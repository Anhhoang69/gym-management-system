namespace backend.Models;

using backend.Enums;
public class Payment
{
    public Guid PaymentId { get; set; }

    public Guid InvoiceId { get; set; }

    public PaymentMethod Method { get; set; }

    public string? RefNo { get; set; }

    public decimal Amount { get; set; }

    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

    public Guid ProcessedBy { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    /// <summary>null khi system-processed (VNPay IPN) — không có staff nào xử lý</summary>
    public Guid? ProcessedByStaffId { get; set; }

    public Staff? ProcessedByStaff { get; set; }

    // ── VNPay Gateway Fields ────────────────────────────────────────────────
    /// <summary>vnp_TxnRef — unique per payment attempt. Dùng để lookup IPN.</summary>
    public string? GatewayTxnRef { get; set; }

    /// <summary>vnp_TransactionNo — mã giao dịch phía VNPay</summary>
    public string? GatewayTransactionNo { get; set; }

    /// <summary>vnp_ResponseCode — "00" = thành công</summary>
    public string? GatewayResponseCode { get; set; }

    /// <summary>vnp_BankCode — NCB, VCB, ...</summary>
    public string? GatewayBankCode { get; set; }

    /// <summary>vnp_PayDate — thời điểm thanh toán xác nhận</summary>
    public DateTime? GatewayPayDate { get; set; }

    /// <summary>JSON full response từ VNPay — lưu cho audit/debug</summary>
    public string? GatewayRawData { get; set; }

    /// <summary>Thời điểm payment URL hết hạn (tạo lúc create + 15 phút)</summary>
    public DateTime? ExpiredAt { get; set; }

    // Navigation
    public Invoice Invoice { get; set; } = null!;
}