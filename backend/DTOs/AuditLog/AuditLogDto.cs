namespace backend.DTOs.AuditLog;

public class AuditLogDto
{
    public Guid AuditLogId { get; set; }

    public Guid UserId { get; set; }

    public string? UserName { get; set; }

    public string EntityType { get; set; } = null!;

    public Guid EntityId { get; set; }

    public string Action { get; set; } = null!;

    public string? OldValue { get; set; }

    public string? NewValue { get; set; }

    public DateTime CreatedAt { get; set; }
}