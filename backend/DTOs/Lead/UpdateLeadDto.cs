namespace backend.DTOs.Lead;

using System.ComponentModel.DataAnnotations;

public class UpdateLeadDto
{
    [Required(ErrorMessage = "Name is required")]
    [StringLength(100, ErrorMessage = "Name must not exceed 100 characters")]
    public string Name { get; set; } = null!;

    [Required(ErrorMessage = "Phone number is required")]
    [Phone(ErrorMessage = "Invalid phone number")]
    public string Phone { get; set; } = null!;

    [EmailAddress(ErrorMessage = "Invalid email address")]
    public string? Email { get; set; }

    [StringLength(500, ErrorMessage = "Note must not exceed 500 characters")]
    public string? Note { get; set; }

    [Required(ErrorMessage = "Branch is required")]
    public Guid BranchId { get; set; }

    [Required(ErrorMessage = "Lead source is required")]
    public Guid SourceId { get; set; }

    public Guid? AssignedToStaffId { get; set; }
}
