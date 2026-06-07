namespace backend.DTOs.Auth;

public class AuthResultDto
{
    public Guid UserId { get; set; }

    public string Email { get; set; } = null!;

    public List<string> Roles { get; set; } = new();

    public bool RequiresOtp { get; set; }

    public string? Token { get; set; }

    public DateTime? ExpiresAt { get; set; }
}