namespace backend.Models;

using backend.Enums;

public class Commission
{
    public Guid CommissionId { get; set; }

    public Guid StaffId { get; set; }
    public Staff Staff { get; set; } = null!;

    public Guid ContractId { get; set; }
    public Contract Contract { get; set; } = null!;

    public Guid InvoiceId { get; set; }
    public Invoice Invoice { get; set; } = null!;

    public decimal Percent { get; set; }

    public decimal Amount { get; set; }

    /// <summary>Approved ngay khi Payment hoàn thành — không cần approval workflow</summary>
    public CommissionStatus Status { get; set; } = CommissionStatus.Approved;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}