using backend.Enums;

namespace backend.Models;

public class Class
{
    public Guid ClassId { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public DateOnly Date { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    public ClassType ClassType { get; set; }

    public ClassStatus Status { get; set; } = ClassStatus.Scheduled;

    public int Capacity { get; set; }

    public int MinCapacity { get; set; }

    // PT dạy lớp
    public Guid TrainerStaffId { get; set; }

    public Staff Trainer { get; set; } = null!;

    // Room
    public Guid RoomId { get; set; }

    public Room Room { get; set; } = null!;

    // navigation

    public ICollection<ClassBooking> Bookings { get; set; } = new List<ClassBooking>();
}