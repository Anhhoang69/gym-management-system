# 📋 Cheat Sheet — Ôn nhanh trước phản biện

> **Đọc file này 30 phút trước khi phản biện**

---

## 🎯 Thông tin cốt lõi cần nhớ

| Thứ | Thông tin |
|---|---|
| Tech stack | ASP.NET Core 9, EF Core, PostgreSQL (Supabase), Railway |
| Pattern | Layered: Controller → Service → DbContext |
| Auth | JWT Bearer (HMAC-SHA256), 60 phút |
| Email | Brevo API (HTTP) — Railway block SMTP port |
| AI | OpenAI GPT-4o-mini |
| Images | Cloudinary (CDN, auto-optimize) |
| Payment QR | VietQR public API |
| Roles | SuperAdmin, GymOwner, Staff, Member |
| Staff positions | BranchAdmin, Sales, Receptionist, PT, HeadPT |
| Deploy | Docker multi-stage → Railway → auto CI/CD từ GitHub |

---

## 🔄 Luồng chính cần thuộc

### Luồng 1: Lead → Member → Contract → Invoice → Payment → Activation
```
1. Sales tạo Lead (CRM)
2. Sales contact lead → Lead.Status = Contacted, Score tăng
3. Lead đồng ý → Staff tạo Draft contract (preview giá + promotion)
4. Staff generate Contract từ Draft → Contract.Status = Pending
5. Staff issue Invoice → Invoice.Status = Pending
6. Thu tiền → Invoice.Status = Paid
7. Activate contract → Contract.Status = Active
8. AccessCard.Status = Active
9. Gửi email activation (Brevo API)
10. Lead.Status = Converted
```

### Luồng 2: Hội viên check-in
```
1. Hội viên đến quầy → đưa thẻ AccessCard
2. Receptionist nhập CardCode → POST /api/attendance/check-in
3. Check: card Active? contract Active? multi-branch OK? chưa check-in hôm nay?
4. Tạo Attendance record
5. Hội viên ra → check-out
```

### Luồng 3: Booking lớp học
```
1. Member xem lịch → GET /api/classes/schedule
2. Member book → POST /api/classes/{id}/book
3. Check: active contract? quota? no conflict? còn chỗ?
4. Booking tạo (Status=Booked)
5. Hôm diễn ra lớp → Staff check-in → BookingStatus = Attended
6. Contract.UsedGroupSessions++
```

### Luồng 4: AI Chat
```
1. Member nhắn → POST /api/ai/chat
2. IntentService.Detect() → "membership"/"schedule"/"fitness"
3. IsPlanRequest? YES → OpenAI với strict JSON + context
                NO  → DB query trực tiếp (không cần OpenAI)
4. Response + save ChatHistory + save AIRecommendation (nếu plan)
```

### Luồng 5: Tính lương
```
1. Admin POST /api/payroll/calculate { month, year }
2. Foreach staff:
   - BaseSalary từ staff record hoặc formula default
   - PT: đếm ClassBookings.Attended trong kỳ → commission + KPI bonus
   - Sales: sum Commissions.Approved trong kỳ
3. Tạo PayrollRecords (Status=Draft)
4. Admin review → Approve → Status = Approved → gửi notification
```

---

## 💡 Design Decisions — Câu trả lời ngắn gọn

| Câu hỏi | Trả lời ngắn |
|---|---|
| Tại sao không Repository Pattern? | EF Core DbContext ĐÃ là Repository. Thêm layer = boilerplate. |
| Tại sao không Microservices? | Scope nhỏ, monolith đơn giản hơn. Scale sau tách AI/Reports. |
| Tại sao PostgreSQL? | Free Supabase, ILike cho search tiếng Việt, ACID. |
| Tại sao enum lưu string? | Debug dễ, migration an toàn. |
| Tại sao Brevo không SMTP? | Railway block port 465/587. Brevo dùng HTTPS. |
| Tại sao Cloudinary? | Railway ephemeral filesystem. CDN + auto-optimize miễn phí. |
| Tại sao Railway không VPS? | Zero-config, CI/CD tự động, phù hợp scale đồ án. |
| JWT có thể revoke không? | Không (stateless). Giải pháp: refresh token + DB blacklist. |
| OTP brute-force protection? | Max 5 attempts → invalidate. Expire 5-15 phút. |
| Concurrent booking race condition? | EF Core atomic SaveChanges. Production: pessimistic lock. |

---

## 🚨 Điểm yếu cần thừa nhận thẳng thắn

> Hội đồng đánh giá cao sự trung thực về limitation

1. **Không có background jobs** — auto-expire contract, email queue, daily cleanup
2. **Không có rate limiting** — có thể bị brute-force login
3. **JWT không revocable** — logout không invalidate token
4. **CORS AllowAll** — production nên restrict origins
5. **Concurrent booking** — race condition ở high concurrency
6. **Commission rate cứng 5%** — không flexible
7. **Không có health check endpoint** — Railway cần để zero-downtime
8. **AI intent detection** — keyword-based, không chính xác 100%
9. **Không cache reports** — query DB mỗi request
10. **Email không async** — blocking request nếu Brevo chậm

---

## 📊 Số liệu quan trọng

- **25+ controllers**, 30 services, 37 models
- **4 roles**, 5 staff positions
- **21 SQL seed scripts**, DbSeeder cho demo data
- **5 enum types** convert sang string trong DB
- **OpenAI**: GPT-4o-mini, max 2000-3000 tokens/request, temp 0.3-0.7
- **OTP**: 6 chữ số, max 5 attempts, expire 5-15 phút
- **AI Context cache**: TTL 6 giờ
- **JWT**: expire 60 phút, ClockSkew = 0
- **Invoice code format**: `INV-yyyyMMdd-XXXXXX`
- **Contract Draft expire**: 24 giờ
- **Commission rate**: 5% DealPrice (Sales staff)
- **Payroll KPI**: threshold configurable (default formula)
- **Booking conflict check**: `A.Start < B.End && B.Start < A.End`

---

## 🎤 Câu mở đầu khi được hỏi

> "Hệ thống được xây dựng theo Layered Architecture với ASP.NET Core 9. Business logic tập trung tại Service layer, Controller chỉ xử lý HTTP. Database là PostgreSQL qua EF Core Code-First. Hệ thống có 4 modules chính: quản lý hội viên/hợp đồng, CRM leads, lịch học, và AI chat assistant tích hợp OpenAI."
