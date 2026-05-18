namespace backend.DTOs.Lead;

using System.ComponentModel.DataAnnotations;

public class MergeLeadDto
{
    [Required(ErrorMessage = "Duplicate lead id is required")]
    public Guid DuplicateLeadId { get; set; }
}