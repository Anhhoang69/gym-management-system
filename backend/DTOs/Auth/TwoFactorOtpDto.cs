using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Auth;

public class TwoFactorOtpDto
{
    [Required]
    [StringLength(6, MinimumLength = 6)]
    public string OtpCode { get; set; } = null!;
}
