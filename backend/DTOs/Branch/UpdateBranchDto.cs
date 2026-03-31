namespace backend.DTOs.Branch;

public class UpdateBranchDto
{
    public string Name { get; set; } = null!;
    public string Address { get; set; } = null!;
    public string? Email { get; set; }
    public string? Hotline { get; set; }
    public string? Description { get; set; }
    public List<string>? Images { get; set; }
}