namespace backend.DTOs.Lead;

using System.ComponentModel.DataAnnotations;

public class LeadSourceUpsertDto
{
    [Required(ErrorMessage = "Lead source name is required")]
    [StringLength(100, ErrorMessage = "Lead source name must not exceed 100 characters")]
    public string Name { get; set; } = null!;

    public int Score { get; set; } = 0;

    public bool IsActive { get; set; } = true;
}
