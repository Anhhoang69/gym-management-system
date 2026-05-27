namespace backend.AI.Core;

/// <summary>
/// Shared chat message model — replaces the old OpenAIService.ChatMessage inner class.
/// ToolCallId is required when Role = "tool" to match OpenAI tool_call_id format.
/// </summary>
public record ChatMessage(
    string Role,
    string Content,
    string? ToolCallId = null   // required for role="tool" messages in multi-tool responses
);
