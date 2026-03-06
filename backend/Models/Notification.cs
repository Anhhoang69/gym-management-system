using backend.Enums;

namespace backend.Models;

public class Notification
{
    public Guid NotificationId { get; set; }

    public Guid UserId { get; set; }

    public string Title { get; set; } = null!;

    public string Message { get; set; } = null!;

    public NotificationType Type { get; set; }

    public NotificationStatus Status { get; set; } = NotificationStatus.Active;

    public string? ActionUrl { get; set; }

    public bool IsRead { get; set; }

    public DateTime? ReadAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // navigation
    public User User { get; set; } = null!;
}