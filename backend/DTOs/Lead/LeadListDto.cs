namespace backend.DTOs.Lead;

using backend.Enums;

public class LeadListDto
{
    public Guid LeadId { get; set; }

    public string Name { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public string? Email { get; set; }

    public Guid SourceId { get; set; }

    public string? SourceName { get; set; }

    public LeadStatus Status { get; set; }

    public int Score { get; set; }

    public string? AssignedToStaffName { get; set; }

    public string? BranchName { get; set; }

    public DateTime CreatedAt { get; set; }
}