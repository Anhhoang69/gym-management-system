using backend.Enums;

namespace backend.DTOs.Request;

public class RequestDetailDto : RequestListDto
{
    public string Description { get; set; } = null!;
    public string? Payload { get; set; }        // JSON snapshot – GymOwner dùng để xem chi tiết thay đổi
    public string? ResponseMessage { get; set; } // Lý do approve/reject
    public string? HandledByName { get; set; }
    public DateTime? ResolvedAt { get; set; }
}
