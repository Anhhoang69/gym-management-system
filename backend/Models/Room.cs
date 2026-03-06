namespace backend.Models;

public class Room
{
    public Guid RoomId { get; set; }

    public string Name { get; set; } = null!;
    public int Capacity { get; set; }
    public string Status { get; set; } = "Active";

    public Guid BranchId { get; set; }
    public Branch Branch { get; set; } = null!;

    public ICollection<RoomImage>? Images { get; set; }
}