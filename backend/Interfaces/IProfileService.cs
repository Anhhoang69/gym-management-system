using backend.DTOs.Profile;
using backend.Helpers;
using backend.Models;

namespace backend.Interfaces;

public interface IProfileService
{
    Task<MyProfileDto> GetMyProfileAsync(Guid userId);
    Task UpdateMyProfileAsync(Guid userId, UpdateMyProfileDto dto);
    Task<PagedResult<LoginHistoryDto>> GetMyLoginHistoryAsync(Guid userId, int page, int pageSize);
    Task RevokeSessionAsync(Guid userId, Guid loginHistoryId);
}
