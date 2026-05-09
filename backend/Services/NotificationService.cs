using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs.Notification;
using backend.Enums;
using backend.Interfaces;
using backend.Models;
using backend.Helpers;

namespace backend.Services;

public class NotificationService : INotificationService
{
    private readonly ApplicationDbContext _context;

    public NotificationService(ApplicationDbContext context)
    {
        _context = context;
    }

    // ===== SEND =====

    public async Task SendAsync(
        string title,
        string message,
        List<Guid> recipientIds,
        NotificationType type = NotificationType.Info,
        Guid? senderId = null,
        string? actionUrl = null)
    {
        if (recipientIds == null || recipientIds.Count == 0) return;

        var notification = new Notification
        {
            NotificationId = Guid.NewGuid(),
            Title = title,
            Message = message,
            Type = type,
            SenderId = senderId,
            ActionUrl = actionUrl,
            CreatedAt = DateTime.UtcNow
        };

        _context.Notifications.Add(notification);

        foreach (var userId in recipientIds.Distinct())
        {
            _context.NotificationRecipients.Add(new NotificationRecipient
            {
                NotificationRecipientId = Guid.NewGuid(),
                NotificationId = notification.NotificationId,
                UserId = userId,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            });
        }

        await _context.SaveChangesAsync();
    }

    public async Task SendToRoleAsync(
        string roleName,
        string title,
        string message,
        NotificationType type = NotificationType.Info,
        Guid? senderId = null,
        string? actionUrl = null)
    {
        var recipientIds = await _context.Users
            .Where(u => _context.UserRoles
                .Any(ur => ur.UserId == u.Id &&
                    _context.Roles.Any(r => r.Id == ur.RoleId && r.Name == roleName)))
            .Select(u => u.Id)
            .ToListAsync();

        if (recipientIds.Count == 0) return;

        await SendAsync(title, message, recipientIds, type, senderId, actionUrl);
    }

    public async Task BroadcastAsync(
        string title,
        string message,
        NotificationType type = NotificationType.Info,
        Guid? senderId = null)
    {
        var recipientIds = await _context.Users
            .Where(u => u.Status == backend.Enums.UserStatus.Active)
            .Select(u => u.Id)
            .ToListAsync();

        if (recipientIds.Count == 0) return;

        await SendAsync(title, message, recipientIds, type, senderId);
    }

    // ===== READ =====

    public async Task<PagedResult<NotificationDto>> GetMyNotificationsAsync(Guid userId, bool? isRead = null, int page = 1, int pageSize = 20)
    {
        var query = _context.NotificationRecipients
            .Include(nr => nr.Notification)
            .Where(nr => nr.UserId == userId && !nr.IsDeleted)
            .AsNoTracking()
            .AsQueryable();

        if (isRead.HasValue)
            query = query.Where(nr => nr.IsRead == isRead.Value);

        var totalItems = await query.CountAsync();

        var items = await query
            .OrderByDescending(nr => nr.Notification.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(nr => new NotificationDto
            {
                NotificationId = nr.NotificationRecipientId,  // dùng RecipientId làm ID cho mark-read
                Title = nr.Notification.Title,
                Message = nr.Notification.Message,
                Type = nr.Notification.Type,
                ActionUrl = nr.Notification.ActionUrl,
                IsRead = nr.IsRead,
                ReadAt = nr.ReadAt,
                CreatedAt = nr.Notification.CreatedAt
            })
            .ToListAsync();

        return new PagedResult<NotificationDto>(items, totalItems, page, pageSize);
    }

    public async Task<int> GetUnreadCountAsync(Guid userId)
    {
        return await _context.NotificationRecipients
            .CountAsync(nr => nr.UserId == userId && !nr.IsRead && !nr.IsDeleted);
    }

    public async Task<bool> MarkReadAsync(Guid notificationRecipientId, Guid userId)
    {
        var recipient = await _context.NotificationRecipients
            .FirstOrDefaultAsync(nr =>
                nr.NotificationRecipientId == notificationRecipientId &&
                nr.UserId == userId && !nr.IsDeleted);

        if (recipient == null) return false;

        recipient.IsRead = true;
        recipient.ReadAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteNotificationAsync(Guid notificationRecipientId, Guid userId)
    {
        var recipient = await _context.NotificationRecipients
            .FirstOrDefaultAsync(nr =>
                nr.NotificationRecipientId == notificationRecipientId &&
                nr.UserId == userId && !nr.IsDeleted);

        if (recipient == null) return false;

        recipient.IsDeleted = true;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task MarkAllReadAsync(Guid userId)
    {
        var unread = await _context.NotificationRecipients
            .Where(nr => nr.UserId == userId && !nr.IsRead)
            .ToListAsync();

        var now = DateTime.UtcNow;
        foreach (var nr in unread)
        {
            nr.IsRead = true;
            nr.ReadAt = now;
        }

        await _context.SaveChangesAsync();
    }
}
