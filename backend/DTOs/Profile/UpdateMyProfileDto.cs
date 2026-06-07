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

    /// <summary>
    /// Chỉ dùng khi người dùng là PT hoặc HeadPT.
    /// Các trường null sẽ được bỏ qua (không ghi đè).
    /// </summary>
    public TrainerProfileUpdate? TrainerProfile { get; set; }
}

public class TrainerProfileUpdate
{
    public int? ExperienceYears { get; set; }
    public string? BioDescription { get; set; }
    public string? Specialization { get; set; }
    public string? Certificate { get; set; }
}
