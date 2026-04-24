using Microsoft.EntityFrameworkCore;

namespace backend.Models;

[Index(nameof(UserId), nameof(Code), nameof(IsUsed))]
public class OtpCode
{
    public Guid OtpCodeId { get; set; }

    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    public string Code { get; set; } = null!;

    public DateTime ExpiresAt { get; set; }

    public bool IsUsed { get; set; }

    public DateTime? UsedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}