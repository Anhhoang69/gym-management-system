using backend.Enums;

namespace backend.Models;

public class ClassBooking
{
    public Guid MemberUserId { get; set; }

    public Guid ClassId { get; set; }

    public DateTime BookedAt { get; set; }

    public BookingStatus Status { get; set; } = BookingStatus.Booked;

    public string? SessionNote { get; set; }

    public string? CancelReason { get; set; }

    // navigation

    public Member Member { get; set; } = null!;

    public Class Class { get; set; } = null!;
}