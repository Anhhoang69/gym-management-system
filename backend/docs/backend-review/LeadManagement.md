# 🧑‍💼 Lead Management — CRM Khách hàng tiềm năng

> **File liên quan:** `LeadController.cs`, `LeadService.cs`, `Lead.cs`, `LeadSource.cs`

---

## 1. Tổng quan module

Lead Management là module **CRM (Customer Relationship Management)** — quản lý toàn bộ pipeline từ khách hàng tiềm năng đến hội viên chính thức.

**Vai trò:** Giúp Sales team track, chăm sóc và convert leads. Tích hợp trực tiếp với Contract module khi convert.

**Luồng chính:**
```
Lead (New)
    ↓ Sales tiếp cận
Lead (Contacted) + tăng ContactCount + cập nhật LastContactedAt
    ↓ Quan tâm
Lead (Qualified)
    ↓ Đồng ý mua
ConvertLeadToMember() → Tạo User + Member + Contract (Pending) + Invoice (Pending)
    ↓
Lead (Converted) — link đến MemberUserId
```

---

## 2. Các endpoint chính

### POST /api/leads
```
Input:  { name, phone, email, sourceId, assignedToStaffId, branchId, note }
Auth:   Staff (Sales | BranchAdmin | SuperAdmin)
```
Validate: phone/email format, sourceId active, assignedTo phải là Sales staff.

### POST /api/leads/import
```
Input:  multipart/form-data với file CSV + duplicateStrategy (Skip|Overwrite)
Auth:   Staff (Sales | BranchAdmin | SuperAdmin)
```
Batch import leads từ CSV, xử lý duplicate theo strategy.

### GET /api/leads (paginated)
```
Query: search, status, sourceId, branchId, assignedToStaffId, minScore, maxScore, createdFrom, createdTo
Auth:  Staff
```

### POST /api/leads/{id}/contact
```
Auth:  Staff
```
Đánh dấu lead đã được liên hệ. Tự động: status=Contacted, contactCount++, lastContactedAt=Now, recalculate Score.

### PUT /api/leads/{id}/status
```
Input: { status, lostReason? }
Auth:  Staff
```
Update status. Nếu status=Lost phải có lostReason.

### POST /api/leads/{id}/convert
```
Input:  { packageId, pricingId, promotionIds[], startDate, taxAmount, note }
Output: { memberUserId, contractId, invoiceId, totalAmountDue }
Auth:   Staff (Sales | BranchAdmin | SuperAdmin)
```
**Quan trọng nhất** — convert lead thành member thật.

### POST /api/leads/merge
```
Input: { leadId, duplicateLeadId }
Auth:  Staff
```
Merge 2 lead trùng lặp thành 1.

---

## 3. Business Logic quan trọng

### Lead Score Calculation
```csharp
private static int CalculateScore(string phone, string? email, int contactCount, int sourceScore)
{
    // Base từ source (ví dụ: Facebook Ads = 30, Website = 20, Walk-in = 10)
    int score = sourceScore;

    // Có email → cộng điểm (email = engaged)
    if (!string.IsNullOrWhiteSpace(email)) score += 10;

    // Đã liên hệ nhiều lần → quan tâm cao
    score += Math.Min(contactCount * 5, 30);

    return Math.Max(0, Math.Min(score, 100)); // Clamp 0-100
}
```

### Convert Lead → Member — flow phức tạp nhất
```csharp
public async Task<ConvertLeadResultDto> ConvertLeadToMemberAsync(...)
{
    // 1. Validate: lead chưa convert, chưa Lost
    if (lead.ConvertedMemberUserId.HasValue) throw;
    if (lead.Status == LeadStatus.Lost) throw;

    // 2. Validate Package + Pricing
    var package = await _context.Packages.Include(p => p.Pricings)...

    // 3. Tính giá với Promotions

    // 4. Check email/phone không trùng User hiện có

    // 5. Tạo User (với tempPassword) + assign Role "Member"
    var user = new User { Email, PhoneNumber, FullName = lead.Name };
    await _userManager.CreateAsync(user, tempPassword);
    await _userManager.AddToRoleAsync(user, "Member");

    // 6. Tạo Member record
    _context.Members.Add(new Member { UserId = user.Id });

    // 7. Tạo AccessCard (Inactive — chưa kích hoạt)
    _context.AccessCards.Add(new AccessCard { Status = AccessCardStatus.Inactive });

    // 8. Tạo Contract (Status = Pending)
    _context.Contracts.Add(new Contract { Status = ContractStatus.Pending });

    // 9. Tạo Invoice (Status = Pending)
    _context.Invoices.Add(new Invoice { Status = InvoiceStatus.Pending });

    // 10. Update Lead → Converted, link ConvertedMemberUserId
    lead.Status = LeadStatus.Converted;
    lead.ConvertedMemberUserId = user.Id;

    await _context.SaveChangesAsync(); // 1 transaction duy nhất

    return new ConvertLeadResultDto {
        Message = "Collect payment at /api/invoices/{id}/payment then activate at /api/contracts/{id}/activate"
    };
}
```

### CSV Import với Duplicate Strategy
```
CSV Row → Parse → Validate → Check duplicate (phone/email)
    ↓ Duplicate found?
        Strategy=Skip → result.SkippedCount++
        Strategy=Overwrite → ApplyImportedLeadValues() → update existing
    ↓ No duplicate
        Build Lead entity → pendingLeads.Add()
    ↓
Sau khi process tất cả rows:
await using var transaction = ...
_context.Leads.AddRange(pendingLeads)
await transaction.CommitAsync()
```

**Tại sao dùng transaction cho import?**
Tránh partial import (5 của 100 rows được import, 95 còn lại fail do network). Rollback nếu DB error.

### Lead Merge
```csharp
// Không cho merge nếu 2 lead link đến 2 member khác nhau
if (targetLead.ConvertedMemberUserId.HasValue && duplicateLead.ConvertedMemberUserId.HasValue
    && targetLead.ConvertedMemberUserId != duplicateLead.ConvertedMemberUserId)
    throw new Exception("Cannot merge leads linked to different members");

// Delete duplicate, update target với merged values
// Chạy trong transaction với 2 SaveChanges để tránh FK violation
```

---

## 4. Validation

```csharp
private static void ValidateLeadPayload(string phone, string? email)
{
    if (string.IsNullOrWhiteSpace(phone))
        throw new Exception("Phone is required");

    var normalizedPhone = NormalizePhone(phone);
    if (!PhoneRegex.IsMatch(normalizedPhone)) // Regex: 9-11 digits
        throw new Exception("Invalid phone number format");

    if (!string.IsNullOrWhiteSpace(email) && !EmailRegex.IsMatch(email))
        throw new Exception("Invalid email format");
}

// Email khi convert: nếu lead không có email → dùng phone@placeholder.local
var email = string.IsNullOrWhiteSpace(lead.Email)
    ? $"{lead.Phone}@placeholder.local"
    : lead.Email;
```

---

## 5. Database

```
Leads
├── LeadId            Guid PK
├── Name              string
├── Phone             string (normalized, unique)
├── Email             string? (unique)
├── Status            LeadStatus (New/Contacted/Qualified/Converted/Lost)
├── SourceId          Guid FK → LeadSources
├── AssignedToStaffId Guid FK → Staffs (phải là Sales position)
├── BranchId          Guid FK → Branches
├── Score             int (0-100)
├── ContactCount      int
├── LastContactedAt   DateTime?
├── LostReason        string?
├── ConvertedMemberUserId Guid? FK → Members (nullable, 1-1)
├── CreatedByUserId   Guid FK → Users
├── CreatedAt         DateTime
└── UpdatedAt         DateTime?

LeadSources
├── Id       Guid PK
├── Name     string
├── Score    int (base score cho leads từ nguồn này)
└── IsActive bool
```

---

## 6. Câu hỏi phản biện thường gặp

**Q: Tại sao Lead chỉ được assign cho Sales staff, không phải mọi staff?**
> Business rule: Sales staff là người chịu trách nhiệm chăm sóc khách hàng, tính commission khi convert. PT hay Receptionist không nên nhận lead để tránh lộn xộn responsibility.

**Q: Tại sao dùng CSV import thay vì manual nhập từng cái?**
> Import hàng loạt từ nguồn ngoài (Facebook Ads export, event sign-up sheets). CSV là format phổ biến nhất. Sample file có ở `leads-import.sample.csv`.

**Q: Duplicate strategy Skip vs Overwrite là gì?**
> Skip: bỏ qua lead trùng, giữ data cũ. Dùng khi import từ nguồn quen, không muốn overwrite data đã chỉnh sửa. Overwrite: cập nhật data lead cũ. Dùng khi import để sync/refresh data từ nguồn.

**Q: Lead Score để làm gì?**
> Giúp Sales prioritize — lead score cao hơn thì ưu tiên contact trước. Score dựa trên: nguồn (Facebook=30, organic=10), có email, số lần contact. Có thể thêm các yếu tố khác (budget, urgency).

**Q: Khi convert lead, tại sao tạo AccessCard inactive?**
> Card tạo sẵn nhưng inactive — chỉ activate sau khi payment và contract activate. Tránh member check-in khi chưa thanh toán.

**Q: Placeholder email "@placeholder.local" có vấn đề gì không?**
> Có thể gây issue nếu lead sau đó muốn login bằng email. Workaround: sau khi convert, member cần update email thật trong profile. Tốt hơn: enforce email required khi convert.

**Q: Hệ thống có track follow-up schedule không?**
> Hiện chỉ track ContactCount và LastContactedAt. Không có follow-up reminder/schedule. Mở rộng: thêm NextFollowUpDate và notification reminder cho Sales.

**Q: Lead Merge có an toàn không?**
> Merge dùng transaction: delete duplicate trước → commit → merge target. Nếu FK constraint fail (duplicate đã có contract), transaction rollback. Check merge không link 2 member khác nhau.
