namespace backend.DTOs.Branch;
public class CreateBranchRoomDto
{
    public string Name { get; set; } = null!;

    public int Capacity { get; set; }
}