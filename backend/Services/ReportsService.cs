using backend.Data;
using backend.DTOs.Dashboard;
using backend.Enums;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace backend.Services;

public class ReportsService : IReportsService
{
    private readonly ApplicationDbContext _context;

    public ReportsService(ApplicationDbContext context)
    {
        _context = context;
    }

    private async Task<(bool isSuperAdmin, bool isGymOwner, bool isBranchAdmin, Guid? branchId, bool isSales, bool isPT)> GetUserRolesAndScopeAsync(Guid userId)
    {
        var isSuperAdmin = await _context.UserRoles
            .AnyAsync(ur => ur.UserId == userId && _context.Roles.Any(r => r.Id == ur.RoleId && r.Name == "SuperAdmin"));
        var isGymOwner = await _context.UserRoles
            .AnyAsync(ur => ur.UserId == userId && _context.Roles.Any(r => r.Id == ur.RoleId && r.Name == "GymOwner"));

        var staff = await _context.Staffs.FirstOrDefaultAsync(s => s.UserId == userId);
        
        bool isBranchAdmin = staff?.Position == StaffPosition.BranchAdmin;
        bool isSales = staff?.Position == StaffPosition.Sales;
        bool isPT = staff?.Position == StaffPosition.PT || staff?.Position == StaffPosition.HeadPT;
        Guid? branchId = staff?.BranchId;

        return (isSuperAdmin, isGymOwner, isBranchAdmin, branchId, isSales, isPT);
    }

    public async Task<KpiOverviewDto> GetKpiOverviewAsync(Guid callerUserId, Guid? branchId)
    {
        var roles = await GetUserRolesAndScopeAsync(callerUserId);
        
        // Scope resolution
        Guid? targetBranchId = roles.isSuperAdmin || roles.isGymOwner ? branchId : roles.branchId;

        var now = DateTime.UtcNow;
        var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var startOfLastMonth = startOfMonth.AddMonths(-1);
        var today = now.Date;
        var tomorrow = today.AddDays(1);

        // Revenue (Paid Invoices)
        var revenueQuery = _context.Invoices.Where(i => i.Status == InvoiceStatus.Paid);
        if (targetBranchId.HasValue)
        {
            revenueQuery = revenueQuery.Where(i => i.CreatedByStaff.BranchId == targetBranchId.Value);
        }

        var totalRevenueMtd = await revenueQuery
            .Where(i => i.UpdatedAt >= startOfMonth)
            .SumAsync(i => i.TotalAmount);

        var totalRevenueLastMonth = await revenueQuery
            .Where(i => i.UpdatedAt >= startOfLastMonth && i.UpdatedAt < startOfMonth)
            .SumAsync(i => i.TotalAmount);

        decimal revenueGrowth = 0;
        if (totalRevenueLastMonth > 0)
        {
            revenueGrowth = ((totalRevenueMtd - totalRevenueLastMonth) / totalRevenueLastMonth) * 100;
        }

        // New Members MTD (Contracts activated this month)
        var contractsQuery = _context.Contracts.AsQueryable();
        if (targetBranchId.HasValue)
        {
            contractsQuery = contractsQuery.Where(c => c.Staff.BranchId == targetBranchId.Value);
        }

        var newMembersMtd = await contractsQuery
            .Where(c => c.StartDate >= startOfMonth && c.Status == ContractStatus.Active)
            .Select(c => c.MemberUserId)
            .Distinct()
            .CountAsync();

        var activeMembersTotal = await contractsQuery
            .Where(c => c.Status == ContractStatus.Active)
            .Select(c => c.MemberUserId)
            .Distinct()
            .CountAsync();

        // Check-ins Today
        var checkinsQuery = _context.Attendances.AsQueryable();
        if (targetBranchId.HasValue)
        {
            checkinsQuery = checkinsQuery.Where(a => a.BranchId == targetBranchId.Value);
        }
        var checkInsTodayTotal = await checkinsQuery
            .Where(a => a.CheckinAt >= today && a.CheckinAt < tomorrow)
            .CountAsync();

        // PT Sessions MTD
        var ptSessionsQuery = _context.ClassBookings
            .Include(cb => cb.Class)
            .Where(cb => cb.Status == BookingStatus.Attended && cb.Class.Date >= DateOnly.FromDateTime(startOfMonth));
        if (targetBranchId.HasValue)
        {
            ptSessionsQuery = ptSessionsQuery.Where(cb => cb.Class.Trainer.BranchId == targetBranchId.Value);
        }
        var ptSessionsMtd = await ptSessionsQuery.CountAsync();

        // Lead Conversion Rate MTD
        var leadsQuery = _context.Leads.AsQueryable();
        if (targetBranchId.HasValue)
        {
            leadsQuery = leadsQuery.Where(l => l.BranchId == targetBranchId.Value);
        }
        
        var leadsCreatedMtd = await leadsQuery.Where(l => l.CreatedAt >= startOfMonth).CountAsync();
        var leadsConvertedMtd = await leadsQuery.Where(l => l.CreatedAt >= startOfMonth && l.Status == LeadStatus.Converted).CountAsync();
        
        decimal conversionRate = leadsCreatedMtd > 0 ? (decimal)leadsConvertedMtd / leadsCreatedMtd * 100 : 0;

        return new KpiOverviewDto
        {
            TotalRevenueMtd = totalRevenueMtd,
            TotalRevenueLastMonth = totalRevenueLastMonth,
            RevenueGrowthPercent = decimal.Round(revenueGrowth, 2),
            NewMembersMtd = newMembersMtd,
            ActiveMembersTotal = activeMembersTotal,
            CheckInsTodayTotal = checkInsTodayTotal,
            PtSessionsMtd = ptSessionsMtd,
            LeadConversionRateMtd = decimal.Round(conversionRate, 2)
        };
    }

    public async Task<RevenueReportDto> GetRevenueReportAsync(ReportQueryDto query, Guid callerUserId)
    {
        var roles = await GetUserRolesAndScopeAsync(callerUserId);
        if (!roles.isSuperAdmin && !roles.isGymOwner && !roles.isBranchAdmin)
            throw new Exception("You do not have permission to view revenue reports.");

        Guid? targetBranchId = roles.isSuperAdmin || roles.isGymOwner ? query.BranchId : roles.branchId;

        var (start, end, periodLabel) = ResolvePeriod(query);

        var invoicesQuery = _context.Invoices
            .Include(i => i.CreatedByStaff).ThenInclude(s => s.Branch)
            .Include(i => i.Contract).ThenInclude(c => c.Package)
            .Where(i => i.Status == InvoiceStatus.Paid && i.UpdatedAt >= start && i.UpdatedAt < end);

        if (targetBranchId.HasValue)
        {
            invoicesQuery = invoicesQuery.Where(i => i.CreatedByStaff.BranchId == targetBranchId.Value);
        }

        var invoices = await invoicesQuery.ToListAsync();

        var totalRevenue = invoices.Sum(i => i.TotalAmount);
        var totalCount = invoices.Count;

        var byBranch = invoices.GroupBy(i => new { BranchId = i.CreatedByStaff?.BranchId, Name = i.CreatedByStaff?.Branch?.Name ?? "Unknown" })
            .Select(g => new RevenueBranchItemDto
            {
                BranchId = g.Key.BranchId.GetValueOrDefault(),
                BranchName = g.Key.Name,
                Revenue = g.Sum(i => i.TotalAmount),
                InvoiceCount = g.Count()
            }).ToList();

        var byPackage = invoices.GroupBy(i => new { i.Contract.PackageId, i.Contract.Package.Name })
            .Select(g => new RevenuePackageItemDto
            {
                PackageId = g.Key.PackageId,
                PackageName = g.Key.Name,
                Revenue = g.Sum(i => i.TotalAmount),
                ContractCount = g.Count()
            }).ToList();

        var byMonth = invoices.GroupBy(i => new { Year = i.UpdatedAt!.Value.Year, Month = i.UpdatedAt!.Value.Month })
            .Select(g => new RevenueMonthItemDto
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                Label = $"{g.Key.Month:D2}/{g.Key.Year}",
                Revenue = g.Sum(i => i.TotalAmount)
            }).OrderBy(x => x.Year).ThenBy(x => x.Month).ToList();

        return new RevenueReportDto
        {
            Period = periodLabel,
            TotalRevenue = totalRevenue,
            TotalInvoices = totalCount,
            AverageRevenuePerInvoice = totalCount > 0 ? totalRevenue / totalCount : 0,
            RevenueByBranch = byBranch,
            RevenueByPackage = byPackage,
            RevenueByMonth = byMonth
        };
    }

    public async Task<SalesFunnelReportDto> GetSalesFunnelReportAsync(ReportQueryDto query, Guid callerUserId)
    {
        var roles = await GetUserRolesAndScopeAsync(callerUserId);
        if (!roles.isSuperAdmin && !roles.isGymOwner && !roles.isBranchAdmin && !roles.isSales)
            throw new Exception("You do not have permission to view sales funnel reports.");

        Guid? targetBranchId = roles.isSuperAdmin || roles.isGymOwner ? query.BranchId : roles.branchId;

        var (start, end, periodLabel) = ResolvePeriod(query);

        var leadsQuery = _context.Leads
            .Include(l => l.Source)
            .Include(l => l.AssignedToStaff).ThenInclude(s => s.User)
            .Where(l => l.CreatedAt >= start && l.CreatedAt < end);

        if (targetBranchId.HasValue)
        {
            leadsQuery = leadsQuery.Where(l => l.BranchId == targetBranchId.Value);
        }

        if (roles.isSales && !roles.isBranchAdmin) // Only strictly sales, limit to their own leads
        {
             leadsQuery = leadsQuery.Where(l => l.AssignedToStaffId == callerUserId);
        }

        var leads = await leadsQuery.ToListAsync();

        var totalLeads = leads.Count;
        var leadsByStatus = leads.GroupBy(l => l.Status.ToString())
                                 .ToDictionary(g => g.Key, g => g.Count());

        var contacted = leads.Count(l => l.Status != LeadStatus.New);
        var converted = leads.Count(l => l.Status == LeadStatus.Converted);

        // Renewal
        var adjustsQuery = _context.ContractAdjusts
            .Include(a => a.Contract).ThenInclude(c => c.Staff)
            .Where(a => a.CreatedAt >= start && a.CreatedAt < end);
        
        if (targetBranchId.HasValue)
        {
            adjustsQuery = adjustsQuery.Where(a => a.Contract.Staff.BranchId == targetBranchId.Value);
        }

        var renewals = await adjustsQuery.CountAsync(a => a.ActionType == ContractAdjustActionType.Extend || a.ActionType == ContractAdjustActionType.Upgrade);
        var expiredContracts = await _context.Contracts.CountAsync(c => c.EndDate >= start && c.EndDate < end && c.Status == ContractStatus.Expired && (!targetBranchId.HasValue || c.Staff.BranchId == targetBranchId.Value));

        decimal renewalRate = renewals + expiredContracts > 0 ? (decimal)renewals / (renewals + expiredContracts) * 100 : 0;

        // Staff breakdown
        var staffIds = leads.Where(l => l.AssignedToStaffId != Guid.Empty).Select(l => l.AssignedToStaffId).Distinct().ToList();
        
        var commissionsQuery = _context.Commissions.Where(c => c.CreatedAt >= start && c.CreatedAt < end);
        if (staffIds.Any()) {
            commissionsQuery = commissionsQuery.Where(c => staffIds.Contains(c.StaffId));
        }

        var commissions = await commissionsQuery.GroupBy(c => c.StaffId)
                                                .Select(g => new { StaffId = g.Key, Total = g.Sum(c => c.Amount) })
                                                .ToDictionaryAsync(x => x.StaffId, x => x.Total);

        var salesByStaff = leads.Where(l => l.AssignedToStaffId != Guid.Empty)
            .GroupBy(l => new { Id = l.AssignedToStaffId, Name = l.AssignedToStaff!.User.FullName ?? "Unknown" })
            .Select(g => new SalesStaffFunnelDto
            {
                StaffId = g.Key.Id,
                StaffName = g.Key.Name,
                LeadsAssigned = g.Count(),
                ConversionCount = g.Count(l => l.Status == LeadStatus.Converted),
                TotalSalesCommission = commissions.GetValueOrDefault(g.Key.Id, 0)
            }).ToList();

        var bySource = leads.Where(l => l.Source != null)
            .GroupBy(l => new { SourceId = l.SourceId, SourceName = l.Source!.Name })
            .Select(g => new LeadSourceFunnelDto
            {
                SourceId = g.Key.SourceId,
                SourceName = g.Key.SourceName,
                LeadCount = g.Count()
            }).ToList();

        return new SalesFunnelReportDto
        {
            Period = periodLabel,
            TotalLeads = totalLeads,
            LeadsByStatus = leadsByStatus,
            ConversionRate = totalLeads > 0 ? (decimal)converted / totalLeads * 100 : 0,
            ContactRate = totalLeads > 0 ? (decimal)contacted / totalLeads * 100 : 0,
            RenewalCount = renewals,
            RenewalRate = decimal.Round(renewalRate, 2),
            LeadsBySource = bySource,
            SalesByStaff = salesByStaff
        };
    }

    public async Task<List<PtPerformanceReportDto>> GetPtPerformanceReportAsync(ReportQueryDto query, Guid callerUserId)
    {
        var roles = await GetUserRolesAndScopeAsync(callerUserId);
        if (!roles.isSuperAdmin && !roles.isGymOwner && !roles.isBranchAdmin && !roles.isPT)
            throw new Exception("You do not have permission to view PT performance reports.");

        Guid? targetBranchId = roles.isSuperAdmin || roles.isGymOwner ? query.BranchId : roles.branchId;
        var (start, end, _) = ResolvePeriod(query);
        var startMonth = start.Month;
        var startYear = start.Year;

        var bookingsQuery = _context.ClassBookings
            .Include(cb => cb.Class).ThenInclude(c => c.Trainer).ThenInclude(t => t.User)
            .Include(cb => cb.Class).ThenInclude(c => c.Trainer).ThenInclude(t => t.Branch)
            .Where(cb => cb.Status == BookingStatus.Attended && cb.Class.Date >= DateOnly.FromDateTime(start) && cb.Class.Date <= DateOnly.FromDateTime(end.AddDays(-1)));

        if (targetBranchId.HasValue)
        {
            bookingsQuery = bookingsQuery.Where(cb => cb.Class.Trainer.BranchId == targetBranchId.Value);
        }

        if (roles.isPT && !roles.isBranchAdmin)
        {
            bookingsQuery = bookingsQuery.Where(cb => cb.Class.TrainerStaffId == callerUserId);
        }

        var bookings = await bookingsQuery.ToListAsync();

        var staffIds = bookings.Select(b => b.Class.TrainerStaffId).Distinct().ToList();

        var payrolls = await _context.PayrollRecords
            .Where(p => staffIds.Contains(p.StaffId) && p.PeriodMonth == startMonth && p.PeriodYear == startYear)
            .ToDictionaryAsync(p => p.StaffId, p => p.KpiBonus);

        var report = bookings.GroupBy(b => new { Id = b.Class.TrainerStaffId, Name = b.Class.Trainer.User.FullName, Branch = b.Class.Trainer.Branch.Name })
            .Select(g => new PtPerformanceReportDto
            {
                PtStaffId = g.Key.Id,
                PtName = g.Key.Name ?? "Unknown",
                BranchName = g.Key.Branch,
                TotalSessions = g.Count(),
                TotalMembers = g.Select(b => b.MemberUserId).Distinct().Count(),
                AverageSessionsPerMember = g.Select(b => b.MemberUserId).Distinct().Count() > 0 ? (decimal)g.Count() / g.Select(b => b.MemberUserId).Distinct().Count() : 0,
                GroupPtCount = g.Count(b => b.Class.ClassType != ClassType.PersonalTraining),
                PrivatePtCount = g.Count(b => b.Class.ClassType == ClassType.PersonalTraining),
                KpiBonus = payrolls.GetValueOrDefault(g.Key.Id, 0)
            }).ToList();

        return report;
    }

    public async Task<CheckInReportDto> GetCheckInReportAsync(ReportQueryDto query, Guid callerUserId)
    {
        var roles = await GetUserRolesAndScopeAsync(callerUserId);
        if (!roles.isSuperAdmin && !roles.isGymOwner && !roles.isBranchAdmin)
            throw new Exception("You do not have permission to view check-in reports.");

        Guid? targetBranchId = roles.isSuperAdmin || roles.isGymOwner ? query.BranchId : roles.branchId;
        var (start, end, periodLabel) = ResolvePeriod(query);

        var checkinsQuery = _context.Attendances.Include(a => a.Branch).Where(a => a.CheckinAt >= start && a.CheckinAt < end);
        
        if (targetBranchId.HasValue)
        {
            checkinsQuery = checkinsQuery.Where(a => a.BranchId == targetBranchId.Value);
        }

        var checkins = await checkinsQuery.ToListAsync();

        var branchName = checkins.FirstOrDefault()?.Branch.Name ?? "All Branches";

        var byDay = checkins.GroupBy(a => DateOnly.FromDateTime(a.CheckinAt))
            .Select(g => new DailyCheckInDto { Date = g.Key, Count = g.Count() })
            .OrderBy(x => x.Date).ToList();

        var byHour = checkins.GroupBy(a => a.CheckinAt.Hour)
            .Select(g => new HourlyCheckInDto { Hour = g.Key, Count = g.Count() })
            .OrderBy(x => x.Hour).ToList();

        var peakDay = byDay.OrderByDescending(x => x.Count).FirstOrDefault()?.Date;
        var peakHour = byHour.OrderByDescending(x => x.Count).FirstOrDefault()?.Hour;

        return new CheckInReportDto
        {
            BranchId = targetBranchId ?? Guid.Empty,
            BranchName = branchName,
            Period = periodLabel,
            TotalCheckIns = checkins.Count,
            UniqueMembers = checkins.Select(a => a.MemberUserId).Distinct().Count(),
            CheckInsByDay = byDay,
            CheckInsByHour = byHour,
            PeakDay = peakDay,
            PeakHour = peakHour
        };
    }

    public async Task<string> ExportCsvAsync(string reportType, ReportQueryDto query, Guid callerUserId)
    {
        var sb = new StringBuilder();

        switch (reportType.ToLower())
        {
            case "revenue":
                var rev = await GetRevenueReportAsync(query, callerUserId);
                sb.AppendLine("BranchName,TotalRevenue,TotalInvoices");
                foreach (var b in rev.RevenueByBranch)
                {
                    sb.AppendLine($"\"{b.BranchName}\",{b.Revenue},{b.InvoiceCount}");
                }
                break;

            case "sales-funnel":
                var funnel = await GetSalesFunnelReportAsync(query, callerUserId);
                sb.AppendLine("StaffName,LeadsAssigned,ConversionCount,TotalSalesCommission");
                foreach (var s in funnel.SalesByStaff)
                {
                    sb.AppendLine($"\"{s.StaffName}\",{s.LeadsAssigned},{s.ConversionCount},{s.TotalSalesCommission}");
                }
                break;

            case "pt-performance":
                var pt = await GetPtPerformanceReportAsync(query, callerUserId);
                sb.AppendLine("PtName,BranchName,TotalSessions,TotalMembers,PrivatePtCount,GroupPtCount,KpiBonus");
                foreach (var p in pt)
                {
                    sb.AppendLine($"\"{p.PtName}\",\"{p.BranchName}\",{p.TotalSessions},{p.TotalMembers},{p.PrivatePtCount},{p.GroupPtCount},{p.KpiBonus}");
                }
                break;

            case "check-in":
                var checkin = await GetCheckInReportAsync(query, callerUserId);
                sb.AppendLine("Date,CheckInCount");
                foreach (var d in checkin.CheckInsByDay)
                {
                    sb.AppendLine($"{d.Date:yyyy-MM-dd},{d.Count}");
                }
                break;

            default:
                throw new Exception("Unknown report type for export");
        }

        return sb.ToString();
    }

    private (DateTime Start, DateTime End, string Label) ResolvePeriod(ReportQueryDto query)
    {
        if (query.FromDate.HasValue && query.ToDate.HasValue)
        {
            return (query.FromDate.Value.ToUniversalTime(), query.ToDate.Value.ToUniversalTime(), $"{query.FromDate.Value:yyyy-MM-dd} to {query.ToDate.Value:yyyy-MM-dd}");
        }

        int year = query.Year ?? DateTime.UtcNow.Year;
        int month = query.Month ?? DateTime.UtcNow.Month;

        var start = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);
        var end = start.AddMonths(1);
        return (start, end, $"{month:D2}/{year}");
    }
}
