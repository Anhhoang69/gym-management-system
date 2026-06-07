namespace backend.DTOs.User;

using backend.Enums;

public class ContractSummaryDto
{
    public Guid ContractId { get; set; }
    public string PackageName { get; set; } = null!;
    public ContractStatus Status { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int TotalPrivateSessions { get; set; }
    public int UsedPrivateSessions { get; set; }
    public int TotalGroupSessions { get; set; }
    public int UsedGroupSessions { get; set; }
}
