namespace backend.Models;
using backend.Enums;
public class PackagePolicy
{
    public Guid PackageId { get; set; }   // PK + FK

    public decimal ChangeFeeDefault { get; set; }

    public ProrationRuleType ProrationRule { get; set; }

    public bool UpgradeAllowed { get; set; }

    public bool DowngradeAllowed { get; set; }

    public bool FreezeAllowed { get; set; }

    public int MaxFreezeDays { get; set; }

    public decimal FreezeFee { get; set; }

    // Navigation
    public Package Package { get; set; } = null!;
}