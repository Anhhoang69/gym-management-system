using Microsoft.EntityFrameworkCore;

namespace backend.Models;

[Index(nameof(UserId), nameof(LoginAt))]
public class LoginHistory
{
    public Guid LoginHistoryId { get; set; }

    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    public DateTime LoginAt { get; set; } = DateTime.UtcNow;

    public string? IpAddress { get; set; }
}