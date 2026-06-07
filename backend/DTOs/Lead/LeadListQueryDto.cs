namespace backend.DTOs.Lead;

using backend.Enums;

public class LeadListQueryDto
{
    public int Page { get; set; } = 1;

    public int PageSize { get; set; } = 10;

    public string? Search { get; set; }

    public LeadStatus? Status { get; set; }

    public Guid? SourceId { get; set; }

    public Guid? BranchId { get; set; }

    public Guid? AssignedToStaffId { get; set; }

    public int? MinScore { get; set; }

    public int? MaxScore { get; set; }

    public DateTime? CreatedFrom { get; set; }

    public DateTime? CreatedTo { get; set; }
}