namespace backend.DTOs.Class;

using backend.Enums;

public class ClassBookingHistoryDto
{
    public Guid ClassId { get; set; }

    public string? ClassTitle { get; set; }

    public DateOnly Date { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    public ClassType ClassType { get; set; }

    public string TrainerName { get; set; } = null!;

    public string RoomName { get; set; } = null!;

    public BookingStatus BookingStatus { get; set; }

    public string? SessionNote { get; set; }

    public DateTime? CheckedInAt { get; set; }
}
