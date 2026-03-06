using Microsoft.AspNetCore.Identity;
using backend.Enums;

namespace backend.Models;

public class User : IdentityUser<Guid>
{
    public string? FullName { get; set; }

    public DateOnly? Birthday { get; set; }

    public Gender? Gender { get; set; }

    public string? Address { get; set; }

    public string? AvatarUrl { get; set; }

    public UserStatus Status { get; set; } = UserStatus.Active;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // navigation
    public Member? Member { get; set; }

    public Staff? Staff { get; set; }

    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
}