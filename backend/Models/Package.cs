namespace backend.Models;
using backend.Enums;
public class Package
{
    public Guid PackageId { get; set; }

    public string Name { get; set; } = null!;

    public int Duration { get; set; }

    public decimal BasePrice { get; set; }

    public string? ThumbnailUrl { get; set; }

    public int PrivatePtLimit { get; set; }

    public int GroupPtLimit { get; set; }

    public bool IsPtIncluded { get; set; }

    public PackageStatus Status { get; set; } = PackageStatus.Active;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // 1 - 1
    public PackagePolicy? PackagePolicy { get; set; }

    // 1 - N
    public ICollection<Contract> Contracts { get; set; } = new List<Contract>();
}