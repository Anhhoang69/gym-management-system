namespace backend.DTOs.Payroll;

using backend.Enums;

public class PayrollFormulaDto
{
    public Guid FormulaId { get; set; }
    public string Name { get; set; } = null!;
    public decimal DefaultBaseSalary { get; set; }
    public decimal CommissionPerSession { get; set; }
    public int KpiSessionThreshold { get; set; }
    public decimal KpiBonus { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreatePayrollFormulaDto
{
    public string Name { get; set; } = null!;
    public decimal DefaultBaseSalary { get; set; }
    public decimal CommissionPerSession { get; set; }
    public int KpiSessionThreshold { get; set; }
    public decimal KpiBonus { get; set; }
}

public class PayrollRecordDto
{
    public Guid PayrollId { get; set; }
    public Guid StaffId { get; set; }
    public string StaffName { get; set; } = null!;
    public string Position { get; set; } = null!;
    public Guid FormulaId { get; set; }
    public string FormulaName { get; set; } = null!;
    public int PeriodMonth { get; set; }
    public int PeriodYear { get; set; }
    public decimal BaseSalary { get; set; }
    public int SessionCount { get; set; }
    public decimal SessionCommission { get; set; }
    public decimal KpiBonus { get; set; }
    public decimal SalesCommission { get; set; }
    public decimal TotalSalary { get; set; }
    public PayrollStatus Status { get; set; }
    public string? Note { get; set; }
    public DateTime CalculatedAt { get; set; }
    public DateTime? ApprovedAt { get; set; }
}

public class CalculatePayrollDto
{
    public int Month { get; set; }
    public int Year { get; set; }
    public Guid FormulaId { get; set; }
}

public class ApprovePayrollPeriodDto
{
    public int Month { get; set; }
    public int Year { get; set; }
    public Guid? BranchId { get; set; }
}
