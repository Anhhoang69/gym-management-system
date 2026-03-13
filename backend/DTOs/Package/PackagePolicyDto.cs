namespace backend.DTOs.Package;

using backend.Enums;

public class PackagePolicyDto
{
    public decimal ChangeFeeDefault { get; set; }

    public ProrationRuleType ProrationRule { get; set; }

    public bool UpgradeAllowed { get; set; }

    public bool DowngradeAllowed { get; set; }

    public bool FreezeAllowed { get; set; }

    public int MaxFreezeDays { get; set; }

    public decimal FreezeFee { get; set; }
}