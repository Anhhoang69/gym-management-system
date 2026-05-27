namespace backend.Models;

/// <summary>
/// Records token consumption per AI conversation turn.
/// Used to estimate API cost and monitor usage breakdown by role.
///
/// gpt-4o-mini pricing (as of 2025):
///   Prompt tokens:     $0.15 / 1M tokens
///   Completion tokens: $0.60 / 1M tokens
/// </summary>
public class AITokenUsageLog
{
    public Guid   Id               { get; set; } = Guid.NewGuid();
    public Guid   UserId           { get; set; }
    public string UserRole         { get; set; } = null!;
    public int    PromptTokens     { get; set; }
    public int    CompletionTokens { get; set; }
    public string Model            { get; set; } = null!;
    public DateTime CreatedAt      { get; set; } = DateTime.UtcNow;
}
