using backend.DTOs.User;
using backend.Helpers;
using backend.Enums;
namespace backend.Interfaces;

public interface IUserService
{

    Task<PagedResult<UserListDto>> GetUserListAsync(
        int page,
        int pageSize,
        string? search,
        UserStatus? status,
        Guid? branchId,
        string? role);

    Task<UserDto?> GetUserAsync(Guid id);

    Task<bool> UpdateUserAsync(Guid id, UpdateUserDto dto, Guid adminId);

    Task<bool> UpdateUserStatusAsync(Guid id, UserStatus status, Guid adminId);

    Task<UserStatsDto> GetUserStatsAsync();
}