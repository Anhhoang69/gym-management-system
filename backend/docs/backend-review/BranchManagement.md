# 🏢 Branch Management — Quản lý chi nhánh

> **File liên quan:** `BranchController.cs`, `BranchService.cs`, `RoomController.cs`, `RoomService.cs`

---

## 1. Tổng quan module

Quản lý thông tin chi nhánh phòng gym và các phòng tập bên trong.

**Hierarchy:**
```
Branch (Chi nhánh)
└── Rooms (Phòng tập)
    └── Classes (Lớp học theo lịch)
```

---

## 2. Các endpoint chính

### Branch CRUD
```
GET    /api/branches          - List (public endpoint, filter active)
GET    /api/branches/{id}     - Detail
POST   /api/branches          - Create [SuperAdmin | GymOwner]
PUT    /api/branches/{id}     - Update [SuperAdmin | GymOwner]
DELETE /api/branches/{id}     - Soft delete [SuperAdmin | GymOwner]
POST   /api/branches/{id}/images  - Upload ảnh [Admin]
DELETE /api/branches/{id}/images/{imageId} - Xóa ảnh [Admin]
```

### Room CRUD
```
GET    /api/rooms             - List (filter by branchId)
GET    /api/rooms/{id}        - Detail
POST   /api/rooms             - Create [Staff+]
PUT    /api/rooms/{id}        - Update [Staff+]
DELETE /api/rooms/{id}        - Delete [Staff+]
POST   /api/rooms/{id}/images - Upload ảnh
```

---

## 3. Business Logic quan trọng

### Soft Delete
```csharp
// Không xóa Branch khỏi DB
public async Task<bool> DeleteBranchAsync(Guid id)
{
    branch.Status = BranchStatus.Inactive;
    branch.UpdatedAt = DateTime.UtcNow;
    await _context.SaveChangesAsync();
    return true;
}
```
**Tại sao soft delete?**
- Staff, Members, Contracts có FK tới Branch
- Xóa cứng → FK violation
- Giữ historical data cho reports
- Có thể reactivate sau

### Unique constraint: Room number per branch
```csharp
// ApplicationDbContext.cs
builder.Entity<Room>()
    .HasIndex(r => new { r.BranchId, r.RoomNumber })
    .IsUnique();
// Phòng số 101 có thể tồn tại ở nhiều chi nhánh khác nhau
```

### Image Upload với Cloudinary
```csharp
// BranchService.AddImageAsync()
var imageUrl = await _cloudinaryService.UploadImageAsync(file, folder: "branches");
_context.BranchImages.Add(new BranchImage {
    BranchId = branchId,
    ImageUrl = imageUrl
});
```

---

## 4. Database

```
Branches
├── BranchId     Guid PK
├── Name         string
├── Address      string
├── Phone        string?
├── Email        string?
├── Status       BranchStatus (Active | Inactive)
├── OpenTime     TimeOnly?
├── CloseTime    TimeOnly?
├── Capacity     int?
├── CreatedAt    DateTime
└── UpdatedAt    DateTime?

BranchImages
├── ImageId   Guid PK
├── BranchId  Guid FK → Branches
└── ImageUrl  string (Cloudinary URL)

Rooms
├── RoomId     Guid PK
├── BranchId   Guid FK → Branches
├── Name       string
├── RoomNumber string
├── Capacity   int
├── Status     RoomStatus (Active | Inactive | Maintenance)
├── CreatedAt  DateTime
└── UpdatedAt  DateTime?

UNIQUE INDEX: (BranchId, RoomNumber)
```

---

## 5. Cloudinary Integration

```csharp
// CloudinaryService.cs
var uploadParams = new ImageUploadParams
{
    File = new FileDescription(file.FileName, stream),
    Folder = folder,  // "branches", "rooms", "gym"
    Transformation = new Transformation()
        .Quality("auto")    // Auto optimize quality
        .FetchFormat("auto") // Serve WebP nếu browser support
};
var result = await _cloudinary.UploadAsync(uploadParams);
return result.SecureUrl.ToString(); // https://res.cloudinary.com/...
```

**Tại sao Cloudinary?**
- Không cần self-host file server
- Auto-resize, auto-format (WebP), CDN global
- Free tier: 25GB storage, 25GB bandwidth/tháng

---

## 6. Câu hỏi phản biện thường gặp

**Q: Tại sao không lưu file ảnh lên server?**
> Server Railway là ephemeral — file upload lên server sẽ mất khi container restart/redeploy. Cloudinary persistent storage giải quyết vấn đề này. Cũng không cần manage disk space.

**Q: Tại sao Branch có OpenTime/CloseTime nhưng không enforce khi check-in?**
> Đúng — hiện tại không validate giờ check-in với giờ mở cửa. Production: thêm validation trong `AttendanceService.CheckInAsync()`: `if (now < branch.OpenTime || now > branch.CloseTime) throw`.

**Q: Multi-branch system — member của branch A có xem được thông tin branch B không?**
> Thông tin branch (GET /api/branches) là public. Class schedule filter theo branchId. Attendance chỉ xem data của mình. Không có thông tin sensitive bị leak qua branch cross-access.

**Q: Branch deletion có ảnh hưởng gì?**
> Soft delete → Branch.Status = Inactive. Staff của branch đó vẫn tồn tại. Classes trong branch đó vẫn tồn tại (không auto-cancel). Cần business decision về cascade xử lý.

**Q: Tại sao không có Branch Manager role riêng?**
> Branch Manager = Staff với Position = BranchAdmin. Không cần thêm Role vì Role đã có Staff — Position là fine-grained permission đủ.
