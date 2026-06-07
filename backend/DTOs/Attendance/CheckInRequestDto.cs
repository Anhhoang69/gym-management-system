namespace backend.DTOs.Attendance;

public class CheckInRequestDto
{
    public string CardNumber { get; set; } = null!; // Or RFID token
    public Guid BranchId { get; set; }
}
