namespace backend.DTOs.Class;

using backend.Enums;

public class ClassDto
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

    // trainer
    public Guid TrainerStaffId { get; set; }

    public string TrainerName { get; set; } = null!;

    // room
    public Guid RoomId { get; set; }

    public string RoomName { get; set; } = null!;

    public string RoomNumber { get; set; } = null!;

    public Guid BranchId { get; set; }

    public string BranchName { get; set; } = null!;

    // booking stats
    public int BookedCount { get; set; }

    public bool IsFull { get; set; }
}