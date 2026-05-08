namespace backend.DTOs.Profile;

/// <summary>
/// Thông tin huấn luyện viên cá nhân trong /api/me (chỉ khi role = PT / HeadPT)
/// </summary>
public class PTProfileInfo
{
    public int ExperienceYears { get; set; }
    public string? BioDescription { get; set; }
    public string? Specialization { get; set; }
    public string? Certificate { get; set; }
    public string? BranchName { get; set; }
}
