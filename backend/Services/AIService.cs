using System.Text.Json;
using System.Text.RegularExpressions;
using backend.Data;
using backend.DTOs.AI;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

/// <summary>
/// Core AI service – orchestrates IntentService + GymDataService + OpenAIService.
/// </summary>
public class AIService : IAIService
{
    private readonly ApplicationDbContext _context;
    private readonly IntentService _intentService;
    private readonly GymDataService _gymDataService;
    private readonly OpenAIService _openAIService;
    private readonly ILogger<AIService> _logger;

    private const int ChatHistoryLimit = 20;

    public AIService(
        ApplicationDbContext context,
        IntentService intentService,
        GymDataService gymDataService,
        OpenAIService openAIService,
        ILogger<AIService> logger)
    {
        _context = context;
        _intentService = intentService;
        _gymDataService = gymDataService;
        _openAIService = openAIService;
        _logger = logger;
    }

    /// <summary>
    /// Handle incoming chat message from a member
    /// </summary>
    public async Task<ChatResponseDto> HandleChatAsync(Guid memberId, ChatRequestDto request)
    {
        // Input validation
        if (string.IsNullOrWhiteSpace(request.Message))
        {
            return new ChatResponseDto
            {
                Message = "Vui lòng nhập tin nhắn.",
                Type = "text"
            };
        }

        var message = request.Message.Trim();

        _logger.LogInformation("AI Chat | Member: {MemberId} | Message: {Message}", memberId, message);

        // Save user message to history
        await SaveChatMessageAsync(memberId, "user", message);

        // Detect intent
        var intent = _intentService.Detect(message);
        var isPlanRequest = _intentService.IsPlanRequest(message);

        _logger.LogInformation("AI Chat | Intent: {Intent} | IsPlanRequest: {IsPlan}", intent, isPlanRequest);

        // Build (or serve from cache) user context BEFORE intent switch.
        // This ensures AIContextCache is populated for every chat, regardless of intent.
        var userContext = await _gymDataService.GetCachedOrBuildContextAsync(memberId);

        string responseMessage;
        var responseType = "text";

        switch (intent)
        {
            case "membership":
                responseMessage = await _gymDataService.GetMembershipInfoAsync(memberId);
                break;

            case "schedule":
                responseMessage = await _gymDataService.GetScheduleInfoAsync(memberId);
                break;

            case "attendance":
                responseMessage = await _gymDataService.GetAttendanceInfoAsync(memberId);
                break;

            case "package":
                responseMessage = await _gymDataService.GetPackageInfoAsync();
                break;

            case "fitness":
            default:
                // Load recent chat history for context
                var history = await GetRecentChatHistory(memberId);

                responseMessage = await _openAIService.ChatAsync(message, userContext, history, isPlanRequest);

                // If it's a plan request, try to save the recommendation
                if (isPlanRequest)
                {
                    await TrySaveRecommendationAsync(memberId, intent, responseMessage);
                    responseType = "json";
                }
                break;
        }

        // Save assistant response to history
        await SaveChatMessageAsync(memberId, "assistant", responseMessage);

        _logger.LogInformation("AI Chat | Response sent | Type: {Type} | Length: {Length}",
            responseType, responseMessage.Length);

        return new ChatResponseDto
        {
            Message = responseMessage,
            Type = responseType
        };
    }

    /// <summary>
    /// Get chat history for a member
    /// </summary>
    public async Task<List<ChatResponseDto>> GetChatHistoryAsync(Guid memberId, int limit = 20)
    {
        var messages = await _context.Set<ChatHistory>()
            .Where(ch => ch.MemberId == memberId)
            .OrderByDescending(ch => ch.CreatedAt)
            .Take(limit)
            .OrderBy(ch => ch.CreatedAt)
            .Select(ch => new ChatResponseDto
            {
                Message = ch.Message,
                Type = ch.Role
            })
            .ToListAsync();

        return messages;
    }

    /// <summary>
    /// Get saved AI recommendations for a member
    /// </summary>
    public async Task<List<AIPlanResultDto>> GetRecommendationsAsync(Guid memberId)
    {
        var recommendations = await _context.Set<AIRecommendation>()
            .Where(r => r.MemberId == memberId)
            .OrderByDescending(r => r.CreatedAt)
            .Take(10)
            .ToListAsync();

        // Map to DTO, attempting to parse stored JSON strings into objects
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

    // ================= PRIVATE HELPERS =================

    /// <summary>
    /// Save a chat message to history
    /// </summary>
    private async Task SaveChatMessageAsync(Guid memberId, string role, string message)
    {
        _context.Set<ChatHistory>().Add(new ChatHistory
        {
            Id = Guid.NewGuid(),
            MemberId = memberId,
            Role = role,
            Message = message,
            CreatedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Load recent chat history for AI context
    /// </summary>
    private async Task<List<OpenAIService.ChatMessage>> GetRecentChatHistory(Guid memberId)
    {
        var messages = await _context.Set<ChatHistory>()
            .Where(ch => ch.MemberId == memberId)
            .OrderByDescending(ch => ch.CreatedAt)
            .Take(ChatHistoryLimit)
            .OrderBy(ch => ch.CreatedAt)
            .Select(ch => new OpenAIService.ChatMessage
            {
                Role = ch.Role,
                Content = ch.Message
            })
            .ToListAsync();

        return messages;
    }

    /// <summary>
    /// Try to parse and save AI recommendation from response.
    /// Handles: pure JSON, markdown-fenced JSON (```json ... ```), and text-mixed JSON.
    /// </summary>
    private async Task TrySaveRecommendationAsync(Guid memberId, string intent, string aiResponse)
    {
        string? workoutPlan = null;
        string? nutritionAdvice = null;
        string? goal = null;

        try
        {
            var jsonStr = ExtractJson(aiResponse);

            if (jsonStr != null)
            {
                var doc = JsonDocument.Parse(jsonStr);
                var root = doc.RootElement;

                if (root.TryGetProperty("WorkoutPlan", out var wp))
                {
                    workoutPlan = wp.GetRawText();

                    if (wp.TryGetProperty("Goal", out var g))
                        goal = g.GetString();
                }

                if (root.TryGetProperty("NutritionAdvice", out var na))
                    nutritionAdvice = na.GetRawText();

                _logger.LogInformation(
                    "AI Recommendation parsed | WorkoutPlan: {HasWP} | NutritionAdvice: {HasNA} | Goal: {Goal}",
                    workoutPlan != null, nutritionAdvice != null, goal);
            }
            else
            {
                _logger.LogWarning("No valid JSON found in AI response. RawResponse length: {Length}", aiResponse.Length);
            }
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(ex, "Failed to parse JSON from AI response | First 200 chars: {Preview}",
                aiResponse.Length > 200 ? aiResponse[..200] : aiResponse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error parsing AI recommendation");
        }

        // Always save — even if parsing failed, we keep RawJson
        try
        {
            _context.Set<AIRecommendation>().Add(new AIRecommendation
            {
                Id = Guid.NewGuid(),
                MemberId = memberId,
                Intent = intent,
                Goal = goal,
                RawJson = aiResponse,
                WorkoutPlan = workoutPlan,
                NutritionAdvice = nutritionAdvice,
                CreatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();

            _logger.LogInformation("AI Recommendation saved | Member: {MemberId} | Intent: {Intent}", memberId, intent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to save AI recommendation to DB");
        }
    }

    /// <summary>
    /// Extract JSON from AI response, handling:
    /// 1. Pure JSON: starts with {
    /// 2. Markdown fenced: ```json { ... } ```
    /// 3. Text mixed: "some text { ... } more text"
    /// </summary>
    private static string? ExtractJson(string response)
    {
        if (string.IsNullOrWhiteSpace(response))
            return null;

        var trimmed = response.Trim();

        // Case 1: Pure JSON
        if (trimmed.StartsWith('{') && trimmed.EndsWith('}'))
        {
            return trimmed;
        }

        // Case 2: Markdown code fence ```json ... ``` or ``` ... ```
        var fenceMatch = Regex.Match(trimmed, @"```(?:json)?\s*(\{[\s\S]*\})\s*```");
        if (fenceMatch.Success)
        {
            return fenceMatch.Groups[1].Value.Trim();
        }

        // Case 3: Find the outermost balanced { } block
        var firstBrace = trimmed.IndexOf('{');
        if (firstBrace < 0) return null;

        var depth = 0;
        var lastBrace = -1;

        for (var i = firstBrace; i < trimmed.Length; i++)
        {
            switch (trimmed[i])
            {
                case '{': depth++; break;
                case '}':
                    depth--;
                    if (depth == 0)
                    {
                        lastBrace = i;
                        // Don't break — keep going to find the last complete top-level block
                        // Actually we want the first complete block
                        goto done;
                    }
                    break;
            }
        }

        done:
        if (lastBrace > firstBrace)
        {
            return trimmed.Substring(firstBrace, lastBrace - firstBrace + 1);
        }

        return null;
    }

    /// <summary>
    /// Try to parse a JSON string into a deserialized object for API response.
    /// Returns null if input is null or not valid JSON.
    /// </summary>
    private static object? TryParseJsonObject(string? jsonString)
    {
        if (string.IsNullOrWhiteSpace(jsonString))
            return null;

        try
        {
            return JsonSerializer.Deserialize<object>(jsonString);
        }
        catch
        {
            return jsonString; // Return as raw string if not valid JSON
        }
    }
}
