using backend.Helpers;

namespace backend.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next,
        ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);

            var statusCode = ex switch
            {
                BusinessException => StatusCodes.Status400BadRequest,
                NotFoundException => StatusCodes.Status404NotFound,
                UnauthorizedException => StatusCodes.Status401Unauthorized,
                ForbiddenException => StatusCodes.Status403Forbidden,
                ConflictException => StatusCodes.Status409Conflict,
                // catch-all for plain Exception used as business validation in services
                _ when IsBusinessMessage(ex.Message) => StatusCodes.Status400BadRequest,
                _ => StatusCodes.Status500InternalServerError
            };

            var response = new ApiResponse<string>
            {
                Success = false,
                Message = ex.Message,
                Errors = statusCode == StatusCodes.Status500InternalServerError
                    ? ex.StackTrace   // only expose stack trace for true 500s
                    : null
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;
            await context.Response.WriteAsJsonAsync(response);
        }
    }

    /// <summary>
    /// Heuristic: plain Exception messages that are clearly validation / business errors
    /// (i.e. NOT infrastructure errors) should be surfaced as 400 instead of 500.
    /// </summary>
    private static bool IsBusinessMessage(string msg)
    {
        if (string.IsNullOrWhiteSpace(msg)) return false;
        var lower = msg.ToLowerInvariant();
        return lower.Contains("invalid credentials") ||
               lower.Contains("already") ||
               lower.Contains("not found") ||
               lower.Contains("no active") ||
               lower.Contains("otp") ||
               lower.Contains("expired") ||
               lower.Contains("passwords do not match") ||
               lower.Contains("invalid request") ||
               lower.Contains("not allowed") ||
               lower.Contains("insufficient") ||
               lower.Contains("cannot") ||
               lower.Contains("must be") ||
               lower.Contains("is required") ||
               lower.Contains("duplicate") ||
               lower.Contains("conflict") ||
               lower.Contains("user account is locked") ||
               lower.Contains("password") ||
               lower.Contains("jwt") ||
               lower.Contains("permission") ||
               lower.Contains("staff") ||
               lower.Contains("contract") ||
               lower.Contains("invoice") ||
               lower.Contains("hợp đồng") ||
               lower.Contains("hóa đơn") ||
               lower.Contains("thanh toán") ||
               lower.Contains("status") ||
               lower.Contains("capacity") ||
               lower.Contains("check-in") ||
               lower.Contains("check-out") ||
               lower.Contains("active") ||
               lower.Contains("invalid");
    }
}