using backend.Data;
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

        decimal rate = staff.CommissionRate ?? 5; // 5% default

        var commission = new Commission
        {
            CommissionId = Guid.NewGuid(),
            StaffId = contract.StaffId,
            ContractId = contract.ContractId,
            InvoiceId = contract.Invoice.InvoiceId,
            Percent = rate,
            Amount = contract.Invoice.TotalAmount * (rate / 100),
            CreatedAt = DateTime.UtcNow
        };

        _context.Commissions.Add(commission);
        await _context.SaveChangesAsync();
    }
}
