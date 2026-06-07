using backend.Enums;

namespace backend.Models;

/// <summary>
/// Audit trail for every AI tool execution.
/// Provides debugging visibility and supports defend arguments about system observability.
/// </summary>
public class AIToolExecutionLog
{
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>The user who triggered the tool call.</summary>
    public Guid UserId { get; set; }

    /// <summary>ASP.NET Identity role at time of call: "Member" | "Staff" | "GymOwner" | "SuperAdmin"</summary>
    public string UserRole { get; set; } = null!;

    /// <summary>Staff business position at time of call. Null for non-Staff roles.</summary>
    public StaffPosition? StaffPosition { get; set; }

    public string ToolName { get; set; } = null!;

    /// <summary>Serialized JSON of arguments passed to the tool.</summary>
    public string? ArgumentsJson { get; set; }

    public bool Success { get; set; }

    /// <summary>Execution time in milliseconds.</summary>
    public long DurationMs { get; set; }

    /// <summary>Error message if Success == false, null otherwise.</summary>
    public string? ErrorMessage { get; set; }

    public DateTime ExecutedAt { get; set; } = DateTime.UtcNow;
}
