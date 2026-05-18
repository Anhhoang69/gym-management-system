namespace backend.Models;

public class LeadSource
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public int Score { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<Lead> Leads { get; set; } = new List<Lead>();
}