# 🏋️ Gym Management System — Tổng Quan Hệ Thống Backend

> **Tài liệu ôn phản biện đồ án tốt nghiệp**
> Stack: ASP.NET Core 9 · PostgreSQL · Railway · Docker

---

## 1. Giới thiệu hệ thống

Gym Management System là phần mềm quản lý phòng tập gym toàn diện, được xây dựng theo mô hình **multi-branch** (nhiều chi nhánh). Hệ thống bao gồm:

- Quản lý hội viên, hợp đồng, thanh toán
- Quản lý lịch lớp học, điểm danh
- CRM quản lý khách hàng tiềm năng (Leads)
- Báo cáo doanh thu, KPI
- Tính lương nhân viên
- Chatbot AI tư vấn fitness
- Thông báo nội bộ, yêu cầu hỗ trợ

---

## 2. Kiến trúc tổng thể

```
Frontend (React/Next.js)
        │
        ▼ HTTP REST API (JSON)
┌─────────────────────────────────┐
│         ASP.NET Core 9          │
│                                 │
│  Controllers (25 endpoints)     │
│       │                         │
│  Services (30 services)         │
│       │                         │
│  EF Core (ApplicationDbContext) │
│       │                         │
│  PostgreSQL (Supabase)          │
└─────────────────────────────────┘
        │
        ├── Cloudinary (hình ảnh)
        ├── Brevo/SMTP (email)
        ├── OpenAI GPT-4o-mini (AI chat)
        └── VietQR (QR thanh toán)
```

**Không có Repository layer riêng** — Services tương tác trực tiếp với `ApplicationDbContext` (EF Core). Đây là trade-off hợp lý cho scope đồ án.

---

## 3. Tech Stack chi tiết

| Thành phần | Công nghệ | Lý do chọn |
|---|---|---|
| Backend framework | ASP.NET Core 9 | .NET 9 LTS, hiệu năng cao, ecosystem mạnh |
| ORM | Entity Framework Core 9 | Code-first, LINQ, migration tự động |
| Database | PostgreSQL (Supabase) | Free tier, ACID, robust |
| Identity | ASP.NET Identity + JWT | Chuẩn công nghiệp, tích hợp sẵn |
| Image storage | Cloudinary | Free CDN, auto optimize |
| Email | Brevo API (thay SMTP) | Railway block port 465/587, Brevo qua HTTPS |
| AI | OpenAI GPT-4o-mini | Cost-effective, tiếng Việt tốt |
| QR Payment | VietQR API | Chuẩn ngân hàng VN |
| Deploy | Railway | Container-based, CI/CD đơn giản |
| Containerization | Docker | Môi trường nhất quán |
| Object mapping | AutoMapper | Tự động map Entity ↔ DTO |

---

## 4. Cấu trúc thư mục

```
backend/
├── Controllers/          # 25 controllers, mỗi controller = 1 endpoint group
├── Services/             # 30 services, business logic
├── Interfaces/           # 26 interfaces (dependency injection)
├── Models/               # 37 entity models
├── DTOs/                 # Data Transfer Objects (input/output)
├── Data/
│   ├── ApplicationDbContext.cs   # EF Core DbContext
│   └── Seed/DbSeeder.cs          # Seeding dữ liệu ban đầu
├── Database/Seeds/       # 21 SQL seed scripts
├── Enums/                # 30 enum files
├── Helpers/              # AuthorizationRoles, AppExceptions, ApiResponse
├── Middleware/           # ExceptionMiddleware (global error handler)
├── Mappers/              # AutoMapper profiles
├── Extensions/           # Extension methods
├── Migrations/           # EF Core migration files
├── Dockerfile            # Docker build config
├── Program.cs            # DI setup, middleware pipeline
└── appsettings.json      # Config (keys replaced với REPLACE_WITH_...)
```

---

## 5. Roles & Phân quyền

Hệ thống có **4 roles chính** (ASP.NET Identity Roles):

| Role | Mô tả |
|---|---|
| `SuperAdmin` | Toàn quyền hệ thống |
| `GymOwner` | Chủ phòng gym, xem báo cáo toàn bộ |
| `Staff` | Nhân viên (phân theo Position) |
| `Member` | Hội viên |

**Staff Positions** (fine-grained RBAC trong service layer):

| Position | Quyền chính |
|---|---|
| `BranchAdmin` | Quản lý chi nhánh, duyệt tất cả |
| `Sales` | Quản lý leads, tạo hợp đồng |
| `Receptionist` | Check-in, tạo invoice |
| `PT` (Personal Trainer) | Quản lý lớp học của mình |
| `HeadPT` | Quản lý tất cả PT |

> **Lưu ý quan trọng**: Role ở tầng Controller (`[Authorize(Roles=...)]`) chỉ check `Staff`/`Member`. Fine-grained permission (Sales vs PT vs Receptionist) được check ở **Service layer** qua `EnsureXxxPermissionAsync()`.

---

## 6. Flow xác thực (Authentication Flow)

```
Client → POST /api/auth/login
              ↓
         AuthService.LoginAsync()
              ↓
    [Check lockout → Check password]
              ↓
    TwoFactorEnabled?
      YES → Gửi OTP → return RequiresOtp=true
      NO  → GenerateJwtToken() → return token
              ↓
         JWT Token (60 phút)
              ↓ (gắn vào Header: Authorization: Bearer <token>)
         Các request tiếp theo
```

---

## 7. Các module chính

| Module | File tài liệu | Mô tả |
|---|---|---|
| Authentication | `AuthModule.md` | Login, OTP, JWT, 2FA, reset password |
| User Management | `UserManagement.md` | Tạo/sửa user, roles, profile |
| Branch Management | `BranchManagement.md` | Chi nhánh, phòng, hình ảnh |
| Package Management | `PackageManagement.md` | Gói tập, giá, chính sách |
| Lead Management | `LeadManagement.md` | CRM, import CSV, convert to member |
| Contract Management | `ContractManagement.md` | Hợp đồng, draft, activate |
| Invoice & Payment | `InvoicePayment.md` | Hóa đơn, thu tiền, VietQR |
| Class Scheduling | `ClassScheduling.md` | Lịch lớp, booking, PT session |
| Attendance | `Attendance.md` | Check-in/out thẻ, điểm danh |
| Reports | `Reports.md` | KPI, doanh thu, phân tích |
| AI Chat Assistant | `AIChatAssistant.md` | OpenAI, intent detection, context |
| Payroll | `Payroll.md` | Tính lương, commission, KPI |
| Notifications | `Notifications.md` | Hệ thống thông báo nội bộ |
| Deployment | `Deployment.md` | Railway, Docker, env vars |
| Security | `Security.md` | JWT, RBAC, SMTP, Cloudinary |

---

## 8. Database Overview

### Các nhóm bảng chính:

**USERS:**
- `AspNetUsers` (User) — base user (Identity)
- `Members` — 1-1 với User (hội viên)
- `Staffs` — 1-1 với User (nhân viên)
- `PTProfiles` — 1-1 với Staff (thông tin PT)

**CORE:**
- `Branches`, `BranchImages`
- `Rooms`, `RoomImages`
- `Classes`, `ClassBookings`
- `AccessCards`, `Attendances`

**SALES:**
- `Leads`, `LeadSources`
- `Contracts`, `ContractDrafts`, `ContractAdjusts`
- `Promotions`, `ContractPromotions`
- `Packages`, `PackagePolicies`, `PackageFeatures`, `PackagePricings`

**BILLING:**
- `Invoices`, `Payments`, `Commissions`

**PAYROLL:**
- `PayrollFormulas`, `PayrollRecords`

**SYSTEM:**
- `Notifications`, `NotificationRecipients`
- `AuditLogs`, `OtpCodes`, `LoginHistories`
- `Requests`

**AI:**
- `ChatHistories`, `AIRecommendations`, `AIContextCaches`

---

## 9. Design Decisions quan trọng

### Tại sao không dùng Repository Pattern?
Vì EF Core DbContext **đã là** một implementation của Unit of Work + Repository pattern. Thêm 1 layer nữa chỉ tăng boilerplate. Trong scope đồ án, dùng trực tiếp `_context` trong Services là hoàn toàn hợp lý.

### Tại sao dùng Service Pattern?
- Tách biệt business logic khỏi HTTP layer
- Dễ unit test (inject mock)
- Tái sử dụng logic (ví dụ: `EnsureC2PermissionAsync` dùng chung ở nhiều service)

### Tại sao dùng PostgreSQL thay vì SQL Server?
- Free tier trên Supabase/Railway
- Hiệu năng tốt với JSONB, ILike
- `EF.Functions.ILike()` — case-insensitive search tiếng Việt

### Tại sao dùng Railway thay vì VPS?
- Không cần setup server, manage OS
- CI/CD tự động từ Git
- Phù hợp scale nhỏ của đồ án
- Nếu scale lớn → chuyển sang AWS ECS hoặc Kubernetes

### Tại sao enum lưu là string?
```csharp
// ApplicationDbContext.cs - dòng 344-366
// Convert all enums to string globally
foreach (var entityType in builder.Model.GetEntityTypes())
    foreach (var property in entityType.GetProperties())
        if (clrType.IsEnum)
            property.SetValueConverter(new EnumToStringConverter<T>())
```
- Debug dễ hơn (đọc DB thấy "Active" thay vì "2")
- Migration ít bị breaking change khi thêm enum values
- Trade-off: tốn thêm storage (minor)

---

## 10. Câu hỏi phản biện thường gặp về tổng quan hệ thống

**Q: Tại sao không dùng Microservices?**
> Microservices phù hợp khi team lớn, module scale độc lập. Đây là đồ án sinh viên, monolith là lựa chọn đúng: deploy đơn giản, debug dễ, không tốn công orchestration (Kubernetes, API Gateway...). Nếu scale lớn, có thể tách module AI và Reports thành service riêng trước.

**Q: Tại sao không có Repository Pattern?**
> EF Core DbContext đã implement Unit of Work và Repository. Thêm layer wrapper chỉ tạo boilerplate không cần thiết. Service layer đảm nhận business logic, Controller đảm nhận HTTP parsing/response. Đây là architectural decision có chủ ý, không phải thiếu sót.

**Q: Hệ thống có thể handle bao nhiêu concurrent users?**
> Với Railway free tier, khoảng 100-500 concurrent users. Bottleneck chính là DB connections (Supabase free: 60 connections). Nếu cần scale: thêm connection pooling (PgBouncer), Redis cache cho hot data (packages, branches), horizontal scale Railway containers.

**Q: Tại sao dùng .NET 9 thay vì .NET 8 LTS?**
> .NET 9 có performance improvements đáng kể (AOT, LINQ optimizations). Railway support .NET 9 Docker. Đây là công nghệ mới nhất tại thời điểm làm đồ án.

**Q: Authentication scheme là gì?**
> JWT Bearer tokens. Token được sign bằng HMAC-SHA256, payload chứa UserId, Email, Roles. Token có thời hạn 60 phút (configurable). Không dùng refresh tokens (để đơn giản) — nếu cần: thêm RefreshToken table và endpoint `/api/auth/refresh`.

**Q: Hệ thống xử lý concurrent booking như thế nào?**
> Check capacity ngay trước khi insert. EF Core SaveChangesAsync() là atomic trong 1 request. Tuy nhiên race condition vẫn có thể xảy ra ở high concurrency. Production solution: Optimistic concurrency (RowVersion) hoặc SELECT FOR UPDATE. Trong scope đồ án, tần suất conflict thấp nên chấp nhận được.

**Q: Có CI/CD không?**
> Railway tự động deploy từ GitHub push. Dockerfile build multi-stage. Migration chạy khi `RUN_MIGRATIONS=true` hoặc môi trường Development. Production: set `RUN_MIGRATIONS=false`, chạy migration thủ công.
