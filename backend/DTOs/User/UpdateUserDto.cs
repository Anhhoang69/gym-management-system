namespace backend.DTOs.User;

using backend.Enums;
using System.ComponentModel.DataAnnotations;

public class UpdateUserDto
{
    public string? FullName { get; set; }

    [Phone(ErrorMessage = "Phone number is invalid")]
    public string? PhoneNumber { get; set; }

    public Gender? Gender { get; set; }

    public DateOnly? Birthday { get; set; }

    public string? Address { get; set; }

    public Guid? BranchId { get; set; }

    public StaffPosition? StaffPosition { get; set; }

    public UserStatus? Status { get; set; }

    public string? Role { get; set; }

    // PT PROFILE
    public PTProfileDto? TrainerProfile { get; set; }

    // MEMBER UPDATE
    public MemberUpdateDto? MemberUpdate { get; set; }
}