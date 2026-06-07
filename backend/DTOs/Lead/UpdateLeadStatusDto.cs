namespace backend.DTOs.Lead;

using System.ComponentModel.DataAnnotations;
using backend.Enums;

public class UpdateLeadStatusDto
{
    [Required(ErrorMessage = "Status is required")]
    [EnumDataType(typeof(LeadStatus), ErrorMessage = "Status is invalid")]
    public LeadStatus Status { get; set; }

    [StringLength(500, ErrorMessage = "Lost reason must not exceed 500 characters")]
    public string? LostReason { get; set; }
}
