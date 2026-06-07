using backend.Enums;

namespace backend.DTOs.Request;

public class RequestListDto
{
    public Guid RequestId { get; set; }
    public string Title { get; set; } = null!;
    public RequestCategory Category { get; set; }
    public RequestStatus Status { get; set; }
    public string? RelatedEntityType { get; set; }
    public Guid? RelatedEntityId { get; set; }
    public string RequestedByName { get; set; } = null!;
    public string RequestedByEmail { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}
