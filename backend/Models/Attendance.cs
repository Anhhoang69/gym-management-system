namespace backend.Models;

public class Attendance
{
    public Guid AttendanceId { get; set; }

    public Guid MemberUserId { get; set; }

    public Guid CardId { get; set; }

    public DateTime CheckinAt { get; set; }

    public DateTime? CheckoutAt { get; set; }

    public Member Member { get; set; } = null!;

    public AccessCard Card { get; set; } = null!;
}