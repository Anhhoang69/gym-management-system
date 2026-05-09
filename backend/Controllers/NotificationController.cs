using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Notification;
using backend.Enums;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _service;

    public NotificationController(INotificationService service)
    {
        _service = service;
    }

    // ===== USER APIs =====

    [HttpGet]
    [SwaggerOperation(
        Summary = "Lấy danh sách thông báo của tôi (có phân trang)",
        Description = "Trả về danh sách thông báo của user hiện tại. Lọc theo isRead."
    )]
    public async Task<ApiResponse<PagedResult<NotificationDto>>> GetMyNotifications(
        bool? isRead,
        int page = 1,
        int pageSize = 20)
    {
        var userId = User.GetRequiredUserId();
        var result = await _service.GetMyNotificationsAsync(userId, isRead, page, pageSize);
        return new ApiResponse<PagedResult<NotificationDto>>(result);
    }

    [HttpDelete("{id}")]
    [SwaggerOperation(
        Summary = "Xóa thông báo",
        Description = "Xóa mềm thông báo khỏi danh sách của user hiện tại."
    )]
    public async Task<ApiResponse<bool>> DeleteNotification(Guid id)
    {
        var userId = User.GetRequiredUserId();
        var result = await _service.DeleteNotificationAsync(id, userId);

        if (!result)
            return new ApiResponse<bool>("Notification not found");

        return new ApiResponse<bool>(true, "Notification deleted");
    }

    [HttpGet("unread-count")]
    [SwaggerOperation(
        Summary = "Đếm thông báo chưa đọc",
        Description = "Trả về số thông báo chưa đọc – dùng cho badge trên UI."
    )]
    public async Task<ApiResponse<int>> GetUnreadCount()
    {
        var userId = User.GetRequiredUserId();
        var count = await _service.GetUnreadCountAsync(userId);
        return new ApiResponse<int>(count);
    }

    [HttpPatch("{id}/read")]
    [SwaggerOperation(
        Summary = "Đánh dấu thông báo đã đọc",
        Description = "Đánh dấu 1 thông báo là đã đọc. ID là NotificationRecipientId."
    )]
    public async Task<ApiResponse<bool>> MarkRead(Guid id)
    {
        var userId = User.GetRequiredUserId();
        var result = await _service.MarkReadAsync(id, userId);

        if (!result)
            return new ApiResponse<bool>("Notification not found");

        return new ApiResponse<bool>(true, "Marked as read");
    }

    [HttpPatch("read-all")]
    [SwaggerOperation(
        Summary = "Đánh dấu tất cả thông báo đã đọc",
        Description = "Đánh dấu tất cả thông báo của user hiện tại là đã đọc."
    )]
    public async Task<ApiResponse<bool>> MarkAllRead()
    {
        var userId = User.GetRequiredUserId();
        await _service.MarkAllReadAsync(userId);
        return new ApiResponse<bool>(true, "All notifications marked as read");
    }

    // ===== ADMIN APIs =====

    [HttpPost("send")]
    [Authorize(Roles = AuthorizationRoles.SuperAdmin + "," + AuthorizationRoles.GymOwner)]
    [SwaggerOperation(
        Summary = "Gửi thông báo đến danh sách user",
        Description = "Gửi thông báo đến danh sách người dùng cụ thể. Các role được phép: SuperAdmin, GymOwner."
    )]
    public async Task<ApiResponse<bool>> Send([FromBody] SendNotificationDto dto)
    {
        var senderId = User.GetRequiredUserId();

        await _service.SendAsync(
            dto.Title,
            dto.Message,
            dto.UserIds,
            dto.Type,
            senderId,
            dto.ActionUrl);

        return new ApiResponse<bool>(true, $"Notification sent to {dto.UserIds.Count} user(s)");
    }

    [HttpPost("broadcast")]
    [Authorize(Roles = AuthorizationRoles.SuperAdminOnly)]
    [SwaggerOperation(
        Summary = "Broadcast thông báo đến tất cả users",
        Description = "SuperAdmin broadcast thông báo đến tất cả Active users."
    )]
    public async Task<ApiResponse<bool>> Broadcast([FromBody] SendNotificationDto dto)
    {
        var senderId = User.GetRequiredUserId();

        await _service.BroadcastAsync(dto.Title, dto.Message, dto.Type, senderId);

        return new ApiResponse<bool>(true, "Broadcast notification sent");
    }
}
