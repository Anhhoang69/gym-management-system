namespace backend.DTOs.Branch;

public class CreateBranchDto
{
    public string Name { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string? Email { get; set; }

    public string? Hotline { get; set; }

    public List<string>? Images { get; set; }

    // optional
    public List<CreateRoomDto>? Rooms { get; set; }

    // assign staff
    public List<Guid>? StaffUserIds { get; set; }

    // branch admin
    public Guid? BranchAdminUserId { get; set; }
}