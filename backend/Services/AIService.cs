using System.Diagnostics;
using System.Text.Json;
using System.Text.RegularExpressions;
using backend.AI;
using backend.AI.Core;
using backend.Data;
using backend.DTOs.AI;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

/// <summary>
/// Orchestrates the Hybrid MCP tool-based chat loop.
///
/// Architecture:
///   1. Build ToolExecutionContext (resolve role + staffPosition from Identity)
///   2. Get available tools for caller (filtered by AIToolRegistry)
///   3. Build conversation with system prompt + user context
///   4. Iterative tool loop: LLM → batch execute tools → LLM → ... → final answer
///   5. Persist ChatHistory, AIRecommendation, AIToolExecutionLog
///
/// No switch(intent), no hardcoded OpenAI, no ad-hoc routing.
/// </summary>
public class AIService : IAIService
{
    private readonly ApplicationDbContext _context;
    private readonly ILLMProvider _llmProvider;
    private readonly AIToolRegistry _toolRegistry;
    private readonly GymDataService _gymDataService;
    private readonly UserManager<User> _userManager;
    private readonly ILogger<AIService> _logger;

    private const int ChatHistoryLimit = 20;
    private const int MaxToolIterations = 5;

    public AIService(
        ApplicationDbContext context,
        ILLMProvider llmProvider,
        AIToolRegistry toolRegistry,
        GymDataService gymDataService,
        UserManager<User> userManager,
        ILogger<AIService> logger)
    {
        _context = context;
        _llmProvider = llmProvider;
        _toolRegistry = toolRegistry;
        _gymDataService = gymDataService;
        _userManager = userManager;
        _logger = logger;
    }

    // ── Public API ───────────────────────────────────────────────────────────

    public async Task<ChatResponseDto> HandleChatAsync(Guid userId, ChatRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Message))
            return new ChatResponseDto { Message = "Vui lòng nhập tin nhắn.", Type = "text" };

        var message = request.Message.Trim();

        // 1. Build execution context
        var ctx = await BuildContextAsync(userId);

        _logger.LogInformation("AI Chat | User: {UserId} | Role: {Role} | Position: {Pos} | Message: {Msg}",
            userId, ctx.Role, ctx.StaffPosition, message.Length > 80 ? message[..80] + "..." : message);

        // 2. Persist user message
        await SaveChatMessageAsync(userId, ctx.Role, "user", message);

        // 3. Get available tools filtered for this caller
        var availableTools = _toolRegistry.GetAvailableTools(ctx);
        var toolDefs = _toolRegistry.ToDefinitions(availableTools);

        // 4. Build message list
        var systemPrompt = BuildSystemPrompt(ctx);
        var history = await GetRecentChatHistoryAsync(userId);
        var messages = new List<AI.Core.ChatMessage>
        {
            new("system", systemPrompt)
        };

        // Inject member context for personalized responses
        if (ctx.Role == AuthorizationRoles.Member)
        {
            var memberContext = await _gymDataService.GetCachedOrBuildContextAsync(userId);
            messages.Add(new("system", $"[Thông tin hội viên]\n{memberContext}"));
        }

        messages.AddRange(history);
        messages.Add(new("user", message));

        // 5. Iterative tool loop — execute ALL tools per LLM response, then loop
        string finalText = "Xin lỗi, tôi không thể hoàn thành yêu cầu. Vui lòng thử lại.";

        for (int iteration = 0; iteration < MaxToolIterations; iteration++)
        {
            var llmResponse = await _llmProvider.ChatAsync(new LLMRequest(messages, toolDefs));

            // No tool calls → LLM is done
            if (llmResponse.ToolCalls == null || llmResponse.ToolCalls.Count == 0)
            {
                finalText = llmResponse.TextContent ?? finalText;
                break;
            }

            _logger.LogInformation("AI Chat | Iteration {I} | Tool calls: {Count}",
                iteration + 1, llmResponse.ToolCalls.Count);

            // Execute all tools in this batch
            var toolResultMessages = new List<AI.Core.ChatMessage>();

            foreach (var invocation in llmResponse.ToolCalls)
            {
                var (resultContent, success) = await ExecuteToolAsync(invocation, availableTools, ctx);
                toolResultMessages.Add(new("tool", resultContent, invocation.CallId));
            }

            // Append assistant message (signals tool_calls to the conversation)
            // then all tool results — OpenAI requires this ordering
            messages.Add(new("assistant", "[tool_calls]"));
            messages.AddRange(toolResultMessages);
        }

        // 6. Persist assistant response
        await SaveChatMessageAsync(userId, ctx.Role, "assistant", finalText);

        _logger.LogInformation("AI Chat | Done | Role: {Role} | Response length: {Len}", ctx.Role, finalText.Length);

        return new ChatResponseDto { Message = finalText, Type = "text" };
    }

    public async Task<List<ChatResponseDto>> GetChatHistoryAsync(Guid userId, int limit = 20)
    {
        return await _context.Set<ChatHistory>()
            .Where(ch => ch.UserId == userId)
            .OrderByDescending(ch => ch.CreatedAt)
            .Take(limit)
            .OrderBy(ch => ch.CreatedAt)
            .Select(ch => new ChatResponseDto
            {
                Message = ch.Message,
                Type = ch.Role
            })
            .ToListAsync();
    }

    public async Task<List<AIPlanResultDto>> GetRecommendationsAsync(Guid memberId)
    {
        var recommendations = await _context.Set<AIRecommendation>()
            .Where(r => r.MemberId == memberId)
            .OrderByDescending(r => r.CreatedAt)
            .Take(10)
            .ToListAsync();

        return recommendations.Select(r => new AIPlanResultDto
        {
            WorkoutPlan = TryParseJsonObject(r.WorkoutPlan),
            NutritionAdvice = TryParseJsonObject(r.NutritionAdvice),
            Summary = r.Goal,
            RawResponse = r.RawJson,
            Intent = r.Intent,
            CreatedAt = r.CreatedAt
        }).ToList();
    }

    public async Task<ToolExecutionContext> BuildContextAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new UnauthorizedAccessException("User not found");

        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? AuthorizationRoles.Member;

        StaffPosition? staffPosition = null;
        Guid? branchId = null;

        if (role == AuthorizationRoles.Staff)
        {
            var staff = await _context.Staffs
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.UserId == userId);

            staffPosition = staff?.Position;
            branchId = staff?.BranchId;
        }

        return new ToolExecutionContext
        {
            UserId = userId,
            Role = role,
            StaffPosition = staffPosition,
            BranchId = branchId,
            Language = "vi"
        };
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    private async Task<(string content, bool success)> ExecuteToolAsync(
        ToolInvocation invocation,
        List<IAITool> availableTools,
        ToolExecutionContext ctx)
    {
        var sw = Stopwatch.StartNew();
        bool success = false;
        string content;

        var tool = _toolRegistry.ResolveAuthorized(invocation.ToolName, ctx);

        if (tool == null)
        {
            content = $"Tool '{invocation.ToolName}' không khả dụng hoặc bạn không có quyền sử dụng.";
            sw.Stop();
            await LogToolExecutionAsync(invocation.ToolName, ctx, false, sw.ElapsedMilliseconds, content);
            return (content, false);
        }

        try
        {
            var result = await tool.ExecuteAsync(invocation.Arguments, ctx);
            success = result.Success;
            content = result.Content;

            // Persist fitness plan if generated
            if (tool.Name == "generate_fitness_plan" && result.StructuredData != null)
                await TrySaveFitnessPlanAsync(ctx.UserId, result.Content, result.StructuredData);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Tool execution error | Tool: {Tool}", invocation.ToolName);
            content = $"Lỗi khi thực thi tool '{invocation.ToolName}': {ex.Message}";
        }

        sw.Stop();
        await LogToolExecutionAsync(invocation.ToolName, ctx, success, sw.ElapsedMilliseconds,
            success ? null : content);

        return (content, success);
    }

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

        return
            $"Bạn là AI Assistant của hệ thống quản lý phòng gym. " +
            $"Người dùng hiện tại là {roleDesc}. " +
            $"Trả lời bằng tiếng Việt, rõ ràng và hữu ích. " +
            $"Sử dụng các công cụ (tools) khi cần lấy dữ liệu thực tế từ hệ thống. " +
            $"Không bịa đặt số liệu — chỉ dùng dữ liệu từ tools.";
    }

    private async Task<List<AI.Core.ChatMessage>> GetRecentChatHistoryAsync(Guid userId)
    {
        // Materialize as anonymous type first — EF cannot use record constructors with optional params in expression trees
        var raw = await _context.Set<ChatHistory>()
            .Where(ch => ch.UserId == userId)
            .OrderByDescending(ch => ch.CreatedAt)
            .Take(ChatHistoryLimit)
            .OrderBy(ch => ch.CreatedAt)
            .Select(ch => new { ch.Role, ch.Message })
            .ToListAsync();

        return raw.Select(r => new AI.Core.ChatMessage(r.Role, r.Message)).ToList();
    }

    private async Task SaveChatMessageAsync(Guid userId, string userRole, string role, string message)
    {
        _context.Set<ChatHistory>().Add(new ChatHistory
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            MemberId = userRole == AuthorizationRoles.Member ? userId : null,  // backward compat
            UserRole = userRole,
            Role = role,
            Message = message,
            CreatedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();
    }

    private async Task LogToolExecutionAsync(
        string toolName, ToolExecutionContext ctx, bool success, long durationMs, string? errorMessage = null)
    {
        try
        {
            _context.Set<AIToolExecutionLog>().Add(new AIToolExecutionLog
            {
                Id = Guid.NewGuid(),
                UserId = ctx.UserId,
                UserRole = ctx.Role,
                StaffPosition = ctx.StaffPosition,
                ToolName = toolName,
                Success = success,
                DurationMs = durationMs,
                ErrorMessage = errorMessage,
                ExecutedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            // Audit log failure must not break the conversation
            _logger.LogWarning(ex, "Failed to write AIToolExecutionLog for tool {Tool}", toolName);
        }
    }

    private async Task TrySaveFitnessPlanAsync(Guid memberId, string aiResponse, object structuredData)
    {
        try
        {
            var jsonStr = ExtractJson(aiResponse);
            string? workoutPlan = null;
            string? nutritionAdvice = null;
            string? goal = null;

            if (jsonStr != null)
            {
                var doc = JsonDocument.Parse(jsonStr);
                var root = doc.RootElement;
                if (root.TryGetProperty("WorkoutPlan", out var wp))
                {
                    workoutPlan = wp.GetRawText();
                    if (wp.TryGetProperty("Goal", out var g)) goal = g.GetString();
                }
                if (root.TryGetProperty("NutritionAdvice", out var na))
                    nutritionAdvice = na.GetRawText();
            }

            _context.Set<AIRecommendation>().Add(new AIRecommendation
            {
                Id = Guid.NewGuid(),
                MemberId = memberId,
                Intent = "fitness",
                Goal = goal,
                RawJson = aiResponse,
                WorkoutPlan = workoutPlan,
                NutritionAdvice = nutritionAdvice,
                CreatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
            _logger.LogInformation("Fitness plan saved | Member: {MemberId}", memberId);
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
