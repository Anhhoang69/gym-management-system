namespace backend.DTOs.Register;

public class RegisterResultDto
{
    public Guid UserId { get; set; }

    public string Email { get; set; } = null!;

    public string TempPassword { get; set; } = null!;

    public Guid ContractId { get; set; }

    public Guid InvoiceId { get; set; }

    /// <summary>Số tiền cần thanh toán — staff dùng để thu tiền qua POST /api/invoices/{id}/payment</summary>
    public decimal TotalAmountDue { get; set; }

    public string Message { get; set; } = "Account created successfully. Check your email for login credentials.";
}
