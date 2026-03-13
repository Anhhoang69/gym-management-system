namespace backend.DTOs.Package;

using backend.Enums;

public class UpdatePackageDto
{
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

    public List<PackageFeatureDto> Features { get; set; } = new();

    public List<PackagePricingDto> Pricings { get; set; } = new();

    public PackagePolicyDto? Policy { get; set; }
}