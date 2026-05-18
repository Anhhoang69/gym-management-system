namespace backend.DTOs.Promotion;

using backend.Enums;

public class UpdatePromotionDto
{
    public string Name { get; set; } = null!;

    public string Code { get; set; } = null!;

    public DiscountType DiscountType { get; set; }

    public decimal DiscountValue { get; set; }

    public Guid? ApplicablePackageId { get; set; }

    public Guid? ApplicableBranchId { get; set; }

    public ContractType? ContractType { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public int MaxUsage { get; set; }
}