using System.Text.Json;
using System.Text.RegularExpressions;
using backend.AI;
using backend.AI.Core;
using backend.AI.Kernel;
using backend.Data;
using backend.DTOs.AI;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Connectors.OpenAI;

// Alias SK ChatHistory — avoids name clash with backend.Models.ChatHistory (EF entity)
using SkChatHistory = Microsoft.SemanticKernel.ChatCompletion.ChatHistory;
// Alias EF ChatHistory — used explicitly when saving to database
using EfChatHistory = backend.Models.ChatHistory;

namespace backend.Services;

/// <summary>
/// AI chat orchestrator powered by Semantic Kernel.
///
/// Architecture:
///   1. BuildContextAsync     — resolve userId → Role + StaffPosition + BranchId
///   2. AIToolRegistry        — RBAC filter: only tools the caller is allowed to use
///   3. KernelFactory         — create SK Kernel with configured LLM connector
///   4. SkToolHelper          — wrap each IAITool as a SK KernelFunction (closure pattern)
///   5. SK FunctionChoiceBehavior.Auto() — SK handles the entire LLM ↔ tool loop
///   6. Persist               — ChatHistory, AIRecommendation, AITokenUsageLog
///
/// No custom HTTP client. No manual tool loop. No provider switch logic.
/// </summary>
public class AIService : IAIService
{
    private readonly ApplicationDbContext _db;
    private readonly AIToolRegistry _toolRegistry;
    private readonly KernelFactory _kernelFactory;
    private readonly ToolInvocationFilter _invocationFilter;
    private readonly GymDataService _gymDataService;
    private readonly UserManager<User> _userManager;
    private readonly IConfiguration _config;
    private readonly ILogger<AIService> _logger;

    private const int ChatHistoryLimit = 20;

    public AIService(
        ApplicationDbContext db,
        AIToolRegistry toolRegistry,
        KernelFactory kernelFactory,
        ToolInvocationFilter invocationFilter,
        GymDataService gymDataService,
        UserManager<User> userManager,
        IConfiguration config,
        ILogger<AIService> logger)
    {
        _db               = db;
        _toolRegistry     = toolRegistry;
        _kernelFactory    = kernelFactory;
        _invocationFilter = invocationFilter;
        _gymDataService   = gymDataService;
        _userManager      = userManager;
        _config           = config;
        _logger           = logger;
    }

    // ── Public API ───────────────────────────────────────────────────────────

    public async Task<ChatResponseDto> HandleChatAsync(Guid userId, ChatRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Message))
            return new ChatResponseDto { Message = "Vui lòng nhập tin nhắn.", Type = "text" };

        var message = request.Message.Trim();

        // 1. Build execution context (role + staffPosition + branchId from Identity + DB)
        var ctx = await BuildContextAsync(userId);
        _invocationFilter.CurrentContext = ctx;   // provide context for audit filter

        _logger.LogInformation(
            "AI Chat | User: {Id} | Role: {Role} | Position: {Pos} | Message: {Msg}",
            userId, ctx.Role, ctx.StaffPosition,
            message.Length > 80 ? message[..80] + "…" : message);

        // 2. Persist user turn
        await SaveChatMessageAsync(userId, ctx.Role, "user", message);

        // 3. RBAC filter — only tools the caller is authorized to use
        var availableTools = _toolRegistry.GetAvailableTools(ctx);

        // 4. Build SK Kernel + attach GymTools plugin (RBAC-filtered)
        var kernel = _kernelFactory.Create();
        kernel.FunctionInvocationFilters.Add(_invocationFilter);

        var plugin = KernelPluginFactory.CreateFromFunctions(
            pluginName: "GymTools",
            functions:  availableTools.Select(t => SkToolHelper.WrapAsTool(t, ctx)));
        kernel.Plugins.Add(plugin);

        // 5. Build SK conversation history
        var skHistory = new SkChatHistory();
        skHistory.AddSystemMessage(BuildSystemPrompt(ctx));

        // Inject member context for personalized responses (only for Member role)
        if (ctx.Role == AuthorizationRoles.Member)
        {
            var memberCtx = await _gymDataService.GetCachedOrBuildContextAsync(userId);
            skHistory.AddSystemMessage($"[Thông tin hội viên]\n{memberCtx}");
        }

        // Load recent DB history into SK conversation
        var dbHistory = await GetRecentChatHistoryAsync(userId);
        foreach (var (role, content) in dbHistory)
        {
            if (role == "user") skHistory.AddUserMessage(content);
            else skHistory.AddAssistantMessage(content);
        }

        skHistory.AddUserMessage(message);

        // 6. SK auto function calling — handles entire LLM ↔ tool loop automatically
        var chatSvc  = kernel.GetRequiredService<IChatCompletionService>();
        var settings = new OpenAIPromptExecutionSettings
        {
            FunctionChoiceBehavior = FunctionChoiceBehavior.Auto(),
            MaxTokens   = int.TryParse(_config["AI:OpenAI:MaxTokens"], out var mt) ? mt : 2000,
            Temperature = 0.7
        };

        var response  = await chatSvc.GetChatMessageContentAsync(skHistory, settings, kernel);
        var finalText = response.Content ?? "Xin lỗi, tôi không thể trả lời lúc này.";

        // 7. Token usage — SK OpenAI connector sets "Usage" in response metadata automatically
        var (promptTokens, completionTokens) = SkToolHelper.ExtractTokenUsage(response);
        await SaveTokenUsageAsync(userId, ctx.Role, promptTokens, completionTokens);

        // 8. Persist assistant turn
        await SaveChatMessageAsync(userId, ctx.Role, "assistant", finalText);

        // 9. Persist fitness plan if the LLM generated one (Member only)
        if (ctx.Role == AuthorizationRoles.Member)
            await TrySaveFitnessPlanAsync(userId, finalText);

        _logger.LogInformation(
            "AI Chat | Done | Role: {Role} | Tokens: {P}+{C} | Length: {Len}",
            ctx.Role, promptTokens, completionTokens, finalText.Length);

        return new ChatResponseDto { Message = finalText, Type = "text" };
    }

    public async Task<List<ChatResponseDto>> GetChatHistoryAsync(Guid userId, int limit = 20)
    {
        return await _db.Set<EfChatHistory>()
            .Where(ch => ch.UserId == userId)
            .OrderByDescending(ch => ch.CreatedAt)
            .Take(limit)
            .OrderBy(ch => ch.CreatedAt)
            .Select(ch => new ChatResponseDto { Message = ch.Message, Type = ch.Role })
            .ToListAsync();
    }

    public async Task<List<AIPlanResultDto>> GetRecommendationsAsync(Guid memberId)
    {
        var recommendations = await _db.Set<AIRecommendation>()
            .Where(r => r.MemberId == memberId)
            .OrderByDescending(r => r.CreatedAt)
            .Take(10)
            .ToListAsync();

        return recommendations.Select(r => new AIPlanResultDto
        {
            WorkoutPlan     = TryParseJsonObject(r.WorkoutPlan),
            NutritionAdvice = TryParseJsonObject(r.NutritionAdvice),
            Summary         = r.Goal,
            RawResponse     = r.RawJson,
            Intent          = r.Intent,
            CreatedAt       = r.CreatedAt
        }).ToList();
    }

    public async Task<ToolExecutionContext> BuildContextAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new UnauthorizedAccessException("User not found");

        var roles = await _userManager.GetRolesAsync(user);
        var role  = roles.FirstOrDefault() ?? AuthorizationRoles.Member;

        StaffPosition? staffPosition = null;
        Guid? branchId = null;

        if (role == AuthorizationRoles.Staff)
        {
            var staff = await _db.Staffs
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.UserId == userId);

            staffPosition = staff?.Position;
            branchId      = staff?.BranchId;
        }

        return new ToolExecutionContext
        {
            UserId        = userId,
            Role          = role,
            StaffPosition = staffPosition,
            BranchId      = branchId,
            Language      = "vi"
        };
    }

    public async Task<TokenUsageStatsDto> GetTokenStatsAsync(int days)
    {
        var since = DateTime.UtcNow.AddDays(-days);

        var logs = await _db.Set<AITokenUsageLog>()
            .Where(l => l.CreatedAt >= since)
            .ToListAsync();

        var totalPrompt     = logs.Sum(l => (long)l.PromptTokens);
        var totalCompletion = logs.Sum(l => (long)l.CompletionTokens);
        var totalTokens     = totalPrompt + totalCompletion;

        // gpt-4o-mini pricing: $0.15/1M prompt + $0.60/1M completion
        var costUsd = (totalPrompt * 0.15m / 1_000_000m)
                    + (totalCompletion * 0.60m / 1_000_000m);

        var byRole = logs
            .GroupBy(l => l.UserRole)
            .ToDictionary(
                g => g.Key,
                g => g.Sum(l => (long)(l.PromptTokens + l.CompletionTokens)));

        return new TokenUsageStatsDto
        {
            Days                  = days,
            TotalPromptTokens     = totalPrompt,
            TotalCompletionTokens = totalCompletion,
            TotalTokens           = totalTokens,
            EstimatedCostUsd      = Math.Round(costUsd, 6),
            TokensByRole          = byRole
        };
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    private string BuildSystemPrompt(ToolExecutionContext ctx)
    {
        var roleDesc = ctx.Role switch
        {
            AuthorizationRoles.Member     => "hội viên phòng gym",
            AuthorizationRoles.Staff      => $"nhân viên ({ctx.StaffPosition?.ToString() ?? "Staff"})",
            AuthorizationRoles.GymOwner   => "chủ phòng gym",
            AuthorizationRoles.SuperAdmin => "quản trị viên hệ thống",
            _                             => ctx.Role
        };

        return $"Bạn là AI Assistant của hệ thống quản lý phòng gym. " +
               $"Người dùng hiện tại là {roleDesc}. " +
               $"Trả lời bằng tiếng Việt, rõ ràng và hữu ích. " +
               $"Sử dụng các công cụ (tools) khi cần lấy dữ liệu thực tế từ hệ thống. " +
               $"Không bịa đặt số liệu — chỉ dùng dữ liệu từ tools.";
    }

    private async Task<List<(string Role, string Content)>> GetRecentChatHistoryAsync(Guid userId)
    {
        var raw = await _db.Set<EfChatHistory>()
            .Where(ch => ch.UserId == userId)
            .OrderByDescending(ch => ch.CreatedAt)
            .Take(ChatHistoryLimit)
            .OrderBy(ch => ch.CreatedAt)
            .Select(ch => new { ch.Role, ch.Message })
            .ToListAsync();

        return raw.Select(r => (r.Role, r.Message)).ToList();
    }

    private async Task SaveChatMessageAsync(Guid userId, string userRole, string role, string message)
    {
        _db.Set<EfChatHistory>().Add(new EfChatHistory
        {
            Id        = Guid.NewGuid(),
            UserId    = userId,
            MemberId  = userRole == AuthorizationRoles.Member ? userId : null,
            UserRole  = userRole,
            Role      = role,
            Message   = message,
            CreatedAt = DateTime.UtcNow
        });
        await _db.SaveChangesAsync();
    }

    private async Task SaveTokenUsageAsync(
        Guid userId, string userRole, int promptTokens, int completionTokens)
    {
        if (promptTokens == 0 && completionTokens == 0) return;

        try
        {
            var model = _config["AI:OpenAI:Model"] ?? "gpt-4o-mini";
            _db.Set<AITokenUsageLog>().Add(new AITokenUsageLog
            {
                UserId           = userId,
                UserRole         = userRole,
                PromptTokens     = promptTokens,
                CompletionTokens = completionTokens,
                Model            = model,
                CreatedAt        = DateTime.UtcNow
            });
            await _db.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to save AITokenUsageLog");
        }
    }

    private async Task TrySaveFitnessPlanAsync(Guid memberId, string aiResponse)
    {
        try
        {
            var jsonStr = ExtractJson(aiResponse);
            if (jsonStr == null) return;

            var doc  = JsonDocument.Parse(jsonStr);
            var root = doc.RootElement;

            string? workoutPlan     = null;
            string? nutritionAdvice = null;
            string? goal            = null;

            if (root.TryGetProperty("WorkoutPlan", out var wp))
            {
                workoutPlan = wp.GetRawText();
                if (wp.TryGetProperty("Goal", out var g)) goal = g.GetString();
            }
            if (root.TryGetProperty("NutritionAdvice", out var na))
                nutritionAdvice = na.GetRawText();

            _db.Set<AIRecommendation>().Add(new AIRecommendation
            {
                Id              = Guid.NewGuid(),
                MemberId        = memberId,
                Intent          = "fitness",
                Goal            = goal,
                RawJson         = aiResponse,
                WorkoutPlan     = workoutPlan,
                NutritionAdvice = nutritionAdvice,
                CreatedAt       = DateTime.UtcNow
            });
            await _db.SaveChangesAsync();
            _logger.LogInformation("Fitness plan saved | Member: {Id}", memberId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to save fitness plan recommendation");
        }
    }

    private static string? ExtractJson(string response)
    {
        if (string.IsNullOrWhiteSpace(response)) return null;
        var trimmed = response.Trim();
        if (trimmed.StartsWith('{') && trimmed.EndsWith('}')) return trimmed;
        var fenceMatch = Regex.Match(trimmed, @"```(?:json)?\s*(\{[\s\S]*\})\s*```");
        if (fenceMatch.Success) return fenceMatch.Groups[1].Value.Trim();
        var firstBrace = trimmed.IndexOf('{');
        if (firstBrace < 0) return null;
        var depth = 0;
        for (var i = firstBrace; i < trimmed.Length; i++)
        {
            if (trimmed[i] == '{') depth++;
            else if (trimmed[i] == '}') { depth--; if (depth == 0) return trimmed[firstBrace..(i + 1)]; }
        }
        return null;
    }

    private static object? TryParseJsonObject(string? jsonString)
    {
        if (string.IsNullOrWhiteSpace(jsonString)) return null;
        try { return JsonSerializer.Deserialize<object>(jsonString); }
        catch { return jsonString; }
    }
}
