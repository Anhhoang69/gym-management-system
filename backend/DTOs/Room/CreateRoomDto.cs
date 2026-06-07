namespace backend.DTOs.Room;

public class CreateRoomDto
{
    public string Name { get; set; } = null!;
    public string RoomNumber { get; set; } = null!;

    public int Capacity { get; set; }

    public List<string>? Images { get; set; }
}