using backend.Enums;

namespace backend.AI.Core;

/// <summary>
/// Carries caller identity + resolved authorization context into every tool execution.
/// Role and StaffPosition are intentionally separate — they represent two independent layers:
///   - Role: ASP.NET Identity application role (SuperAdmin, GymOwner, Staff, Member)
///   - StaffPosition: business position, only relevant when Role == "Staff"
/// </summary>
public class ToolExecutionContext
{
    public Guid UserId { get; init; }

    /// <summary>ASP.NET Identity role: "SuperAdmin" | "GymOwner" | "Staff" | "Member"</summary>
    public string Role { get; init; } = null!;

    /// <summary>
    /// Staff business position. NULL for SuperAdmin, GymOwner, and Member.
    /// Only set when Role == "Staff".
    /// </summary>
    public StaffPosition? StaffPosition { get; init; }

    /// <summary>
    /// Branch the staff belongs to. NULL for SuperAdmin/GymOwner (global scope) and Member.
    /// </summary>
    public Guid? BranchId { get; init; }

    /// <summary>Preferred language for AI responses, defaults to "vi".</summary>
    public string Language { get; init; } = "vi";
}
