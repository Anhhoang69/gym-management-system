namespace backend.DTOs.Package;

public class PackageStatsDto
{
    public int TotalPackages { get; set; }

    public int ActivePackages { get; set; }

    public int InactivePackages { get; set; }

    public int TotalSubscribers { get; set; }
}