namespace backend.Models;

using backend.Enums;

public class Promotion
{
    public Guid PromotionId { get; set; }

    public string Name { get; set; } = null!;
    public string Code { get; set; } = null!;

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

    /// <summary>Kênh bán áp dụng: null = tất cả, "Walk-in" | "Online" | "Referral"</summary>
    public string? SalesChannel { get; set; }

    /// <summary>Giá trị HĐ tối thiểu để áp dụng khuến mãi; null = không giới hạn</summary>
    public decimal? MinContractValue { get; set; }

    /// <summary>Cách áp dụng khi có nhiều khuến mãi đồng thời</summary>
    public ApplicationRuleType ApplicationRule { get; set; } = ApplicationRuleType.BestDiscount;

    /// <summary>Độ ưu tiên (số nhỏ = ưu tiên cao); dùng khi ApplicationRule = HighestPriority</summary>
    public int Priority { get; set; }

    public Guid CreatedByUserId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation

    public User CreatedByUser { get; set; } = null!;
    public Package? ApplicablePackage { get; set; }

    public Branch? ApplicableBranch { get; set; }
}