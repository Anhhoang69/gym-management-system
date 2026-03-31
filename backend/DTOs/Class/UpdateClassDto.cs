namespace backend.DTOs.Class;

using backend.Enums;

public class UpdateClassDto
{
    public string? Title { get; set; }

    public string? Description { get; set; }

    public DateOnly Date { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    public ClassType ClassType { get; set; }

    public int Capacity { get; set; }

    public int MinCapacity { get; set; }

    public Guid TrainerStaffId { get; set; }

    public Guid RoomId { get; set; }
}