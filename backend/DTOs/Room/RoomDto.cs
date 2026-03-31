namespace backend.DTOs.Room;

using backend.Enums;

public class RoomDto
{
    public Guid RoomId { get; set; }

    public string Name { get; set; } = null!;
    public string RoomNumber { get; set; } = null!;

    public int Capacity { get; set; }

    public RoomStatus Status { get; set; }

    public Guid BranchId { get; set; }

    public string BranchName { get; set; } = null!;

    public List<string> Images { get; set; } = new();

    public int TotalClasses { get; set; }
}