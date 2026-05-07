namespace backend.Models;

public class Member
{
    // PK + FK -> User
    public Guid UserId { get; set; }

    // navigation

    public User User { get; set; } = null!;

    // 1 - 1
    public AccessCard? AccessCard { get; set; }

    public Lead? Lead { get; set; }

    // 1 - N
    public ICollection<Contract> Contracts { get; set; } = new List<Contract>();

    public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();

    // N - N
    public ICollection<ClassBooking> ClassBookings { get; set; } = new List<ClassBooking>();

    // ================= AI =================

    public ICollection<ChatHistory> ChatHistories { get; set; } = new List<ChatHistory>();

    public ICollection<AIRecommendation> AIRecommendations { get; set; } = new List<AIRecommendation>();

    public AIContextCache? AIContextCache { get; set; }
}