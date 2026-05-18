namespace backend.DTOs.Contract;

/// <summary>Preview trả về sau khi tạo draft</summary>
public class ContractDraftPreviewDto
{
    public Guid DraftId { get; set; }
    public string MemberName { get; set; } = null!;
    public string PackageName { get; set; } = null!;
    public int DurationMonths { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal OriginalPrice { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal DealPrice { get; set; }
    public List<string> AppliedPromotions { get; set; } = [];
    public DateTime ExpiresAt { get; set; }
}
