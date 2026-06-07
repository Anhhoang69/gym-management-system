namespace backend.DTOs.Branch;

public class PublicBranchDto
{
    public Guid BranchId { get; set; }
    public string Name { get; set; } = null!;
    public string? Address { get; set; }
    public string? Hotline { get; set; }
    public string? Email { get; set; }
    public string? Description { get; set; }
    public string? OpeningHours { get; set; }
    public List<string> Images { get; set; } = new();
}
