namespace backend.DTOs.Package;

public class PackageFeatureDto
{
    public Guid FeatureId { get; set; }

    public string Content { get; set; } = null!;

    public int DisplayOrder { get; set; }
}