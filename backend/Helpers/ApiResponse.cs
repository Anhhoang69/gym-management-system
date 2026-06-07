namespace backend.Helpers;

public class ApiResponse<T>
{
    public bool Success { get; set; }

    public string Message { get; set; } = string.Empty;

    public T? Data { get; set; }

    public object? Errors { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    public ApiResponse()
    {
    }

    public ApiResponse(T data, string message = "Success")
    {
        Success = true;
        Message = message;
        Data = data;
    }

    public ApiResponse(string message, object? errors = null)
    {
        Success = false;
        Message = message;
        Errors = errors;
    }
}