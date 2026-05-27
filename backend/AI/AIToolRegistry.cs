using backend.AI.Core;
using backend.Enums;
using backend.Helpers;

namespace backend.AI;

/// <summary>
/// Central registry for all IAITool implementations.
/// Filters available tools per caller based on Role + StaffPosition — two independent layers.
///
/// SECURITY CONTRACT:
///   - Member never sees admin/staff tools.
///   - Staff only see tools matching their StaffPosition.
///   - AllowedRoles/AllowedStaffPositions are internal — never exposed to callers.
/// </summary>
public class AIToolRegistry
{
    private readonly IEnumerable<IAITool> _allTools;
    private readonly ILogger<AIToolRegistry> _logger;

    public AIToolRegistry(IEnumerable<IAITool> allTools, ILogger<AIToolRegistry> logger)
    {
        _allTools = allTools;
        _logger = logger;
    }

    /// <summary>
    /// Returns only the tools the caller is authorized to use.
    /// These become the tool definitions sent to the LLM — the LLM
    /// cannot invoke tools it doesn't see in the schema.
    /// </summary>
    public List<IAITool> GetAvailableTools(ToolExecutionContext ctx)
    {
        var available = _allTools.Where(tool => IsAuthorized(tool, ctx)).ToList();

        _logger.LogInformation(
            "AIToolRegistry | Role: {Role} | Position: {Pos} | Available tools: {Count}",
            ctx.Role, ctx.StaffPosition?.ToString() ?? "N/A", available.Count);

        return available;
    }

    // Note: ToDefinitions() removed — SK wraps IAITools directly via SkToolHelper.WrapAsTool().
    // ToolDefinition was part of the old custom provider layer (deleted).

    /// <summary>
    /// Resolve a specific tool by name, only if the caller is authorized.
    /// Returns null if tool not found or caller not authorized.
    /// </summary>
    public IAITool? ResolveAuthorized(string toolName, ToolExecutionContext ctx)
    {
        var tool = _allTools.FirstOrDefault(t =>
            string.Equals(t.Name, toolName, StringComparison.OrdinalIgnoreCase));

        if (tool == null) return null;
        if (!IsAuthorized(tool, ctx))
        {
            _logger.LogWarning(
                "AIToolRegistry | UNAUTHORIZED tool access attempt | Tool: {Tool} | Role: {Role} | UserId: {UserId}",
                toolName, ctx.Role, ctx.UserId);
            return null;
        }

        return tool;
    }

    private static bool IsAuthorized(IAITool tool, ToolExecutionContext ctx)
    {
        // Layer 1: Role must match
        if (!tool.AllowedRoles.Contains(ctx.Role))
            return false;

        // Layer 2: If caller is Staff, check StaffPosition
        // (SuperAdmin, GymOwner, Member don't have positions — skip position check)
        if (ctx.Role == AuthorizationRoles.Staff)
        {
            // Tool has no position restriction → available to all Staff
            if (tool.AllowedStaffPositions.Length == 0)
                return true;

            // Tool has position restriction → caller must have a matching position
            return ctx.StaffPosition.HasValue
                   && tool.AllowedStaffPositions.Contains(ctx.StaffPosition.Value);
        }

        return true;
    }
}
