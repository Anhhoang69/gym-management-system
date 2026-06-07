namespace backend.DTOs.Branch;

public class AssignStaffResultDto
{
    public int Assigned { get; set; }
    public List<string> Warnings { get; set; } = new();  // vd: "User X đã được gán vào chi nhánh này"
    public List<string> Errors { get; set; } = new();    // vd: "User Y không phải Staff role"
}
