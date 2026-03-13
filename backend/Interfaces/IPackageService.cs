using backend.DTOs.Package;

namespace backend.Interfaces;

public interface IPackageService
{
    Task<List<PackageDto>> GetPackagesAsync(
        string? search,
        string? status,
        string? tier);

    Task<PackageStatsDto> GetPackageStatsAsync();

    Task<PackageDto?> GetPackageAsync(Guid id);

    Task<bool> UpdatePackageAsync(
        Guid id,
        UpdatePackageDto dto,
        Guid userId);

    Task<bool> DeactivatePackageAsync(
        Guid id,
        Guid userId);

    Task<bool> DeletePackageAsync(
        Guid id,
        Guid userId);
}