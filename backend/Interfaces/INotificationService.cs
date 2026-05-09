using backend.DTOs.Notification;
using backend.Enums;
using backend.Helpers;

namespace backend.Interfaces;

public interface INotificationService
{
    /// <summary>Gửi thông báo đến danh sách user IDs cụ thể</summary>
    Task SendAsync(
        string title,
        string message,
        List<Guid> recipientIds,
        NotificationType type = NotificationType.Info,
        Guid? senderId = null,
        string? actionUrl = null);

    /// <summary>Gửi thông báo đến tất cả user có role cụ thể (dùng AuthorizationRoles.X)</summary>
    Task SendToRoleAsync(
        string roleName,
        string title,
        string message,
        NotificationType type = NotificationType.Info,
        Guid? senderId = null,
        string? actionUrl = null);

    /// <summary>Broadcast đến tất cả Active users</summary>
    Task BroadcastAsync(
        string title,
        string message,
        NotificationType type = NotificationType.Info,
        Guid? senderId = null);

    /// <summary>Lấy danh sách thông báo của 1 user (có phân trang)</summary>
    Task<PagedResult<NotificationDto>> GetMyNotificationsAsync(Guid userId, bool? isRead = null, int page = 1, int pageSize = 20);

    /// <summary>Đếm số thông báo chưa đọc</summary>
    Task<int> GetUnreadCountAsync(Guid userId);

    /// <summary>Đánh dấu 1 thông báo đã đọc</summary>
    Task<bool> MarkReadAsync(Guid notificationRecipientId, Guid userId);

    /// <summary>Đánh dấu tất cả thông báo đã đọc</summary>
    Task MarkAllReadAsync(Guid userId);

    /// <summary>Xóa mềm 1 thông báo khỏi danh sách của user</summary>
    Task<bool> DeleteNotificationAsync(Guid notificationRecipientId, Guid userId);
}
