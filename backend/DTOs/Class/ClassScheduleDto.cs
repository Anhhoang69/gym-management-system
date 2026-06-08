namespace backend.DTOs.Class;

using backend.Enums;

/// <summary>
/// Trả về cho tất cả role — bổ sung các field dành cho Member.
/// </summary>
public class ClassScheduleDto
{
    public Guid ClassId { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public DateOnly Date { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    public ClassType ClassType { get; set; }

    public ClassStatus Status { get; set; }

    public int Capacity { get; set; }

    public int MinCapacity { get; set; }

    public int BookedCount { get; set; }
    public int AttendedCount { get; set; }

    public bool IsFull { get; set; }

    // Trainer
    public Guid TrainerStaffId { get; set; }

    public string TrainerName { get; set; } = null!;

    // Room + Branch
    public Guid RoomId { get; set; }

    public string RoomName { get; set; } = null!;

    public string RoomNumber { get; set; } = null!;

    public Guid BranchId { get; set; }

    public string BranchName { get; set; } = null!;

    // Member-specific (null nếu caller không phải Member)
    public bool? IsBooked { get; set; }

    public BookingStatus? MyBookingStatus { get; set; }

    public string? MySessionNote { get; set; }
}
