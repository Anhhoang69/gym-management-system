namespace backend.Models;

public class BranchImage
{
    public Guid BranchImageId { get; set; }

    public Guid Id { get; set; }
    public Room Branch { get; set; } = null!;

    public string ImageUrl { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}