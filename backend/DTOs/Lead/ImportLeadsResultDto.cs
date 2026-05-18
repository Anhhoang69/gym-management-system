namespace backend.DTOs.Lead;

public class ImportLeadsResultDto
{
    public int TotalRows { get; set; }

    public int CreatedCount { get; set; }

    public int UpdatedCount { get; set; }

    public int SkippedCount { get; set; }

    public int FailedCount { get; set; }

    public List<LeadImportRowErrorDto> Errors { get; set; } = new();
}
