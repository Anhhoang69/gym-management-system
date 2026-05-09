namespace backend.Models;
using backend.Enums;
public class Staff
{
    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    public Guid BranchId { get; set; }
    public Branch Branch { get; set; } = null!;

    public StaffPosition Position { get; set; }

    // Tỷ lệ hoa hồng (%), null = dùng mặc định 5%
    public decimal? CommissionRate { get; set; }

    // Lương cơ bản (VND/tháng), null = dùng DefaultBaseSalary từ PayrollFormula
    public decimal? BaseSalary { get; set; }

    public PTProfile? PTProfile { get; set; }

    public ICollection<Class> TeachingClasses { get; set; } = new List<Class>();
}