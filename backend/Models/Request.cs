using backend.Enums;

namespace backend.Models;

public class Request
{
    public Guid RequestId { get; set; }

    // user gửi request
    public Guid UserId { get; set; }

    public RequestType Type { get; set; }

    public RequestCategory Category { get; set; }

    // tiêu đề hiển thị trong approval center
    public string Title { get; set; } = null!;

    public string Description { get; set; } = null!;

    public RequestStatus Status { get; set; } = RequestStatus.Pending;

    public string? ResponseMessage { get; set; }

    public string? AttachmentUrl { get; set; }
    public string? Payload { get; set; }  // JSON snapshot data

    public string? RelatedEntityType { get; set; }

    public Guid? RelatedEntityId { get; set; }

    // staff xử lý
    public Guid? HandledByUserId { get; set; }

    public DateTime? ResolvedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // ===== navigation =====

    // sender
    public User User { get; set; } = null!;

    // handler
    public User? HandledByUser { get; set; }
}