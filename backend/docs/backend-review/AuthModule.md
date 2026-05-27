# 🔐 Auth Module — Xác thực & Phân quyền

> **File liên quan:** `AuthController.cs`, `AuthService.cs`, `Program.cs`, `OtpCode.cs`, `LoginHistory.cs`

---

## 1. Tổng quan module

Module Auth xử lý toàn bộ vòng đời xác thực:
- Đăng nhập bằng email hoặc số điện thoại
- Xác thực 2 bước (2FA) qua OTP
- Quên/đặt lại mật khẩu qua OTP
- Đổi mật khẩu khi đã đăng nhập
- Phát hành JWT token

**Vai trò:** Là cổng vào duy nhất của hệ thống. Mọi request đều cần JWT token (trừ các endpoint public).

---

## 2. Các endpoint chính

### POST /api/auth/login
```
Input:  { emailOrPhone, password }
Output: { token, expiresAt, roles, ... } hoặc { requiresOtp: true }
Auth:   Public
```
**Flow:**
1. Tìm user theo email hoặc phone (normalize về lowercase/digits)
2. Check lockout (`IsLockedOutAsync`)
3. Verify password (`CheckPasswordAsync`)
4. Nếu `TwoFactorEnabled = true` → tạo OTP, gửi email/SMS → return `requiresOtp: true`
5. Nếu không → `CompleteLoginAsync()` → generate JWT → lưu `LoginHistory` → return token

### POST /api/auth/verify-otp
```
Input:  { userId, otpCode }
Output: { token, expiresAt, ... }
Auth:   Public
```
**Flow:** Xác thực OTP với purpose="2FA", đánh dấu `IsUsed=true` → complete login

### POST /api/auth/forgot-password
```
Input:  { emailOrPhone }
Output: { message: "OTP sent" }
Auth:   Public
```
**Flow:** Tìm user, invalidate OTP cũ, tạo OTP mới (15 phút), gửi email/SMS.
> **Security note:** Không reveal user exists — nếu không tìm thấy, vẫn return 200 (silent fail)

### POST /api/auth/reset-password
```
Input:  { emailOrPhone, otpCode, newPassword, confirmPassword }
Output: { success }
Auth:   Public
```
**Flow:** Validate OTP (max 5 attempts) → `ResetPasswordAsync()` → đánh dấu OTP used

### POST /api/auth/change-password
```
Input:  { currentPassword, newPassword, confirmPassword }
Output: { success }
Auth:   Authenticated (any role)
```
**Flow:** `ChangePasswordAsync()` — tự động verify `currentPassword`

### POST /api/auth/2fa/setup/send-otp, /enable, /disable
```
Auth: Authenticated
```
Gửi OTP với purpose="2FASetup" → verify → enable/disable 2FA

---

## 3. Business Logic quan trọng

### JWT Token Generation
```csharp
// AuthService.cs - GenerateJwtToken()
var claims = new List<Claim>
{
    new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
    new(ClaimTypes.NameIdentifier, user.Id.ToString()),
    new(ClaimTypes.Email, user.Email),
    // Role claims - dùng cho [Authorize(Roles=...)]
};
claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

// Sign bằng HMAC-SHA256, expire 60 phút
```

**Claims trong token:**
- `sub` / `nameidentifier` = UserId (Guid)
- `email` = Email
- `role` = ["Member"] hoặc ["Staff"] hoặc ["SuperAdmin", ...]

### OTP Security
- OTP 6 chữ số, sinh bởi `RandomNumberGenerator.GetInt32` (cryptographically secure)
- OTP có purpose: `"2FA"`, `"PasswordReset"`, `"2FASetup"`
- **Max 5 attempts** — sau 5 lần sai, OTP bị invalidate tự động
- Khi tạo OTP mới → invalidate tất cả OTP cũ cùng purpose → tránh OTP cũ còn dùng được

### Multi-channel delivery
```csharp
// Gửi qua email nếu login bằng email
// Gửi qua SMS (mock) nếu login bằng phone
bool isEmail = dto.EmailOrPhone.Contains('@');
if (isEmail && !string.IsNullOrWhiteSpace(user.Email))
    await _emailService.SendPasswordResetAsync(user.Email, otp.Code);
else if (!isEmail && !string.IsNullOrWhiteSpace(user.PhoneNumber))
    await _smsService.SendPasswordResetAsync(user.PhoneNumber, otp.Code);
```

### Silent fail cho forgot password
```csharp
public async Task ForgotPasswordAsync(ForgotPasswordDto dto)
{
    var user = await FindUserByIdentifierAsync(dto.EmailOrPhone);
    if (user == null) return; // không throw — tránh user enumeration attack
```

---

## 4. Database liên quan

### Bảng `OtpCodes`
```
OtpCodeId   Guid PK
UserId      Guid FK → AspNetUsers
Code        string (6 digits)
Purpose     string ("2FA" | "PasswordReset" | "2FASetup")
IsUsed      bool
AttemptCount int (tăng khi nhập sai)
ExpiresAt   DateTime
UsedAt      DateTime?
CreatedAt   DateTime
```

### Bảng `LoginHistories`
```
LoginHistoryId  Guid PK
UserId          Guid FK → AspNetUsers (Cascade)
LoginAt         DateTime
IpAddress       string?
```

### Bảng `AspNetUsers` (Identity)
```
Id              Guid PK
Email           string (unique)
PhoneNumber     string
PasswordHash    string (bcrypt)
TwoFactorEnabled bool
LockoutEnabled  bool
AccessFailedCount int
LastLoginAt     DateTime?
```

---

## 5. Security & Validation

### JWT Configuration (Program.cs)
```csharp
ValidateIssuer = true,
ValidateAudience = true,
ValidateLifetime = true,
ValidateIssuerSigningKey = true,
ClockSkew = TimeSpan.Zero  // Không cho phép clock drift
```

### Password Hashing
- ASP.NET Identity dùng **PBKDF2 + HMAC-SHA256** (không phải bcrypt, nhưng tương đương về security)
- Auto-upgrade hash version khi login

### Lockout Policy
- `IsLockedOutAsync()` check ASP.NET Identity lockout
- Default: 5 failed attempts → lockout 5 phút
- Configurable trong Identity options

### Response khi auth fail
```csharp
// Program.cs - custom JWT events
OnChallenge: HTTP 401 "Unauthorized" (text/plain)
OnForbidden: HTTP 403 "Forbidden" (text/plain)
```

---

## 6. Luồng xử lý thực tế

```
Frontend → POST /api/auth/login
    ↓
AuthController.LoginAsync()
    ↓ gọi
AuthService.LoginAsync(dto, ipAddress)
    ↓
1. FindUserByIdentifierAsync(emailOrPhone)
   → query Users WHERE Email = x OR PhoneNumber = normalized
    ↓
2. IsLockedOutAsync(user) → 423 nếu locked
    ↓
3. CheckPasswordAsync(user, password)
   → dùng Identity PasswordHasher verify PBKDF2
    ↓
4. GetRolesAsync(user) → ["Staff"]
    ↓
5. TwoFactorEnabled?
   YES → GenerateOtpCode() → save OtpCodes → SendEmail → return requiresOtp:true
   NO  → GenerateJwtToken() → save LoginHistory → return {token, roles, expiresAt}
```

---

## 7. Câu hỏi phản biện thường gặp

**Q: Tại sao dùng JWT thay vì Session?**
> JWT là stateless — server không cần lưu session state. Phù hợp với REST API và deploy trên container (multiple instances không share memory). Session cần sticky session hoặc distributed cache (Redis), phức tạp hơn nhiều.

**Q: JWT có thể bị revoke không?**
> JWT thuần thì không. Đây là limitation đã biết. Giải pháp production: dùng short-lived token (15 phút) + refresh token (stored in DB, có thể revoke). Trong scope đồ án, token 60 phút là chấp nhận được. Có thể thêm Redis blacklist nếu cần.

**Q: Tại sao dùng OTP 6 chữ số thay vì link email?**
> OTP phù hợp với cả SMS (không thể dùng link). Dễ nhập trên mobile. `RandomNumberGenerator.GetInt32` đảm bảo randomness đủ mạnh cho 6 chữ số.

**Q: OTP có bị brute-force không?**
> Có chống brute-force: max 5 attempts sau đó OTP bị invalidate. OTP expire sau 5-15 phút. Nếu cần mạnh hơn: thêm rate limiting per IP.

**Q: Tại sao login được bằng cả email và phone?**
> User-friendly cho thị trường Việt Nam — nhiều user không nhớ email. Code normalize phone (chỉ giữ digit) và email (lowercase) để tránh mismatch.

**Q: 2FA hoạt động như thế nào?**
> Login bình thường → check password → nếu 2FA enabled → gửi OTP → client POST `/verify-otp` → nhận token. Flow giống Google Authenticator nhưng dùng email/SMS thay vì TOTP.

**Q: ClockSkew = TimeSpan.Zero là gì?**
> JWT validation mặc định cho phép 5 phút clock drift giữa server và client. Setting này tắt tolerance đó, token expire đúng lúc được set. Giảm window attack.

**Q: Nếu user đổi password, token cũ có còn dùng được không?**
> Có — đây là limitation của JWT. Giải pháp: đưa version hash của password vào claim, reject token nếu hash không match. Chưa implement trong scope hiện tại.

**Q: IpAddress tracking để làm gì?**
> LoginHistory lưu IP để audit trail. Có thể dùng để detect suspicious login (khác country/IP). Chưa có logic tự động, chỉ lưu để reference.

**Q: Tại sao dùng `Guid` cho UserId thay vì `int`?**
> Guid không predictable (không thể đoán ID của user khác). Không cần sequence, an toàn với distributed systems. Trade-off: tốn thêm 12 bytes storage và index kém compact hơn bigint.
