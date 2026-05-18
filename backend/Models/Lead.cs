namespace backend.Models;

using backend.Enums;
using Microsoft.EntityFrameworkCore;

[Index(nameof(Phone), IsUnique = true)]
[Index(nameof(Email), IsUnique = true)]
public class Lead
{
    public Guid LeadId { get; set; }

    public string Name { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public string? Email { get; set; }

    public Guid SourceId { get; set; }
    public LeadSource? Source { get; set; }

    public LeadStatus Status { get; set; } = LeadStatus.New;

    public string? Note { get; set; }

    public string? LostReason { get; set; }

    public DateTime? LastContactedAt { get; set; }

    public int ContactCount { get; set; } = 0;

    public int Score { get; set; } = 0;


    public Guid AssignedToStaffId { get; set; }

    // Ai tạo lead
    public Guid CreatedByUserId { get; set; }

    public User? CreatedByUser { get; set; }

    public Guid? BranchId { get; set; }

    public Guid? ConvertedMemberUserId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public Staff AssignedToStaff { get; set; } = null!;

    public Member? ConvertedMember { get; set; }
}