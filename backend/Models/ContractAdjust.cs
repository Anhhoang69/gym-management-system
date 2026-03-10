namespace backend.Models;

using backend.Enums;

public class ContractAdjust
{
    public Guid ContractAdjustId { get; set; }

    public Guid ContractId { get; set; }

    public Guid OldPackageId { get; set; }

    public Guid NewPackageId { get; set; }

    public ContractAdjustActionType ActionType { get; set; }

    public decimal ProrationAmount { get; set; }

    public decimal ChangeFeeAmount { get; set; }

    public ContractAdjustStatus Status { get; set; } = ContractAdjustStatus.Pending;

    public DateTime EffectiveFrom { get; set; }

    public DateTime? EffectiveTo { get; set; }

    public Guid? ApprovedByStaffId { get; set; }

    public DateTime? ApprovedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // ================= RELATIONSHIPS =================

    // N - 1
    public Contract Contract { get; set; } = null!;

    public Package OldPackage { get; set; } = null!;

    public Package NewPackage { get; set; } = null!;
    public Staff? ApprovedByStaff { get; set; }
}