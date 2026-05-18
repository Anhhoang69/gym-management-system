namespace backend.DTOs.Lead;

public class LeadImportRowErrorDto
{
    public int RowNumber { get; set; }

    public string Message { get; set; } = string.Empty;
}
