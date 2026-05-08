namespace backend.Models;

/// <summary>
/// Bản nháp cấu hình gói hội viên (UC: Configure Membership Offer).
/// Được tạo bởi Sales/Receptionist, hết hạn sau 24h nếu không GenerateContract.
/// </summary>
public class ContractDraft
{
    public Guid DraftId { get; set; }

    /// <summary>Staff tạo bản nháp này</summary>
    public Guid CreatedByStaffId { get; set; }

    /// <summary>Member đích (không null khi target là Member)</summary>
    public Guid? MemberUserId { get; set; }

    public Guid PackageId { get; set; }

    public Guid PricingId { get; set; }

    public DateTime StartDate { get; set; }

    public string? Note { get; set; }

    /// <summary>Giá niêm yết trước khuyến mãi</summary>
    public decimal OriginalPrice { get; set; }

    /// <summary>Tổng khuyến mãi áp dụng</summary>
    public decimal DiscountAmount { get; set; }

    /// <summary>Giá deal cuối = OriginalPrice - DiscountAmount</summary>
    public decimal DealPrice { get; set; }

    /// <summary>JSON array of PromotionIds được áp dụng</summary>
    public string PromotionIdsJson { get; set; } = "[]";

    public bool IsUsed { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>Bản nháp tự hủy sau 24h</summary>
    public DateTime ExpiresAt { get; set; }

    // Navigation
    public Staff CreatedByStaff { get; set; } = null!;

    public Member? Member { get; set; }

    public Package Package { get; set; } = null!;

    public PackagePricing Pricing { get; set; } = null!;
}
