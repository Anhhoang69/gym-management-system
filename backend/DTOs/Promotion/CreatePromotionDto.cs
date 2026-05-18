namespace backend.DTOs.Promotion;
using backend.Enums;

public class CreatePromotionDto
{
    public string Name { get; set; } = null!;
    public string Code { get; set; } = null!;           // unique code

    public DiscountType DiscountType { get; set; }
    public decimal DiscountValue { get; set; }          // % hoặc số tiền cố định

    public Guid? ApplicablePackageId { get; set; }      // null = áp cho tất cả
    public Guid? ApplicableBranchId { get; set; }       // null = áp cho tất cả chi nhánh
    public ContractType? ContractType { get; set; }     // null = áp cho tất cả loại HĐ

    // Thời gian hiệu lực (UTC)
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public int MaxUsage { get; set; }                   // 0 = không giới hạn

    // Fields mới
    public string? SalesChannel { get; set; }           // null = all channels
    public decimal? MinContractValue { get; set; }      // null = no minimum
    public ApplicationRuleType ApplicationRule { get; set; } = ApplicationRuleType.BestDiscount;
    public int Priority { get; set; } = 0;
}
