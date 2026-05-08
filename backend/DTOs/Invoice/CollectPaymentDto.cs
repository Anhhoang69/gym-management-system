using System.ComponentModel.DataAnnotations;
using backend.Enums;

namespace backend.DTOs.Invoice;

public class CollectPaymentDto
{
    [Required]
    public PaymentMethod Method { get; set; }

    [Required]
    public decimal Amount { get; set; }

    public string? RefNo { get; set; }
}
