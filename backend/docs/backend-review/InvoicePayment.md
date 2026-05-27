# 💰 Invoice & Payment — Hóa đơn và Thanh toán

> **File liên quan:** `InvoiceController.cs`, `InvoiceService.cs`, `PaymentController.cs`, `PaymentService.cs`, `VietQrService.cs`

---

## 1. Tổng quan module

Module xử lý toàn bộ vòng đời thanh toán: từ tạo hóa đơn, thu tiền, đến link với contract activation.

**Vai trò trong hệ thống:**
```
Contract (Pending) → Issue Invoice (Pending) → Collect Payment → Invoice (Paid)
                                                                        ↓
                                              Contract Activate → Contract (Active)
```

---

## 2. Các endpoint chính

### POST /api/invoices/issue
```
Input:  { contractId, taxAmount }
Output: InvoiceDto (status=Pending)
Auth:   Staff (Sales | Receptionist | BranchAdmin | SuperAdmin)
```
**Business:** Contract phải Pending. 1 contract chỉ có 1 invoice.

### GET /api/invoices/{invoiceId}
```
Auth:   Staff
```

### POST /api/invoices/{invoiceId}/payment
```
Input:  { amount, method (Cash|BankTransfer|QRCode), refNo? }
Output: { payment, newInvoiceStatus }
Auth:   Staff
```
**Business:**
- Invoice chưa Paid
- Amount phải >= TotalAmount (không partial payment)
- Tạo Payment record, update Invoice.Status = Paid

### GET /api/invoices (filtered)
```
Query: branchId, status, fromDate, toDate, page, pageSize
Auth:  Staff
```

### DELETE /api/invoices/{invoiceId}/cancel
```
Auth:  Staff
```
Chỉ cancel được invoice chưa Paid. Invoice Paid không thể cancel.

### GET /api/invoices/{invoiceId}/qr
```
Output: { qrDataUrl, qrImageUrl }
Auth:   Staff hoặc Member
```
Generate VietQR code để thanh toán chuyển khoản.

---

## 3. Business Logic quan trọng

### Invoice Code Generation
```csharp
var suffix = Convert.ToHexString(RandomNumberGenerator.GetBytes(3));
string invoiceCode = $"INV-{DateTime.UtcNow:yyyyMMdd}-{suffix}";
// Ví dụ: INV-20260520-A3F7B2
```

### Không có Partial Payment
```csharp
if (dto.Amount < invoice.TotalAmount)
    throw new Exception($"Payment amount must be at least {invoice.TotalAmount} (Partial payments not supported)");
```
**Tại sao?** Đơn giản hóa business logic. Tránh trạng thái "partially paid" phức tạp. Gym thường thu tiền 1 lần (không trả góp trong hệ thống này).

### Invoice → Payment → Paid flow (atomic)
```csharp
_context.Payments.Add(payment);
invoice.Status = InvoiceStatus.Paid;
invoice.UpdatedAt = DateTime.UtcNow;
await _context.SaveChangesAsync(); // Atomic: cả payment và invoice status
```

### Invoice amount calculation
```
Subtotal      = contract.OriginalPrice (giá gốc của package)
DiscountAmount = tổng discount từ promotions
TaxAmount     = thuế (nếu có, nhập khi issue invoice)
TotalAmount   = DealPrice + TaxAmount
             = (OriginalPrice - DiscountAmount) + TaxAmount
```

---

## 4. VietQR Integration

```csharp
// VietQrService.cs
public async Task<VietQrResponseDto> GenerateQrAsync(decimal amount, string description)
{
    var payload = new {
        accountNo = _configuration["VietQR:AccountNo"],
        accountName = _configuration["VietQR:AccountName"],
        acqId = GetBankAcqId(_configuration["VietQR:BankId"]),
        amount = (int)amount,
        addInfo = description,  // Invoice code
        format = "text",
        template = "compact"
    };

    // POST https://api.vietqr.io/v2/generate
    var response = await _httpClient.PostAsJsonAsync("https://api.vietqr.io/v2/generate", payload);
    // Returns: { qrDataURL (base64 PNG), qrCode (VietQR string) }
}
```

**Tại sao dùng VietQR?**
> VietQR là chuẩn QR ngân hàng Việt Nam — tương thích với hầu hết banking app (Vietcombank, MB, Techcombank...). Khách hàng scan QR → tự điền số tiền và nội dung chuyển khoản.

---

## 5. Payment Methods

```csharp
enum PaymentMethod { Cash, BankTransfer, QRCode, Card }
```

- `Cash`: Thu tiền mặt tại quầy — Receptionist ghi nhận
- `BankTransfer`: Chuyển khoản thủ công — verify RefNo (mã giao dịch)
- `QRCode`: Scan VietQR → tự động fill thông tin → transfer → Staff confirm
- `Card`: Quẹt thẻ (future implementation)

---

## 6. Commission cho Sales staff

```csharp
// CommissionService.RecordAsync() - gọi trong ContractService.ActivateMembershipAsync()
public async Task RecordAsync(Guid contractId, Guid staffId)
{
    var contract = await _context.Contracts.Include(c => c.Package)...
    var staff = await _context.Staffs.FirstOrDefaultAsync(s => s.UserId == staffId);

    // Chỉ Sales staff mới có commission
    if (staff?.Position != StaffPosition.Sales) return;

    decimal rate = 0.05m; // Default 5% commission rate
    var commission = new Commission
    {
        StaffId = staffId,
        ContractId = contractId,
        Amount = contract.DealPrice * rate,
        Status = CommissionStatus.Pending // Admin cần approve
    };
    _context.Commissions.Add(commission);
}
```

Commission pending → Admin approve → Tính vào PayrollRecord.SalesCommission.

---

## 7. Database

```
Invoices
├── InvoiceId       Guid PK
├── ContractId      Guid FK → Contracts (unique - 1-1)
├── MemberId        Guid FK → Members
├── InvoiceCode     string (INV-yyyyMMdd-XXXX)
├── Subtotal        decimal
├── DiscountAmount  decimal
├── TaxAmount       decimal
├── TotalAmount     decimal
├── Status          InvoiceStatus (Pending | Paid | Cancelled)
├── CreatedByStaffId Guid? FK → Staffs
├── CreatedAt       DateTime
└── UpdatedAt       DateTime?

Payments
├── PaymentId         Guid PK
├── InvoiceId         Guid FK → Invoices (unique - 1-1)
├── Method            PaymentMethod
├── RefNo             string? (mã GD ngân hàng)
├── Amount            decimal
├── Status            PaymentStatus (Completed | Refunded)
├── ProcessedByStaffId Guid FK → Staffs
└── CreatedAt         DateTime

Commissions
├── CommissionId  Guid PK
├── StaffId       Guid FK → Staffs
├── ContractId    Guid FK → Contracts
├── Amount        decimal
├── Status        CommissionStatus (Pending | Approved | Rejected)
└── CreatedAt     DateTime
```

---

## 8. Câu hỏi phản biện thường gặp

**Q: Tại sao không support partial payment (trả góp)?**
> Business decision — gym thường không support trả góp trong phần mềm (có thể thỏa thuận offline). Giảm complexity đáng kể. Nếu cần: thêm `PaymentInstallments` table và tracking remaining balance.

**Q: Nếu payment bị ghi nhận nhầm thì sao?**
> Hiện không có refund flow. Production: thêm `RefundPayment` endpoint, tạo refund record, update Invoice.Status = Refunded, reverse Contract.Status về Pending.

**Q: VietQR có verify payment tự động không?**
> Không. Hiện là manual: khách quét QR chuyển khoản → Staff verify trên app ngân hàng → Staff bấm confirm trên hệ thống. Auto-verify cần webhook từ ngân hàng (MB Bank, VietcomBank API) — phức tạp và cần đăng ký với ngân hàng.

**Q: RefNo (reference number) để làm gì?**
> Lưu mã giao dịch ngân hàng để đối soát (reconciliation). Staff nhập khi confirm payment BankTransfer.

**Q: Tại sao Invoice và Contract là 1-1?**
> 1 hợp đồng = 1 lần thanh toán duy nhất. Nếu muốn gia hạn → tạo ContractAdjust mới với Invoice mới. Tránh confusion nhiều invoices cho 1 contract.

**Q: TaxAmount có bắt buộc không?**
> Không (default 0). Tùy quy định thuế của từng gym. Để tính thuế VAT: `TaxAmount = DealPrice * 0.1`.

**Q: Commission rate cứng 5% có thể thay đổi không?**
> Trong code hiện tại cứng ở `CommissionService`. Cải thiện: thêm `CommissionRate` vào `Package` hoặc `Staff` table để flexible per-package hoặc per-staff.
