using backend.Enums;

namespace backend.Models;

public class Notification
{
    public Guid NotificationId { get; set; }

    public string Title { get; set; } = null!;

    public string Message { get; set; } = null!;

    public NotificationType Type { get; set; }

    // null = System-generated
    public Guid? SenderId { get; set; }
    public User? Sender { get; set; }

    public string? ActionUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // N-N với User thông qua NotificationRecipient
    public ICollection<NotificationRecipient> Recipients { get; set; } = new List<NotificationRecipient>();
}