using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Helpers;
using backend.Interfaces;
using backend.DTOs.Branch;
using backend.Enums;
using backend.Extensions;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers;

[ApiController]
[Route("api/branches")]
[Authorize(Roles = AuthorizationRoles.AdminRoles)]
public class BranchController : ControllerBase
{
    private readonly IBranchService _service;

    public BranchController(IBranchService service)
    {
        _service = service;
    }

    [HttpGet]
    [SwaggerOperation(
        Summary = "Lấy danh sách chi nhánh",
        Description = "Trả về danh sách chi nhánh với bộ lọc theo search (Name) và status."
    )]
    public async Task<ApiResponse<List<BranchListDto>>> GetBranches(
        string? search,
        BranchStatus? status)
    {
        var result = await _service.GetBranchListAsync(search, status);
        return new ApiResponse<List<BranchListDto>>(result);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(
        Summary = "Lấy chi tiết chi nhánh",
        Description = "Trả về thông tin chi tiết của một chi nhánh theo ID."
    )]
    public async Task<ApiResponse<BranchDto?>> GetBranch(Guid id)
    {
        var result = await _service.GetBranchAsync(id);

        if (result == null)
            return new ApiResponse<BranchDto?>("Branch not found");

        return new ApiResponse<BranchDto?>(result);
    }

    [HttpGet("stats")]
    [SwaggerOperation(
        Summary = "Lấy thống kê chi nhánh",
        Description = "Trả về số liệu thống kê về các chi nhánh."
    )]
    public async Task<ApiResponse<BranchStatsDto>> GetStats()
    {
        var result = await _service.GetBranchStatsAsync();

        return new ApiResponse<BranchStatsDto>(result);
    }

    // UPDATE REQUEST

    [HttpPut("{id}")]
    [SwaggerOperation(
        Summary = "Gửi yêu cầu cập nhật chi nhánh",
        Description = "Gửi yêu cầu cập nhật thông tin chi nhánh. Yêu cầu cần được phê duyệt bởi gymOwner."
    )]
    public async Task<ApiResponse<bool>> UpdateBranch(Guid id, UpdateBranchDto dto)
    {
        var userId = User.GetRequiredUserId();
        var result = await _service.UpdateBranchAsync(id, dto, userId);

        if (!result)
            return new ApiResponse<bool>("Branch not found");

        return new ApiResponse<bool>(true, "Update request submitted");
    }

    // DEACTIVATE REQUEST

    [HttpDelete("{id}")]
    [SwaggerOperation(
        Summary = "Gửi yêu cầu vô hiệu hóa chi nhánh",
        Description = "Gửi yêu cầu vô hiệu hóa chi nhánh. Yêu cầu cần được phê duyệt bởi gymOwner."
    )]
    public async Task<ApiResponse<bool>> DeactivateBranch(Guid id)
    {
        var userId = User.GetRequiredUserId();
        var result = await _service.DeactivateBranchAsync(id, userId);

        if (!result)
            return new ApiResponse<bool>("Branch not found");

        return new ApiResponse<bool>(true, "Deactivate request submitted");
    }

    [HttpPost("requests/{requestId}/approve")]
    [Authorize(Roles = AuthorizationRoles.GymOwnerOnly)]
    [SwaggerOperation(
        Summary = "Phê duyệt yêu cầu chi nhánh",
        Description = "Phê duyệt yêu cầu cập nhật hoặc vô hiệu hóa chi nhánh. Chỉ dành cho gymOwner."
    )]
    public async Task<ApiResponse<bool>> ApproveRequest(Guid requestId)
    {
        var userId = User.GetRequiredUserId();

        var result = await _service.ApproveBranchRequestAsync(requestId, userId);

        if (!result)
            return new ApiResponse<bool>("Request not found");

        return new ApiResponse<bool>(true, "Request approved");
    }

    [HttpPost("requests/{requestId}/reject")]
    [Authorize(Roles = AuthorizationRoles.GymOwnerOnly)]
    public async Task<ApiResponse<bool>> RejectRequest(
    Guid requestId,
    string? message)
    {
        var userId = User.GetRequiredUserId();

        var result = await _service.RejectBranchRequestAsync(requestId, userId, message);

        if (!result)
            return new ApiResponse<bool>("Request not found");

        return new ApiResponse<bool>(true, "Request rejected");
    }

}