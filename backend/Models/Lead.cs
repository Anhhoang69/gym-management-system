namespace backend.Models;

using backend.Enums;

public class Lead
{
    public Guid LeadId { get; set; }

    public string Name { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public string? Email { get; set; }

    public string? Source { get; set; }

    public LeadStatus Status { get; set; } = LeadStatus.New;

    public Guid AssignedToStaffId { get; set; }

    public Guid? ConvertedMemberUserId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // ================= NAVIGATION =================

    // STAFF 1 - N LEAD
    public Staff AssignedToStaff { get; set; } = null!;

    // LEAD 1 - 1 MEMBER (Convert to)
    public Member? ConvertedMember { get; set; }
}