using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;

namespace backend.AI.Tools.Payroll;

/// <summary>
/// Payroll report scoped to the calling BranchAdmin's branch.
/// </summary>
public class BranchPayrollTool : BaseAITool
{
    private readonly IPayrollService _payrollService;

    public BranchPayrollTool(IPayrollService payrollService)
    {
        _payrollService = payrollService;
    }

    public override string Name => "get_branch_payroll";
    public override string Description => "Xem bảng lương nhân viên chi nhánh: lương cơ bản, hoa hồng, KPI bonus, tổng lương theo tháng.";

    public override JsonElement InputSchema => BuildSchema("""
        {
          "type": "object",
          "properties": {
            "month": { "type": "integer", "minimum": 1, "maximum": 12 },
            "year":  { "type": "integer" }
          }
        }
        """);

    public override string[] AllowedRoles => [AuthorizationRoles.Staff, AuthorizationRoles.SuperAdmin, AuthorizationRoles.GymOwner];
    public override StaffPosition[] AllowedStaffPositions => [StaffPosition.BranchAdmin];

    public override async Task<ToolResult> ExecuteAsync(
        JsonElement args, ToolExecutionContext context, CancellationToken ct = default)
    {
        try
        {
            var now = DateTime.UtcNow;
            var month = GetInt(args, "month") ?? now.Month;
            var year = GetInt(args, "year") ?? now.Year;

            var records = await _payrollService.GetPayrollReportAsync(month, year, context.BranchId, null, null, null);

            if (!records.Any())
                return ToolResult.Ok($"Chưa có bảng lương nào cho tháng {month}/{year}.");

            var totalPayout = records.Sum(r => r.TotalSalary);
            var lines = records.Select(r =>
                $"- {r.StaffName} ({r.Position}) | Lương: {r.TotalSalary:N0} VNĐ | {r.Status}");

            var summary =
                $"💼 **Bảng lương tháng {month}/{year}** ({records.Count} nhân viên)\n" +
                $"- Tổng chi lương: {totalPayout:N0} VNĐ\n\n" +
                string.Join("\n", lines);

            return ToolResult.Ok(summary, records);
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
