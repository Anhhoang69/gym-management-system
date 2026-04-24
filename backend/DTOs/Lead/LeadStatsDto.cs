using backend.Enums;

namespace backend.DTOs.Lead;

public class LeadStatsDto
{
    public int TotalLeads { get; set; }

    public int NewLeads { get; set; }

    public int ContactedLeads { get; set; }

    public int QualifiedLeads { get; set; }

    public int ConvertedLeads { get; set; }

    public int LostLeads { get; set; }

    public int LeadsCreatedToday { get; set; }

    public int LeadsCreatedThisWeek { get; set; }

    public int LeadsCreatedThisMonth { get; set; }

    public decimal AverageScore { get; set; }

    public decimal ContactRate { get; set; }

    public decimal ConversionRate { get; set; }

    public List<LeadSourceStatsDto> TopSources { get; set; } = new();
}
