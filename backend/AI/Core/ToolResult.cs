namespace backend.AI.Core;

/// <summary>
/// Result returned by an IAITool execution.
/// Content is always populated (used as tool result message to LLM).
/// StructuredData is optional raw data for persistence (e.g. fitness plan JSON).
/// </summary>
public record ToolResult(
    bool Success,
    string Content,
    object? StructuredData = null,
    string? ErrorMessage = null
)
{
    public static ToolResult Ok(string content, object? data = null)
        => new(true, content, data);

    public static ToolResult Fail(string errorMessage)
        => new(false, $"Lỗi: {errorMessage}", ErrorMessage: errorMessage);
}
