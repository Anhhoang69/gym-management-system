using backend.Middleware;

namespace backend.Extensions;

public static class ApplicationBuilderExtensions
{
    public static IApplicationBuilder UseGlobalException(
        this IApplicationBuilder app)
    {
        return app.UseMiddleware<ExceptionMiddleware>();
    }
}