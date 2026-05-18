using backend.DTOs.Common;
using backend.Enums;

namespace backend.DTOs.Payment;

public class PaymentQueryDto : PagedQueryDto
{
    public PaymentMethod? Method { get; set; }
    public Guid? BranchId { get; set; }
    public Guid? InvoiceId { get; set; }
    public Guid? StaffId { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}
