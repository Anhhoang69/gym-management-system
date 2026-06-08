using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;

namespace backend.AI.Tools.Payroll;

/// <summary>
/// Global payroll overview — SuperAdmin and GymOwner see all branches.
/// </summary>
public class PayrollOverviewTool : BaseAITool
{
    private readonly IPayrollService _payrollService;

    public PayrollOverviewTool(IPayrollService payrollService)
    {
        _payrollService = payrollService;
    }

    public override string Name => "get_payroll_overview";
    public override string Description => "Xem tổng quan bảng lương toàn hệ thống: tổng chi lương tất cả chi nhánh, phân tích theo vị trí.";

    public override JsonElement InputSchema => BuildSchema("""
        {
          "type": "object",
          "properties": {
            "month": { "type": "integer", "minimum": 1, "maximum": 12 },
            "year":  { "type": "integer" },
            "branchId": { "type": "string", "format": "uuid" }
          }
        }
        """);

    public override string[] AllowedRoles => [AuthorizationRoles.SuperAdmin, AuthorizationRoles.GymOwner];
    public override StaffPosition[] AllowedStaffPositions => [];   // not Staff role

    public override async Task<ToolResult> ExecuteAsync(
        JsonElement args, ToolExecutionContext context, CancellationToken ct = default)
    {
        try
        {
            var now = DateTime.UtcNow;
            var month = GetInt(args, "month") ?? now.Month;
            var year = GetInt(args, "year") ?? now.Year;
            var branchId = GetGuid(args, "branchId");

            var records = await _payrollService.GetPayrollReportAsync(month, year, branchId, null, null, null);

            if (!records.Any())
                return ToolResult.Ok($"Chưa có bảng lương nào cho tháng {month}/{year}.");

            var totalPayout = records.Sum(r => r.TotalSalary);
            var byPosition = records
                .GroupBy(r => r.Position)
                .Select(g => $"  • {g.Key}: {g.Count()} người | {g.Sum(r => r.TotalSalary):N0} VNĐ");

            var summary =
                $"🌐 **Tổng quan lương toàn hệ thống {month}/{year}**\n" +
                $"- Tổng nhân viên: {records.Count}\n" +
                $"- Tổng chi lương: {totalPayout:N0} VNĐ\n\n" +
                $"**Phân tích theo vị trí:**\n" +
                string.Join("\n", byPosition);

            return ToolResult.Ok(summary, records);
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
