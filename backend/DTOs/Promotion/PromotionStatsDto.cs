namespace backend.DTOs.Promotion;

public class PromotionStatsDto
{
    public int Total { get; set; }

    public int Active { get; set; }

    public int Scheduled { get; set; }

    public int Expired { get; set; }
}