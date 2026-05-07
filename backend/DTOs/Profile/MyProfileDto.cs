using backend.Enums;

namespace backend.DTOs.Profile;

public class MyProfileDto
{
    public Guid UserId { get; set; }

    public string? FullName { get; set; }

    public string Email { get; set; } = null!;

    public string? PhoneNumber { get; set; }

    public Gender? Gender { get; set; }

    public DateOnly? Birthday { get; set; }

    public string? Address { get; set; }

    public string? AvatarUrl { get; set; }

    public string? LanguagePreference { get; set; }

    public bool TwoFactorEnabled { get; set; }

    public DateTime? LastLoginAt { get; set; }

    public string? Role { get; set; }

    public string? BranchName { get; set; }
}
