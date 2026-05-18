using Microsoft.EntityFrameworkCore;

namespace backend.Models;

[Index(nameof(UserId), nameof(Code), nameof(IsUsed))]
public class OtpCode
{
    public Guid OtpCodeId { get; set; }

    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    public string Code { get; set; } = null!;

    /// <summary>
    /// Distinguishes OTP type: "2FA", "PasswordReset", "2FASetup"
    /// Prevents cross-purpose reuse (e.g. a 2FA OTP cannot reset a password).
    /// </summary>
    public string Purpose { get; set; } = "2FA";

    /// <summary>
    /// Incremented on each failed verification attempt.
    /// OTP is auto-invalidated (IsUsed = true) at >= 5 attempts.
    /// </summary>
    public int AttemptCount { get; set; } = 0;

    public DateTime ExpiresAt { get; set; }

    public bool IsUsed { get; set; }

    public DateTime? UsedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}