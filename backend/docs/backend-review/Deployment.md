# 🚀 Deployment — Railway, Docker, Environment

> **File liên quan:** `Dockerfile`, `appsettings.json`, `Program.cs`, Railway config

---

## 1. Tổng quan deployment

| Thành phần | Platform | Ghi chú |
|---|---|---|
| Backend API | Railway (container) | ASP.NET Core 9 Docker |
| Database | Supabase (PostgreSQL) | Free tier, Postgres 15 |
| Email | Brevo API | HTTP-based, tránh SMTP port block |
| Image CDN | Cloudinary | Auto-optimize, global CDN |
| AI | OpenAI API | GPT-4o-mini |
| QR Payment | VietQR API | Public API, no auth needed |

---

## 2. Dockerfile

```dockerfile
# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY backend/ .
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Runtime (nhẹ hơn SDK image ~300MB vs ~800MB)
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "backend.dll"]
```

**Multi-stage build tại sao?**
- Stage 1 (sdk): cần full SDK để compile
- Stage 2 (aspnet): chỉ cần runtime (~220MB, không có compiler)
- Image production nhỏ hơn ~600MB, deploy nhanh hơn, ít attack surface

---

## 3. Environment Variables trên Railway

Railway inject env vars vào container qua Railway dashboard. **Không bao giờ commit secrets vào code.**

```bash
# Database
ConnectionStrings__DefaultConnection=Host=xxx.supabase.co;Database=postgres;Username=postgres;Password=xxx

# JWT
Jwt__Key=your-super-secret-key-at-least-32-chars
Jwt__Issuer=gym-management-system
Jwt__Audience=gym-management-system-client
Jwt__ExpiryMinutes=60

# Email (Brevo)
Brevo__ApiKey=xkeysib-xxxxx
EmailSettings__FromEmail=your@email.com

# OpenAI
OpenAI__ApiKey=sk-xxx
OpenAI__Model=gpt-4o-mini
OpenAI__MaxTokens=2000

# Cloudinary
Cloudinary__CloudName=your-cloud-name
Cloudinary__ApiKey=xxx
Cloudinary__ApiSecret=xxx

# VietQR
VietQR__BankId=MB
VietQR__AccountNo=0123456789
VietQR__AccountName=GYM MANAGEMENT

# Migrations control
RUN_MIGRATIONS=false  # Production: false, chạy manual
```

**Tại sao `Brevo__ApiKey` dùng `__` (double underscore)?**
> Railway env var naming convention: `Brevo__ApiKey` map tới `_configuration["Brevo:ApiKey"]` trong ASP.NET Core configuration. Double underscore = section separator.

---

## 4. Migration Strategy

```csharp
// Program.cs
if (Environment.GetEnvironmentVariable("RUN_MIGRATIONS") == "true"
    || app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var userManager = ...;
    var roleManager = ...;

    await DbSeeder.SeedAsync(context, userManager, roleManager);
    // DbSeeder cũng apply migrations: context.Database.MigrateAsync()
}
```

**Production workflow:**
1. Set `RUN_MIGRATIONS=false` → app startup nhanh, không chờ migration
2. Khi cần migrate: set `RUN_MIGRATIONS=true` → deploy → migrate → set lại `false`

**Tại sao không auto-migrate mọi lần?**
> Migration startup chậm (10-30s). Railway health check timeout nếu startup quá chậm. Migration production cần kiểm soát — chạy sai thời điểm có thể break DB.

---

## 5. CORS Configuration

```csharp
// Program.cs - Cho phép tất cả origins (development friendly)
options.AddPolicy("AllowAll", policy =>
{
    policy.AllowAnyOrigin()
          .AllowAnyMethod()
          .AllowAnyHeader();
});
```

**Production concern:** `AllowAnyOrigin` không an toàn tuyệt đối. Nên restrict về domain frontend cụ thể:
```csharp
policy.WithOrigins("https://your-frontend.vercel.app")
```
Trade-off: development tiện hơn với AllowAll.

---

## 6. ForwardedHeaders (Railway/Nginx)

```csharp
// Program.cs
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.All
});
```
Railway chạy sau reverse proxy → `X-Forwarded-For`, `X-Forwarded-Proto` headers cần được trust để:
- Lấy IP thực của client (LoginHistory)
- HTTPS redirect đúng

---

## 7. Email — Brevo thay SMTP

**Vấn đề:** Railway block port 465/587 (SMTP) để chống spam.

**Giải pháp:** Dùng Brevo (Sendinblue) HTTP API thay SMTP thuần:
```csharp
// SmtpEmailService.cs
private async Task SendEmailAsync(string toEmail, string subject, string body)
{
    // Try Brevo API key
    var apiKey = _configuration["Brevo__ApiKey"] ?? _configuration["EmailSettings:Password"];

    if (string.IsNullOrEmpty(apiKey))
    {
        // Fallback: mock email (log ra console)
        _logger.LogInformation("[MOCK EMAIL] To: {ToEmail} | ...", toEmail, subject, body);
        return;
    }

    // Call Brevo HTTP API (port 443 HTTPS — không bị block)
    var response = await client.PostAsync("https://api.brevo.com/v3/smtp/email", content);
}
```

**Class name "SmtpEmailService" nhưng không dùng SMTP?**
> Legacy naming — class ban đầu dùng SMTP, sau switch sang Brevo API nhưng giữ tên để không breaking change. Trong phòng thủ phản biện: "class implement IEmailService interface, internal implementation có thể thay đổi (SMTP → Brevo API) mà không ảnh hưởng caller."

---

## 8. Swagger (Production mode)

```csharp
// Swagger enabled mọi môi trường (kể cả production)
app.UseSwagger();
app.UseSwaggerUI();
```

Production có Swagger để demo/test dễ hơn. Security: JWT authentication required cho protected endpoints. Nếu cần bảo mật Swagger: check environment trước khi enable.

---

## 9. Câu hỏi phản biện thường gặp

**Q: Tại sao deploy Railway thay vì VPS?**
> Railway: zero-config, CI/CD tự động từ Git, scale horizontal dễ, free $5/month credit đủ cho demo. VPS cần setup Nginx, SSL, firewall, update OS — tốn thời gian không cần thiết cho đồ án. Trade-off: Railway ít control hơn nhưng productivity cao hơn.

**Q: Tại sao dùng Docker?**
> Đảm bảo "works on my machine = works on Railway". Dev environment và production environment giống nhau. Nếu bất kỳ dependency thay đổi, Dockerfile capture đầy đủ. Multi-stage build giảm image size.

**Q: Supabase free tier có đủ không?**
> Supabase free: 500MB DB, 60 connections, 2GB bandwidth/tháng. Đủ cho demo và đồ án. Production scale: upgrade Supabase hoặc dùng Railway PostgreSQL service.

**Q: Tại sao không dùng Redis?**
> Redis là improvement, không phải requirement. Hệ thống đã có DB-backed caching (AIContextCache). Redis sẽ giảm DB load và increase response time. Với traffic đồ án, không cần thiết.

**Q: CI/CD flow như thế nào?**
> Push code → GitHub → Railway auto-detect → Railway pull latest → Docker build → health check → deploy (zero-downtime nếu health check pass).

**Q: Nếu Railway service down thì sao?**
> Railway có 99.9% uptime SLA. Nếu down: fallback là Railway restart container tự động. Business continuity: backup DB từ Supabase. Không có multi-region redundancy (vượt scope đồ án).

**Q: Environment variables có bị expose không?**
> Không. Railway encrypt env vars at rest. Không log env vars. Code không include secrets (appsettings.json có "REPLACE_WITH_..."). `.gitignore` include `appsettings.Local.json` (file secrets local).

**Q: Tại sao `ASPNETCORE_URLS=http://+:8080`?**
> Railway assign port 8080 mặc định. `http://+:8080` = listen trên tất cả interfaces, port 8080. HTTPS termination do Railway reverse proxy xử lý, app chỉ cần HTTP.

**Q: VietQR có cần API key không?**
> VietQR public API không cần authentication (generate QR từ thông tin tài khoản công khai). Giới hạn rate limit áp dụng. Tích hợp đơn giản, không cần đăng ký.
