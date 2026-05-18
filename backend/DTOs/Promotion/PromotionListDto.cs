using backend.Enums;

namespace backend.DTOs.Promotion;

public class PromotionListDto
{
    public Guid PromotionId { get; set; }
    public string Name { get; set; } = null!;
    public string Code { get; set; } = null!;
    public DiscountType DiscountType { get; set; }
    public decimal DiscountValue { get; set; }
    public string? BranchName { get; set; }
    public ContractType? ContractType { get; set; }
    public int CurrentUsage { get; set; }
    public int MaxUsage { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public PromotionStatus Status { get; set; }
}