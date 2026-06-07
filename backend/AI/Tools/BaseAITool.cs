using System.Text.Json;
using backend.AI.Core;
using backend.Enums;
using backend.Helpers;

namespace backend.AI.Tools;

/// <summary>
/// Base class with shared helpers for all tool implementations.
/// Provides JSON schema building utilities and safe argument extraction.
/// </summary>
public abstract class BaseAITool : IAITool
{
    public abstract string Name { get; }
    public abstract string Description { get; }
    public abstract JsonElement InputSchema { get; }
    public abstract string[] AllowedRoles { get; }
    public abstract StaffPosition[] AllowedStaffPositions { get; }

    public abstract Task<ToolResult> ExecuteAsync(
        JsonElement args,
        ToolExecutionContext context,
        CancellationToken ct = default);

    // ── Schema builders ─────────────────────────────────────────────

    protected static JsonElement EmptySchema()
        => JsonDocument.Parse("{\"type\":\"object\",\"properties\":{}}").RootElement;

    protected static JsonElement BuildSchema(string json)
        => JsonDocument.Parse(json).RootElement;

    // ── Argument extraction helpers ──────────────────────────────────

    protected static string? GetString(JsonElement args, string key)
    {
        if (args.TryGetProperty(key, out var el) && el.ValueKind != JsonValueKind.Null)
            return el.GetString();
        return null;
    }

    protected static int? GetInt(JsonElement args, string key)
    {
        if (args.TryGetProperty(key, out var el) && el.TryGetInt32(out var v))
            return v;
        return null;
    }

    protected static Guid? GetGuid(JsonElement args, string key)
    {
        var s = GetString(args, key);
        return Guid.TryParse(s, out var g) ? g : null;
    }

    protected static DateOnly? GetDate(JsonElement args, string key)
    {
        var s = GetString(args, key);
        return DateOnly.TryParse(s, out var d) ? d : null;
    }
}
