using backend.Enums;

namespace backend.DTOs.Class;

public class ClassBookingDto
{
    public Guid ClassId { get; set; }

    // class details
    public string? Title { get; set; }

    public DateOnly Date { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    public ClassType ClassType { get; set; }

    public ClassStatus Status { get; set; }

    // trainer
    public string TrainerName { get; set; } = null!;

    // room
    public string RoomName { get; set; } = null!;

    // booking details
    public DateTime BookedAt { get; set; }

    public BookingStatus BookingStatus { get; set; }

    public string? SessionNote { get; set; }

    public string? CancelReason { get; set; }

    public DateTime? CancelledAt { get; set; }

    public DateTime? CheckedInAt { get; set; }
}