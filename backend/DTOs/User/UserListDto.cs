using backend.Enums;

namespace backend.DTOs.User;

public class UserListDto
{
    public Guid UserId { get; set; }
    public string? FullName { get; set; }
    public string Email { get; set; } = null!;
    public string? Role { get; set; }
    public string? BranchName { get; set; }
    public StaffPosition? StaffPosition { get; set; }
    public UserStatus Status { get; set; }
    public DateTime? LastLoginAt { get; set; }
}
