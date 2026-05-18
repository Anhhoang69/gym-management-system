namespace backend.Models;

public class RoomImage
{
    public Guid RoomImageId { get; set; }

    public Guid RoomId { get; set; }
    public Room Room { get; set; } = null!;

    public string ImageUrl { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}