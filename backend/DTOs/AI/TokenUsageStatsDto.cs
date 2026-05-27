namespace backend.DTOs.AI;

/// <summary>Response DTO for GET /api/ai/usage — token consumption statistics.</summary>
public class TokenUsageStatsDto
{
    public int     Days                  { get; set; }
    public long    TotalPromptTokens     { get; set; }
    public long    TotalCompletionTokens { get; set; }
    public long    TotalTokens           { get; set; }

    /// <summary>Estimated cost in USD based on gpt-4o-mini pricing.</summary>
    public decimal EstimatedCostUsd      { get; set; }

    /// <summary>Total tokens broken down by user role (Member / Staff / GymOwner / SuperAdmin).</summary>
    public Dictionary<string, long> TokensByRole { get; set; } = new();
}
