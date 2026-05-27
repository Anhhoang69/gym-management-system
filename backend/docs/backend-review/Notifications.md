# 🔔 Notifications & Requests — Thông báo nội bộ & Yêu cầu

> **File liên quan:** `NotificationController.cs`, `NotificationService.cs`, `RequestController.cs`, `RequestService.cs`

---

## 1. Notification Module

### Tổng quan
Hệ thống thông báo nội bộ (in-app notification), không phải push notification. Thông báo được lưu DB và hiển thị khi user đăng nhập.

### Notification Types
```csharp
enum NotificationType {
    General, Payroll, Contract, Attendance,
    LeadAssigned, ClassUpdate, Request, System
}
```

### Database
```
Notifications
├── NotificationId  Guid PK
├── Title           string
├── Message         string
├── Type            NotificationType
├── SenderId        Guid? FK → Users (nullable - system notification)
├── CreatedAt       DateTime
└── IsRead          bool (aggregate - xem từng recipient)

NotificationRecipients (N-N)
├── NotificationId  Guid FK → Notifications (Cascade)
├── UserId          Guid FK → Users (Cascade)
├── IsRead          bool
└── ReadAt          DateTime?

UNIQUE INDEX: (NotificationId, UserId)
```

### Endpoints
```
GET  /api/notifications        - List notifications của tôi
POST /api/notifications        - Tạo và gửi notification [Staff+]
PUT  /api/notifications/{id}/read - Đánh dấu đã đọc
GET  /api/notifications/unread-count - Số thông báo chưa đọc
```

### Service Usage
```csharp
// PayrollService dùng NotificationService sau khi approve payroll:
await _notificationService.SendAsync(
    title: "Lương đã được duyệt",
    message: "Bảng lương tháng 5/2026 đã được phê duyệt",
    recipientIds: staffIds,
    type: NotificationType.Payroll
);
```

---

## 2. Request Module

### Tổng quan
Hệ thống yêu cầu hỗ trợ — member hoặc staff gửi yêu cầu, admin/manager xử lý.

### Request Categories
```csharp
enum RequestCategory {
    Technical,      // Lỗi hệ thống
    ContractChange, // Thay đổi hợp đồng
    Refund,         // Hoàn tiền
    Complaint,      // Khiếu nại
    Suggestion,     // Góp ý
    Other           // Khác
}
enum RequestType { Internal, External }
enum RequestStatus { Pending, InProgress, Resolved, Rejected }
```

### Database
```
Requests
├── RequestId       Guid PK
├── UserId          Guid FK → Users (người gửi)
├── Category        RequestCategory
├── Type            RequestType
├── Title           string
├── Description     string
├── Status          RequestStatus
├── HandledByUserId Guid? FK → Users (người xử lý)
├── AdminNote       string?
├── CreatedAt       DateTime
└── UpdatedAt       DateTime?
```

### Endpoints
```
GET    /api/requests       - List requests (filter by status, category)
POST   /api/requests       - Tạo request mới [Any authenticated]
GET    /api/requests/{id}  - Detail
PUT    /api/requests/{id}/status - Update status + admin note [Staff+]
```

---

## 3. Câu hỏi phản biện thường gặp

**Q: Tại sao không dùng Email cho notification?**
> In-app notification: không cần email, user check trong app. Email gây spam nếu nhiều notification. Có thể thêm email digest notification sau.

**Q: Real-time notification bằng WebSocket không?**
> Chưa có WebSocket/SignalR. User phải refresh/poll để thấy notification mới. Production improvement: SignalR hub push notification khi có message mới.

**Q: Notification có expire không?**
> Không có TTL. Notification tồn tại vĩnh viễn trong DB. Production: thêm cleanup job xóa notification cũ hơn 90 ngày.

**Q: Request module có email notification không?**
> Khi create request: không có email auto-notify admin. Admin phải check dashboard. Improvement: trigger email khi request mới được tạo.

**Q: Tại sao Request Category có Refund nhưng không có refund flow trong Invoice?**
> Request là "soft" channel — user báo cáo muốn refund, admin xử lý manually (có thể ngoài hệ thống). Invoice refund flow cần implement riêng nếu muốn tự động hóa.
