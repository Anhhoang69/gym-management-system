namespace backend.Models;
using backend.Enums;
public class Branch
{
    public Guid BranchId { get; set; }

    public string Name { get; set; } = null!;
    public string Address { get; set; } = null!;

    public string? Email { get; set; }
    public string? Hotline { get; set; }

    public string? Description { get; set; }

    public BranchStatus Status { get; set; } = BranchStatus.Pending;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public ICollection<Room> Rooms { get; set; } = new List<Room>();

    public ICollection<Staff> Staffs { get; set; } = new List<Staff>();

    public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();

    public ICollection<BranchImage> Images { get; set; } = new List<BranchImage>();
}