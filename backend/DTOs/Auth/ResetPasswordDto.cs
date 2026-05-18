using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Auth;

public class ResetPasswordDto
{
    [Required]
    public string EmailOrPhone { get; set; } = null!;

    [Required]
    [StringLength(6, MinimumLength = 6)]
    public string OtpCode { get; set; } = null!;

    [Required]
    [MinLength(6)]
    public string NewPassword { get; set; } = null!;

    [Required]
    [Compare(nameof(NewPassword), ErrorMessage = "Passwords do not match")]
    public string ConfirmPassword { get; set; } = null!;
}
