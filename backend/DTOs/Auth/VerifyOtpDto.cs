namespace backend.DTOs.Auth;

using System.ComponentModel.DataAnnotations;

public class VerifyOtpDto
{
    [Required(ErrorMessage = "UserId is required")]
    public Guid UserId { get; set; }

    [Required(ErrorMessage = "OTP code is required")]
    [StringLength(6, MinimumLength = 6, ErrorMessage = "OTP code must be 6 digits")]
    public string OtpCode { get; set; } = null!;
}