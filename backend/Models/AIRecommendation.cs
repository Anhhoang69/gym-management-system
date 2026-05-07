namespace backend.Models;

public class AIRecommendation
{
    public Guid Id { get; set; }

    public Guid MemberId { get; set; }

    /// <summary>
    /// User's fitness goal (e.g. "Giảm cân", "Tăng cơ")
    /// </summary>
    public string? Goal { get; set; }

    /// <summary>
    /// Intent that triggered this recommendation (membership, fitness, general, etc.)
    /// </summary>
    public string? Intent { get; set; }

    /// <summary>
    /// Full raw JSON response from AI
    /// </summary>
    public string? RawJson { get; set; }

    /// <summary>
    /// Parsed workout plan content
    /// </summary>
    public string? WorkoutPlan { get; set; }

    /// <summary>
    /// Parsed nutrition advice content
    /// </summary>
    public string? NutritionAdvice { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // ================= RELATIONS =================

    public Member Member { get; set; } = null!;
}
