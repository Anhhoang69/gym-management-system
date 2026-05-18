namespace backend.Models;

using backend.Enums;
public class AccessCard
{
    public Guid AccessCardId { get; set; }
    public string CardCode { get; set; } = null!;

    public Guid MemberUserId { get; set; }

    public AccessCardStatus Status { get; set; } = AccessCardStatus.Active;


    public DateTime IssueDate { get; set; }

    public DateTime? ExpireDate { get; set; }

    public Member Member { get; set; } = null!;
    public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
}