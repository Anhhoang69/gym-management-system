using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Package;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

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
    [SwaggerOperation(
        Summary = "Lấy danh sách gói tập",
        Description = "Trả về danh sách gói tập với bộ lọc theo search, status và tier."
    )]
    public async Task<ApiResponse<List<PackageDto>>> GetPackages(
        string? search,
        PackageStatus? status,
        string? tier)
    {
        var result = await _service.GetPackagesAsync(search, status, tier);

        return new ApiResponse<List<PackageDto>>(result);
    }

    [HttpGet("stats")]
    [SwaggerOperation(
        Summary = "Lấy thống kê gói tập",
        Description = "Trả về số liệu thống kê về các gói tập."
    )]
    public async Task<ApiResponse<PackageStatsDto>> GetStats()
    {
        var result = await _service.GetPackageStatsAsync();

        return new ApiResponse<PackageStatsDto>(result);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(
        Summary = "Lấy chi tiết gói tập",
        Description = "Trả về thông tin chi tiết của một gói tập theo ID."
    )]
    public async Task<ApiResponse<PackageDto?>> GetPackage(Guid id)
    {
        var result = await _service.GetPackageAsync(id);

        if (result == null)
            return new ApiResponse<PackageDto?>("Package not found");

        return new ApiResponse<PackageDto?>(result);
    }

    [HttpPut("{id}")]
    [SwaggerOperation(
        Summary = "Cập nhật thông tin gói tập",
        Description = "Cập nhật thông tin gói tập theo ID. Ghi audit log. Chỉ dành cho admin/staff."
    )]
    public async Task<ApiResponse<bool>> UpdatePackage(Guid id, UpdatePackageDto dto)
    {
        var userId = Guid.Parse("daafff73-5a97-449e-9779-3e179d0db93c");

        var result = await _service.UpdatePackageAsync(id, dto, userId);

        if (!result)
            return new ApiResponse<bool>("Package not found");

        return new ApiResponse<bool>(true, "Package updated");
    }

    [HttpPatch("{id}/status")]
    [SwaggerOperation(
        Summary = "Cập nhật trạng thái gói tập",
        Description = "Thay đổi trạng thái của gói tập (Active, Inactive). Ghi audit log. Chỉ dành cho admin/staff."
    )]
    public async Task<ApiResponse<bool>> UpdatePackageStatus(
    Guid id,
    UpdatePackageStatusDto dto)
    {
        var userId = Guid.Parse("daafff73-5a97-449e-9779-3e179d0db93c");

        var result = await _service.UpdatePackageStatusAsync(
            id,
            dto.Status,
            userId);

        if (!result)
            return new ApiResponse<bool>("Package not found");

        return new ApiResponse<bool>(true, "Package status updated");
    }

    [HttpDelete("{id}")]
    [SwaggerOperation(
        Summary = "Xóa gói tập",
        Description = "Xóa gói tập theo ID. Ghi audit log. Chỉ dành cho admin/staff."
    )]
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