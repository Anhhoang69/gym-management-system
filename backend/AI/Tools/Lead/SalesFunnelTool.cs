using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.DTOs.Dashboard;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;

namespace backend.AI.Tools.Lead;

/// <summary>
/// Sales funnel report — conversion rates by stage.
/// Accessible to Sales, BranchAdmin, GymOwner, SuperAdmin.
/// </summary>
public class SalesFunnelTool : BaseAITool
{
    private readonly IReportsService _reportsService;

    public SalesFunnelTool(IReportsService reportsService)
    {
        _reportsService = reportsService;
    }

    public override string Name => "get_sales_funnel";
    public override string Description => "Xem phễu bán hàng: tỷ lệ chuyển đổi từng giai đoạn, top nguồn lead, hiệu suất sales.";

    public override JsonElement InputSchema => BuildSchema("""
        {
          "type": "object",
          "properties": {
            "branchId": {
              "type": "string",
              "format": "uuid",
              "description": "ID chi nhánh (để trống = toàn hệ thống, chỉ SuperAdmin/GymOwner)"
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
            // BranchAdmin scoped to own branch; SuperAdmin/GymOwner can see global
            var branchId = context.StaffPosition == StaffPosition.BranchAdmin
                ? context.BranchId
                : GetGuid(args, "branchId");

            var query = new ReportQueryDto { BranchId = branchId };
            var report = await _reportsService.GetSalesFunnelReportAsync(query, context.UserId);

            var sb = new System.Text.StringBuilder("📊 **Phễu bán hàng**\n");
            sb.AppendLine($"- Tổng leads: {report.TotalLeads}");
            sb.AppendLine($"- Tỷ lệ liên hệ: {report.ContactRate}%");
            sb.AppendLine($"- Tỷ lệ chuyển đổi: {report.ConversionRate}%");
            if (report.LeadsBySource.Any())
            {
                sb.AppendLine("- Top nguồn lead:");
                foreach (var src in report.LeadsBySource.Take(3))
                    sb.AppendLine($"  \u2022 {src.SourceName}: {src.LeadCount} leads");
            }

            return ToolResult.Ok(sb.ToString(), report);
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
