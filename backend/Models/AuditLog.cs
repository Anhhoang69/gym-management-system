namespace backend.Models;

public class AuditLog
{
    public Guid LogId { get; set; }

    public Guid UserId { get; set; }

    public string EntityType { get; set; } = null!;

    public Guid EntityId { get; set; }

    public string Action { get; set; } = null!;

    public string? OldValue { get; set; }

    public string? NewValue { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // navigation
    public User User { get; set; } = null!;
}