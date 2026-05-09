using backend.Enums;

namespace backend.DTOs.Branch;

public class CreateBranchResultDto
{
    public Guid BranchId { get; set; }
    public string Name { get; set; } = null!;
    public BranchStatus Status { get; set; }
    public Guid RequestId { get; set; }
    public List<string> Warnings { get; set; } = new();
}
