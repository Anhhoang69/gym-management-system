namespace backend.DTOs.Dashboard;

public class PtPerformanceReportDto
{
    public Guid PtStaffId { get; set; }

    public string PtName { get; set; } = string.Empty;

    public string BranchName { get; set; } = string.Empty;

    /// <summary>Số lượng buổi dạy đã hoàn thành (ClassBookings.Attended)</summary>
    public int TotalSessions { get; set; }

    /// <summary>Số lượng member đã dạy (unique)</summary>
    public int TotalMembers { get; set; }

    public decimal AverageSessionsPerMember { get; set; }

    public decimal KpiBonus { get; set; }

    public int GroupPtCount { get; set; }

    public int PrivatePtCount { get; set; }
}
