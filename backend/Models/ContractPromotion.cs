namespace backend.Models;

public class ContractPromotion
{
    public Guid ContractId { get; set; }

    public Guid PromotionId { get; set; }

    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

    // navigation
    public Contract Contract { get; set; } = null!;

    public Promotion Promotion { get; set; } = null!;
}