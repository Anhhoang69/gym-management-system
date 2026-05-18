namespace backend.DTOs.Lead;

using backend.Enums;

/// <summary>
/// Body gửi lên khi chuyển Lead thành Member (MODE 2 — Pending).
/// Sales chỉ tạo Contract + Invoice ở trạng thái Pending,
/// thu tiền và kích hoạt sẽ thực hiện ở bước riêng sau đó.
/// </summary>
public class ConvertLeadToMemberDto
{
    /// <summary>Gói hội viên muốn đăng ký</summary>
    public Guid PackageId { get; set; }

    /// <summary>Gói giá (duration) muốn chọn</summary>
    public Guid PricingId { get; set; }

    /// <summary>Ngày bắt đầu hợp đồng</summary>
    public DateTime StartDate { get; set; }

    /// <summary>Danh sách mã khuyến mãi muốn áp dụng (có thể bỏ trống)</summary>
    public List<Guid>? PromotionIds { get; set; }

    /// <summary>Tiền thuế (nếu có)</summary>
    public decimal TaxAmount { get; set; } = 0;

    /// <summary>Ghi chú hợp đồng</summary>
    public string? Note { get; set; }
}

/// <summary>
/// Kết quả trả về sau khi convert Lead thành Member thành công.
/// Trả về contractId + invoiceId để frontend dẫn sang bước thu tiền.
/// </summary>
public class ConvertLeadResultDto
{
    public Guid MemberUserId { get; set; }
    public Guid ContractId { get; set; }
    public Guid InvoiceId { get; set; }

    /// <summary>Tổng tiền cần thu (Invoice.TotalAmount)</summary>
    public decimal TotalAmountDue { get; set; }

    public decimal OriginalPrice { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal DealPrice { get; set; }

    public DateTime ContractStartDate { get; set; }
    public DateTime ContractEndDate { get; set; }

    /// <summary>Trạng thái: Contract=Pending, Invoice=Pending, Card=Inactive</summary>
    public string Message { get; set; } = null!;
}
