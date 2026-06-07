# 💼 Payroll — Tính lương nhân viên

> **File liên quan:** `PayrollController.cs`, `PayrollService.cs`, `PayrollFormula.cs`, `PayrollRecord.cs`

---

## 1. Tổng quan module

Module tính lương nhân viên tự động dựa trên công thức cấu hình. Hỗ trợ:
- Lương cơ bản (base salary per staff hoặc default)
- Commission buổi dạy (PT/HeadPT)
- KPI bonus khi vượt ngưỡng session
- Commission hoa hồng Sales (từ contract activation)

---

## 2. Công thức tính lương

```
TotalSalary = BaseSalary + SessionCommission + KpiBonus + SalesCommission

Trong đó:
- BaseSalary        = staff.BaseSalary ?? formula.DefaultBaseSalary
- SessionCommission = sessions * formula.CommissionPerSession    (PT only)
- KpiBonus          = sessions >= formula.KpiSessionThreshold ? formula.KpiBonus : 0  (PT only)
- SalesCommission   = sum(Commissions.Amount where Approved, trong kỳ)  (Sales only)
```

### PayrollFormula fields
```
DefaultBaseSalary       decimal (lương cơ bản mặc định nếu staff không có BaseSalary riêng)
CommissionPerSession    decimal (ví dụ: 50,000 VND/buổi)
KpiSessionThreshold     int (ví dụ: 30 buổi/tháng → đạt KPI)
KpiBonus                decimal (ví dụ: 500,000 VND khi đạt KPI)
IsActive                bool (chỉ 1 formula active tại 1 thời điểm)
```

---

## 3. Các endpoint chính

### POST /api/payroll/formula (create)
```
Input:  { name, defaultBaseSalary, commissionPerSession, kpiSessionThreshold, kpiBonus }
Auth:   SuperAdmin | GymOwner
```
Tạo formula mới, auto deactivate formula cũ.

### POST /api/payroll/calculate
```
Input:  { month, year, formulaId? }
Auth:   SuperAdmin | GymOwner | BranchAdmin
```
Tính lương cho tất cả staff trong kỳ. Overwrite Draft records, skip Approved/Paid.

### GET /api/payroll/report
```
Query: month, year, branchId?, staffId?, position?
Auth:  SuperAdmin | GymOwner | BranchAdmin
```

### GET /api/payroll/my
```
Auth:  Staff (tự xem lương mình)
```

### POST /api/payroll/approve
```
Input:  { month, year, branchId? }
Auth:   SuperAdmin | GymOwner | BranchAdmin
```
Approve tất cả Draft records trong kỳ → Status = Approved → gửi notification.

### GET /api/payroll/export/csv
```
Output: CSV file
Auth:   Admin roles
```

---

## 4. Business Logic

### Calculate Payroll
```csharp
foreach (var staff in staffs)
{
    // Bỏ qua nếu đã Approved/Paid (chỉ overwrite Draft)
    if (existing?.Status != PayrollStatus.Draft) continue;

    decimal baseSalary = staff.BaseSalary ?? formula.DefaultBaseSalary;

    if (staff.Position == StaffPosition.PT || staff.Position == StaffPosition.HeadPT)
    {
        // Đếm buổi dạy đã có người tham gia (Attended)
        sessions = await _context.ClassBookings
            .CountAsync(b => b.Class.TrainerStaffId == staff.UserId
                          && b.Status == BookingStatus.Attended
                          && b.Class.Date.Month == dto.Month
                          && b.Class.Date.Year == dto.Year);

        sessionCommission = sessions * formula.CommissionPerSession;
        kpiBonus = sessions >= formula.KpiSessionThreshold ? formula.KpiBonus : 0m;
    }

    if (staff.Position == StaffPosition.Sales)
    {
        salesCommission = await _context.Commissions
            .Where(c => c.StaffId == staff.UserId
                     && c.CreatedAt.Month == dto.Month
                     && c.Status == CommissionStatus.Approved)
            .SumAsync(c => c.Amount);
    }

    record.TotalSalary = baseSalary + sessionCommission + kpiBonus + salesCommission;
}
```

### Approve → Send Notification
```csharp
await _notificationService.SendAsync(
    title: $"Lương tháng {dto.Month}/{dto.Year} đã được duyệt",
    message: $"Bảng lương kỳ {dto.Month}/{dto.Year} của bạn đã được quản lý phê duyệt.",
    recipientIds: staffIds, // Tất cả staff có payroll trong kỳ
    type: NotificationType.Payroll);
```

---

## 5. Database

```
PayrollFormulas
├── FormulaId             Guid PK
├── Name                  string
├── DefaultBaseSalary     decimal
├── CommissionPerSession  decimal
├── KpiSessionThreshold   int
├── KpiBonus              decimal
├── IsActive              bool
├── CreatedByUserId       Guid FK → Users
└── CreatedAt             DateTime

PayrollRecords
├── PayrollId       Guid PK
├── StaffId         Guid FK → Staffs
├── FormulaId       Guid FK → PayrollFormulas
├── PeriodMonth     int
├── PeriodYear      int
├── BaseSalary      decimal
├── SessionCount    int
├── SessionCommission decimal
├── KpiBonus        decimal
├── SalesCommission decimal
├── TotalSalary     decimal
├── Status          PayrollStatus (Draft | Approved | Paid)
├── CalculatedAt    DateTime
├── ApprovedAt      DateTime?
└── ApprovedByUserId Guid? FK → Users

UNIQUE INDEX: (StaffId, PeriodMonth, PeriodYear) — 1 record/staff/kỳ
```

---

## 6. Câu hỏi phản biện thường gặp

**Q: Tại sao chỉ có 1 PayrollFormula active?**
> Đơn giản hóa: tất cả staff dùng cùng 1 công thức tại 1 thời điểm. Nếu cần: thêm `FormulaId` vào `Staff` để mỗi staff có công thức riêng.

**Q: Tại sao tính sessions từ ClassBookings.Attended thay vì Classes?**
> Session commission phải tính thực tế — chỉ tính buổi có người tham gia. Nếu lớp dạy mà không ai attend → không nhận commission. Fairness và accuracy cao hơn.

**Q: Payroll Status Paid có nghĩa gì?**
> Draft = mới tính. Approved = manager duyệt. Paid = đã chuyển khoản. Paid cần thêm implementation (update Status + lưu thời gian chi trả).

**Q: Nếu tính lương nhầm thì sao?**
> Chỉ overwrite Draft. Approved/Paid records không bị ảnh hưởng. Admin cần un-approve trước rồi tính lại (chưa implement endpoint un-approve).

**Q: Commission của Sales được tính như thế nào?**
> 5% của DealPrice (hard-coded trong CommissionService). Commission record được tạo khi activate contract. Trạng thái Pending → Admin approve → tính vào payroll tháng đó.
