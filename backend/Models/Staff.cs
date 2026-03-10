namespace backend.Models;
using backend.Enums;
public class Staff
{
    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    public Guid BranchId { get; set; }
    public Branch Branch { get; set; } = null!;

    public StaffPosition Position { get; set; }

    public ICollection<Class> TeachingClasses { get; set; } = new List<Class>();
}