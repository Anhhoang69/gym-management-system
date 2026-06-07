namespace backend.DTOs.User;

using backend.Enums;

public class UserDto
{
    public Guid UserId { get; set; }

    public string? FullName { get; set; }

    public string Email { get; set; } = null!;

    public string? PhoneNumber { get; set; }

    public Gender? Gender { get; set; }

    public DateOnly? Birthday { get; set; }

    public string? Address { get; set; }

    public string? AvatarUrl { get; set; }

    public UserStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? LastLoginAt { get; set; }

    // staff info
    public Guid? BranchId { get; set; }

    public string? BranchName { get; set; }

    public Guid? InitialBranchId { get; set; }

    public StaffPosition? StaffPosition { get; set; }

    // role
    public string? Role { get; set; }

    // type
    public bool IsStaff { get; set; }

    public bool IsMember { get; set; }

    public MemberDetailDto? MemberInfo { get; set; }

    public PTProfileDto? TrainerProfile { get; set; }
}