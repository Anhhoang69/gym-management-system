using System.ComponentModel.DataAnnotations;
using backend.Enums;

namespace backend.DTOs.Register;

public class RegisterMemberDto
{
    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = null!;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    public string PhoneNumber { get; set; } = null!;

    public Gender? Gender { get; set; }

    public DateOnly? Birthday { get; set; }

    public string? Address { get; set; }

    [Required]
    public Guid PackageId { get; set; }

    [Required]
    public Guid PricingId { get; set; }

    [Required]
    public Guid BranchId { get; set; }

    [Required]
    public PaymentMethod PaymentMethod { get; set; }
}
