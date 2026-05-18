namespace backend.DTOs.Profile;

public class LoginHistoryDto
{
    public Guid LoginHistoryId { get; set; }

    public DateTime LoginAt { get; set; }

    public string? IpAddress { get; set; }

    public string? UserAgent { get; set; }

    public string? DeviceName { get; set; }

    public bool IsRevoked { get; set; }

    public DateTime? RevokedAt { get; set; }
}
