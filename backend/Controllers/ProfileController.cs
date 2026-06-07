using System.Security.Claims;
using backend.DTOs.Profile;
using backend.Helpers;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers;

[ApiController]
[Route("api/me")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profileService;

    public ProfileController(IProfileService profileService)
    {
        _profileService = profileService;
    }

    [HttpGet]
    [SwaggerOperation(
        Summary = "Lấy thông tin cá nhân",
        Description = "Trả về hồ sơ của người dùng đang đăng nhập (UC-4)."
    )]
    public async Task<ApiResponse<MyProfileDto>> GetMyProfile()
    {
        var userId = GetCurrentUserId();
        var result = await _profileService.GetMyProfileAsync(userId);
        return new ApiResponse<MyProfileDto>(result, "Profile retrieved");
    }

    [HttpPut]
    [SwaggerOperation(
        Summary = "Cập nhật thông tin cá nhân",
        Description = "Cập nhật các trường tự chỉnh sửa: họ tên, giới tính, ngày sinh, địa chỉ, avatar, ngôn ngữ (UC-4)."
    )]
    public async Task<ApiResponse<object>> UpdateMyProfile([FromBody] UpdateMyProfileDto dto)
    {
        var userId = GetCurrentUserId();
        await _profileService.UpdateMyProfileAsync(userId, dto);
        return new ApiResponse<object>(true, "Profile updated");
    }

    [HttpGet("login-history")]
    [SwaggerOperation(
        Summary = "Lịch sử đăng nhập / phiên hoạt động",
        Description = "Danh sách các lần đăng nhập, thiết bị và IP (UC-4)."
    )]
    public async Task<ApiResponse<PagedResult<LoginHistoryDto>>> GetLoginHistory(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var userId = GetCurrentUserId();
        var result = await _profileService.GetMyLoginHistoryAsync(userId, page, pageSize);
        return new ApiResponse<PagedResult<LoginHistoryDto>>(result, "Login history retrieved");
    }

    [HttpDelete("sessions/{loginHistoryId:guid}")]
    [SwaggerOperation(
        Summary = "Thu hồi phiên đăng nhập",
        Description = "Đánh dấu một phiên đăng nhập cụ thể là đã bị thu hồi (UC-4)."
    )]
    public async Task<ApiResponse<object>> RevokeSession([FromRoute] Guid loginHistoryId)
    {
        var userId = GetCurrentUserId();
        await _profileService.RevokeSessionAsync(userId, loginHistoryId);
        return new ApiResponse<object>(true, "Session revoked");
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? throw new Exception("Unauthorized");
        return Guid.Parse(claim);
    }
}
