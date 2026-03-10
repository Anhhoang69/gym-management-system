namespace backend.Models;

using backend.Enums;

public class Contract
{
    public Guid ContractId { get; set; }

    public Guid MemberUserId { get; set; }

    public Guid PackageId { get; set; }

    public Guid StaffId { get; set; }

    public decimal DealPrice { get; set; }

    public string? Note { get; set; }

    public ContractStatus Status { get; set; } = ContractStatus.Active;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public int TotalPrivateSessions { get; set; }

    public int UsedPrivateSessions { get; set; }

    public int TotalGroupSessions { get; set; }

    public int UsedGroupSessions { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // ================= RELATIONS =================

    public Member Member { get; set; } = null!;

    public Package Package { get; set; } = null!;

    public Staff Staff { get; set; } = null!;

     // 1 - 1
    public Invoice? Invoice { get; set; }

    public Commission? Commission { get; set; }

    // M - N
    public ICollection<ContractPromotion> ContractPromotions { get; set; } = new List<ContractPromotion>();

    // 1 - N
    public ICollection<ContractAdjust> ContractAdjusts { get; set; } = new List<ContractAdjust>();
}