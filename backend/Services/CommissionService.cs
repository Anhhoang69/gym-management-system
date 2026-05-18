using backend.Data;
using backend.DTOs.Commission;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class CommissionService : ICommissionService
{
    private readonly ApplicationDbContext _context;

    public CommissionService(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Ghi nhận hoa hồng khi hợp đồng được kích hoạt (Payment đã Paid).
    /// Status = Approved ngay — không cần approval workflow.
    /// </summary>
    public async Task RecordAsync(Guid contractId, Guid triggerStaffId)
    {
        var contract = await _context.Contracts
            .Include(c => c.Invoice)
            .FirstOrDefaultAsync(c => c.ContractId == contractId);

        if (contract == null || contract.Invoice == null)
            return;

        var staff = await _context.Staffs.FirstOrDefaultAsync(s => s.UserId == contract.StaffId);
        if (staff == null)
            return;

        decimal rate = staff.CommissionRate ?? 5m; // 5% default

        _context.Commissions.Add(new Commission
        {
            CommissionId = Guid.NewGuid(),
            StaffId = contract.StaffId.Value,
            ContractId = contract.ContractId,
            InvoiceId = contract.Invoice.InvoiceId,
            Percent = rate,
            Amount = contract.Invoice.TotalAmount * (rate / 100),
            Status = CommissionStatus.Approved,
            CreatedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();
    }

    public async Task<PagedResult<CommissionListDto>> GetMyCommissionsAsync(Guid staffId, int? month, int? year, int page, int pageSize)
    {
        var q = _context.Commissions
            .Include(c => c.Contract)
                .ThenInclude(ct => ct.Member)
                    .ThenInclude(m => m.User)
            .Include(c => c.Contract)
                .ThenInclude(ct => ct.Package)
            .Where(c => c.StaffId == staffId)
            .AsQueryable();

        if (month.HasValue)
            q = q.Where(c => c.CreatedAt.Month == month.Value);

        if (year.HasValue)
            q = q.Where(c => c.CreatedAt.Year == year.Value);

        var total = await q.CountAsync();

        var items = await q.OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new CommissionListDto
            {
                CommissionId = c.CommissionId,
                ContractId = c.ContractId,
                MemberName = c.Contract.Member.User.FullName ?? "Unknown",
                PackageName = c.Contract.Package.Name,
                Percent = c.Percent,
                Amount = c.Amount,
                Status = c.Status,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();

        return new PagedResult<CommissionListDto>(items, total, page, pageSize);
    }
}
