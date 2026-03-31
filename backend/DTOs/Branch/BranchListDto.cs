using backend.Enums;

namespace backend.DTOs.Branch;

public class BranchListDto
{
    public Guid BranchId { get; set; }
    public string Name { get; set; } = null!;
    public string? Address { get; set; }
    public string? Hotline { get; set; }
    public BranchStatus Status { get; set; }
    public int TotalRooms { get; set; }
    public int TotalStaff { get; set; }
    public int TotalCheckinsToday { get; set; }
    public List<string> Images { get; set; } = new();
}
