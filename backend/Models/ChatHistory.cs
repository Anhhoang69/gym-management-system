namespace backend.Models;

public class ChatHistory
{
    public Guid Id { get; set; }

    /// <summary>
    /// Generic caller identity — works for Member, Staff, and Admin.
    /// Added in Hybrid MCP refactor to support multi-role chat history.
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Deprecated: kept for backward compatibility. Will be null for Staff/Admin chats.
    /// For Member chats: UserId == MemberId.
    /// </summary>
    public Guid? MemberId { get; set; }

    /// <summary>
    /// ASP.NET Identity role at time of message: "Member" | "Staff" | "GymOwner" | "SuperAdmin"
    /// </summary>
    public string UserRole { get; set; } = "Member";

    /// <summary>Role of the message sender: "user" | "assistant"</summary>
    public string Role { get; set; } = null!;

    public string Message { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // ================= RELATIONS =================

    /// <summary>Nullable — only populated for Member chats.</summary>
    public Member? Member { get; set; }
}
