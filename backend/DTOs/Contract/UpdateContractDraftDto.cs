using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Contract;

public class UpdateContractDraftDto
{
    [Required]
    public DateTime StartDate { get; set; }

    public string? Note { get; set; }
}
