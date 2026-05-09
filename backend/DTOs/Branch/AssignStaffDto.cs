using backend.Enums;

namespace backend.DTOs.Branch;

public class AssignStaffDto
{
    public List<Guid> UserIds { get; set; } = new();

    // nullable = giữ nguyên position hiện tại nếu Staff đã tồn tại
    public StaffPosition? Position { get; set; }
}
