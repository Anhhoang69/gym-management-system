# 📋 Contract Management — Hợp đồng hội viên

> **File liên quan:** `ContractController.cs`, `ContractService.cs`, `ContractDraft.cs`, `Contract.cs`, `InvoiceService.cs`

---

## 1. Tổng quan module

Contract Management là **module trung tâm** của hệ thống — kết nối Lead → Member → Invoice → Payment → Activation. Một hợp đồng (contract) đại diện cho một gói tập mà member đã ký kết.

**Vai trò:**
- Quản lý vòng đời hợp đồng: Draft → Pending → Active → Expired/Cancelled
- Tính giá với khuyến mãi (Promotions)
- Kích hoạt membership sau thanh toán
- Gửi email xác nhận activation

**Luồng nghiệp vụ chính:**
```
Staff tạo Draft
    ↓
Preview giá (với/không promotion)
    ↓
Generate Contract (Pending)
    ↓
Issue Invoice (Pending)
    ↓
Collect Payment → Invoice = Paid
    ↓
Activate Contract → Status = Active
    ↓
Tạo/Update AccessCard + Gửi email
    ↓
Record Commission cho Staff
```

---

## 2. Các endpoint chính

### POST /api/contracts/draft/create
```
Input:  { memberId, packageId, pricingId, promotionIds[], startDate, note }
Output: ContractDraftPreviewDto (giá, ngày, promotions áp dụng)
Auth:   Staff (Sales | Receptionist | BranchAdmin | SuperAdmin)
```
**Business:** Tính discount từ promotions (% hoặc fixed), tạo draft có hiệu lực 24h.

### GET /api/contracts/draft/{draftId}
```
Output: ContractDraftPreviewDto
Auth:   Staff roles
```
Check draft còn valid (chưa dùng, chưa expire).

### POST /api/contracts/generate
```
Input:  { draftId }
Output: ContractDto (status=Pending)
Auth:   Staff roles
```
Từ Draft → Contract thật. Tăng `CurrentUsage` của promotions. Đánh dấu Draft `IsUsed=true`.

### POST /api/contracts/{contractId}/activate
```
Input:  (none, chỉ contractId)
Output: { cardCode }
Auth:   Staff roles
```
**Business logic quan trọng nhất:**
1. Check contract status = Pending
2. Check invoice status = Paid
3. Set contract.Status = Active
4. Create/Update AccessCard (Active)
5. Record commission
6. Gửi email membership activated

### GET /api/contracts (with filters)
```
Query: memberId, branchId, status, fromDate, toDate, page, pageSize
Auth:  Staff roles
```

### PUT /api/contracts/{contractId}
```
Input: { startDate, note }
Auth:  Staff roles
```
Chỉ cho update khi contract ở Pending status.

### POST /api/contracts/{contractId}/cancel
```
Auth:  Staff roles
```
Hủy contract, deactivate AccessCard, ghi AuditLog.

---

## 3. Business Logic quan trọng

### Tại sao phải có Draft trước khi Generate Contract?
Draft là bước **preview & confirm** trước khi tạo contract thật. Staff có thể:
- Preview giá sau promotion
- Sửa startDate
- Cancel nếu member đổi ý

Draft hết hạn sau **24 giờ** — tránh draft tồn tại vô hạn làm rác DB.

### Promotion calculation
```csharp
foreach (var promo in promotions)
{
    // Kiểm tra 4 điều kiện:
    if (promo.StartDate > DateTime.UtcNow || promo.EndDate < DateTime.UtcNow) continue; // Còn hạn?
    if (promo.ApplicablePackageId.HasValue && promo.ApplicablePackageId != package.PackageId) continue; // Đúng gói?
    if (promo.CurrentUsage >= promo.MaxUsage) continue; // Còn slot?

    if (promo.DiscountType == DiscountType.Percentage)
        currentDiscount = originalPrice * (promo.DiscountValue / 100);
    else // FixedAmount
        currentDiscount = promo.DiscountValue;

    discountAmount += currentDiscount; // Stack promotions được!
}
if (discountAmount > originalPrice) discountAmount = originalPrice; // Không âm tiền
```

### Tại sao Contract phải Pending trước khi Paid?
```csharp
// ActivateMembershipAsync()
if (contract.Status != ContractStatus.Pending)
    throw new Exception("Contract is not in Pending status");

if (contract.Invoice == null || contract.Invoice.Status != InvoiceStatus.Paid)
    throw new Exception("Invoice is not Paid. Cannot activate membership.");
```
**Reasoning:** Đảm bảo business flow nghiêm ngặt. Không thể activate nếu chưa thu tiền. Tránh "free membership" do lỗi operator.

### AccessCard lifecycle khi Activate
```csharp
var card = contract.Member.AccessCard;
if (card == null)
{
    // Tạo mới AccessCard
    code = RegistrationService.GenerateCardCode(contract.MemberUserId);
    card = new AccessCard { Status = AccessCardStatus.Active, ExpireDate = contract.EndDate };
}
else
{
    // Reuse card cũ (renew) — update ExpireDate
    card.Status = AccessCardStatus.Active;
    card.ExpireDate = contract.EndDate;
}
```

### EnsureC2PermissionAsync — Service-level authorization
```csharp
private async Task EnsureC2PermissionAsync(Guid staffUserId)
{
    // Check Staff position trong DB (không chỉ rely vào JWT role)
    var hasPermission = await _context.Staffs.AnyAsync(s =>
        s.UserId == staffUserId &&
        (s.Position == StaffPosition.Sales ||
         s.Position == StaffPosition.Receptionist ||
         s.Position == StaffPosition.BranchAdmin));

    if (hasPermission) return;

    // SuperAdmin bypass
    var isAdmin = await _context.UserRoles.AnyAsync(...r.Name == "SuperAdmin"...);
    if (!isAdmin) throw new Exception("Permission denied...");
}
```
**Tại sao check ở Service thay vì Controller?** Controller chỉ check role `Staff` (bất kỳ staff). Service check position cụ thể (Sales/Receptionist/BranchAdmin). PT không được quản lý hợp đồng.

---

## 4. Database liên quan

```
ContractDrafts
├── DraftId (PK)
├── CreatedByStaffId → Staffs
├── MemberUserId → Members (nullable — draft chưa chọn member)
├── PackageId → Packages
├── PricingId → PackagePricings
├── PromotionIdsJson (JSON array of Guid)
├── OriginalPrice, DiscountAmount, DealPrice
├── StartDate, ExpiresAt (24h sau tạo)
└── IsUsed (true sau khi generate)

Contracts
├── ContractId (PK)
├── MemberUserId → Members
├── PackageId → Packages
├── StaffId → Staffs (người tạo)
├── Status (Pending/Active/Expired/Cancelled)
├── OriginalPrice, DiscountAmount, DealPrice
├── StartDate, EndDate
├── TotalPrivateSessions, UsedPrivateSessions
├── TotalGroupSessions, UsedGroupSessions
└── Note, CreatedAt, UpdatedAt

ContractPromotions (N-N)
├── ContractId → Contracts
└── PromotionId → Promotions

ContractAdjusts (extend/upgrade)
├── ContractAdjustId (PK)
├── ContractId → Contracts
├── ActionType (Extend/Upgrade/Downgrade)
└── ...
```

---

## 5. Luồng xử lý thực tế

```
[Staff] Frontend → POST /api/contracts/draft/create
    ↓
ContractController.CreateDraft() [Auth: Staff]
    ↓
ContractService.CreateDraftAsync(dto, staffId)
    ↓
1. EnsureC2PermissionAsync(staffId)
   → check Staffs table: position in {Sales, Receptionist, BranchAdmin}
    ↓
2. Load Package + Pricings từ DB
    ↓
3. Calculate discount từ valid Promotions
    ↓
4. Save ContractDraft (ExpiresAt = Now + 24h)
    ↓
5. Return ContractDraftPreviewDto

--- Sau khi review ---

[Staff] POST /api/contracts/generate { draftId }
    ↓
ContractService.GenerateContractAsync()
    ↓
1. Load Draft (chưa used, chưa expire)
2. Tạo Contract (Status=Pending)
3. Tăng CurrentUsage của promotions
4. Mark Draft IsUsed=true
5. Save + Return ContractDto

--- Thu tiền ---

POST /api/invoices/{id}/payment
    ↓
InvoiceService.CollectPaymentAsync() → Invoice.Status = Paid

--- Kích hoạt ---

POST /api/contracts/{id}/activate
    ↓
1. Check contract.Status == Pending ✓
2. Check invoice.Status == Paid ✓
3. contract.Status = Active
4. AccessCard.Status = Active, ExpireDate = contract.EndDate
5. CommissionService.RecordAsync()
6. Email: SendMembershipActivatedAsync()
```

---

## 6. Câu hỏi phản biện thường gặp

**Q: Tại sao cần Draft? Sao không tạo Contract luôn?**
> Draft là bước xác nhận trước khi commit. Staff có thể review giá, sửa ngày, hoặc hủy mà không ảnh hưởng dữ liệu thật. Tương tự "shopping cart" trước khi checkout. Draft tự expire sau 24h, không làm rác DB lâu dài.

**Q: Nếu payment fail giữa chừng thì sao?**
> Contract vẫn ở Pending, Invoice vẫn ở Pending. Staff có thể thử collect payment lại. Nếu cần hủy: cancel contract, cancel invoice. EF Core `SaveChangesAsync()` là atomic — không có partial commit.

**Q: Stack nhiều promotion có bị lạm dụng không?**
> Có check: promotion phải Active, còn hạn, đúng gói, còn slot. Nếu muốn giới hạn stack: thêm logic "chỉ áp 1 promotion/contract". Hiện tại cho stack để flexible hơn cho business.

**Q: Tại sao không dùng transaction khi activate?**
> `SaveChangesAsync()` trong EF Core wrap tất cả changes trong 1 DB transaction tự động. Commission và Email được gọi trong `try/catch` riêng — lỗi email không rollback activation (intentional design).

**Q: Khi nào contract tự động Expired?**
> Hiện tại không có background job auto-expire. Status check dựa vào `EndDate`. Để implement: cần Hangfire/Quartz background job chạy mỗi đêm update status. Trong scope hiện tại, query filter theo `EndDate >= DateTime.UtcNow`.

**Q: ContractAdjust dùng để làm gì?**
> Ghi lại lịch sử thay đổi hợp đồng: gia hạn (Extend), nâng gói (Upgrade), hạ gói (Downgrade). Phục vụ báo cáo renewal rate trong Reports module.

**Q: Tại sao Staff có thể tạo contract cho GymOwner hay SuperAdmin?**
> Hệ thống check position trong Staffs table, không check Role. SuperAdmin không có Staff record nên không có position, nhưng vẫn pass `EnsureC2PermissionAsync` vì check Role "SuperAdmin" là fallback.

**Q: CardCode được tạo như thế nào?**
> `RegistrationService.GenerateCardCode(userId)` — generate từ UserId để unique, thường dạng "GYM-{prefix}-{suffix}". Dùng để check-in vật lý.
