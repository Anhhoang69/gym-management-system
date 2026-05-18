using backend.Enums;

namespace backend.DTOs.Invoice;

public class InvoiceListDto
{
    public Guid InvoiceId { get; set; }
    public Guid ContractId { get; set; }
    public string InvoiceCode { get; set; } = null!;
    public string MemberName { get; set; } = null!;
    public decimal TotalAmount { get; set; }
    public InvoiceStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CreatedByStaffName { get; set; } = null!;
}
