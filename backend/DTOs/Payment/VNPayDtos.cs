namespace backend.DTOs.Payment;

// ── Create ──────────────────────────────────────────────────────────────────

public class VNPayCreateRequestDto
{
    public Guid InvoiceId { get; set; }
}

public class VNPayCreateResultDto
{
    public string PaymentUrl { get; set; } = string.Empty;
    public string TxnRef { get; set; } = string.Empty;
    public DateTime ExpiredAt { get; set; }
    public decimal Amount { get; set; }
    public string InvoiceCode { get; set; } = string.Empty;
}

// ── IPN ──────────────────────────────────────────────────────────────────────

/// <summary>Kết quả trả về cho VNPay sau khi xử lý IPN.</summary>
public class VNPayIpnResult
{
    public string RspCode { get; set; } = "99";
    public string Message { get; set; } = "Unknown error";
}

// ── Return ────────────────────────────────────────────────────────────────────

/// <summary>Kết quả trả về cho frontend sau khi validate ReturnUrl params.</summary>
public class VNPayReturnResult
{
    public bool Success { get; set; }
    public string ResponseCode { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public Guid? InvoiceId { get; set; }
    public decimal? Amount { get; set; }
    public string? InvoiceCode { get; set; }
    public string? BankCode { get; set; }
    public string? TransactionNo { get; set; }
}

// ── Status ────────────────────────────────────────────────────────────────────

public class PaymentStatusDto
{
    public Guid PaymentId { get; set; }
    public string Status { get; set; } = string.Empty;        // PaymentStatus enum string
    public string InvoiceStatus { get; set; } = string.Empty; // InvoiceStatus enum string
    public string? GatewayResponseCode { get; set; }
    public DateTime? PaidAt { get; set; }
    public DateTime? ExpiredAt { get; set; }
    public decimal Amount { get; set; }
}
