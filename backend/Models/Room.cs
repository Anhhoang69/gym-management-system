namespace backend.Models;

using backend.Enums;
public class Room
{
    public Guid RoomId { get; set; }

    public string Name { get; set; } = null!;
    public int Capacity { get; set; }
    public RoomStatus Status { get; set; } = RoomStatus.Active;

    public Guid BranchId { get; set; }
    public Branch Branch { get; set; } = null!;

    // 1 - N Class
    public ICollection<Class> Classes { get; set; } = new List<Class>();

    // 1 - N Images
    public ICollection<RoomImage> Images { get; set; } = new List<RoomImage>();
}