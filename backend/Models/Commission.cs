namespace backend.Models;

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
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}