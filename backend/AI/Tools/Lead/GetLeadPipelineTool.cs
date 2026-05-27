using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.DTOs.Lead;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;

namespace backend.AI.Tools.Lead;

/// <summary>
/// Returns a filtered lead pipeline list — Sales sees their own leads, BranchAdmin sees branch.
/// </summary>
public class GetLeadPipelineTool : BaseAITool
{
    private readonly ILeadService _leadService;

    public GetLeadPipelineTool(ILeadService leadService)
    {
        _leadService = leadService;
    }

    public override string Name => "get_lead_pipeline";
    public override string Description => "Xem danh sách leads theo trạng thái (New, Contacted, Qualified, Converted, Lost). Hỗ trợ lọc theo trạng thái.";

    public override JsonElement InputSchema => BuildSchema("""
        {
          "type": "object",
          "properties": {
            "status": {
              "type": "string",
              "enum": ["New", "Contacted", "Qualified", "Converted", "Lost"],
              "description": "Lọc theo trạng thái lead"
            },
            "pageSize": {
              "type": "integer",
              "default": 10,
              "description": "Số leads tối đa trả về"
            }
          }
        }
        """);

    public override string[] AllowedRoles => [AuthorizationRoles.Staff, AuthorizationRoles.SuperAdmin, AuthorizationRoles.GymOwner];
    public override StaffPosition[] AllowedStaffPositions => [StaffPosition.Sales, StaffPosition.BranchAdmin];

    public override async Task<ToolResult> ExecuteAsync(
        JsonElement args, ToolExecutionContext context, CancellationToken ct = default)
    {
        try
        {
            var statusStr = GetString(args, "status");
            var pageSize = GetInt(args, "pageSize") ?? 10;

            LeadStatus? status = statusStr != null && Enum.TryParse<LeadStatus>(statusStr, out var s) ? s : null;

            var query = new LeadListQueryDto
            {
                Status = status,
                PageSize = Math.Min(pageSize, 20),
                Page = 1
            };

            // Sales staff only sees their own leads (enforced by EnsureLeadWritePermissionAsync in service)
            var result = await _leadService.GetLeadListAsync(query);
            var items = result.Items;

            if (!items.Any())
                return ToolResult.Ok("Không tìm thấy leads phù hợp.");

            var lines = items.Select(l =>
                $"- {l.Name} | {l.Phone} | {l.Status} | Score: {l.Score}");
            var text = $"📋 **Leads** ({result.TotalItems} tổng):\n" + string.Join("\n", lines);
            return ToolResult.Ok(text, result);
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
