# 📊 Reports Module — Báo cáo & Phân tích

> **File liên quan:** `ReportsController.cs`, `ReportsService.cs`, `DTOs/Dashboard/`

---

## 1. Tổng quan module

Module báo cáo cung cấp thông tin phân tích cho ban quản lý:
- KPI tổng quan (doanh thu, hội viên, check-in)
- Báo cáo doanh thu (theo chi nhánh, gói tập, tháng)
- Phân tích sales funnel (leads → convert → renewal)
- Hiệu suất PT
- Báo cáo check-in
- Export CSV

**Vai trò-based scoping** — mỗi role chỉ thấy data trong phạm vi mình:
- SuperAdmin/GymOwner: toàn bộ hệ thống
- BranchAdmin: chỉ chi nhánh mình
- Sales staff: chỉ leads được assign

---

## 2. Các endpoint chính

### GET /api/reports/kpi
```
Query: branchId?
Output: KpiOverviewDto
Auth:  Staff (BranchAdmin+) | SuperAdmin | GymOwner
```
**Metrics:**
- TotalRevenueMtd (Month-to-Date)
- TotalRevenueLastMonth + RevenueGrowthPercent
- NewMembersMtd, ActiveMembersTotal
- CheckInsTodayTotal
- PtSessionsMtd
- LeadConversionRateMtd

### GET /api/reports/revenue
```
Query: branchId?, year?, month?, fromDate?, toDate?
Output: RevenueReportDto
Auth:  SuperAdmin | GymOwner | BranchAdmin
```
Revenue breakdown theo: chi nhánh, gói tập, tháng.

### GET /api/reports/sales-funnel
```
Output: SalesFunnelReportDto
Auth:  SuperAdmin | GymOwner | BranchAdmin | Sales
```
- Total leads, leads by status
- Conversion rate, contact rate
- Renewal rate
- By source, by sales staff

### GET /api/reports/pt-performance
```
Output: List<PtPerformanceReportDto>
Auth:  SuperAdmin | GymOwner | BranchAdmin | PT
```
Per-PT: total sessions, unique members, KPI bonus.

### GET /api/reports/check-in
```
Output: CheckInReportDto
Auth:  SuperAdmin | GymOwner | BranchAdmin
```
By day, by hour, peak day, peak hour.

### GET /api/reports/{type}/export
```
Query: type (revenue | sales-funnel | pt-performance | check-in)
Output: CSV file download
Auth:  Staff roles
```

---

## 3. Business Logic quan trọng

### Role-based Data Scoping
```csharp
private async Task<(bool isSuperAdmin, bool isGymOwner, bool isBranchAdmin,
    Guid? branchId, bool isSales, bool isPT)> GetUserRolesAndScopeAsync(Guid userId)
{
    var staff = await _context.Staffs.FirstOrDefaultAsync(s => s.UserId == userId);

    bool isBranchAdmin = staff?.Position == StaffPosition.BranchAdmin;
    bool isSales = staff?.Position == StaffPosition.Sales;
    bool isPT = staff?.Position == StaffPosition.PT || staff?.Position == StaffPosition.HeadPT;
    Guid? branchId = staff?.BranchId; // BranchAdmin/Sales/PT chỉ thấy branch mình

    return (isSuperAdmin, isGymOwner, isBranchAdmin, branchId, isSales, isPT);
}

// Scope resolution:
Guid? targetBranchId = (isSuperAdmin || isGymOwner) ? query.BranchId : roles.branchId;
```
- SuperAdmin/GymOwner: chọn branch bất kỳ (query param), hoặc all branches nếu không chọn
- BranchAdmin/Staff: bị lock vào branchId của mình

### Revenue Calculation (from Paid Invoices)
```csharp
var revenueQuery = _context.Invoices.Where(i => i.Status == InvoiceStatus.Paid);
// Filter theo branch nếu cần
var totalRevenueMtd = await revenueQuery
    .Where(i => i.UpdatedAt >= startOfMonth)
    .SumAsync(i => i.TotalAmount);

// Growth rate
decimal revenueGrowth = totalRevenueLastMonth > 0
    ? ((totalRevenueMtd - totalRevenueLastMonth) / totalRevenueLastMonth) * 100
    : 0;
```

### Renewal Rate (Sales Funnel)
```csharp
// Renewal = số ContractAdjust (Extend/Upgrade) trong kỳ
var renewals = await adjustsQuery.CountAsync(
    a => a.ActionType == ContractAdjustActionType.Extend ||
         a.ActionType == ContractAdjustActionType.Upgrade);

var expiredContracts = await _context.Contracts.CountAsync(
    c => c.EndDate >= start && c.EndDate < end && c.Status == ContractStatus.Expired);

decimal renewalRate = renewals + expiredContracts > 0
    ? (decimal)renewals / (renewals + expiredContracts) * 100
    : 0;
```

### PT Performance — Session count + KPI lookup
```csharp
// Count attended bookings per PT
var bookings = await bookingsQuery.ToListAsync();

// Join với PayrollRecords để lấy KPI bonus đã tính
var payrolls = await _context.PayrollRecords
    .Where(p => staffIds.Contains(p.StaffId) && p.PeriodMonth == startMonth)
    .ToDictionaryAsync(p => p.StaffId, p => p.KpiBonus);

// Group by trainer
var report = bookings.GroupBy(b => new { Id = b.Class.TrainerStaffId, ... })
    .Select(g => new PtPerformanceReportDto {
        TotalSessions = g.Count(),
        TotalMembers = g.Select(b => b.MemberUserId).Distinct().Count(),
        KpiBonus = payrolls.GetValueOrDefault(g.Key.Id, 0)
    });
```

### Period Resolution
```csharp
private (DateTime Start, DateTime End, string Label) ResolvePeriod(ReportQueryDto query)
{
    // Ưu tiên custom fromDate/toDate
    if (query.FromDate.HasValue && query.ToDate.HasValue)
        return (fromDate, toDate, "custom range");

    // Fallback: year + month
    int year = query.Year ?? DateTime.UtcNow.Year;
    int month = query.Month ?? DateTime.UtcNow.Month;
    var start = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);
    return (start, start.AddMonths(1), $"{month:D2}/{year}");
}
```

---

## 4. Database flow

```
Revenue Report:
Invoices [Status=Paid, UpdatedAt in period]
    → Include CreatedByStaff → Branch
    → Include Contract → Package
    → Group by Branch, Package, Month

Sales Funnel:
Leads [CreatedAt in period]
    → Include Source, AssignedToStaff
    → Group by Status, Source, Staff

PT Performance:
ClassBookings [Status=Attended, Class.Date in period]
    → Include Class → Trainer → User, Branch
    → Group by Trainer

Check-In:
Attendances [CheckinAt in period]
    → Group by Day, Hour
```

---

## 5. Export CSV

```csharp
case "revenue":
    sb.AppendLine("BranchName,TotalRevenue,TotalInvoices");
    foreach (var b in rev.RevenueByBranch)
        sb.AppendLine($"\"{b.BranchName}\",{b.Revenue},{b.InvoiceCount}");

case "pt-performance":
    sb.AppendLine("PtName,BranchName,TotalSessions,TotalMembers,PrivatePtCount,GroupPtCount,KpiBonus");
    ...
```

Return `text/csv` với `Content-Disposition: attachment; filename=report.csv`.

---

## 6. Câu hỏi phản biện thường gặp

**Q: Tại sao BranchAdmin không xem được data của branch khác?**
> Data scoping theo role là security requirement cơ bản. BranchAdmin chỉ chịu trách nhiệm chi nhánh của mình. Xem data branch khác có thể vi phạm business confidentiality.

**Q: Revenue được tính từ đâu?**
> Từ `Invoices.TotalAmount` where `Status = Paid`. Không từ `Contracts.DealPrice` — vì có thể có TaxAmount khác nhau. Chỉ tính invoice đã thực sự thu tiền.

**Q: RevenueGrowth = 0 khi tháng trước = 0 nghĩa là gì?**
> Không thể tính growth rate khi base = 0 (chia cho 0). Return 0 là safe default. Có thể return null hoặc "N/A" để UX tốt hơn.

**Q: ConversionRate tính như thế nào?**
> `converted / total * 100`. Trong Sales Funnel: tổng leads có status Converted / tổng leads tạo trong kỳ. KPI tốt thường 10-30% cho gym.

**Q: Hệ thống có dashboard real-time không?**
> Không có WebSocket/SSE. Data query mỗi lần request. Nếu cần real-time: thêm SignalR hub, push update khi payment/check-in xảy ra. Redis cache cho hot metrics.

**Q: Export PDF không?**
> Chưa implement. Chỉ có CSV export. PDF cần thêm library (DinkToPdf, QuestPDF). User có thể mở CSV trong Excel → export PDF từ Excel.

**Q: Dữ liệu report có được cache không?**
> Không. Mỗi request query trực tiếp DB. Với data volume nhỏ (đồ án), OK. Production: cache report results trong Redis với TTL 15-30 phút. Hoặc pre-compute aggregates vào materialized views.

**Q: Tại sao Sales staff chỉ thấy leads của mình trong funnel?**
> Business isolation: Sales A không thấy leads của Sales B → tránh "steal" leads. Manager/BranchAdmin thấy tất cả để so sánh performance.
