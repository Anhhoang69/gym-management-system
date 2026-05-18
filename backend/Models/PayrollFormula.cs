namespace backend.Models;

using backend.Enums;

public class PayrollFormula
{
    public Guid FormulaId { get; set; }

    /// <summary>Tên kỳ áp dụng, VD: "Formula T5/2025"</summary>
    public string Name { get; set; } = null!;

    /// <summary>Lương cơ bản mặc định (VND/tháng), override được ở Staff.BaseSalary</summary>
    public decimal DefaultBaseSalary { get; set; }

    /// <summary>Hoa hồng mỗi buổi dạy (PT/HeadPT)</summary>
    public decimal CommissionPerSession { get; set; }

    /// <summary>Số buổi tối thiểu để nhận KPI bonus</summary>
    public int KpiSessionThreshold { get; set; }

    /// <summary>Thưởng KPI (flat, VND)</summary>
    public decimal KpiBonus { get; set; }

    public bool IsActive { get; set; } = true;

    public Guid CreatedByUserId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation
    public User CreatedBy { get; set; } = null!;

    public ICollection<PayrollRecord> Records { get; set; } = new List<PayrollRecord>();
}
