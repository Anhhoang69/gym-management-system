using backend.DTOs.Package;
using backend.Enums;

namespace backend.Interfaces;

public interface IPackageService
{
    Task<List<PackageDto>> GetPackagesAsync(
        string? search,
        PackageStatus? status,
        string? tier);

    Task<PackageStatsDto> GetPackageStatsAsync();

    Task<PackageDto?> GetPackageAsync(Guid id);

    Task<Guid> CreatePackageAsync(CreatePackageDto dto, Guid userId);

    Task<bool> UpdatePackageAsync(
        Guid id,
        UpdatePackageDto dto,
        Guid userId);

    Task<bool> UpdatePackageStatusAsync(Guid id, PackageStatus status, Guid userId);

    Task<bool> DeletePackageAsync(
        Guid id,
        Guid userId);
}