using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Attendance;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers;

[ApiController]
[Route("api/attendance")]
[Authorize]
public class AttendanceController : ControllerBase
{
    private readonly IAttendanceService _service;

    public AttendanceController(IAttendanceService service)
    {
        _service = service;
    }

    [HttpPost("checkin")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles + "," + AuthorizationRoles.StaffRoles)]
    [SwaggerOperation(Summary = "Check-in member bằng thẻ", Description = "Receptionist quẹt thẻ member để check-in vào gym. Validate thẻ và gói tập.")]
    public async Task<ApiResponse<AttendanceDto>> CheckIn(CheckInRequestDto dto)
    {
        var result = await _service.CheckInAsync(dto);
        return new ApiResponse<AttendanceDto>(result, "Checked in successfully");
    }

    [HttpPost("checkout")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles + "," + AuthorizationRoles.StaffRoles)]
    [SwaggerOperation(Summary = "Check-out member bằng thẻ", Description = "Receptionist quẹt thẻ member để check-out khỏi gym.")]
    public async Task<ApiResponse<AttendanceDto>> CheckOut(CheckInRequestDto dto)
    {
        var result = await _service.CheckOutAsync(dto);
        return new ApiResponse<AttendanceDto>(result, "Checked out successfully");
    }

    [HttpPost("checkin/manual")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles + "," + AuthorizationRoles.StaffRoles)]
    [SwaggerOperation(Summary = "Check-in thủ công", Description = "Receptionist check-in thủ công cho member (quên thẻ).")]
    public async Task<ApiResponse<AttendanceDto>> ManualCheckIn(ManualCheckInDto dto)
    {
        var staffId = User.GetRequiredUserId();
        var result = await _service.ManualCheckInAsync(dto, staffId);
        return new ApiResponse<AttendanceDto>(result, "Checked in manually successfully");
    }

    [HttpGet("my")]
    [Authorize(Roles = AuthorizationRoles.MemberOnly)]
    [SwaggerOperation(Summary = "Lịch sử check-in của tôi", Description = "Member xem lịch sử vào gym của mình.")]
    public async Task<ApiResponse<List<AttendanceDto>>> GetMyAttendance()
    {
        var memberId = User.GetRequiredUserId();
        var result = await _service.GetMyAttendanceAsync(memberId);
        return new ApiResponse<List<AttendanceDto>>(result);
    }

    [HttpGet("branch/{branchId}")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles + "," + AuthorizationRoles.StaffRoles)]
    [SwaggerOperation(Summary = "Lịch sử check-in của chi nhánh", Description = "Staff/Admin xem danh sách check-in tại chi nhánh theo ngày.")]
    public async Task<ApiResponse<List<AttendanceDto>>> GetBranchAttendance(Guid branchId, [FromQuery] DateOnly? date)
    {
        var result = await _service.GetBranchAttendanceAsync(branchId, date);
        return new ApiResponse<List<AttendanceDto>>(result);
    }

    [HttpGet("member/{memberId}")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles + "," + AuthorizationRoles.StaffRoles)]
    [SwaggerOperation(Summary = "Lịch sử check-in của một member", Description = "Staff/Admin xem lịch sử vào gym của một member cụ thể.")]
    public async Task<ApiResponse<List<AttendanceDto>>> GetMemberAttendance(Guid memberId)
    {
        var result = await _service.GetMemberAttendanceAsync(memberId);
        return new ApiResponse<List<AttendanceDto>>(result);
    }
}
