using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Class;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers;

[ApiController]
[Route("api/pt")]
[Authorize]
public class PTController : ControllerBase
{
    private readonly IClassService _classService;

    public PTController(IClassService classService)
    {
        _classService = classService;
    }

    [HttpGet("members/{memberId}/training-history")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles + "," + AuthorizationRoles.StaffRoles)] // Includes PT
    [SwaggerOperation(
        Summary = "Lấy lịch sử tập luyện của member",
        Description = "Trả về lịch sử buổi tập của member (ClassBookings). PT chỉ xem được nếu có dạy member này."
    )]
    public async Task<ApiResponse<List<ClassBookingHistoryDto>>> GetMemberTrainingHistory(Guid memberId)
    {
        var callerUserId = User.GetRequiredUserId();
        var result = await _classService.GetMemberTrainingHistoryAsync(memberId, callerUserId);

        return new ApiResponse<List<ClassBookingHistoryDto>>(result);
    }
}
