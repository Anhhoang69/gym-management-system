namespace backend.DTOs.Package;

public class PackagePricingDto
{
    public Guid PackagePricingId { get; set; }

    public int DurationMonths { get; set; }

    public decimal Price { get; set; }

    public decimal? OriginalPrice { get; set; }
}