using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.Enums;
using backend.Helpers;
using backend.Services;

namespace backend.AI.Tools.Training;

/// <summary>
/// Uses LLM context + member data to generate a personalized fitness + nutrition plan.
/// The generated plan is saved as an AIRecommendation via StructuredData.
/// This tool returns a prompt-assembled context for the LLM to generate the plan —
/// the actual plan text comes from the LLM's subsequent response, not from this tool.
/// </summary>
public class GenerateFitnessPlanTool : BaseAITool
{
    private readonly GymDataService _gymDataService;

    public GenerateFitnessPlanTool(GymDataService gymDataService)
    {
        _gymDataService = gymDataService;
    }

    public override string Name => "generate_fitness_plan";

    public override string Description =>
        "Tạo kế hoạch tập luyện và dinh dưỡng cá nhân hóa cho hội viên dựa trên lịch sử, mục tiêu và gói tập hiện tại.";

    public override JsonElement InputSchema => BuildSchema("""
        {
          "type": "object",
          "properties": {
            "goals": {
              "type": "string",
              "description": "Mục tiêu tập luyện (vd: giảm cân, tăng cơ, tăng sức bền)"
            },
            "daysPerWeek": {
              "type": "integer",
              "minimum": 1,
              "maximum": 7,
              "description": "Số buổi tập mỗi tuần mong muốn"
            }
          }
        }
        """);

    public override string[] AllowedRoles => [AuthorizationRoles.Member];
    public override StaffPosition[] AllowedStaffPositions => [];

    public override async Task<ToolResult> ExecuteAsync(
        JsonElement args, ToolExecutionContext context, CancellationToken ct = default)
    {
        try
        {
            // Gather member context — used by the LLM to personalize the plan
            var memberContext = await _gymDataService.GetCachedOrBuildContextAsync(context.UserId);
            var goals = GetString(args, "goals") ?? "không xác định";
            var daysPerWeek = GetInt(args, "daysPerWeek") ?? 3;

            var prompt =
                $"Dựa trên thông tin hội viên sau:\n{memberContext}\n\n" +
                $"Mục tiêu: {goals}\n" +
                $"Số buổi mỗi tuần: {daysPerWeek}\n\n" +
                "Hãy tạo kế hoạch tập luyện và dinh dưỡng chi tiết, cụ thể và có thể thực hiện được.";

            // Return as ToolResult.Ok — AIService will pass this to LLM for final plan generation
            // StructuredData carries {goals, daysPerWeek} so AIService can persist AIRecommendation
            return ToolResult.Ok(prompt, new { goals, daysPerWeek, memberId = context.UserId });
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
