using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Class;
using backend.Extensions;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers;

[ApiController]
[Route("api/classes")]
[Authorize]
public class ClassController : ControllerBase
{
    private readonly IClassService _service;

    public ClassController(IClassService service)
    {
        _service = service;
    }

    // ================= LIST =================

    [HttpGet]
    [SwaggerOperation(
        Summary = "Lấy lịch lớp học (Role-based)",
        Description = "Trả về lịch lớp học theo filter. Dữ liệu được lọc theo vai trò (PT chỉ thấy lớp của mình, Member thấy thông tin booking cá nhân)."
    )]
    [AllowAnonymous] // Tạm thời để lấy token trong code
    public async Task<ApiResponse<List<ClassScheduleDto>>> GetSchedule(
        [FromQuery] DateOnly? startDate,
        [FromQuery] DateOnly? endDate,
        [FromQuery] DateOnly? date,
        [FromQuery] Guid? roomId,
        [FromQuery] Guid? trainerId,
        [FromQuery] ClassType? classType,
        [FromQuery] ClassStatus? status,
        [FromQuery] Guid? branchId)
    {
        // Require auth, check explicitly to allow smooth fail if needed or just use GetRequiredUserId if [Authorize] is on class
        // Let's use User.GetRequiredUserId() since controller has [Authorize]
        var userId = User.GetRequiredUserId();

        var result = await _service.GetScheduleAsync(startDate, endDate, date, roomId, trainerId, classType, status, branchId, userId);

        return new ApiResponse<List<ClassScheduleDto>>(result);
    }

    // ================= DETAIL =================

    [HttpGet("{id}")]
    [SwaggerOperation(
        Summary = "Lấy chi tiết một lớp học",
        Description = "Trả về thông tin chi tiết của một lớp học cụ thể theo ID, bao gồm trainer, room và bookings. Dùng để xem thông tin lớp trước khi booking."
    )]
    public async Task<ApiResponse<ClassDto?>> GetClass(Guid id)
    {
        var result = await _service.GetClassAsync(id);

        if (result == null)
            return new ApiResponse<ClassDto?>("Class not found");

        return new ApiResponse<ClassDto?>(result);
    }

    // ================= CREATE =================

    [HttpPost]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)]
    [SwaggerOperation(
        Summary = "Tạo mới một lớp học",
        Description = "Tạo lớp học mới với thông tin từ DTO. Kiểm tra xung đột trainer và room. Chỉ dành cho admin/staff."
    )]
    public async Task<ApiResponse<Guid>> CreateClass(CreateClassDto dto)
    {
        var userId = User.GetRequiredUserId();

        var result = await _service.CreateClassAsync(dto, userId);

        return new ApiResponse<Guid>(result);
    }

    // ================= UPDATE =================

    [HttpPut("{id}")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)]
    [SwaggerOperation(
        Summary = "Cập nhật thông tin lớp học",
        Description = "Cập nhật thông tin lớp học theo ID. Không cho phép cập nhật lớp đã hoàn thành. Chỉ dành cho admin/staff."
    )]
    public async Task<ApiResponse<bool>> UpdateClass(Guid id, UpdateClassDto dto)
    {
        var userId = User.GetRequiredUserId();

        var result = await _service.UpdateClassAsync(id, dto, userId);

        return new ApiResponse<bool>(result);
    }

    // ================= UPDATE STATUS =================

    [HttpPatch("{id}/status")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)]
    [SwaggerOperation(
        Summary = "Cập nhật trạng thái lớp học",
        Description = "Thay đổi trạng thái của lớp học (Scheduled, InProgress, Completed, Cancelled). Ghi audit log. Chỉ dành cho admin/staff."
    )]
    public async Task<ApiResponse<bool>> UpdateClassStatus(Guid id, UpdateClassStatusDto dto)
    {
        var userId = User.GetRequiredUserId();

        var result = await _service.UpdateClassStatusAsync(id, dto.Status, userId);

        if (!result)
            return new ApiResponse<bool>("Class not found");

        return new ApiResponse<bool>(true, "Class status updated");
    }

    // ================= DELETE =================

    [HttpDelete("{id}")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)]
    [SwaggerOperation(
        Summary = "Xóa lớp học",
        Description = "Xóa lớp học theo ID. Không cho phép xóa lớp đã hoàn thành hoặc có bookings. Ghi audit log. Chỉ dành cho admin/staff."
    )]
    public async Task<ApiResponse<bool>> DeleteClass(Guid id)
    {
        var userId = User.GetRequiredUserId();

        var result = await _service.DeleteClassAsync(id, userId);

        return new ApiResponse<bool>(result);
    }

    // ================= BOOKING =================

    [HttpPost("{id}/book")]
    [Authorize(Roles = AuthorizationRoles.MemberOnly)]
    [SwaggerOperation(
        Summary = "Đặt chỗ lớp học",
        Description = "Member đặt chỗ cho một lớp học. Kiểm tra class available, không xung đột lịch, chưa book, và còn chỗ trống. Cho phép rebook nếu đã cancel trước đó."
    )]
    public async Task<ApiResponse<bool>> BookClass(Guid id)
    {
        var memberUserId = User.GetRequiredUserId();

        var result = await _service.BookClassAsync(id, memberUserId);

        return new ApiResponse<bool>(true, "Booked successfully");
    }

    [HttpPatch("{id}/cancel-booking")]
    [Authorize(Roles = AuthorizationRoles.MemberOnly)]
    [SwaggerOperation(
        Summary = "Hủy đặt chỗ lớp học",
        Description = "Member hủy đặt chỗ cho lớp học đã book. Cập nhật status thành Cancelled và ghi lý do hủy."
    )]
    public async Task<ApiResponse<bool>> CancelBooking(Guid id, CancelBookingDto dto)
    {
        var memberUserId = User.GetRequiredUserId();

        var result = await _service.CancelBookingAsync(id, memberUserId, dto.CancelReason);

        return new ApiResponse<bool>(true, "Booking cancelled");
    }

    [HttpGet("my-bookings")]
    [Authorize(Roles = AuthorizationRoles.MemberOnly)]
    [SwaggerOperation(
        Summary = "Lấy danh sách đặt chỗ của member",
        Description = "Trả về danh sách các lớp học mà member đã đặt chỗ, bao gồm thông tin class, trainer, room và trạng thái booking."
    )]
    public async Task<ApiResponse<List<ClassBookingDto>>> GetMyBookings()
    {
        var memberUserId = User.GetRequiredUserId();

        var result = await _service.GetMyBookingsAsync(memberUserId);

        return new ApiResponse<List<ClassBookingDto>>(result);
    }

    // ================= PT / STAFF ACTIONS =================

    [HttpGet("{id}/members")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles + "," + AuthorizationRoles.StaffRoles)] // Includes PT
    [SwaggerOperation(
        Summary = "Lấy danh sách member trong lớp (PT/Staff)",
        Description = "Trả về danh sách member đã book lớp. PT chỉ xem được lớp mình phụ trách."
    )]
    public async Task<ApiResponse<List<ClassMemberDto>>> GetClassMembers(Guid id)
    {
        var userId = User.GetRequiredUserId();
        var result = await _service.GetClassMembersAsync(id, userId);

        return new ApiResponse<List<ClassMemberDto>>(result);
    }

    [HttpPatch("{id}/class-checkin")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles + "," + AuthorizationRoles.StaffRoles)]
    [SwaggerOperation(
        Summary = "Điểm danh member vào lớp học (Staff/PT)",
        Description = "Staff hoặc PT điểm danh (check-in) member vào một lớp học cụ thể."
    )]
    public async Task<ApiResponse<bool>> ClassCheckIn(Guid id, ClassCheckInDto dto)
    {
        var userId = User.GetRequiredUserId();
        var result = await _service.ClassCheckInAsync(id, dto.MemberUserId, userId);

        return new ApiResponse<bool>(true, "Member checked in to class successfully");
    }

    [HttpPatch("class-bookings/{classId}/members/{memberId}/session-note")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles + "," + AuthorizationRoles.StaffRoles)]
    [SwaggerOperation(
        Summary = "Ghi chú buổi tập của member (PT/HeadPT)",
        Description = "PT cập nhật ghi chú (session note) cho member sau buổi học."
    )]
    public async Task<ApiResponse<bool>> UpdateSessionNote(Guid classId, Guid memberId, UpdateSessionNoteDto dto)
    {
        var userId = User.GetRequiredUserId();
        var result = await _service.UpdateSessionNoteAsync(classId, memberId, dto.SessionNote, userId);

        return new ApiResponse<bool>(true, "Session note updated successfully");
    }
}