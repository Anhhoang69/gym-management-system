using backend.Enums;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Member;

public class UpdateAccessCardStatusDto
{
    [Required]
    public AccessCardStatus Status { get; set; }

    public string? Reason { get; set; }
}
