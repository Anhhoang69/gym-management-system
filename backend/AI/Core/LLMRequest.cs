using System.Text.Json;

namespace backend.AI.Core;

/// <summary>JSON Schema definition for a tool parameter.</summary>
public record ToolDefinition(
    string Name,
    string Description,
    JsonElement InputSchema
);

/// <summary>Request sent to an LLM provider.</summary>
public record LLMRequest(
    List<ChatMessage> Messages,
    List<ToolDefinition>? Tools = null,
    float Temperature = 0.7f,
    int MaxTokens = 2000
);
