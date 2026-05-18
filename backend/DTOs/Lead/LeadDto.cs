namespace backend.DTOs.Lead;

using backend.Enums;

public class LeadDto
{
    public Guid LeadId { get; set; }

    public string Name { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public string? Email { get; set; }

    public LeadStatus Status { get; set; }

    public string? Note { get; set; }

    public string? LostReason { get; set; }

    public DateTime? LastContactedAt { get; set; }

    public int ContactCount { get; set; }

    public int Score { get; set; }


    public Guid AssignedToStaffId { get; set; }

    public Guid CreatedByUserId { get; set; }

    public string? CreatedByUserName { get; set; }

    public string? AssignedToStaffName { get; set; }

    public Guid? BranchId { get; set; }

    public string? BranchName { get; set; }

    public Guid? ConvertedMemberUserId { get; set; }

    public Guid SourceId { get; set; }

    public string? SourceName { get; set; }

    public string? ConvertedMemberName { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}