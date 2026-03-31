using Microsoft.AspNetCore.Mvc;
using backend.DTOs.User;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly IUserService _service;

    public UserController(IUserService service)
    {
        _service = service;
    }

    [HttpGet]
    [SwaggerOperation(
        Summary = "Lấy danh sách người dùng với phân trang",
        Description = "Trả về danh sách người dùng với bộ lọc theo search (fullname, email), status, branch, role hệ thống: gymOwner, SuperAdmin, Member, Staff (BranchAdmin, PT, HeadPT, Sales, Receptionist). Hỗ trợ phân trang. Chỉ trả về các trường cần thiết cho danh sách."
    )]
    public async Task<ApiResponse<PagedResult<UserListDto>>> GetUsers(
        int page = 1,
        int pageSize = 10,
        string? search = null,
        UserStatus? status = null,
        Guid? branchId = null,
        string? role = null)
    {
        var result = await _service.GetUserListAsync(page, pageSize, search, status, branchId, role);
        return new ApiResponse<PagedResult<UserListDto>>(result);
    }

    [HttpGet("stats")]
    [SwaggerOperation(
        Summary = "Lấy thống kê người dùng",
        Description = "Trả về số liệu thống kê về người dùng theo vai trò và trạng thái."
    )]
    public async Task<ApiResponse<UserStatsDto>> GetStats()
    {
        var result = await _service.GetUserStatsAsync();

        return new ApiResponse<UserStatsDto>(result);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(
        Summary = "Lấy chi tiết người dùng",
        Description = "Trả về thông tin chi tiết của một người dùng theo ID."
    )]
    public async Task<ApiResponse<UserDto?>> GetUser(Guid id)
    {
        var result = await _service.GetUserAsync(id);

        if (result == null)
            return new ApiResponse<UserDto?>("User not found");

        return new ApiResponse<UserDto?>(result);
    }

    [HttpPut("{id}")]
    [SwaggerOperation(
        Summary = "Cập nhật thông tin người dùng",
        Description = "Cập nhật thông tin người dùng theo ID. Ghi audit log. Chỉ dành cho admin."
    )]
    public async Task<ApiResponse<bool>> UpdateUser(Guid id, UpdateUserDto dto)
    {
        var adminId = Guid.Parse("daafff73-5a97-449e-9779-3e179d0db93c");

        var result = await _service.UpdateUserAsync(id, dto, adminId);

        if (!result)
            return new ApiResponse<bool>("User not found");

        return new ApiResponse<bool>(true, "User updated");
    }

    [HttpPatch("{id}/status")]
    [SwaggerOperation(
        Summary = "Cập nhật trạng thái người dùng",
        Description = "Thay đổi trạng thái của người dùng (Active, Inactive, Suspended). Ghi audit log. Chỉ dành cho admin."
    )]
    public async Task<ApiResponse<bool>> UpdateUserStatus(Guid id, UpdateUserStatusDto dto)
    {
        var adminId = Guid.Parse("daafff73-5a97-449e-9779-3e179d0db93c");

        var result = await _service.UpdateUserStatusAsync(id, dto.Status, adminId);

        if (!result)
            return new ApiResponse<bool>("User not found");

        return new ApiResponse<bool>(true, "User status updated");
    }

}