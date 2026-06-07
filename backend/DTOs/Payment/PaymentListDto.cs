using backend.Enums;

namespace backend.DTOs.Payment;

public class PaymentListDto
{
    public Guid PaymentId { get; set; }
    public Guid InvoiceId { get; set; }
    public string InvoiceCode { get; set; } = null!;
    public string MemberName { get; set; } = null!;
    public PaymentMethod Method { get; set; }
    public string? RefNo { get; set; }
    public decimal Amount { get; set; }
    public PaymentStatus Status { get; set; }
    public string ProcessedByStaffName { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}
