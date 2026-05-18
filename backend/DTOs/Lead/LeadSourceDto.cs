namespace backend.DTOs.Lead;

public class LeadSourceDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public int Score { get; set; }
    public bool IsActive { get; set; }
}