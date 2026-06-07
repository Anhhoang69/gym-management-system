using backend.Enums;

namespace backend.DTOs.Notification;

public class SendNotificationDto
{
    public string Title { get; set; } = null!;
    public string Message { get; set; } = null!;
    public NotificationType Type { get; set; } = NotificationType.Info;
    public List<Guid> UserIds { get; set; } = new();
    public string? ActionUrl { get; set; }
}
