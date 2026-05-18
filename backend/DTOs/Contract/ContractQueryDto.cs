using backend.DTOs.Common;
using backend.Enums;

namespace backend.DTOs.Contract;

public class ContractQueryDto : PagedQueryDto
{
    public Guid? BranchId { get; set; }
    public Guid? MemberId { get; set; }
    public ContractStatus? Status { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}
