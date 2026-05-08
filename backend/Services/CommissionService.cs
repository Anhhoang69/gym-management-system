using backend.Data;
using backend.Enums;
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
            StaffId = contract.StaffId,
            ContractId = contract.ContractId,
            InvoiceId = contract.Invoice.InvoiceId,
            Percent = rate,
            Amount = contract.Invoice.TotalAmount * (rate / 100),
            Status = CommissionStatus.Approved,
            CreatedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();
    }
}
