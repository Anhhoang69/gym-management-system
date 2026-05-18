namespace backend.Models;
public class PTProfile
{
    public Guid StaffUserId { get; set; }

    public int ExperienceYears { get; set; }

    public string? BioDescription { get; set; }

    public string? Specialization { get; set; }

    public string? Certificate { get; set; }

    public Staff Staff { get; set; } = null!;
}