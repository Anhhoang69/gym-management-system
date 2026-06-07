using System.Text.Json;
using Microsoft.SemanticKernel;
using backend.AI.Core;

namespace backend.AI.Kernel;

/// <summary>
/// Bridges the IAITool business layer with Semantic Kernel's function invocation system.
///
/// Design principle:
///   - IAITool = business/RBAC layer (unchanged)
///   - KernelFunction = SK orchestration layer (generated on-the-fly per request)
///   - ToolExecutionContext is captured via closure — never leaked into SK pipeline
/// </summary>
public static class SkToolHelper
{
    /// <summary>
    /// Wraps an IAITool as a SK KernelFunction.
    /// SK can auto-invoke this function when the LLM requests it.
    ///
    /// The ToolExecutionContext (userId, role, branchId) is captured in a closure,
    /// ensuring RBAC is enforced at every tool execution without polluting SK args.
    /// </summary>
    public static KernelFunction WrapAsTool(IAITool tool, ToolExecutionContext ctx)
    {
        return KernelFunctionFactory.CreateFromMethod(
            method: async (KernelArguments skArgs, CancellationToken ct) =>
            {
                // Serialize SK args dict → JSON → JsonElement for IAITool.ExecuteAsync
                // SK passes args as object? values; serialization normalizes all types.
                var dict = new Dictionary<string, object?>();
                foreach (var kv in skArgs)
                    if (kv.Key is not ("kernel" or "cancellationToken"))
                        dict[kv.Key] = kv.Value;

                var json    = JsonSerializer.Serialize(dict);
                var element = JsonDocument.Parse(json).RootElement;

                var result = await tool.ExecuteAsync(element, ctx, ct);
                return result.Content;   // SK receives plain string
            },
            functionName: tool.Name,
            description:  tool.Description,
            parameters:   ExtractParameters(tool.InputSchema)
        );
    }

    /// <summary>
    /// Extracts OpenAI token usage from SK response metadata.
    /// The OpenAI connector automatically sets "Usage" in ChatMessageContent.Metadata.
    /// Returns (0, 0) safely if metadata is absent — token tracking is non-critical.
    /// </summary>
    public static (int PromptTokens, int CompletionTokens) ExtractTokenUsage(
        Microsoft.SemanticKernel.ChatMessageContent response)
    {
        try
        {
            if (response.Metadata?.TryGetValue("Usage", out var raw) == true && raw != null)
            {
                // Use dynamic to avoid hard dependency on OpenAI SDK internal types
                dynamic usage = raw;
                return ((int)usage.InputTokenCount, (int)usage.OutputTokenCount);
            }
        }
        catch { /* non-critical — swallow and return zeros */ }
        return (0, 0);
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    /// <summary>
    /// Parses a JSON Schema "properties" object into SK KernelParameterMetadata list.
    /// Supports JSON Schema types: string, integer, number, boolean.
    /// Parameters listed in "required" array are marked IsRequired = true.
    /// </summary>
    private static IReadOnlyList<KernelParameterMetadata> ExtractParameters(JsonElement schema)
    {
        var result = new List<KernelParameterMetadata>();

        if (!schema.TryGetProperty("properties", out var props))
            return result;

        var required = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        if (schema.TryGetProperty("required", out var reqArr))
            foreach (var r in reqArr.EnumerateArray())
                if (r.GetString() is { } s) required.Add(s);

        foreach (var prop in props.EnumerateObject())
        {
            var description = prop.Value.TryGetProperty("description", out var d)
                ? d.GetString() ?? prop.Name
                : prop.Name;

            var typeName = prop.Value.TryGetProperty("type", out var t)
                ? t.GetString()
                : "string";

            var dotNetType = typeName switch
            {
                "integer" => typeof(int),
                "number"  => typeof(double),
                "boolean" => typeof(bool),
                _         => typeof(string)
            };

            result.Add(new KernelParameterMetadata(prop.Name)
            {
                Description   = description,
                IsRequired    = required.Contains(prop.Name),
                ParameterType = dotNetType
            });
        }

        return result;
    }
}
