namespace backend.DTOs.Branch;
using backend.Enums;
public class BranchRoomDto
{
    public Guid RoomId { get; set; }

    public string Name { get; set; } = null!;

    public int Capacity { get; set; }

    public RoomStatus Status { get; set; }
}