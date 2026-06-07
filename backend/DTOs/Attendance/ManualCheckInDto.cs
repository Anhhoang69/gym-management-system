namespace backend.DTOs.Attendance;

public class ManualCheckInDto
{
    public Guid MemberUserId { get; set; }
    public Guid BranchId { get; set; }
}
