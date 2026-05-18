namespace backend.DTOs.Promotion;
using backend.Enums;

public class ValidatePromotionDto
{
    public string Code { get; set; } = null!;
    public DiscountType DiscountType { get; set; }
    public decimal DiscountValue { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public Guid? ApplicablePackageId { get; set; }
    public Guid? ApplicableBranchId { get; set; }
    public string? SalesChannel { get; set; }
    public Guid? ExcludePromotionId { get; set; }  // khi edit: exclude chính nó
}

public class ValidatePromotionResultDto
{
    public bool IsValid { get; set; }
    public List<string> Errors { get; set; } = new();      // hard block
    public List<string> Warnings { get; set; } = new();    // soft warning
}
