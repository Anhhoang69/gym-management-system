namespace backend.DTOs.Member;

using backend.Enums;

/// <summary>
/// Body cho Receptionist tạo hồ sơ nhanh walk-in (E2).
/// "Quick" = quick onboarding, KHÔNG phải quick payment.
/// Kết quả: Contract(Pending) + Invoice(Pending), thu tiền qua /api/invoices/{id}/payment sau.
/// </summary>
public class QuickRegisterDto
{
    // ── Thông tin khách ───────────────────────────────────────────────────────
    public string FullName { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string? Email { get; set; }
    public DateOnly? Birthday { get; set; }
    public Gender? Gender { get; set; }

    // ── Gói tập ───────────────────────────────────────────────────────────────
    public Guid PackageId { get; set; }
    public Guid PricingId { get; set; }
    public List<Guid>? PromotionIds { get; set; }
    public DateTime StartDate { get; set; }

    // ── Tuỳ chọn ─────────────────────────────────────────────────────────────
    public decimal TaxAmount { get; set; } = 0;
    public string? Note { get; set; }

    /// <summary>Nếu đây là khách đã có Lead trước đó — cập nhật Lead.Status = Converted</summary>
    public Guid? LinkedLeadId { get; set; }
}

/// <summary>
/// Kết quả sau khi onboard thành công.
/// Trả về invoiceId + contractId để frontend dẫn sang màn thu tiền.
/// </summary>
public class QuickRegisterResultDto
{
    public Guid MemberUserId { get; set; }
    public Guid ContractId { get; set; }
    public Guid InvoiceId { get; set; }
    public string InvoiceCode { get; set; } = null!;

    public decimal OriginalPrice { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal DealPrice { get; set; }

    /// <summary>Tổng tiền cần thu (dealPrice + tax). Invoice đang Pending.</summary>
    public decimal TotalAmountDue { get; set; }

    public DateTime ContractStartDate { get; set; }
    public DateTime ContractEndDate { get; set; }

    /// <summary>Hướng dẫn bước tiếp theo</summary>
    public string Message { get; set; } = null!;
}
