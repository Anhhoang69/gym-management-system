using System.Text.Json;

namespace backend.AI.Core;

/// <summary>
/// A single tool invocation requested by the LLM.
/// CallId maps to OpenAI's tool_call_id — must be echoed back in the tool result message.
/// </summary>
public record ToolInvocation(
    string CallId,
    string ToolName,
    JsonElement Arguments
);

/// <summary>
/// Response from an LLM provider.
/// If ToolCalls is non-empty, the caller must execute all tools and loop.
/// If TextContent is non-null, the conversation is complete.
/// </summary>
public record LLMResponse(
    string? TextContent,
    List<ToolInvocation>? ToolCalls   // List — OpenAI/Claude support parallel tool calls in one response
);
