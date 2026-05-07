using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.AI;

public class ChatRequestDto
{
    [Required(ErrorMessage = "Message is required")]
    [MinLength(1, ErrorMessage = "Message cannot be empty")]
    [MaxLength(2000, ErrorMessage = "Message cannot exceed 2000 characters")]
    public string Message { get; set; } = null!;
}
