namespace backend.DTOs.Lead;

public class LeadSourceStatsDto
{
    public Guid SourceId { get; set; }

    public string SourceName { get; set; } = null!;

    public int LeadCount { get; set; }
}
