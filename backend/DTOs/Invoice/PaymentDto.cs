using backend.Enums;

namespace backend.DTOs.Invoice;

public class PaymentDto
{
    public Guid PaymentId { get; set; }
    public Guid InvoiceId { get; set; }
    public PaymentMethod Method { get; set; }
    public string? RefNo { get; set; }
    public decimal Amount { get; set; }
    public PaymentStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}
