using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Auth;

public class ForgotPasswordDto
{
    [Required]
    public string EmailOrPhone { get; set; } = null!;
}
