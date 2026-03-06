namespace backend.Models;

public class Branch
{
    public Guid BranchId { get; set; }

    public string Name { get; set; } = null!;
    public string Address { get; set; } = null!;
    public string? Email { get; set; }
    public string? Hotline { get; set; }

    public string Status { get; set; } = "Active";

    public ICollection<Room>? Rooms { get; set; }
    public ICollection<Member>? Members { get; set; }
    public ICollection<Staff>? Staffs { get; set; }

    public ICollection<BranchImage>? Images { get; set; }
}