namespace backend.DTOs.AI;

public class ChatResponseDto
{
    public string Message { get; set; } = null!;

    /// <summary>
    /// Response type: "text" for conversational, "json" for structured plan
    /// </summary>
    public string Type { get; set; } = "text";
}
