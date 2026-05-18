using backend.DTOs.Common;

namespace backend.DTOs.Contract;

public class ContractDraftQueryDto : PagedQueryDto
{
    public Guid? MemberId { get; set; }
    public Guid? BranchId { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}
