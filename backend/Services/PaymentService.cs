using backend.Data;
using backend.DTOs.Payment;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class PaymentService : IPaymentService
{
    private readonly ApplicationDbContext _context;

    public PaymentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<PaymentListDto>> GetPaymentsAsync(PaymentQueryDto query, Guid staffId)
    {
        await EnsureAdminPermissionAsync(staffId);

        var q = _context.Payments
            .Include(p => p.Invoice)
                .ThenInclude(i => i.Member)
                    .ThenInclude(m => m.User)
            .Include(p => p.ProcessedByStaff)
                .ThenInclude(s => s.User)
            .AsQueryable();

        if (query.Method.HasValue)
            q = q.Where(p => p.Method == query.Method.Value);

        if (query.InvoiceId.HasValue)
            q = q.Where(p => p.InvoiceId == query.InvoiceId.Value);

        if (query.StaffId.HasValue)
            q = q.Where(p => p.ProcessedByStaffId == query.StaffId.Value);

        if (query.BranchId.HasValue)
            q = q.Where(p => p.ProcessedByStaff.BranchId == query.BranchId.Value);

        if (query.FromDate.HasValue)
            q = q.Where(p => p.CreatedAt >= query.FromDate.Value);

        if (query.ToDate.HasValue)
            q = q.Where(p => p.CreatedAt <= query.ToDate.Value);

        var total = await q.CountAsync();

        var items = await q.OrderByDescending(p => p.CreatedAt)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(p => new PaymentListDto
            {
                PaymentId = p.PaymentId,
                InvoiceId = p.InvoiceId,
                InvoiceCode = p.Invoice.InvoiceCode,
                MemberName = p.Invoice.Member.User.FullName ?? "Unknown",
                Method = p.Method,
                RefNo = p.RefNo,
                Amount = p.Amount,
                Status = p.Status,
                ProcessedByStaffName = p.ProcessedByStaff.User.FullName ?? "Unknown",
                CreatedAt = p.CreatedAt
            })
            .ToListAsync();

        return new PagedResult<PaymentListDto>(items, total, query.Page, query.PageSize);
    }

    private async Task EnsureAdminPermissionAsync(Guid staffUserId)
    {
        var hasPermission = await _context.Staffs
            .AsNoTracking()
            .AnyAsync(s => s.UserId == staffUserId &&
                          (s.Position == StaffPosition.BranchAdmin ||
                           s.Position == StaffPosition.Receptionist));

        if (hasPermission) return;

        var isSuperOrOwner = await _context.UserRoles
            .AsNoTracking()
            .AnyAsync(ur => ur.UserId == staffUserId &&
                           _context.Roles.Any(r => r.Id == ur.RoleId &&
                               (r.Name == "SuperAdmin" || r.Name == "GymOwner")));

        if (!isSuperOrOwner)
            throw new Exception("You do not have permission to view payments (requires Receptionist, BranchAdmin, GymOwner or SuperAdmin)");
    }
}
