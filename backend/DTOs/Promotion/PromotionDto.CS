namespace backend.DTOs.Promotion;

using backend.Enums;

public class PromotionDto
{
    public Guid PromotionId { get; set; }

    public string Name { get; set; } = null!;

    public string Code { get; set; } = null!;

    public PromotionStatus Status { get; set; }

    public DiscountType DiscountType { get; set; }

    public decimal DiscountValue { get; set; }

    public Guid? ApplicablePackageId { get; set; }

    public Guid? ApplicableBranchId { get; set; }

    public ContractType? ContractType { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public int MaxUsage { get; set; }

    public int CurrentUsage { get; set; }

    public Guid CreatedByUserId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    // info thêm cho FE (optional)
    public string? PackageName { get; set; }

    public string? BranchName { get; set; }

    public string? CreatedByName { get; set; }
}