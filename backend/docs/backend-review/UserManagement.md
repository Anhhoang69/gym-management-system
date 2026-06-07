# 👤 User Management — Quản lý người dùng & hồ sơ

> **File liên quan:** `UserController.cs`, `UserService.cs`, `ProfileController.cs`, `ProfileService.cs`, `RegisterController.cs`, `RegistrationService.cs`

---

## 1. Tổng quan module

Quản lý tài khoản người dùng trong hệ thống, bao gồm:
- Admin tạo/quản lý Staff accounts
- Member tự quản lý hồ sơ cá nhân
- Registration flow (quick register, convert từ lead)
- Profile update, avatar upload

---

## 2. User Model

```
AspNetUsers (User)
├── Id            Guid PK
├── Email         string (unique)
├── PhoneNumber   string
├── FullName      string?
├── Birthday      DateTime?
├── Gender        Gender? (Male | Female | Other)
├── AvatarUrl     string?
├── InitialBranchId Guid? FK → Branches (chi nhánh đăng ký)
├── TwoFactorEnabled bool
├── CreatedAt     DateTime
├── LastLoginAt   DateTime?
└── Status        UserStatus (Active | Inactive | Suspended)

Staffs (1-1 với User)
├── UserId        Guid PK & FK → Users
├── BranchId      Guid FK → Branches
├── Position      StaffPosition (Sales|Receptionist|PT|HeadPT|BranchAdmin)
├── BaseSalary    decimal? (override default formula salary)
└── HireDate      DateTime?

Members (1-1 với User)
└── UserId        Guid PK & FK → Users
    (thêm data member-specific nếu cần)

PTProfiles (1-1 với Staff)
├── StaffUserId   Guid PK & FK → Staffs
├── Bio           string?
├── Specialization string?
├── CertificationUrl string?
└── ExperienceYears int?
```

---

## 3. Các endpoint chính

### User Management (Admin)
```
GET    /api/users                   - List users (filter by role, branch, status)
GET    /api/users/{id}              - Detail
POST   /api/users/staff             - Tạo Staff account
PUT    /api/users/{id}              - Update user
POST   /api/users/{id}/assign-role  - Assign role
POST   /api/users/{id}/deactivate   - Soft deactivate
```

### Profile (Self)
```
GET    /api/profile                 - Xem hồ sơ mình
PUT    /api/profile                 - Update thông tin cá nhân
POST   /api/profile/avatar          - Upload avatar
GET    /api/profile/login-history   - Xem lịch sử đăng nhập
```

### Registration
```
POST   /api/register                - Quick register (tạo member account tại quầy)
```

---

## 4. Business Logic

### Tạo Staff Account
```csharp
// UserService.CreateStaffAsync()
var tempPassword = RegistrationService.GenerateTempPassword();
var user = new User { ... };
await _userManager.CreateAsync(user, tempPassword);
await _userManager.AddToRoleAsync(user, "Staff");
_context.Staffs.Add(new Staff { UserId = user.Id, Position = dto.Position, BranchId = dto.BranchId });
// Gửi email với tempPassword → Staff đăng nhập và đổi password
await _emailService.SendActivationAsync(user.Email, user.FullName, tempPassword);
```

### Quick Register (Member mới tại quầy)
```csharp
// RegistrationService
var cardCode = GenerateCardCode(user.Id);
// Format: "GYM-{userId.ToString().Substring(0,4)}-{random}"
// Ví dụ: GYM-A3F7-B2C9

_context.AccessCards.Add(new AccessCard {
    CardCode = cardCode,
    Status = AccessCardStatus.Inactive  // Activate sau khi có contract + payment
});
```

### Avatar Upload
```csharp
// ProfileService.UploadAvatarAsync()
var avatarUrl = await _cloudinaryService.UploadImageAsync(file, folder: "avatars");
user.AvatarUrl = avatarUrl;
// Không xóa ảnh cũ (simplicity) — Cloudinary có thể cleanup manually
```

### Soft Deactivate User
```csharp
user.Status = UserStatus.Inactive;
// Không xóa: lịch sử contracts, payments, attendances vẫn giữ
// User bị inactive không thể login (check ở AuthService nếu implement)
```

---

## 5. Password Management

```csharp
// Temp password generation
public static string GenerateTempPassword()
{
    // Format: Gym + random 8 chars (upper + digit)
    // Ví dụ: Gym#A3F7b2C9
    // Đủ mạnh để vượt Identity password policy
}
```

Identity password policy mặc định:
- Min 6 ký tự
- 1 uppercase, 1 digit, 1 special char

---

## 6. Câu hỏi phản biện thường gặp

**Q: Tại sao không có email verification khi đăng ký?**
> Gym là closed-loop system — staff tạo account cho member (không self-register online). Email verification không cần thiết vì staff verify identity trực tiếp. Nếu mở self-registration: thêm email confirm flow.

**Q: Tại sao gửi temporary password qua email?**
> Standard B2B/enterprise pattern: admin-created accounts với forced password change. Thay vì để member chọn password trước, temp password đảm bảo staff control onboarding.

**Q: User có thể có cả Member và Staff không?**
> Không — User.Member và User.Staff là 1-1 riêng biệt. Một người không thể vừa là hội viên vừa là nhân viên trong cùng 1 account (theo design hiện tại). Nếu cần: thêm logic cho "employee-member" discount.

**Q: InitialBranchId có thể thay đổi không?**
> Có thể update qua PUT /api/profile. InitialBranchId xác định "home branch" cho multi-branch check-in policy.

**Q: Tại sao không có UserProfile table riêng?**
> Thông tin profile (FullName, Birthday, Gender, Avatar) được lưu thẳng vào `User` entity. Đủ cho scope hiện tại. Nếu cần profile phức tạp hơn (social links, certifications...): tách ra UserProfile table.
