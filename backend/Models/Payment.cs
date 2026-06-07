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
    public Guid ProcessedByStaffId { get; set; }

    public Staff ProcessedByStaff { get; set; } = null!;

    // Navigation

    public Invoice Invoice { get; set; } = null!;
}