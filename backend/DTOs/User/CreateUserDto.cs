namespace backend.DTOs.User;

using System.ComponentModel.DataAnnotations;
using backend.Enums;

public class CreateUserDto
{
    [Required(ErrorMessage = "Full name is required")]
    [StringLength(150, ErrorMessage = "Full name must not exceed 150 characters")]
    public string FullName { get; set; } = null!;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Email is invalid")]
    public string Email { get; set; } = null!;

    [Required(ErrorMessage = "Phone number is required")]
    [Phone(ErrorMessage = "Phone number is invalid")]
    public string PhoneNumber { get; set; } = null!;

    [Required(ErrorMessage = "Password is required")]
    public string Password { get; set; } = null!;

    [Required(ErrorMessage = "Role is required")]
    public string Role { get; set; } = null!;

    public Guid? BranchId { get; set; }

    public Gender? Gender { get; set; }

    public DateOnly? Birthday { get; set; }

    [StringLength(500, ErrorMessage = "Address must not exceed 500 characters")]
    public string? Address { get; set; }
}