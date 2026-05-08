using backend.Enums;

namespace backend.DTOs.Invoice;

public class InvoiceDto
{
    public Guid InvoiceId { get; set; }
    public Guid ContractId { get; set; }
    public string InvoiceCode { get; set; } = null!;
    public decimal Subtotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public InvoiceStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}
