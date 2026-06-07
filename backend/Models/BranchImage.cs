namespace backend.Models;

public class BranchImage
{
    public Guid BranchImageId { get; set; }

    public Guid BranchId { get; set; }
    public Branch Branch { get; set; } = null!;

    public string ImageUrl { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}