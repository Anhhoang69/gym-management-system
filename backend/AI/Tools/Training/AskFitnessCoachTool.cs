using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.Enums;
using backend.Helpers;
using backend.Services;

namespace backend.AI.Tools.Training;

/// <summary>
/// Provides the AI fitness coach with member context so it can answer training/nutrition
/// questions in a personalized way (without being a static FAQ).
/// </summary>
public class AskFitnessCoachTool : BaseAITool
{
    private readonly GymDataService _gymDataService;

    public AskFitnessCoachTool(GymDataService gymDataService)
    {
        _gymDataService = gymDataService;
    }

    public override string Name => "ask_fitness_coach";

    public override string Description =>
        "Lấy thông tin bối cảnh của hội viên để AI trả lời câu hỏi về tập luyện, dinh dưỡng một cách cá nhân hóa.";

    public override JsonElement InputSchema => BuildSchema("""
        {
          "type": "object",
          "properties": {
            "question": {
              "type": "string",
              "description": "Câu hỏi về tập luyện hoặc dinh dưỡng"
            }
          },
          "required": ["question"]
        }
        """);

    public override string[] AllowedRoles => [AuthorizationRoles.Member];
    public override StaffPosition[] AllowedStaffPositions => [];

    public override async Task<ToolResult> ExecuteAsync(
        JsonElement args, ToolExecutionContext context, CancellationToken ct = default)
    {
        try
        {
            var question = GetString(args, "question") ?? "";
            var memberContext = await _gymDataService.GetCachedOrBuildContextAsync(context.UserId);

            // Return context so LLM can generate a personalized answer
            var enrichedContext =
                $"Thông tin hội viên:\n{memberContext}\n\n" +
                $"Câu hỏi: {question}";

            return ToolResult.Ok(enrichedContext);
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
