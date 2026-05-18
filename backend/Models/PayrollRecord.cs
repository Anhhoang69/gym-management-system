namespace backend.Models;

using backend.Enums;

public class PayrollRecord
{
    public Guid PayrollId { get; set; }

    /// <summary>Staff bất kỳ (PT, Sales, Receptionist, ...)</summary>
    public Guid StaffId { get; set; }

    public Guid FormulaId { get; set; }

    public int PeriodMonth { get; set; }   // 1–12

    public int PeriodYear { get; set; }

    public decimal BaseSalary { get; set; }

    // PT / HeadPT specific
    public int SessionCount { get; set; }          // Số buổi dạy đã Attended

    public decimal SessionCommission { get; set; } // SessionCount × CommissionPerSession

    public decimal KpiBonus { get; set; }          // 0 hoặc formula.KpiBonus

    // Sales specific
    public decimal SalesCommission { get; set; }   // SUM(Commission.Amount) trong kỳ

    public decimal TotalSalary { get; set; }       // Base + Session + Kpi + Sales

    public PayrollStatus Status { get; set; } = PayrollStatus.Draft;

    public string? Note { get; set; }

    public DateTime CalculatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ApprovedAt { get; set; }

    public Guid? ApprovedByUserId { get; set; }

    // Navigation
    public Staff Staff { get; set; } = null!;

    public PayrollFormula Formula { get; set; } = null!;

    public User? ApprovedBy { get; set; }
}
