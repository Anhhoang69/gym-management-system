namespace backend.DTOs.Register;

public class RegisterResultDto
{
    public Guid UserId { get; set; }

    public string Email { get; set; } = null!;

    public string TempPassword { get; set; } = null!;

    public Guid ContractId { get; set; }

    public Guid InvoiceId { get; set; }

    /// <summary>Số tiền cần thanh toán</summary>
    public decimal TotalAmountDue { get; set; }

    public string Message { get; set; } = "Account created successfully. Check your email for login credentials.";

    // ── VNPay (Nullé nếu gói Free hoặc VNPay tạo thất bại) ──
    public string? PaymentUrl { get; set; }
    public string? TxnRef { get; set; }
    public DateTime? PaymentExpiredAt { get; set; }
    public string? InvoiceCode { get; set; }
}
