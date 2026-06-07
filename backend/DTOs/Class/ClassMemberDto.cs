namespace backend.DTOs.Class;

using backend.Enums;

/// <summary>
/// Member trong một buổi học — dành cho PT/HeadPT/Admin xem.
/// </summary>
public class ClassMemberDto
{
    public Guid MemberUserId { get; set; }

    public string MemberName { get; set; } = null!;

    public string? AvatarUrl { get; set; }

    public BookingStatus BookingStatus { get; set; }

    public DateTime BookedAt { get; set; }

    public DateTime? CheckedInAt { get; set; }

    public string? SessionNote { get; set; }
}
