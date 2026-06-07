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

    /// <summary>Số lần tối đa hội viên được phép freeze gói trong suốt thời hạn hợp đồng</summary>
    public int MaxFreezeCount { get; set; }

    public decimal FreezeFee { get; set; }

    /// <summary>Cho phép chuyển nhượng gói cho người khác — reserved for future business logic</summary>
    public bool TransferAllowed { get; set; }

    /// <summary>Cho phép gia hạn sớm trước khi hết hạn — reserved for future business logic</summary>
    public bool EarlyRenewAllowed { get; set; }

    /// <summary>Cho phép check-in tại chi nhánh khác chi nhánh gốc (All-access)</summary>
    public bool AllowMultiBranch { get; set; } = false;

    // Navigation
    public Package Package { get; set; } = null!;
}