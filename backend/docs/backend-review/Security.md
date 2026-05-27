# 🔒 Security — Bảo mật hệ thống

> **File liên quan:** `ExceptionMiddleware.cs`, `AuthorizationRoles.cs`, `AppExceptions.cs`, `Program.cs`, `AuthService.cs`

---

## 1. Kiến trúc bảo mật tổng quan

```
Request → [CORS] → [ForwardedHeaders] → [Auth Middleware]
    ↓
[ExceptionMiddleware] (global error handler)
    ↓
[Controller] → [Authorize(Roles=...)] → [Service] → [EnsureXxxPermissionAsync()]
```

Hệ thống bảo mật nhiều lớp:
1. **JWT Authentication** — xác thực danh tính
2. **Role-based Authorization** — kiểm tra role ở Controller
3. **Position-based Permission** — kiểm tra position ở Service
4. **Business Rule Validation** — kiểm tra state hợp lệ
5. **Global Exception Handling** — không leak stack trace cho non-500

---

## 2. JWT Security

### Token structure
```
Header:  { alg: "HS256", typ: "JWT" }
Payload: {
  sub: "userId-guid",
  nameidentifier: "userId-guid",
  email: "user@example.com",
  role: ["Staff"],  // hoặc ["Member"], ["SuperAdmin"]
  iss: "gym-management-system",
  aud: "gym-management-system-client",
  exp: 1234567890,  // Unix timestamp
  iat: 1234567830
}
Signature: HMAC-SHA256(base64(header) + "." + base64(payload), secret)
```

### Validation config
```csharp
options.TokenValidationParameters = new TokenValidationParameters
{
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,           // Reject expired tokens
    ValidateIssuerSigningKey = true,   // Verify signature
    ValidIssuer = "gym-management-system",
    ValidAudience = "gym-management-system-client",
    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
    ClockSkew = TimeSpan.Zero          // Strict expiry (no 5-min grace)
};
```

---

## 3. RBAC (Role-Based Access Control)

### Tầng 1: Controller level
```csharp
[Authorize(Roles = AuthorizationRoles.AdminRoles)]  // "SuperAdmin,GymOwner,Staff"
[Authorize(Roles = AuthorizationRoles.MemberOnly)]  // "Member"
[Authorize]  // Bất kỳ authenticated user
[AllowAnonymous]  // Public
```

### Tầng 2: Service level (fine-grained)
```csharp
// ContractService, InvoiceService, LeadService...
private async Task EnsureC2PermissionAsync(Guid staffUserId)
{
    // Không đủ chỉ là Staff — phải đúng position
    var hasPermission = await _context.Staffs.AnyAsync(s =>
        s.UserId == staffUserId &&
        (s.Position == StaffPosition.Sales ||
         s.Position == StaffPosition.Receptionist ||
         s.Position == StaffPosition.BranchAdmin));

    if (hasPermission) return;

    // SuperAdmin bypass
    var isAdmin = await _context.UserRoles.AnyAsync(ur =>
        ur.UserId == staffUserId &&
        _context.Roles.Any(r => r.Id == ur.RoleId && r.Name == "SuperAdmin"));

    if (!isAdmin) throw new Exception("Permission denied");
}
```

**Tại sao check 2 tầng?**
> Controller check Role (Staff/Member) nhanh chóng bằng JWT claim — không cần DB query. Service check Position cần DB query nhưng chính xác hơn. Tránh trường hợp Staff (PT) vô tình truy cập contract management.

---

## 4. Global Exception Middleware

```csharp
public async Task InvokeAsync(HttpContext context)
{
    try { await _next(context); }
    catch (Exception ex)
    {
        var statusCode = ex switch
        {
            BusinessException    => 400,
            NotFoundException    => 404,
            UnauthorizedException => 401,
            ForbiddenException   => 403,
            ConflictException    => 409,
            // Heuristic check cho plain Exception messages
            _ when IsBusinessMessage(ex.Message) => 400,
            _ => 500
        };

        var response = new ApiResponse<string>
        {
            Success = false,
            Message = ex.Message,
            // Stack trace chỉ trả về khi 500 (internal error)
            Errors = statusCode == 500 ? ex.StackTrace : null
        };

        context.Response.StatusCode = statusCode;
        await context.Response.WriteAsJsonAsync(response);
    }
}
```

**IsBusinessMessage Heuristic:**
```csharp
// Các từ khóa trong message → return 400 thay vì 500
lower.Contains("not found") ||
lower.Contains("already") ||
lower.Contains("otp") ||
lower.Contains("expired") ||
lower.Contains("cannot") ||
lower.Contains("permission") ||
// ...20+ patterns
```

**Tại sao heuristic?** Nhiều service dùng `throw new Exception("Invoice not found")` thay vì `throw new NotFoundException(...)`. Heuristic giúp map đúng status code mà không cần refactor hàng trăm places.

---

## 5. Password Security

ASP.NET Identity dùng **PBKDF2 + HMAC-SHA256**:
- 10,000 iterations (default, Identity v3)
- Salt ngẫu nhiên per-user
- Hash format: `{version}.{salt}.{hash}` (base64)

```csharp
// Auto-verify và auto-upgrade khi login
var isPasswordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
// Nếu hash version cũ → tự động re-hash với version mới khi login
```

---

## 6. Input Validation

### FluentValidation / DataAnnotations
Không dùng FluentValidation — validation trong Service layer:
```csharp
// AuthService
if (dto.NewPassword != dto.ConfirmPassword)
    throw new Exception("Passwords do not match");

// LeadService
if (string.IsNullOrWhiteSpace(phone)) throw ...
if (!PhoneRegex.IsMatch(normalizedPhone)) throw ...
if (!string.IsNullOrWhiteSpace(email) && !EmailRegex.IsMatch(email)) throw ...
```

### SQL Injection Prevention
EF Core sử dụng **parameterized queries** tự động — không có raw SQL injection risk. Mọi query đều qua LINQ → EF Core → parameterized SQL.

### Email dùng `EF.Functions.ILike`
```csharp
// PostgreSQL case-insensitive search (tiếng Việt friendly)
query.Where(l => EF.Functions.ILike(l.Name, $"%{keyword}%"))
```
EF Core tự parameterize → không có injection.

---

## 7. Secrets Management

```
appsettings.json:        Public values only (REPLACE_WITH_... placeholders)
appsettings.Local.json:  Local dev secrets (trong .gitignore)
Railway env vars:         Production secrets (encrypted)
```

**gitignore:**
```
appsettings.Local.json
*.user
```

Không bao giờ commit API keys, DB credentials, JWT secret vào git.

---

## 8. CORS

```csharp
options.AddPolicy("AllowAll", policy =>
    policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
```

Development convenience. Production tốt hơn nên restrict:
```csharp
policy.WithOrigins("https://gym.yourdomain.com")
      .AllowAnyMethod()
      .AllowAnyHeader();
```

---

## 9. API Response format

```csharp
// Helpers/ApiResponse.cs
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public T? Data { get; set; }
    public string? Errors { get; set; }  // Stack trace khi 500
}
```

Consistent response format — frontend dễ xử lý. `Success=false` + `Message` cho user-facing errors.

---

## 10. Câu hỏi phản biện thường gặp

**Q: JWT Secret key phải bao nhiêu bit?**
> HMAC-SHA256 cần ít nhất 256-bit key (32 bytes). appsettings.json placeholder nhắc nhở nhưng không enforce. Production: generate bằng `openssl rand -base64 32`.

**Q: Tại sao không dùng OAuth2 / Google Login?**
> Thêm OAuth cần cấu hình provider (Google Cloud Console, callback URLs...). Phức tạp cho scope đồ án. JWT username/password đủ cho use case gym — internal users, không phải consumer app.

**Q: Có HTTPS không?**
> Có — Railway terminating SSL. App chỉ listen HTTP (port 8080) vì HTTPS termination ở Railway load balancer. `UseForwardedHeaders` để app biết request gốc là HTTPS. `HttpsRedirection` comment out vì không cần (Railway đã handle).

**Q: Sensitive data có được mã hóa trong DB không?**
> Passwords: PBKDF2 hash (không decrypt được). Email, phone: lưu plaintext — standard practice. Nếu cần compliance (GDPR, HIPAA): encrypt PII fields. Trong scope đồ án, không yêu cầu.

**Q: Rate limiting có không?**
> Chưa implement. Có thể bị brute-force login. Production: thêm ASP.NET Core Rate Limiting middleware (`app.UseRateLimiter()`), giới hạn `/api/auth/login` 5 requests/IP/minute.

**Q: Audit log để làm gì?**
> `AuditLogs` table record mọi thay đổi quan trọng (Create/Update/Delete Lead, CreateClass, CancelContract...). Giúp trace "ai làm gì, lúc nào". Không thể rollback, chỉ để reference.

**Q: Có XSS protection không?**
> Response `Content-Type: application/json` → browser không execute. HTML trong response được encode tự động bởi `System.Text.Json`. `text/plain` responses cho 401/403 cũng safe.

**Q: SQL Injection?**
> EF Core parameterized queries. Không có raw SQL. PostgreSQL prepared statements. Zero risk với current implementation.

**Q: Stored credentials trong Code?**
> Không. appsettings.json chỉ có placeholder. Secrets trong Railway env vars (encrypted) hoặc appsettings.Local.json (gitignored).
