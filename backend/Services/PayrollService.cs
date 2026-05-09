using System.Text;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using backend.Data;
using backend.DTOs.Payroll;
using backend.Enums;
using backend.Interfaces;
using backend.Models;

namespace backend.Services;

public class PayrollService : IPayrollService
{
    private readonly ApplicationDbContext _context;
    private readonly INotificationService _notificationService;
    private readonly IMapper _mapper;

    public PayrollService(ApplicationDbContext context, INotificationService notificationService, IMapper mapper)
    {
        _context = context;
        _notificationService = notificationService;
        _mapper = mapper;
    }

    public async Task<List<PayrollFormulaDto>> GetFormulasAsync()
    {
        return await _context.PayrollFormulas
            .OrderByDescending(f => f.CreatedAt)
            .ProjectTo<PayrollFormulaDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<Guid> CreateFormulaAsync(CreatePayrollFormulaDto dto, Guid callerUserId)
    {
        var formula = new PayrollFormula
        {
            FormulaId = Guid.NewGuid(),
            Name = dto.Name,
            DefaultBaseSalary = dto.DefaultBaseSalary,
            CommissionPerSession = dto.CommissionPerSession,
            KpiSessionThreshold = dto.KpiSessionThreshold,
            KpiBonus = dto.KpiBonus,
            IsActive = true,
            CreatedByUserId = callerUserId,
            CreatedAt = DateTime.UtcNow
        };

        // Deactivate others
        var actives = await _context.PayrollFormulas.Where(f => f.IsActive).ToListAsync();
        foreach (var act in actives) act.IsActive = false;

        _context.PayrollFormulas.Add(formula);
        await _context.SaveChangesAsync();

        return formula.FormulaId;
    }

    public async Task<bool> SetActiveFormulaAsync(Guid formulaId)
    {
        var formula = await _context.PayrollFormulas.FindAsync(formulaId);
        if (formula == null) return false;

        var actives = await _context.PayrollFormulas.Where(f => f.IsActive).ToListAsync();
        foreach (var act in actives) act.IsActive = false;

        formula.IsActive = true;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<int> CalculatePayrollAsync(CalculatePayrollDto dto)
    {
        var formula = await _context.PayrollFormulas.FindAsync(dto.FormulaId);
        if (formula == null) throw new Exception("Formula not found");

        var staffs = await _context.Staffs.Include(s => s.User).ToListAsync();
        int calculatedCount = 0;

        foreach (var staff in staffs)
        {
            // Check existing
            var existing = await _context.PayrollRecords
                .FirstOrDefaultAsync(r => r.StaffId == staff.UserId && r.PeriodMonth == dto.Month && r.PeriodYear == dto.Year);

            if (existing != null)
            {
                if (existing.Status != PayrollStatus.Draft) continue; // Skip approved/paid
                _context.PayrollRecords.Remove(existing);
            }

            decimal baseSalary = staff.BaseSalary ?? formula.DefaultBaseSalary;
            decimal sessionCommission = 0;
            decimal kpiBonus = 0;
            decimal salesCommission = 0;
            int sessions = 0;

            if (staff.Position == StaffPosition.PT || staff.Position == StaffPosition.HeadPT)
            {
                sessions = await _context.ClassBookings
                    .Include(b => b.Class)
                    .CountAsync(b =>
                        b.Class.TrainerStaffId == staff.UserId &&
                        b.Status == BookingStatus.Attended &&
                        b.Class.Date.Month == dto.Month &&
                        b.Class.Date.Year == dto.Year);

                sessionCommission = sessions * formula.CommissionPerSession;
                kpiBonus = sessions >= formula.KpiSessionThreshold ? formula.KpiBonus : 0m;
            }

            if (staff.Position == StaffPosition.Sales)
            {
                salesCommission = await _context.Commissions
                    .Where(c => c.StaffId == staff.UserId &&
                                c.CreatedAt.Month == dto.Month &&
                                c.CreatedAt.Year == dto.Year &&
                                c.Status == CommissionStatus.Approved)
                    .SumAsync(c => c.Amount);
            }

            var record = new PayrollRecord
            {
                PayrollId = Guid.NewGuid(),
                StaffId = staff.UserId,
                FormulaId = formula.FormulaId,
                PeriodMonth = dto.Month,
                PeriodYear = dto.Year,
                BaseSalary = baseSalary,
                SessionCount = sessions,
                SessionCommission = sessionCommission,
                KpiBonus = kpiBonus,
                SalesCommission = salesCommission,
                TotalSalary = baseSalary + sessionCommission + kpiBonus + salesCommission,
                Status = PayrollStatus.Draft,
                CalculatedAt = DateTime.UtcNow
            };

            _context.PayrollRecords.Add(record);
            calculatedCount++;
        }

        await _context.SaveChangesAsync();
        return calculatedCount;
    }

    public async Task<List<PayrollRecordDto>> GetPayrollReportAsync(int? month, int? year, Guid? branchId, Guid? staffId, string? position)
    {
        var query = _context.PayrollRecords
            .Include(r => r.Staff).ThenInclude(s => s.User)
            .Include(r => r.Formula)
            .AsQueryable();

        if (month.HasValue) query = query.Where(r => r.PeriodMonth == month.Value);
        if (year.HasValue) query = query.Where(r => r.PeriodYear == year.Value);
        if (branchId.HasValue) query = query.Where(r => r.Staff.BranchId == branchId.Value);
        if (staffId.HasValue) query = query.Where(r => r.StaffId == staffId.Value);

        if (!string.IsNullOrEmpty(position) && Enum.TryParse<StaffPosition>(position, out var pos))
        {
            query = query.Where(r => r.Staff.Position == pos);
        }

        return await query.ProjectTo<PayrollRecordDto>(_mapper.ConfigurationProvider).ToListAsync();
    }

    public async Task<List<PayrollRecordDto>> GetMyPayrollAsync(Guid staffUserId, int? month, int? year)
    {
        var query = _context.PayrollRecords
            .Include(r => r.Staff).ThenInclude(s => s.User)
            .Include(r => r.Formula)
            .Where(r => r.StaffId == staffUserId);

        if (month.HasValue) query = query.Where(r => r.PeriodMonth == month.Value);
        if (year.HasValue) query = query.Where(r => r.PeriodYear == year.Value);

        return await query.OrderByDescending(r => r.PeriodYear).ThenByDescending(r => r.PeriodMonth)
            .ProjectTo<PayrollRecordDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<int> ApprovePeriodAsync(ApprovePayrollPeriodDto dto, Guid approverId)
    {
        var records = await _context.PayrollRecords
            .Include(r => r.Staff)
            .Where(r => r.PeriodMonth == dto.Month &&
                        r.PeriodYear == dto.Year &&
                        r.Status == PayrollStatus.Draft &&
                        (!dto.BranchId.HasValue || r.Staff.BranchId == dto.BranchId.Value))
            .ToListAsync();

        if (!records.Any()) return 0;

        var staffIds = new List<Guid>();
        foreach (var record in records)
        {
            record.Status = PayrollStatus.Approved;
            record.ApprovedAt = DateTime.UtcNow;
            record.ApprovedByUserId = approverId;
            staffIds.Add(record.StaffId);
        }

        await _notificationService.SendAsync(
            title: $"Lương tháng {dto.Month}/{dto.Year} đã được duyệt",
            message: $"Bảng lương kỳ {dto.Month}/{dto.Year} của bạn đã được quản lý phê duyệt.",
            recipientIds: staffIds,
            type: NotificationType.Payroll);

        await _context.SaveChangesAsync();
        return records.Count;
    }

    public async Task<string> ExportPayrollCsvAsync(int month, int year, Guid? branchId)
    {
        var records = await GetPayrollReportAsync(month, year, branchId, null, null);

        var sb = new StringBuilder();
        sb.AppendLine("StaffId,StaffName,Position,PeriodMonth,PeriodYear,BaseSalary,SessionCount,SessionCommission,KpiBonus,SalesCommission,TotalSalary,Status");

        foreach (var r in records)
        {
            sb.AppendLine($"{r.StaffId},\"{r.StaffName}\",{r.Position},{r.PeriodMonth},{r.PeriodYear},{r.BaseSalary},{r.SessionCount},{r.SessionCommission},{r.KpiBonus},{r.SalesCommission},{r.TotalSalary},{r.Status}");
        }

        return sb.ToString();
    }
}
