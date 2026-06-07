namespace backend.DTOs.Attendance;

public class AttendanceDto
{
    public Guid AttendanceId { get; set; }
    public Guid MemberUserId { get; set; }
    public string MemberName { get; set; } = null!;
    public Guid BranchId { get; set; }
    public string BranchName { get; set; } = null!;
    public DateTime CheckinAt { get; set; }
    public DateTime? CheckoutAt { get; set; }
}
