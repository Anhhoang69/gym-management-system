using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Package;
using backend.Helpers;
using backend.Interfaces;

namespace backend.Controllers;

[ApiController]
[Route("api/packages")]
public class PackageController : ControllerBase
{
    private readonly IPackageService _service;

    public PackageController(IPackageService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ApiResponse<List<PackageDto>>> GetPackages(
        string? search,
        string? status,
        string? tier)
    {
        var result = await _service.GetPackagesAsync(search, status, tier);

        return new ApiResponse<List<PackageDto>>(result);
    }

    [HttpGet("stats")]
    public async Task<ApiResponse<PackageStatsDto>> GetStats()
    {
        var result = await _service.GetPackageStatsAsync();

        return new ApiResponse<PackageStatsDto>(result);
    }

    [HttpGet("{id}")]
    public async Task<ApiResponse<PackageDto?>> GetPackage(Guid id)
    {
        var result = await _service.GetPackageAsync(id);

        if (result == null)
            return new ApiResponse<PackageDto?>("Package not found");

        return new ApiResponse<PackageDto?>(result);
    }

    [HttpPut("{id}")]
    public async Task<ApiResponse<bool>> UpdatePackage(Guid id, UpdatePackageDto dto)
    {
        var userId = Guid.Parse("daafff73-5a97-449e-9779-3e179d0db93c");

        var result = await _service.UpdatePackageAsync(id, dto, userId);

        if (!result)
            return new ApiResponse<bool>("Package not found");

        return new ApiResponse<bool>(true, "Package updated");
    }

    [HttpPatch("{id}/deactivate")]
    public async Task<ApiResponse<bool>> DeactivatePackage(Guid id)
    {
        var userId = Guid.Parse("daafff73-5a97-449e-9779-3e179d0db93c");

        var result = await _service.DeactivatePackageAsync(id, userId);

        if (!result)
            return new ApiResponse<bool>("Package not found");

        return new ApiResponse<bool>(true, "Package deactivated");
    }

    [HttpDelete("{id}")]
    public async Task<ApiResponse<bool>> DeletePackage(Guid id)
    {
        var userId = Guid.Parse("daafff73-5a97-449e-9779-3e179d0db93c");

        try
        {
            var result = await _service.DeletePackageAsync(id, userId);

            if (!result)
                return new ApiResponse<bool>("Package not found");

            return new ApiResponse<bool>(true, "Package deleted");
        }
        catch (Exception ex)
        {
            return new ApiResponse<bool>(ex.Message);
        }
    }
}