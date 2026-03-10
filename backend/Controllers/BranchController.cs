using Microsoft.AspNetCore.Mvc;
using backend.Helpers;
using backend.Interfaces;
using backend.DTOs.Branch;

namespace backend.Controllers;

[ApiController]
[Route("api/branches")]
public class BranchController : ControllerBase
{
    private readonly IBranchService _service;

    public BranchController(IBranchService service)
    {
        _service = service;
    }

    // View Branch List
    [HttpGet]
    public async Task<ApiResponse<List<BranchListDto>>> GetBranches(
        string? search,
        string? status)
    {
        try
        {
            var result = await _service.GetBranchesAsync(search, status);

            return new ApiResponse<List<BranchListDto>>(result);
        }
        catch
        {
            return new ApiResponse<List<BranchListDto>>(
                "Không thể tải danh sách, vui lòng thử lại");
        }
    }

    // Create Branch
    [HttpPost]
    public async Task<ApiResponse<BranchListDto>> CreateBranch(CreateBranchDto dto)
    {
        var userId = Guid.Parse(User.FindFirst("sub")!.Value);

        var result = await _service.CreateBranchAsync(dto, userId);

        return new ApiResponse<BranchListDto>(result);
    }

    // Update Branch
    [HttpPut("{id}")]
    public async Task<ApiResponse<bool>> UpdateBranch(Guid id, UpdateBranchDto dto)
    {
        var userId = Guid.Parse(User.FindFirst("sub")!.Value);

        var result = await _service.UpdateBranchAsync(id, dto, userId);

        if (!result)
            return new ApiResponse<bool>("Branch not found");

        return new ApiResponse<bool>(true);
    }

    // Deactivate Branch
    [HttpDelete("{id}")]
    public async Task<ApiResponse<bool>> DeleteBranch(Guid id)
    {
        var userId = Guid.Parse(User.FindFirst("sub")!.Value);

        var result = await _service.DeactivateBranchAsync(id, userId);

        if (!result)
            return new ApiResponse<bool>("Branch not found");

        return new ApiResponse<bool>(true);
    }
}