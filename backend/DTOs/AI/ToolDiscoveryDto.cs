using System.Text.Json;

namespace backend.DTOs.AI;

/// <summary>
/// Returned by GET /api/ai/tools — filtered list of tools available to the calling user.
/// AllowedRoles/AllowedStaffPositions are intentionally NOT exposed.
/// </summary>
public class ToolDiscoveryDto
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public JsonElement Schema { get; set; }
}
