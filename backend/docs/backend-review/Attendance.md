# ✅ Attendance — Check-in / Check-out

> **File liên quan:** `AttendanceController.cs`, `AttendanceService.cs`, `Attendance.cs`, `AccessCard.cs`

---

## 1. Tổng quan module

Module quản lý điểm danh vào/ra phòng gym. Hội viên dùng **thẻ AccessCard** (physical card với CardCode) để check-in tại quầy lễ tân.

**Luồng:**
```
Hội viên quét/đưa thẻ tại quầy
    ↓
Receptionist nhập CardCode → POST /api/attendance/check-in
    ↓
Validate thẻ Active + Contract Active + Multi-branch policy
    ↓
Tạo Attendance record
    ↓
Hội viên tập xong → Check-out
```

---

## 2. Các endpoint chính

### POST /api/attendance/check-in
```
Input:  { cardNumber, branchId }
Output: AttendanceDto (memberName, branchName, checkinAt, ...)
Auth:   Staff
```
**Validation:**
1. AccessCard tồn tại và Status = Active
2. Có Contract Active chưa hết hạn
3. Nếu gói không cho multi-branch → phải check-in đúng branch đăng ký
4. Hôm nay chưa có check-in chưa checkout (prevent double check-in)

### POST /api/attendance/check-out
```
Input:  { cardNumber, branchId }
Output: AttendanceDto (với checkoutAt)
Auth:   Staff
```
Update `CheckoutAt` của attendance hiện tại.

### POST /api/attendance/manual-check-in
```
Input:  { memberUserId, branchId }
Auth:   Staff
```
Check-in thủ công (khi thẻ bị hỏng hoặc quên thẻ).

### GET /api/attendance/my
```
Auth:   Member (tự xem lịch sử của mình)
Output: List<AttendanceDto>
```

### GET /api/attendance/branch/{branchId}
```
Query: date?
Auth:  Staff
Output: List<AttendanceDto>
```

### GET /api/attendance/member/{memberId}
```
Auth:  Staff
Output: List<AttendanceDto>
```

---

## 3. Business Logic quan trọng

### Multi-branch Policy Check
```csharp
var homeBranchId = card.Member.User.InitialBranchId; // Branch đăng ký ban đầu
if (!activeContract.Package.PackagePolicy.AllowMultiBranch && homeBranchId != dto.BranchId)
    throw new Exception("Your package only allows check-in at your home branch");
```
**PackagePolicy.AllowMultiBranch:**
- `true` = gói Premium/Elite → vào bất kỳ chi nhánh nào
- `false` = gói Basic → chỉ chi nhánh gốc

### Double check-in prevention
```csharp
var existing = await _context.Attendances
    .OrderByDescending(a => a.CheckinAt)
    .FirstOrDefaultAsync(a => a.CardId == card.AccessCardId
                            && a.CheckinAt.Date == DateTime.UtcNow.Date);

if (existing != null && existing.CheckoutAt == null)
    throw new Exception("Already checked in");
// Cho phép check-in lần 2 trong ngày nếu lần 1 đã checkout
```

### Manual check-in (không cần thẻ)
```csharp
var cardId = member.AccessCard?.AccessCardId ?? Guid.Empty;
// Fallback if no card exists:
CardId = cardId != Guid.Empty ? cardId : Guid.NewGuid()
```
Manual check-in vẫn validate contract và multi-branch policy.

---

## 4. Database

```
Attendances
├── AttendanceId  Guid PK
├── MemberUserId  Guid FK → Members
├── CardId        Guid FK → AccessCards
├── BranchId      Guid FK → Branches
├── CheckinAt     DateTime
└── CheckoutAt    DateTime?

AccessCards
├── AccessCardId  Guid PK
├── MemberUserId  Guid FK → Members (unique - 1-1)
├── CardCode      string (unique - e.g. "GYM-A3F7B2")
├── Status        AccessCardStatus (Active | Inactive | Lost)
├── IssueDate     DateTime
└── ExpireDate    DateTime?

Packages → PackagePolicies (1-1)
├── PackageId         Guid PK
├── AllowMultiBranch  bool
├── FreezeAllowed     bool
├── MaxFreezeDays     int
└── AllowTransfer     bool
```

---

## 5. Câu hỏi phản biện thường gặp

**Q: Tại sao dùng CardCode thay vì MemberId để check-in?**
> Physical card scenario: reception không nhìn thấy DB, chỉ nhìn thẻ plastic. Nhập CardCode giống scan barcode/QR. Có thể upgrade lên QR code scan thay vì nhập tay.

**Q: Nếu hội viên mất thẻ thì sao?**
> Staff update AccessCard.Status = Lost → issue card mới với CardCode mới. Lịch sử check-in cũ vẫn giữ.

**Q: Tại sao cho phép check-in manual?**
> Tình huống thực tế: thẻ bị hỏng, quên thẻ, lần đầu đến chưa có thẻ. Manual check-in tránh block member vào gym.

**Q: Checkout có bắt buộc không?**
> Không enforce. Member có thể không checkout — attendance vẫn valid. CheckoutAt null nghĩa là chưa checkout hoặc quên. Dùng cho analytics về thời gian lưu lại gym (khi có checkout).

**Q: Multi-branch có ảnh hưởng đến class booking không?**
> Class booking không check multi-branch (chỉ check active contract + capacity). Chỉ check-in vật lý mới enforce multi-branch policy. Có thể là inconsistency cần fix.

**Q: Dữ liệu check-in dùng để làm gì ngoài điểm danh?**
> Reports module: Check-In Report by day/hour, peak analysis. KPI: CheckInsTodayTotal. AI context: frequency check-in để personalize AI advice.

**Q: AttendanceId là Guid tạo ra tốn nhiều không?**
> `Guid.NewGuid()` rất fast (~100ns). Performance không phải vấn đề. Lợi ích: globally unique, không cần sequence/identity.
