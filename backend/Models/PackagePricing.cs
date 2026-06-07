namespace backend.Models;

public class PackagePricing
{
    public Guid PackagePricingId { get; set; }

    public Guid PackageId { get; set; }

    public int DurationMonths { get; set; }

    public decimal Price { get; set; }

    public decimal? OriginalPrice { get; set; }

    public Package Package { get; set; } = null!;
}