namespace backend.Models;

using backend.Enums;

public class Promotion
{
    public Guid PromotionId { get; set; }

    public string Name { get; set; } = null!;

    public PromotionStatus Status { get; set; } = PromotionStatus.Active;

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

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation

    public User CreatedByUser { get; set; } = null!;
    public Package? ApplicablePackage { get; set; }

    public Branch? ApplicableBranch { get; set; }
}