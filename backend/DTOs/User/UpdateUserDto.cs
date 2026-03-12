namespace backend.DTOs.User;

using backend.Enums;

public class UpdateUserDto
{
    public string? FullName { get; set; }

    public string? PhoneNumber { get; set; }

    public Gender? Gender { get; set; }

    public DateOnly? Birthday { get; set; }

    public string? Address { get; set; }

    public Guid? BranchId { get; set; }

    public StaffPosition? StaffPosition { get; set; }

    public UserStatus Status { get; set; }
}