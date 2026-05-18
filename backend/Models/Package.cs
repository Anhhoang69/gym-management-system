namespace backend.Models;
using backend.Enums;
public class Package
{
    public Guid PackageId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string? ThumbnailUrl { get; set; }

    public PackageTier Tier { get; set; }

    public bool IsPtIncluded { get; set; }

    public int PrivatePtLimit { get; set; }

    public int GroupPtLimit { get; set; }

    public int MaxCheckinsPerWeek { get; set; }

    public string? BadgeLabel { get; set; }

    public int DisplayOrder { get; set; }

    public PackageStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public PackagePolicy? PackagePolicy { get; set; }

    public ICollection<PackageFeature> Features { get; set; } = new List<PackageFeature>();

    public ICollection<PackagePricing> Pricings { get; set; } = new List<PackagePricing>();

    public ICollection<Contract> Contracts { get; set; } = new List<Contract>();
}