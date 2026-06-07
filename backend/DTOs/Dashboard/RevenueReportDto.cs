namespace backend.DTOs.Dashboard;

public class RevenueReportDto
{
    public string Period { get; set; } = string.Empty;

    public decimal TotalRevenue { get; set; }

    public int TotalInvoices { get; set; }

    public decimal AverageRevenuePerInvoice { get; set; }

    public List<RevenueBranchItemDto> RevenueByBranch { get; set; } = new();

    public List<RevenuePackageItemDto> RevenueByPackage { get; set; } = new();

    public List<RevenueMonthItemDto> RevenueByMonth { get; set; } = new();
}

public class RevenueBranchItemDto
{
    public Guid BranchId { get; set; }
    public string BranchName { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int InvoiceCount { get; set; }
}

public class RevenuePackageItemDto
{
    public Guid PackageId { get; set; }
    public string PackageName { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int ContractCount { get; set; }
}

public class RevenueMonthItemDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public string Label { get; set; } = string.Empty; // e.g. "01/2025"
    public decimal Revenue { get; set; }
}
