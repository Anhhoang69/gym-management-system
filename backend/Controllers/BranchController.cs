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

    // ===== LIST =====

    [HttpGet]
    [SwaggerOperation(
        Summary = "Lấy danh sách chi nhánh",
        Description = "SuperAdmin/GymOwner: xem tất cả. Staff: chỉ xem branch của mình. Lọc theo search và status."
    )]
    public async Task<ApiResponse<List<BranchListDto>>> GetBranches(
        string? search,
        BranchStatus? status)
    {
        var result = await _service.GetBranchListAsync(search, status);
        return new ApiResponse<List<BranchListDto>>(result);
    }

    // ===== DETAIL =====

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

    // ===== STATS =====

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

    // ===== CREATE =====

    [HttpPost]
    [Authorize(Roles = AuthorizationRoles.SuperAdminOnly)]
    [SwaggerOperation(
        Summary = "Tạo chi nhánh mới",
        Description = "SuperAdmin tạo branch mới (Status=Pending). Gửi yêu cầu Approve Configuration đến GymOwner. " +
                      "Có thể đính kèm rooms (Configure Facilities) và staff (Assign Users to Branch). " +
                      "Response trả warnings nếu thiếu cấu hình."
    )]
    public async Task<ApiResponse<CreateBranchResultDto>> CreateBranch(CreateBranchDto dto)
    {
        var userId = User.GetRequiredUserId();
        var result = await _service.CreateBranchAsync(dto, userId);
        return new ApiResponse<CreateBranchResultDto>(result, "Branch created – awaiting GymOwner approval");
    }

    // ===== UPDATE REQUEST =====

    [HttpPut("{id}")]
    [Authorize(Roles = AuthorizationRoles.SuperAdminOnly)]
    [SwaggerOperation(
        Summary = "Gửi yêu cầu cập nhật chi nhánh",
        Description = "Chỉ SuperAdmin. Gửi yêu cầu cập nhật thông tin chi nhánh. Yêu cầu cần được GymOwner phê duyệt."
    )]
    public async Task<ApiResponse<bool>> UpdateBranch(Guid id, UpdateBranchDto dto)
    {
        var userId = User.GetRequiredUserId();
        var result = await _service.UpdateBranchAsync(id, dto, userId);

        if (!result)
            return new ApiResponse<bool>("Branch not found");

        return new ApiResponse<bool>(true, "Update request submitted – awaiting GymOwner approval");
    }

    // ===== DEACTIVATE REQUEST =====

    [HttpDelete("{id}")]
    [Authorize(Roles = AuthorizationRoles.SuperAdminOnly)]
    [SwaggerOperation(
        Summary = "Gửi yêu cầu vô hiệu hóa chi nhánh",
        Description = "Chỉ SuperAdmin. Gửi yêu cầu vô hiệu hóa chi nhánh. Yêu cầu cần được GymOwner phê duyệt."
    )]
    public async Task<ApiResponse<bool>> DeactivateBranch(Guid id)
    {
        var userId = User.GetRequiredUserId();
        var result = await _service.DeactivateBranchAsync(id, userId);

        if (!result)
            return new ApiResponse<bool>("Branch not found");

        return new ApiResponse<bool>(true, "Deactivate request submitted – awaiting GymOwner approval");
    }

    // ===== ASSIGN STAFF =====

    [HttpPost("{id}/staff")]
    [Authorize(Roles = AuthorizationRoles.SuperAdminOnly)]
    [SwaggerOperation(
        Summary = "Gán nhân viên vào chi nhánh",
        Description = "Gán danh sách users (phải có role Staff) vào chi nhánh. " +
                      "Bỏ qua nếu đã được gán (warning). Báo lỗi nếu user không hợp lệ (inactive, không phải Staff)."
    )]
    public async Task<ApiResponse<AssignStaffResultDto>> AssignStaff(Guid id, AssignStaffDto dto)
    {
        var adminId = User.GetRequiredUserId();
        var result = await _service.AssignStaffAsync(id, dto, adminId);
        return new ApiResponse<AssignStaffResultDto>(result);
    }

    // ===== REMOVE STAFF =====

    [HttpDelete("{id}/staff/{userId}")]
    [Authorize(Roles = AuthorizationRoles.SuperAdminOnly)]
    [SwaggerOperation(
        Summary = "Gỡ nhân viên khỏi chi nhánh",
        Description = "Gỡ user khỏi chi nhánh. Không xóa Staff record, chỉ ghi audit log. " +
                      "Không thể gỡ nếu còn lớp học đang diễn ra."
    )]
    public async Task<ApiResponse<bool>> RemoveStaff(Guid id, Guid userId)
    {
        var adminId = User.GetRequiredUserId();
        var result = await _service.RemoveStaffFromBranchAsync(id, userId, adminId);

        if (!result)
            return new ApiResponse<bool>("Staff assignment not found");

        return new ApiResponse<bool>(true, "Staff removed from branch");
    }
}