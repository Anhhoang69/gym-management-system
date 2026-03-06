namespace backend.Models;

using backend.Enums;

public class Invoice
{
    public Guid InvoiceId { get; set; }

    public Guid ContractId { get; set; }

    public Guid MemberId { get; set; }

    public string InvoiceCode { get; set; } = null!;

    public decimal Subtotal { get; set; }

    public decimal DiscountAmount { get; set; }

    public decimal TaxAmount { get; set; }

    public decimal TotalAmount { get; set; }

    public InvoiceStatus Status { get; set; } = InvoiceStatus.Pending;

    public Guid CreatedByStaffId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation

    public Contract Contract { get; set; } = null!;

    public Member Member { get; set; } = null!;

    public Staff CreatedByStaff { get; set; } = null!;

    public Payment? Payment { get; set; }
}