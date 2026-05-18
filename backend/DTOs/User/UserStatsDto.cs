namespace backend.DTOs.User;

public class UserStatsDto
{
    public int TotalUsers { get; set; }

    public int ActiveUsers { get; set; }

    public int StaffAccounts { get; set; }

    public int MemberAccounts { get; set; }
}