using backend.DTOs.Common;
using backend.Enums;

namespace backend.DTOs.Invoice;

public class InvoiceQueryDto : PagedQueryDto
{
    public InvoiceStatus? Status { get; set; }
    public Guid? BranchId { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}
