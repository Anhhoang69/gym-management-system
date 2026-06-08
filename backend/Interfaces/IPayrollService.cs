using backend.DTOs.Payroll;
using backend.Enums;
using backend.Helpers;

namespace backend.Interfaces;

public interface IPayrollService
{
    // Formula
    Task<List<PayrollFormulaDto>> GetFormulasAsync();
    Task<Guid> CreateFormulaAsync(CreatePayrollFormulaDto dto, Guid callerUserId);
    Task<bool> SetActiveFormulaAsync(Guid formulaId);

    // Calculation & Reporting
    Task<int> CalculatePayrollAsync(CalculatePayrollDto dto);
    Task<List<PayrollRecordDto>> GetPayrollReportAsync(int? month, int? year, Guid? branchId, Guid? staffId, string? position, PayrollStatus? status);
    Task<PagedResult<PayrollRecordDto>> GetPagedPayrollReportAsync(int? month, int? year, Guid? branchId, Guid? staffId, string? position, PayrollStatus? status, int page, int pageSize);
    Task<List<PayrollRecordDto>> GetMyPayrollAsync(Guid staffUserId, int? month, int? year);

    // Approval
    Task<int> ApprovePeriodAsync(ApprovePayrollPeriodDto dto, Guid approverId);

    // Export
    Task<string> ExportPayrollCsvAsync(int month, int year, Guid? branchId);
}
