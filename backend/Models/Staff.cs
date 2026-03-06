namespace backend.Models;

public class Staff
{
    public Guid StaffId { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid BranchId { get; set; }
    public Branch Branch { get; set; } = null!;

    public string Status { get; set; } = "Active";

    public DateTime? LastLoginAt { get; set; }
}