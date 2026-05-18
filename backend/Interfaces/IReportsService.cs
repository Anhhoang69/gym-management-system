using backend.DTOs.Dashboard;

namespace backend.Interfaces;

public interface IReportsService
{
    Task<KpiOverviewDto> GetKpiOverviewAsync(Guid callerUserId, Guid? branchId);
    Task<RevenueReportDto> GetRevenueReportAsync(ReportQueryDto query, Guid callerUserId);
    Task<SalesFunnelReportDto> GetSalesFunnelReportAsync(ReportQueryDto query, Guid callerUserId);
    Task<List<PtPerformanceReportDto>> GetPtPerformanceReportAsync(ReportQueryDto query, Guid callerUserId);
    Task<CheckInReportDto> GetCheckInReportAsync(ReportQueryDto query, Guid callerUserId);
    
    /// <summary>
    /// Xuất báo cáo ra định dạng CSV
    /// reportType có thể là: "revenue", "sales-funnel", "pt-performance", "check-in"
    /// </summary>
    Task<string> ExportCsvAsync(string reportType, ReportQueryDto query, Guid callerUserId);
}
