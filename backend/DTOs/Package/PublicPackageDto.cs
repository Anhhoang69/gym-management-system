namespace backend.DTOs.Package;

public class PublicPackageDto
{
    public Guid PackageId { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string Tier { get; set; } = null!;
    public bool IsPtIncluded { get; set; }
    public int PrivatePtLimit { get; set; }
    public int GroupPtLimit { get; set; }
    public int MaxCheckinsPerWeek { get; set; }
    public string? BadgeLabel { get; set; }
    public List<string> Features { get; set; } = new();
    public List<PublicPackagePricingDto> Pricings { get; set; } = new();
}

public class PublicPackagePricingDto
{
    public Guid PackagePricingId { get; set; }
    public int DurationMonths { get; set; }
    public decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
}
