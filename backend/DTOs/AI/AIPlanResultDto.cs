namespace backend.DTOs.AI;

public class AIPlanResultDto
{
    public object? WorkoutPlan { get; set; }

    public object? NutritionAdvice { get; set; }

    public string? Summary { get; set; }

    /// <summary>
    /// Raw AI response (fallback khi parse JSON fail)
    /// </summary>
    public string? RawResponse { get; set; }

    public string? Intent { get; set; }

    public DateTime CreatedAt { get; set; }
}
