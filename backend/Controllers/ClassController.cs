using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Class;
using backend.Extensions;
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
        Summary = "Lấy danh sách tất cả các lớp học",
        Description = "Trả về danh sách các lớp học với thông tin chi tiết bao gồm trainer, room và danh sách booking. Dùng để hiển thị lịch lớp cho admin hoặc member."
    )]
    public async Task<ApiResponse<List<ClassDto>>> GetClasses()
    {
        var result = await _service.GetClassesAsync();

        return new ApiResponse<List<ClassDto>>(result);
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
}