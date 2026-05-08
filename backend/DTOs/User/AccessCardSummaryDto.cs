namespace backend.DTOs.User;

using backend.Enums;

public class AccessCardSummaryDto
{
    public Guid AccessCardId { get; set; }
    public string CardCode { get; set; } = null!;
    public AccessCardStatus Status { get; set; }
    public DateTime IssueDate { get; set; }
    public DateTime? ExpireDate { get; set; }
}
