# 🎤 SCRIPT THUYẾT TRÌNH — TOÀN BỘ SLIDE KIẾN TRÚC & KỸ THUẬT

> **Dự án:** Gym Management System — ASP.NET Core 9
> **Mục đích:** Script thuyết trình phản biện đồ án tốt nghiệp
> **Phong cách:** Nói tự nhiên, không đọc slide, dùng tay chỉ vào diagram

---
---

# SLIDE 1 — ERD GIẢN LƯỢC

> ⏱ Thời gian: 3–4 phút

## Mở đầu

"Đây là sơ đồ ERD giản lược của toàn bộ hệ thống. Em sẽ trình bày theo từng cụm thực thể để hội đồng dễ theo dõi."

---

### 🧩 Phần 1 — Nhóm USER (trung tâm ERD) — khoảng 40 giây

> [Chỉ vào thực thể USER ở giữa ERD]

"Trọng tâm của ERD là thực thể **USER** — đây là bảng gốc kế thừa từ ASP.NET Identity.

USER có hai chuyên biệt hóa:
- Một là **MEMBER** — hội viên, được tạo khi đăng ký gói tập.
- Hai là **STAFF** — nhân viên, với 5 vị trí khác nhau: BranchAdmin, HeadPT, Sales, PT, Receptionist — thể hiện bằng ký hiệu vòng tròn chuyên biệt hóa (generalization) trong ERD.

USER còn liên kết với:
- **ROLE** qua bảng trung gian UserRole — để phân quyền JWT.
- **OTP_CODE** và **LOGIN_HISTORY** — phục vụ xác thực 2 bước và audit đăng nhập.
- **AUDITLOG** và **NOTIFICATION** — ghi nhận mọi hành động và gửi thông báo nội bộ."

---

### 🧩 Phần 2 — Nhóm CRM: LEAD & STAFF — khoảng 30 giây

> [Chỉ sang phía STAFF và LEAD bên phải ERD]

"Về phía STAFF:
- Staff **quản lý** LEAD — mỗi lead được assign cho 1 Sales staff.
- Lead có **LEAD_SOURCE** để biết nguồn tiếp cận: Facebook, website, walk-in...
- Khi lead đồng ý mua, hệ thống **Convert** lead thành MEMBER — đây là điểm giao giữa CRM và hệ thống hội viên.

Staff cũng có **PAYROLL_RECORDS** để tính lương, dùng công thức **PAYROLLFORMULA**. PT có thêm quan hệ Teaches với CLASS."

---

### 🧩 Phần 3 — Nhóm MEMBER & hợp đồng — khoảng 50 giây

> [Chỉ xuống cụm MEMBER ở giữa dưới ERD]

"MEMBER là thực thể trung tâm của nghiệp vụ. MEMBER có các liên kết sau:

Thứ nhất, **ACCESS_CARD** — mỗi hội viên có 1 thẻ vật lý để check-in. Quan hệ 1-1.

Thứ hai, **ATTENDANCE** — mỗi lần quẹt thẻ tạo ra 1 bản ghi điểm danh, thuộc về 1 BRANCH.

Thứ ba, luồng hợp đồng:
- MEMBER ký **CONTRACT** thông qua **CONTRACT_DRAFT** — draft là bước preview giá trước khi xác nhận.
- CONTRACT liên kết với **PACKAGE** — gói tập có **PACKAGE_POLICY** (chính sách multi-branch, freeze...) và **PACKAGE_PRICING** (bảng giá theo số tháng).
- CONTRACT được áp dụng **PROMOTION** để giảm giá.
- CONTRACT issues ra **INVOICE** — hóa đơn, và INVOICE được thanh toán qua **PAYMENT**.
- Khi Sales chốt hợp đồng, hệ thống tạo **COMMISSION** cho nhân viên đó.
- **CONTRACT_ADJUST** ghi lại lịch sử gia hạn hoặc nâng gói."

---

### 🧩 Phần 4 — Nhóm lớp học & chi nhánh — khoảng 30 giây

> [Chỉ sang BRANCH, ROOM, CLASS bên phải ERD]

"**BRANCH** là đơn vị tổ chức. Trong mỗi chi nhánh có nhiều **ROOM** — phòng tập.

Lịch học (**CLASS**) được tổ chức trong ROOM, do PT dạy. Member **booking** vào CLASS.

Staff làm việc (**works at**) tại BRANCH. BRANCH cũng có PROMOTION riêng."

---

### 🧩 Phần 5 — Nhóm AI — khoảng 20 giây

> [Chỉ vào góc dưới trái ERD]

"Cuối cùng, ở góc dưới trái, là các thực thể phục vụ AI Chat Assistant:
- **CHAT_HISTORY** — lưu lịch sử hội thoại của từng hội viên.
- **AI_CONTEXT_CACHE** — cache thông tin hội viên để không query DB mỗi lần chat.
- **AI_RECOMMENDATION** — lưu kế hoạch tập luyện và dinh dưỡng do AI sinh ra.

Cả 3 đều thuộc về MEMBER theo quan hệ 1-N."

---

### 🎯 Câu kết — khoảng 10 giây

"Tổng thể, ERD có khoảng **37 thực thể**, tổ chức thành 5 nhóm nghiệp vụ rõ ràng. Em thiết kế để đảm bảo **tính toàn vẹn tham chiếu** thông qua foreign key và cascade delete ở những quan hệ phụ thuộc mạnh."

---

### ❓ Câu hỏi phản biện thường gặp — Slide ERD

| Câu hỏi | Trả lời ngắn |
|---|---|
| STAFF là generalization — tại sao không tách bảng riêng? | Single-table với cột Position enum — tránh JOIN phức tạp, EF Core hỗ trợ enum-to-string tốt |
| USER và MEMBER/STAFF quan hệ gì? | 1-1. USER là identity (đăng nhập), MEMBER/STAFF là profile chuyên biệt |
| CONTRACT_DRAFT tại sao không tạo CONTRACT luôn? | Draft là preview giá 24h — staff confirm trước khi commit. Tránh data rác |
| COMMISSION vs PAYROLL_RECORDS khác nhau? | Commission: tạo ngay khi activate contract. Payroll: tổng hợp cuối tháng (BaseSalary + Commission + KPI) |
| ACCESS_CARD tách riêng làm gì? | Thẻ có vòng đời độc lập (Lost, replace), audit lịch sử thẻ, không ảnh hưởng MEMBER record |
| Cardinality MEMBER và CONTRACT? | 1-N — 1 hội viên có nhiều contract theo thời gian. Tại 1 thời điểm chỉ 1 contract Active (filter bằng Status) |

---
---

# SLIDE 2 — SƠ ĐỒ KIẾN TRÚC HỆ THỐNG (N-Layer tổng quan)

> ⏱ Thời gian: 2–3 phút

## Mở đầu

"Slide này mô tả kiến trúc phần mềm theo mô hình **N-Layer** — hay còn gọi là Layered Architecture."

---

### Phần 1 — Presentation Layer (trên cùng)

> [Chỉ vào 4 hộp trên cùng: Member UI, PT UI, Receptionist/Sales UI, Admin/Owner UI]

"Tầng trên cùng là **Presentation Layer** — gồm 4 giao diện người dùng tương ứng với 4 nhóm vai trò: Member UI, PT UI, Receptionist/Sales UI, và Admin/Owner UI. Mỗi UI chỉ truy cập đúng chức năng của role mình."

---

### Phần 2 — Authentication & Authorization

> [Chỉ vào hộp Authentication and Authorization ở giữa]

"Mọi request từ tầng Presentation đều phải đi qua bước **Authentication và Authorization**. Trong code, em implement bằng JWT Bearer Token — token được sign bằng HMAC-SHA256, chứa UserId và Role trong claims. ASP.NET Core middleware tự động validate token trước khi vào controller."

---

### Phần 3 — Application Layer

> [Chỉ vào Controller, View Handler, Error Handler, Session Manager]

"Tầng Application gồm **Controller** — nhận HTTP request, định nghĩa endpoints, trả response — và **View Handler** phía frontend. Ngoài ra có Error Handler là **ExceptionMiddleware** của em — catch mọi exception, map sang status code phù hợp: 400 cho business error, 404 cho not found, 401/403 cho auth, 500 cho lỗi hệ thống. Session Manager xử lý JWT claims."

---

### Phần 4 — Business Layer (phần lớn nhất)

> [Chỉ vào 7–8 module bên trong Business Layer]

"Tầng Business là trọng tâm — chứa toàn bộ business logic, chia thành các module:
- **Sales & Contract Management** — quản lý leads, hợp đồng, draft, activate
- **Facility Management** — chi nhánh, phòng tập, hình ảnh Cloudinary
- **Membership Management** — hội viên, thẻ access, registration
- **Scheduling** — lịch lớp học, booking, conflict detection
- **AI Chatbot Service** — tích hợp OpenAI, intent detection, context cache
- **Notification & Reporting** — báo cáo KPI, doanh thu, thông báo nội bộ
- **Payroll and Commission Management** — tính lương, hoa hồng
- **Billing & Finance** — hóa đơn, thanh toán, VietQR

Bên phải là 2 external system: Access Control System (thẻ check-in) và External AI Service Provider (OpenAI). Payment System xử lý VietQR."

---

### Phần 5 — Persistence & Database Layer

> [Chỉ xuống 2 tầng dưới cùng]

"Tầng Persistence là **EF Core** — em không implement Repository Pattern riêng vì DbContext của EF Core đã là một implementation của Unit of Work và Repository. Service tương tác trực tiếp với DbContext, tất cả query đều qua LINQ được EF Core compile thành parameterized SQL — không có nguy cơ SQL injection.

Tầng Database là **PostgreSQL** hosted trên Supabase — lý do chọn PostgreSQL vì hỗ trợ ILike cho tìm kiếm case-insensitive tiếng Việt, free tier Supabase đủ cho scale đồ án."

---

### ❓ Câu hỏi phản biện — Slide kiến trúc N-Layer

| Câu hỏi | Trả lời ngắn |
|---|---|
| Tại sao không dùng Repository Pattern? | EF Core DbContext ĐÃ implement Repository + Unit of Work. Thêm layer = boilerplate không cần thiết. Microsoft khuyến nghị cho project vừa nhỏ. |
| Tại sao không Clean Architecture? | Clean Architecture phù hợp team lớn. N-Layer đơn giản hơn, đủ separation of concerns, không overhead. |
| Service lifetime Scoped — tại sao? | DbContext là Scoped (không thread-safe). Service phụ thuộc DbContext phải cùng lifetime. Singleton gây lỗi concurrent access. |
| ExceptionMiddleware hoạt động thế nào? | Catch exception → map sang HTTP status code → return ApiResponse JSON. Dùng custom exception types và heuristic message check. |

---
---

# SLIDE 3 — KIẾN TRÚC TRIỂN KHAI HỆ THỐNG

> ⏱ Thời gian: 2–3 phút

## Mở đầu

"Slide này mô tả kiến trúc triển khai thực tế của hệ thống — tức là các thành phần chạy trên môi trường production."

---

### Phần 1 — Frontend & Vercel

> [Chỉ vào USERS → Frontend]

"Người dùng truy cập qua trình duyệt Web hoặc Mobile. **Frontend** được build bằng React 19 + Vite + TailwindCSS 4, deploy trên **Vercel** — free tier, CDN toàn cầu, CI/CD tự động khi push lên GitHub."

---

### Phần 2 — Backend: Railway + Docker

> [Chỉ vào Backend box — .NET + Railway + Docker]

"Frontend giao tiếp với Backend qua **HTTPS** — toàn bộ traffic được mã hóa. Backend là **ASP.NET Core Web API**, target **.NET 9** — phiên bản mới nhất tại thời điểm làm đồ án, có cải thiện performance đáng kể so với .NET 8.

Backend được containerize bằng **Docker** — em viết Dockerfile theo **multi-stage build**: stage 1 dùng SDK image để compile và publish (~800MB), stage 2 dùng aspnet runtime image nhẹ hơn (~220MB). Container chạy trên **Railway** — platform hỗ trợ CI/CD tự động từ GitHub, không cần cấu hình server thủ công."

---

### Phần 3 — Database: Supabase PostgreSQL

> [Chỉ xuống PostgreSQL/Supabase]

"Database là **PostgreSQL** hosted trên **Supabase** — Database-as-a-Service. Backend kết nối qua connection string trong Railway Environment Variables — secrets được encrypt, không bao giờ commit vào git. Free tier Supabase cho 500MB storage và 60 connections — đủ cho demo và đồ án."

---

### Phần 4 — External Services

> [Chỉ sang 4 external services bên phải]

"Hệ thống tích hợp 4 external services:

Một là **OpenAI GPT-4o-mini** — AI chat assistant. Em chọn GPT-4o-mini vì cost-effective ($0.15/1M tokens), hỗ trợ tiếng Việt tốt, đủ chất lượng cho use case tư vấn fitness.

Hai là **Cloudinary** — lưu trữ hình ảnh chi nhánh, phòng tập, avatar. Lý do không lưu lên server: Railway là ephemeral container — file upload sẽ mất khi redeploy. Cloudinary cho CDN toàn cầu và auto-optimize (WebP, quality auto).

Ba là **JWT Authentication** — token được sign bằng HMAC-SHA256. Validation config: ValidateIssuer, ValidateAudience, ValidateLifetime, ClockSkew = TimeSpan.Zero — không có clock drift tolerance.

Bốn là **GitHub** — source code và CI/CD. Push lên main → Railway tự detect → Docker build → deploy. Zero-downtime rolling deployment."

---

### Phần 5 — Tóm tắt 4 điểm nổi bật

> [Chỉ vào 4 ô dưới cùng]

"Tóm tắt 4 điểm nổi bật:
- **Cloud Deployment**: Frontend Vercel, Backend Railway, DB Supabase — mỗi thành phần được tối ưu riêng
- **AI Integration**: OpenAI GPT-4o-mini với intent detection tự xây dựng
- **Security & RBAC**: JWT + Role-Based Access Control, fine-grained permission ở service layer
- **Docker & CI/CD**: Tự động build và deploy từ GitHub push"

---

### ❓ Câu hỏi phản biện — Slide triển khai

| Câu hỏi | Trả lời ngắn |
|---|---|
| Tại sao Railway không VPS? | Railway: zero-config, CI/CD tự động, phù hợp scale đồ án. VPS cần setup Nginx, SSL, firewall — tốn thời gian không cần thiết. |
| Docker multi-stage build lợi gì? | Stage 1 SDK (~800MB) chỉ để compile. Stage 2 runtime (~220MB) deploy. Image nhỏ hơn → deploy nhanh, ít attack surface. |
| Tại sao không dùng SMTP mà dùng Brevo? | Railway block port 465/587 (chống spam). Brevo gửi email qua HTTP API port 443 — không bị block. |
| Env vars bảo mật thế nào? | Railway encrypt env vars at rest. Code chỉ có placeholder REPLACE_WITH_... appsettings.Local.json trong .gitignore. |
| HTTPS termination ở đâu? | Railway reverse proxy handle SSL termination. Backend chỉ listen HTTP port 8080. UseForwardedHeaders để nhận X-Forwarded-For. |
| Supabase free tier đủ không? | 500MB DB, 60 connections, 2GB bandwidth/tháng — đủ cho demo. Production: upgrade Supabase Pro hoặc Railway PostgreSQL. |

---
---

# SLIDE 4 — BACKEND: KIẾN TRÚC N-LAYER CHI TIẾT

> ⏱ Thời gian: 2–3 phút

## Mở đầu

"Slide này đi sâu vào kiến trúc backend — cụ thể từng layer và các thành phần hỗ trợ."

---

### Phần 1 — 5 Layer (bên trái slide)

> [Chỉ vào sơ đồ 5 bước bên trái]

"Backend được tổ chức theo **5 layer rõ ràng**:

**Layer 1 — Presentation (Client)**: Web/Mobile App — phía frontend, giao tiếp với backend qua REST API.

**Layer 2 — Controller Layer**: Mỗi controller ứng với 1 nhóm endpoint. Controller chỉ làm 3 việc: nhận HTTP request, gọi service, trả response. Không có business logic ở đây. Ví dụ: `ContractController.GenerateAsync()` chỉ gọi `_contractService.GenerateContractAsync(dto, userId)` rồi return Ok().

**Layer 3 — Service Layer**: Đây là tầng quan trọng nhất — chứa toàn bộ business logic. Mỗi service implement một interface tương ứng. Ví dụ: `IContractService` → `ContractService`. Việc dùng interface giúp dependency injection, dễ unit test bằng mock.

**Layer 4 — Data Access Layer**: Service gọi trực tiếp `ApplicationDbContext` của EF Core — không có Repository wrapper riêng. `DbContext.SaveChangesAsync()` là atomic — wrap tất cả changes trong 1 DB transaction.

**Layer 5 — Database Layer**: PostgreSQL trên Supabase. EF Core Code-First với migration files — cấu trúc DB được định nghĩa từ C# entities."

---

### Phần 2 — Các thành phần hỗ trợ (bên phải slide)

> [Chỉ sang 6 thành phần bên phải]

"Bên phải là 6 thành phần hỗ trợ:

**DTOs** (Data Transfer Objects): Tách biệt API contract với database entity. Ví dụ: `ContractDto` chứa thông tin cần trả về client, còn `Contract` entity có thể có nhiều field internal hơn. AutoMapper giúp tự động map giữa Entity và DTO.

**Models/Entities**: 37 entity class ánh xạ trực tiếp với PostgreSQL tables. Được config bằng Fluent API trong `ApplicationDbContext.OnModelCreating()`.

**Mappers**: AutoMapper Profile định nghĩa mapping rules. `ProjectTo<T>()` cho phép mapping ngay trong SQL query — không load full entity vào memory.

**Enums**: Khoảng 30 enum files định nghĩa các trạng thái. Đặc biệt: em dùng `EnumToStringConverter` để lưu enum thành chuỗi trong DB thay vì số — debug dễ hơn, migration an toàn hơn khi thêm enum values.

**Helpers & Extensions**: `AppExceptions.cs` định nghĩa 5 custom exception types: `BusinessException` → 400, `NotFoundException` → 404, `UnauthorizedException` → 401, `ForbiddenException` → 403, `ConflictException` → 409.

**Middleware**: `ExceptionMiddleware` là global error handler — catch exception từ bất kỳ layer nào, map sang HTTP status code phù hợp, trả về `ApiResponse<string>` JSON. Không expose stack trace cho lỗi business, chỉ expose khi 500 internal error."

---

### ❓ Câu hỏi phản biện — Slide Backend

| Câu hỏi | Trả lời ngắn |
|---|---|
| AutoMapper có overhead không? | Overhead nhỏ (~1-5ms). ProjectTo<T>() mapping ở DB level — không load full entity. Acceptable với scale hiện tại. |
| Tại sao dùng interface cho Service? | Dependency injection, dễ unit test (inject mock), có thể swap implementation. |
| EnumToStringConverter — tại sao? | Debug dễ (thấy "Active" thay vì "2"). Migration an toàn khi thêm enum values. Trade-off nhỏ: tốn thêm storage. |
| Code-First hay DB-First? | Code-First: entity class → EF Core migration → DB schema. Dễ version control, refactor, team collaboration. |
| Business logic ở Controller được không? | Không. Controller chỉ parse HTTP, gọi service, return response. Logic ở Controller làm khó unit test, khó reuse. |

---
---

# SLIDE 5 — AI CHAT ASSISTANT: OVERVIEW

> ⏱ Thời gian: 2 phút

## Mở đầu

"Đây là tổng quan về tính năng AI Chat Assistant — một trong những điểm khác biệt của hệ thống."

---

### Phần 1 — 5 loại Intent (bảng bên trái)

> [Chỉ vào bảng Intent — Function bên trái]

"AI Chat hỗ trợ **5 loại intent** — tức là 5 loại câu hỏi mà hội viên có thể hỏi:

- **MEMBERSHIP**: Kiểm tra thông tin gói tập đang dùng — còn bao nhiêu ngày, còn bao nhiêu buổi PT
- **SCHEDULE**: Xem lịch lớp học đã đặt sắp tới
- **ATTENDANCE**: Hỏi số buổi đã tập — tuần này, tháng này, tổng cộng
- **PACKAGE**: Tra cứu các gói tập đang bán, bảng giá
- **FITNESS AI**: Sinh kế hoạch tập luyện, chế độ ăn — đây là loại cần gọi OpenAI

4 intent đầu, hệ thống **trả lời thẳng từ database** — không cần gọi OpenAI, nhanh và tiết kiệm chi phí. Chỉ FITNESS AI mới gọi OpenAI."

---

### Phần 2 — 4 tính năng nổi bật (bên phải)

> [Chỉ sang 4 tính năng bên phải]

"Hệ thống có 4 tính năng nổi bật:

**Phản hồi cá nhân hóa**: AI nhận thông tin context của từng hội viên — tuổi, giới tính, gói đang dùng, tần suất tập — để cho lời khuyên phù hợp. Context này được build từ DB và cache trong bảng AI_CONTEXT_CACHE với TTL 6 giờ.

**Sinh kế hoạch tập luyện**: Khi hội viên hỏi 'muốn giảm 5kg', AI sinh kế hoạch bao gồm WorkoutPlan và NutritionAdvice dạng JSON có cấu trúc. Kế hoạch được lưu vào bảng AI_RECOMMENDATION để hội viên xem lại sau.

**Gợi ý dinh dưỡng**: Dựa trên mục tiêu, hệ thống gợi ý chế độ ăn phù hợp.

**Chat theo ngữ cảnh**: Giữ 20 tin nhắn gần nhất trong lịch sử để AI hiểu context cuộc hội thoại — không bị lặp câu hỏi."

---

### ❓ Câu hỏi phản biện — Slide AI Overview

| Câu hỏi | Trả lời ngắn |
|---|---|
| Tại sao không dùng ChatGPT trực tiếp mà cần AIService? | AIService là orchestration layer: phân loại intent, lấy context từ DB, quyết định có cần gọi OpenAI không, lưu history và recommendation. |
| Intent detection chính xác không? | ~80-90% với câu thông thường. Yếu với câu mơ hồ. Cải thiện: embedding-based classifier hoặc fine-tune model. |
| Tại sao giới hạn 20 tin nhắn lịch sử? | Mỗi message = tokens. Giới hạn để kiểm soát cost. GPT-4o-mini có context 128K tokens nhưng chi phí tăng theo. |

---
---

# SLIDE 6 — AI CHAT ASSISTANT: LUỒNG XỬ LÝ CHI TIẾT

> ⏱ Thời gian: 3–4 phút

## Mở đầu

"Slide này đi sâu vào luồng xử lý kỹ thuật của AI Chat — từ khi hội viên gửi tin nhắn đến khi nhận được phản hồi."

---

### Phần 1 — Kiến trúc 4 service (sơ đồ bên trái)

> [Chỉ vào sơ đồ service bên trái]

"Kiến trúc AI gồm các thành phần chính:
- **AIController**: Nhận request, xác thực JWT, lấy memberId từ Claims
- **AIService**: Orchestration layer — điều phối toàn bộ luồng xử lý
- **IntentService**: Phân loại intent bằng keyword matching
- **GymDataService**: Query database — trả lời câu hỏi không cần AI
- **OpenAIService**: Gọi OpenAI API — chỉ khi thực sự cần"

---

### Phần 2 — Luồng xử lý 7 bước (bảng số bên phải)

> [Chỉ vào bảng số 1→7 bên phải, đi theo từng bước]

"Cụ thể luồng xử lý theo 7 bước:

**Bước 1**: Hội viên gửi `POST /api/ai/chat` với message _'Cho tôi bài tập giảm cân'_.

**Bước 2**: AIController xác thực JWT, lấy memberId từ Claims — đảm bảo chỉ member đã đăng nhập mới dùng được.

**Bước 3**: `AIService.HandleChatAsync()` bắt đầu xử lý:

> **3.1** — Lưu message của user vào **ChatHistories** ngay lập tức — để không mất data dù có lỗi sau đó.

> **3.2** — **IntentService.Detect(message)**: Normalize text (xóa dấu tiếng Việt bằng `RemoveDiacritics()`), so khớp keyword với từ điển. _'giảm cân'_ → intent = _'fitness'_. Đồng thời check `IsPlanRequest()` — regex tìm pattern như _'muốn giảm'_, _'X kg'_, _'kế hoạch'_ → quyết định có cần strict JSON output không.

> **3.3** — **GymDataService.GetCachedOrBuildContextAsync(memberId)**: Check AI_CONTEXT_CACHE — nếu cache còn tươi (dưới 6 giờ) thì dùng luôn; nếu stale thì query DB lấy thông tin user, contract, attendance, upcoming classes rồi upsert lại cache.

> **3.4** — Lấy **20 tin nhắn lịch sử** gần nhất từ ChatHistories.

> **3.5** — **OpenAIService.ChatAsync()**: Build messages array gồm SystemPrompt, UserContext, ChatHistory, và Message hiện tại. POST lên `api.openai.com/v1/chat/completions`. Nếu là plan request: enforce JSON-only output với temperature=0.3, maxTokens=3000; nếu chat thường: temperature=0.7, maxTokens=2000.

**Bước 4**: Lưu response của AI vào ChatHistories.

**Bước 5**: Return `ChatResponseDto { Message, Type }` — Type là _'text'_ hoặc _'json'_ để frontend biết cách render.

**Bước 6**: Client có thể gọi thêm `GET /api/ai/history` hoặc `GET /api/ai/recommendations` để xem lịch sử và kế hoạch đã lưu.

**Bước 7**: Kết thúc luồng."

---

### Phần 3 — 2 điểm kỹ thuật nổi bật

> [Nhấn mạnh 2 điểm này trước khi kết slide]

"Có 2 điểm kỹ thuật em muốn nhấn mạnh:

**Thứ nhất, thông minh phân loại request**: Câu _'Lịch tập của tôi?'_ → intent _'schedule'_ → chỉ query DB, không gọi OpenAI. Câu _'Cho tôi kế hoạch tập giảm cân'_ → intent _'fitness'_ + isPlanRequest=true → bắt buộc gọi OpenAI với JSON strict mode. Điều này giúp tiết kiệm cost đáng kể.

**Thứ hai, JSON extraction robustness**: OpenAI đôi khi trả về JSON kèm text giải thích. Em implement `ExtractJson()` với 3 fallback: check nếu response là JSON thuần → dùng ngay; tìm markdown code fence → extract; tìm brace matching `{ ... }` → extract. Nếu parse fail → lưu raw response, WorkoutPlan = null, không crash request."

---

### ❓ Câu hỏi phản biện — Slide AI Flow

| Câu hỏi | Trả lời ngắn |
|---|---|
| Temperature 0.3 vs 0.7 — tại sao? | 0.7 = sáng tạo (chat tự nhiên). 0.3 = deterministic (JSON output — ít hallucinate structure hơn). |
| AI có thể đưa ra lời khuyên sai không? | Có — LLM có hallucination. System prompt có "Do NOT give medical advice". Cần disclaimer cho user. |
| Chi phí OpenAI tháng bao nhiêu? | GPT-4o-mini: $0.15/1M input tokens. 1000 chat/tháng x 500 tokens ≈ $0.075–0.30/tháng. Rất rẻ. |
| Cache 6 giờ có đủ fresh không? | Đủ cho data ít thay đổi (profile, gói tập). Có InvalidateCacheAsync() gọi khi contract activate hoặc profile update. |
| Nếu OpenAI API down thì sao? | Fallback message thân thiện trả về user. Chat history vẫn được lưu. Gợi ý thêm retry + exponential backoff. |
| Tại sao lưu ChatHistory trước khi xử lý? | Đảm bảo không mất message nếu có exception sau đó. User message là data quan trọng cần audit. |
| IsPlanRequest() và Detect() khác nhau? | Detect() → phân loại intent (membership/schedule/fitness...). IsPlanRequest() → check có cần JSON strict mode không (regex + keyword). Hai mục đích khác nhau. |

---
---

## 📌 TỔNG KẾT — Câu nói kết thúc phần kiến trúc

"Tóm lại, hệ thống được thiết kế theo nguyên tắc **separation of concerns** rõ ràng — mỗi layer có trách nhiệm riêng, có thể mở rộng hoặc thay thế độc lập. Các design decision như N-Layer, EF Core trực tiếp không Repository, enum lưu string, hay Brevo thay SMTP đều là **quyết định có chủ ý** dựa trên context của đồ án — cân bằng giữa simplicity, maintainability và scope phù hợp. Em sẵn sàng giải thích bất kỳ quyết định nào nếu hội đồng muốn đi sâu hơn."
