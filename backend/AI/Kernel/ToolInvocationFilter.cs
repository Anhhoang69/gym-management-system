using System.Diagnostics;
using Microsoft.SemanticKernel;
using backend.AI.Core;
using backend.Data;
using backend.Models;

namespace backend.AI.Kernel;

/// <summary>
/// Semantic Kernel function invocation filter.
/// Intercepts every SK function call to write an AIToolExecutionLog entry.
///
/// Lifecycle: Scoped — one instance per HTTP request.
/// AIService sets CurrentContext immediately after BuildContextAsync()
/// so this filter has access to the caller's userId, role, and staffPosition.
///
/// Only audits functions in the "GymTools" plugin — SK internal functions are ignored.
/// </summary>
public class ToolInvocationFilter : IFunctionInvocationFilter
{
    private readonly ApplicationDbContext _db;
    private readonly ILogger<ToolInvocationFilter> _logger;

    /// <summary>
    /// Set by AIService before SK invocation begins.
    /// Provides caller identity for audit logging.
    /// </summary>
    public ToolExecutionContext? CurrentContext { get; set; }

    public ToolInvocationFilter(
        ApplicationDbContext db,
        ILogger<ToolInvocationFilter> logger)
    {
        _db     = db;
        _logger = logger;
    }

    public async Task OnFunctionInvocationAsync(
        FunctionInvocationContext context,
        Func<FunctionInvocationContext, Task> next)
    {
        // Only audit gym domain tools — skip SK internals
        if (context.Function.PluginName != "GymTools")
        {
            await next(context);
            return;
        }

        var sw      = Stopwatch.StartNew();
        var success = false;
        string? error = null;

        try
        {
            await next(context);
            success = true;
        }
        catch (Exception ex)
        {
            error = ex.Message;
            _logger.LogError(ex, "ToolInvocationFilter | Tool error | {Tool}", context.Function.Name);
            throw;
        }
        finally
        {
            sw.Stop();
            _logger.LogInformation(
                "ToolInvocationFilter | {Tool} | {Duration}ms | Success: {Ok} | Role: {Role}",
                context.Function.Name, sw.ElapsedMilliseconds,
                success, CurrentContext?.Role ?? "unknown");

            await WriteAuditLogAsync(context.Function.Name, success, sw.ElapsedMilliseconds, error);
        }
    }

    // ── Private ──────────────────────────────────────────────────────────────

    private async Task WriteAuditLogAsync(
        string toolName, bool success, long durationMs, string? error)
    {
        if (CurrentContext == null) return;

        try
        {
            _db.Set<AIToolExecutionLog>().Add(new AIToolExecutionLog
            {
                UserId        = CurrentContext.UserId,
                UserRole      = CurrentContext.Role,
                StaffPosition = CurrentContext.StaffPosition,
                ToolName      = toolName,
                Success       = success,
                DurationMs    = durationMs,
                ErrorMessage  = error,
                ExecutedAt    = DateTime.UtcNow
            });
            await _db.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            // Audit log failure must NEVER break the conversation
            _logger.LogWarning(ex, "ToolInvocationFilter | Failed to write audit log for {Tool}", toolName);
        }
    }
}
