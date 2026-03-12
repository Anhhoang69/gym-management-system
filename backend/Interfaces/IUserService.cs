using backend.DTOs.User;
using backend.Helpers;

namespace backend.Interfaces;

public interface IUserService
{
    Task<PagedResult<UserDto>> GetUsersAsync(
        int page,
        int pageSize,
        string? search,
        string? status,
        Guid? branchId,
        string? role);

    Task<UserDto?> GetUserAsync(Guid id);

    Task<bool> UpdateUserAsync(Guid id, UpdateUserDto dto, Guid adminId);

    Task<bool> DeactivateUserAsync(Guid id, Guid adminId);

    Task<UserStatsDto> GetUserStatsAsync();
}