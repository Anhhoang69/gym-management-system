namespace backend.DTOs.Dashboard;

public class ReportQueryDto
{
    public Guid? BranchId { get; set; }

    public int? Month { get; set; }

    public int? Year { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }
}
