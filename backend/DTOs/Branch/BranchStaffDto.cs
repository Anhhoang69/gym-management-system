namespace backend.DTOs.Branch;
using backend.Enums;
public class BranchStaffDto
{
    public Guid UserId { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public StaffPosition Position { get; set; }
}