using Microsoft.AspNetCore.Mvc;
using backend.DTOs.User;
using backend.Helpers;
using backend.Interfaces;

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
    public async Task<ApiResponse<PagedResult<UserDto>>> GetUsers(
        int page = 1,
        int pageSize = 10,
        string? search = null,
        string? status = null,
        Guid? branchId = null,
        string? role = null)
    {
        var result = await _service.GetUsersAsync(page, pageSize, search, status, branchId, role);

        return new ApiResponse<PagedResult<UserDto>>(result);
    }

    [HttpGet("stats")]
    public async Task<ApiResponse<UserStatsDto>> GetStats()
    {
        var result = await _service.GetUserStatsAsync();

        return new ApiResponse<UserStatsDto>(result);
    }

    [HttpGet("{id}")]
    public async Task<ApiResponse<UserDto?>> GetUser(Guid id)
    {
        var result = await _service.GetUserAsync(id);

        if (result == null)
            return new ApiResponse<UserDto?>("User not found");

        return new ApiResponse<UserDto?>(result);
    }

    [HttpPut("{id}")]
    public async Task<ApiResponse<bool>> UpdateUser(Guid id, UpdateUserDto dto)
    {
        var adminId = Guid.Parse("daafff73-5a97-449e-9779-3e179d0db93c");

        var result = await _service.UpdateUserAsync(id, dto, adminId);

        if (!result)
            return new ApiResponse<bool>("User not found");

        return new ApiResponse<bool>(true, "User updated");
    }

    [HttpPatch("{id}/deactivate")]
    public async Task<ApiResponse<bool>> DeactivateUser(Guid id)
    {
        var adminId = Guid.Parse("daafff73-5a97-449e-9779-3e179d0db93c");

        var result = await _service.DeactivateUserAsync(id, adminId);

        if (!result)
            return new ApiResponse<bool>("User not found");

        return new ApiResponse<bool>(true, "User deactivated");
    }

}