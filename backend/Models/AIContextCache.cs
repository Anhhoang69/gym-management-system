namespace backend.Models;

public class AIContextCache
{
    /// <summary>
    /// PK + FK → Member.UserId (1-1)
    /// </summary>
    public Guid MemberId { get; set; }

    /// <summary>
    /// Cached user context string for AI prompts
    /// </summary>
    public string CachedContext { get; set; } = null!;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ================= RELATIONS =================

    public Member Member { get; set; } = null!;
}
