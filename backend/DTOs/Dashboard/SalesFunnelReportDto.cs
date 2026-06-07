namespace backend.DTOs.Dashboard;

public class SalesFunnelReportDto
{
    public string Period { get; set; } = string.Empty;

    public int TotalLeads { get; set; }

    /// <summary>Breakdown by LeadStatus</summary>
    public Dictionary<string, int> LeadsByStatus { get; set; } = new();

    public decimal ConversionRate { get; set; }

    public decimal ContactRate { get; set; }

    /// <summary>Số lượng hợp đồng gia hạn (ContractAdjust.ActionType = Renew/Extend)</summary>
    public int RenewalCount { get; set; }

    /// <summary>Tỷ lệ gia hạn = Renewed / (Expired + Renewed)</summary>
    public decimal RenewalRate { get; set; }

    public List<LeadSourceFunnelDto> LeadsBySource { get; set; } = new();

    public List<SalesStaffFunnelDto> SalesByStaff { get; set; } = new();
}

public class LeadSourceFunnelDto
{
    public Guid SourceId { get; set; }
    public string SourceName { get; set; } = string.Empty;
    public int LeadCount { get; set; }
}

public class SalesStaffFunnelDto
{
    public Guid StaffId { get; set; }
    public string StaffName { get; set; } = string.Empty;
    public int LeadsAssigned { get; set; }
    public int ConversionCount { get; set; }
    public decimal TotalSalesCommission { get; set; }
}
