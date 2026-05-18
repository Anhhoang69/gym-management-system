using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Contract;

public class UpdateContractDto
{
    [Required]
    public DateTime StartDate { get; set; }

    public string? Note { get; set; }
}
