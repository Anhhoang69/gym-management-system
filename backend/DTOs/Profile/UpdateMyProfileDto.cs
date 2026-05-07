using backend.Enums;

namespace backend.DTOs.Profile;

public class UpdateMyProfileDto
{
    public string? FullName { get; set; }

    public Gender? Gender { get; set; }

    public DateOnly? Birthday { get; set; }

    public string? Address { get; set; }

    public string? AvatarUrl { get; set; }

    public string? LanguagePreference { get; set; }
}
