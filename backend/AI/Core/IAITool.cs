using System.Text.Json;
using backend.Enums;

namespace backend.AI.Core;

/// <summary>
/// Canonical interface for every AI tool in the system.
///
/// Authorization is declared as metadata on the tool — the registry filters
/// available tools per caller before they are sent to the LLM. This means
/// the LLM never even "knows" about tools the caller is not allowed to use.
///
/// IMPORTANT: Role != StaffPosition.
///   AllowedRoles   → ASP.NET Identity roles: "SuperAdmin", "GymOwner", "Staff", "Member"
///   AllowedStaffPositions → business positions, only relevant when caller Role == "Staff"
///                           Empty array = tool available to ALL staff positions.
/// </summary>
public interface IAITool
{
    /// <summary>Unique snake_case name used by the LLM to invoke this tool.</summary>
    string Name { get; }

    /// <summary>Human-readable description shown to the LLM in tool schema.</summary>
    string Description { get; }

    /// <summary>JSON Schema object describing the tool's input parameters.</summary>
    JsonElement InputSchema { get; }

    /// <summary>
    /// Application roles allowed to use this tool.
    /// Example: ["Member"] or ["SuperAdmin", "GymOwner", "Staff"]
    /// </summary>
    string[] AllowedRoles { get; }

    /// <summary>
    /// Staff positions allowed to use this tool (only evaluated when caller Role == "Staff").
    /// Empty array = no position restriction (all Staff positions allowed).
    /// Example: [StaffPosition.Sales, StaffPosition.BranchAdmin]
    /// </summary>
    StaffPosition[] AllowedStaffPositions { get; }

    /// <summary>
    /// Execute the tool and return a result.
    /// Tools MUST NOT reimplement business logic — they orchestrate existing services.
    /// </summary>
    Task<ToolResult> ExecuteAsync(
        JsonElement args,
        ToolExecutionContext context,
        CancellationToken ct = default);
}
