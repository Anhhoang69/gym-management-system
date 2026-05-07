namespace backend.Models;

public class ChatHistory
{
    public Guid Id { get; set; }

    public Guid MemberId { get; set; }

    /// <summary>
    /// Role of the message sender: "user" or "assistant"
    /// </summary>
    public string Role { get; set; } = null!;

    public string Message { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // ================= RELATIONS =================

    public Member Member { get; set; } = null!;
}
