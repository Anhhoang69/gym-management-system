namespace backend.DTOs.Dashboard;

/// <summary>
/// KPI tổng quan — chỉ chứa số tổng hợp nhẹ, không chứa chart/breakdown data.
/// Chart data nằm ở từng endpoint báo cáo riêng (/revenue, /check-in...).
/// </summary>
public class KpiOverviewDto
{
    /// <summary>Doanh thu tháng hiện tại (Month-to-date, từ Invoice.Paid)</summary>
    public decimal TotalRevenueMtd { get; set; }

    /// <summary>Doanh thu tháng trước (để frontend tự tính delta)</summary>
    public decimal TotalRevenueLastMonth { get; set; }

    /// <summary>% tăng trưởng doanh thu so với tháng trước</summary>
    public decimal RevenueGrowthPercent { get; set; }

    /// <summary>Số hội viên mới tháng này (Contract chuyển sang Active trong tháng)</summary>
    public int NewMembersMtd { get; set; }

    /// <summary>Tổng hội viên đang có Contract.Active</summary>
    public int ActiveMembersTotal { get; set; }

    /// <summary>Lượt check-in hôm nay (tất cả branch)</summary>
    public int CheckInsTodayTotal { get; set; }

    /// <summary>Tỷ lệ chuyển đổi lead tháng này (%)</summary>
    public decimal LeadConversionRateMtd { get; set; }

    /// <summary>Tổng buổi PT tháng này (ClassBookings.Attended)</summary>
    public int PtSessionsMtd { get; set; }
}
