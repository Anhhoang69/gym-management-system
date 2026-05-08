using backend.Enums;

namespace backend.DTOs.Contract;

public class ContractDto
{
    public Guid ContractId { get; set; }
    public Guid MemberUserId { get; set; }
    public string MemberName { get; set; } = null!;
    public string PackageName { get; set; } = null!;
    public ContractStatus Status { get; set; }
    public decimal DealPrice { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int TotalPrivateSessions { get; set; }
    public int UsedPrivateSessions { get; set; }
    public int TotalGroupSessions { get; set; }
    public int UsedGroupSessions { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; }

    /// <summary>Null khi chưa có Invoice</summary>
    public Guid? InvoiceId { get; set; }
    public InvoiceStatus? InvoiceStatus { get; set; }
}
