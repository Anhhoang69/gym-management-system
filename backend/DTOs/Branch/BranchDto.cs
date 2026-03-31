namespace backend.DTOs.Branch;

using backend.Enums;

public class BranchDto
{
    public Guid BranchId { get; set; }
    public string Name { get; set; } = null!;
    public string Address { get; set; } = null!;
    public string? Email { get; set; }
    public string? Hotline { get; set; }
    public string? Description { get; set; }
    public BranchStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    // ===== STATS =====
    public int TotalRooms { get; set; }
    public int TotalStaff { get; set; }
    public int TotalCheckinsToday { get; set; }
    // ===== MEDIA =====
    public List<string> Images { get; set; } = new();
    // ===== RELATED DATA =====
    public List<BranchRoomDto> Rooms { get; set; } = new();
    public List<BranchStaffDto> Staffs { get; set; } = new();
}