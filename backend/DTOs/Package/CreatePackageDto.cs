namespace backend.DTOs.Package;
using backend.Enums;

public class CreatePackageDto
{
    // Basic Info
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? ThumbnailUrl { get; set; }
    public PackageTier Tier { get; set; }
    public string? BadgeLabel { get; set; }
    public int DisplayOrder { get; set; }

    // PT Sessions
    public bool IsPtIncluded { get; set; }
    public int PrivatePtLimit { get; set; }
    public int GroupPtLimit { get; set; }
    public int MaxCheckinsPerWeek { get; set; }

    // Pricing (bắt buộc ít nhất 1)
    public List<PackagePricingDto> Pricings { get; set; } = new();

    // Features / bullet points
    public List<PackageFeatureDto> Features { get; set; } = new();

    // Freeze Policy + Package Options (optional — nếu null thì default = không cho phép)
    public PackagePolicyDto? Policy { get; set; }
}
