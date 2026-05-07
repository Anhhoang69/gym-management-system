using Microsoft.AspNetCore.Identity;
using backend.Enums;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

[Index(nameof(Email), IsUnique = true)]
[Index(nameof(PhoneNumber), IsUnique = true)]
public class User : IdentityUser<Guid>
{
    public string? FullName { get; set; }

    public DateOnly? Birthday { get; set; }

    public Gender? Gender { get; set; }

    public string? Address { get; set; }

    public string? AvatarUrl { get; set; }

    public string? LanguagePreference { get; set; }

    public UserStatus Status { get; set; } = UserStatus.Active;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }

    public Guid? InitialBranchId { get; set; }

    public Branch? InitialBranch { get; set; }

    // navigation
    public Member? Member { get; set; }

    public Staff? Staff { get; set; }

    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
    public ICollection<OtpCode> OtpCodes { get; set; } = new List<OtpCode>();
    public ICollection<LoginHistory> LoginHistories { get; set; } = new List<LoginHistory>();

    // request gửi
    public ICollection<Request> Requests { get; set; } = new List<Request>();

    // request xử lý
    public ICollection<Request> HandledRequests { get; set; } = new List<Request>();
}