using backend.Enums;

namespace backend.DTOs.Commission;

public class CommissionListDto
{
    public Guid CommissionId { get; set; }
    public Guid ContractId { get; set; }
    public string MemberName { get; set; } = null!;
    public string PackageName { get; set; } = null!;
    public decimal Percent { get; set; }
    public decimal Amount { get; set; }
    public CommissionStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}
