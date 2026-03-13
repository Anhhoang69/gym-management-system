namespace backend.Models;

public class PackageFeature
{
    public Guid PackageFeatureId { get; set; }

    public Guid PackageId { get; set; }

    public string Content { get; set; } = null!;

    public int DisplayOrder { get; set; }

    public Package Package { get; set; } = null!;
}