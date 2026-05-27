# 🗓️ Class Scheduling — Lịch lớp học & Booking

> **File liên quan:** `ClassController.cs`, `ClassService.cs`, `Class.cs`, `ClassBooking.cs`

---

## 1. Tổng quan module

Module quản lý lịch lớp học (group classes, PT sessions) và hệ thống booking của hội viên.

**Vai trò:**
- Staff tạo/quản lý lịch lớp
- Member đặt chỗ (booking), hủy booking
- PT xem danh sách học viên, ghi note session
- Check-in điểm danh lớp học
- Tracking session quota (PT sessions / Group sessions)

---

## 2. Các endpoint chính

### GET /api/classes/schedule
```
Query: startDate, endDate, date, roomId, trainerId, classType, status, branchId
Auth:  Any authenticated
```
**Business filter theo role:**
- PT staff: chỉ thấy lớp của mình (`TrainerStaffId == callerUserId`)
- Member: chỉ thấy lớp `Scheduled` hoặc lớp đã book
- Admin/BranchAdmin: thấy tất cả

### POST /api/classes
```
Input:  { title, date, startTime, endTime, classType, capacity, minCapacity, roomId, trainerStaffId }
Auth:   Staff (non-PT)
```
**Validation:**
- `capacity <= room.Capacity`
- Không conflict lịch trainer (cùng ngày, giờ chồng)
- Không conflict lịch phòng (cùng ngày, giờ chồng)

### POST /api/classes/{classId}/book
```
Auth:   Member
```
**Business logic:** Check active contract, quota, schedule conflict, capacity.

### DELETE /api/classes/{classId}/book
```
Input:  { cancelReason }
Auth:   Member
```
Hủy booking, chỉ khi status=Booked.

### POST /api/classes/{classId}/check-in/{memberUserId}
```
Auth:   Staff
```
Check-in member vào lớp, tăng `UsedGroupSessions`.

### GET /api/classes/{classId}/members
```
Auth:   Staff (PT chỉ thấy lớp của mình)
```

---

## 3. Business Logic quan trọng

### Conflict Check khi tạo lớp
```csharp
// Trainer conflict: cùng trainer, cùng ngày, thời gian chồng
var trainerConflict = await _context.Classes.AnyAsync(x =>
    x.TrainerStaffId == dto.TrainerStaffId &&
    x.Date == dto.Date &&
    x.StartTime < dto.EndTime &&   // Overlap check
    dto.StartTime < x.EndTime);    // (A starts before B ends AND B starts before A ends)

// Room conflict: tương tự
var roomConflict = await _context.Classes.AnyAsync(x =>
    x.RoomId == dto.RoomId &&
    x.Date == dto.Date &&
    x.StartTime < dto.EndTime &&
    dto.StartTime < x.EndTime);
```

### Booking Business Rules
```csharp
public async Task<bool> BookClassAsync(Guid classId, Guid memberUserId)
{
    // 1. Class phải ở trạng thái Scheduled
    if (@class.Status != ClassStatus.Scheduled)
        throw new Exception("Class is not available for booking");

    // 2. Member phải có active contract chưa hết hạn
    var activeContract = await _context.Contracts
        .Where(c => c.MemberUserId == memberUserId
                 && c.Status == ContractStatus.Active
                 && c.EndDate >= DateTime.UtcNow)
        .FirstOrDefaultAsync();
    if (activeContract == null)
        throw new Exception("No active membership found.");

    // 3. Kiểm tra quota group sessions (nếu có giới hạn)
    if (activeContract.TotalGroupSessions > 0 &&
        activeContract.UsedGroupSessions >= activeContract.TotalGroupSessions)
        throw new Exception("Group session quota exceeded.");

    // 4. Schedule conflict: member không có lớp khác cùng giờ
    var conflict = await _context.ClassBookings.Include(x => x.Class).AnyAsync(x =>
        x.MemberUserId == memberUserId &&
        x.Status == BookingStatus.Booked &&
        x.Class.Date == @class.Date &&
        x.Class.StartTime < @class.EndTime &&
        @class.StartTime < x.Class.EndTime);
    if (conflict) throw new Exception("Schedule conflict");

    // 5. Capacity check
    var bookedCount = await _context.ClassBookings
        .CountAsync(x => x.ClassId == classId && x.Status == BookingStatus.Booked);
    if (bookedCount >= @class.Capacity)
        throw new Exception("Class is full");

    // 6. Idempotent: nếu đã book rồi → return true (không error)
    // Nếu đã book mà bị cancel → reactivate
}
```

### Check-In → Tăng UsedGroupSessions
```csharp
public async Task<bool> ClassCheckInAsync(Guid classId, Guid memberUserId, Guid callerUserId)
{
    booking.Status = BookingStatus.Attended;
    booking.CheckedInAt = DateTime.UtcNow;

    // Tự động tăng counter session đã dùng
    var contract = await _context.Contracts.FirstOrDefaultAsync(
        c => c.MemberUserId == memberUserId && c.Status == ContractStatus.Active);
    if (contract != null) contract.UsedGroupSessions++;

    await _context.SaveChangesAsync();
}
```

### PT-only data visibility
```csharp
// Chỉ PT trainer của lớp mới thấy danh sách học viên
if (staff.Position == StaffPosition.PT && @class.TrainerStaffId != callerUserId)
    throw new UnauthorizedAccessException("You are not the trainer of this class");

// Xem training history của member: PT chỉ xem member đã học lớp của mình
var hasSharedClass = await _context.ClassBookings.AnyAsync(
    b => b.MemberUserId == memberUserId && b.Class.TrainerStaffId == callerUserId);
if (!hasSharedClass) throw new UnauthorizedAccessException(...);
```

---

## 4. Database liên quan

```
Classes
├── ClassId         Guid PK
├── Title           string
├── Description     string?
├── Date            DateOnly
├── StartTime       TimeOnly
├── EndTime         TimeOnly
├── ClassType       ClassType (GroupClass | PersonalTraining | Yoga | Pilates...)
├── Status          ClassStatus (Scheduled | Completed | Cancelled)
├── Capacity        int (max members)
├── MinCapacity     int (min để lớp khai giảng)
├── RoomId          Guid FK → Rooms
└── TrainerStaffId  Guid FK → Staffs

ClassBookings (N-N: Member <-> Class, composite PK)
├── MemberUserId    Guid FK → Members
├── ClassId         Guid FK → Classes
├── Status          BookingStatus (Booked | Attended | Cancelled)
├── BookedAt        DateTime
├── CheckedInAt     DateTime?
├── CancelReason    string?
├── CancelledAt     DateTime?
└── SessionNote     string? (PT ghi note về buổi tập)
```

**Quan hệ:**
- `Class.Trainer` → `Staff` (nhiều lớp / 1 trainer) — `OnDelete: Restrict`
- `ClassBooking` composite PK `(MemberUserId, ClassId)` — 1 member/1 lớp chỉ 1 booking

---

## 5. Enums

```csharp
enum ClassType { GroupClass, PersonalTraining, Yoga, Pilates, Cardio, Strength }
enum ClassStatus { Scheduled, Completed, Cancelled }
enum BookingStatus { Booked, Attended, Cancelled }
```

---

## 6. Câu hỏi phản biện thường gặp

**Q: Nếu nhiều user cùng book lớp cuối cùng thì xử lý thế nào?**
> Check capacity ngay trước insert. EF Core `SaveChangesAsync()` atomic trong 1 request. Race condition có thể xảy ra nếu 2 request đến đồng thời. Production solution: thêm `[ConcurrencyCheck]` hoặc `SELECT FOR UPDATE` (PostgreSQL), hoặc `IsolationLevel.Serializable`. Trong scope đồ án, xác suất thấp và acceptable.

**Q: Tại sao không cho phép hủy booking sát giờ học?**
> Hiện tại không có time-based cancellation restriction. Production: thêm rule "không hủy trong vòng 2 giờ trước giờ học". Check `@class.Date` + `@class.StartTime` vs `DateTime.UtcNow`.

**Q: MinCapacity dùng để làm gì?**
> Nếu số booking < MinCapacity trước giờ học, lớp có thể bị hủy. Logic auto-cancel chưa implement (cần background job). Hiện lưu data để staff tham khảo.

**Q: PT session và Group session quota khác nhau thế nào?**
> `TotalPrivateSessions` = số buổi 1-1 với PT (trong `Contract`). `TotalGroupSessions` = số buổi lớp nhóm. Mỗi lần check-in group class → tăng `UsedGroupSessions`. Quota = 0 nghĩa là không giới hạn.

**Q: Tại sao Session Note lưu ở ClassBooking thay vì bảng riêng?**
> Note là per-booking (mỗi member trong mỗi lớp có note riêng). Lưu ở ClassBooking là semantic đúng — note gắn liền với buổi tập cụ thể.

**Q: Overlap detection algorithm hoạt động như thế nào?**
> Interval overlap: A và B overlap khi `A.Start < B.End AND B.Start < A.End`. Đây là standard algorithm. Cần đảm bảo cả Date và Time cùng match.

**Q: ClassType có ảnh hưởng gì đến business logic?**
> Trong Reports: phân biệt `PersonalTraining` vs group classes cho PT performance report. Booking logic hiện không phân biệt (check quota group sessions bất kể ClassType). Có thể extend để private sessions trừ `UsedPrivateSessions`.
