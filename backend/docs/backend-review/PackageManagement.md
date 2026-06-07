# 📦 Package Management — Gói tập & Chính sách

> **File liên quan:** `PackageController.cs`, `PackageService.cs`, `Package.cs`, `PackagePolicy.cs`

---

## 1. Tổng quan module

Quản lý các gói tập (membership packages) với cấu trúc linh hoạt:
- Nhiều tier gói (Trial, Basic, Premium, Elite)
- Nhiều mức giá theo thời hạn (1 tháng, 3 tháng, 12 tháng)
- Chính sách gói (multi-branch, freeze, PT sessions)
- Danh sách tính năng (features)
- Khuyến mãi (Promotions)

---

## 2. Cấu trúc Package

```
Package (gói tập)
├── PackagePolicy (1-1: chính sách)
│   ├── AllowMultiBranch
│   ├── FreezeAllowed + MaxFreezeDays
│   └── AllowTransfer
├── PackageFeatures (1-N: danh sách tính năng)
│   ├── "Phòng xông hơi"
│   ├── "Lớp Yoga không giới hạn"
│   └── "Tủ đồ riêng"
└── PackagePricings (1-N: bảng giá)
    ├── { DurationMonths: 1, Price: 500,000 }
    ├── { DurationMonths: 3, Price: 1,200,000 }
    └── { DurationMonths: 12, Price: 4,000,000 }
```

---

## 3. Enums

```csharp
enum PackageTier { Trial, Basic, Premium, Elite }
enum PackageStatus { Active, Inactive }
```

---

## 4. Các endpoint chính

```
GET    /api/packages         - List active packages (public cho landing page)
GET    /api/packages/{id}    - Detail + policy + pricings + features
POST   /api/packages         - Create [SuperAdmin | GymOwner]
PUT    /api/packages/{id}    - Update
DELETE /api/packages/{id}    - Soft delete (set Inactive)
POST   /api/packages/{id}/policy  - Create/update policy
POST   /api/packages/{id}/pricing - Add pricing tier
DELETE /api/packages/{id}/pricing/{pricingId} - Remove pricing tier
POST   /api/packages/{id}/feature  - Add feature
DELETE /api/packages/{id}/feature/{featureId} - Remove feature
```

---

## 5. Business Logic

### Tại sao không xóa Package có contract?
```csharp
// Soft delete: set Status = Inactive
// Contract cũ vẫn tham chiếu PackageId
// Không xóa cứng → không vi phạm FK
```

### PT sessions trong Package
```
Package.PrivatePtLimit   = số buổi PT 1-1 được phép
Package.GroupPtLimit     = số buổi class nhóm được phép
Package.IsPtIncluded     = có bao gồm PT không
```
Khi tạo Contract: copy values này vào `Contract.TotalPrivateSessions`, `Contract.TotalGroupSessions`.

---

## 6. Database

```
Packages
├── PackageId       Guid PK
├── Name            string
├── Tier            PackageTier
├── Description     string?
├── IsPtIncluded    bool
├── PrivatePtLimit  int (0 = không giới hạn hoặc không có)
├── GroupPtLimit    int
├── Status          PackageStatus
├── DisplayOrder    int (thứ tự hiển thị)
├── CreatedAt       DateTime
└── UpdatedAt       DateTime?

PackagePolicies (1-1 với Package)
├── PackageId         Guid PK & FK → Packages
├── AllowMultiBranch  bool
├── FreezeAllowed     bool
├── MaxFreezeDays     int?
└── AllowTransfer     bool

PackageFeatures (1-N)
├── FeatureId   Guid PK
├── PackageId   Guid FK → Packages (Cascade delete)
└── Content     string

PackagePricings (1-N)
├── PackagePricingId  Guid PK
├── PackageId         Guid FK → Packages (Cascade delete)
├── DurationMonths    int
└── Price             decimal
```

---

## 7. Câu hỏi phản biện thường gặp

**Q: Tại sao tách PackagePricing thay vì lưu price trực tiếp vào Package?**
> Flexible pricing: 1 gói có thể có nhiều mức giá (1 tháng, 3 tháng, 6 tháng, 1 năm). Không cần tạo 4 package riêng. Staff chọn duration khi tạo contract.

**Q: AllowMultiBranch trong PackagePolicy dùng ở đâu?**
> AttendanceService.CheckInAsync() kiểm tra: `if (!activeContract.Package.PackagePolicy.AllowMultiBranch && homeBranchId != dto.BranchId) throw`.

**Q: Nếu xóa pricing đang có trong draft/contract thì sao?**
> ContractDraft lưu `PricingId` → nếu pricing bị xóa → draft orphan. Production: cascade check hoặc soft-delete pricing. Trong scope đồ án, admin không nên xóa pricing đang dùng.

**Q: PrivatePtLimit = 0 có nghĩa gì?**
> Tuỳ convention. Hiện tại: 0 = không có PT sessions. Nếu muốn "unlimited": dùng -1 hoặc null. Cần document rõ.
