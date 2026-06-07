namespace backend.DTOs.Invoice;

public class IssueInvoiceDto
{
    public Guid ContractId { get; set; }
    public decimal TaxAmount { get; set; } = 0;
}
