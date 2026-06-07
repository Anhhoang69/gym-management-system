namespace backend.DTOs.Package;

public class PackageFeatureDto
{
    public Guid PackageFeatureId { get; set; }

    public string Content { get; set; } = null!;

    public int DisplayOrder { get; set; }
}