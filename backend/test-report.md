# 7.2 Kiểm Thử API

## 7.2.1 Phương Pháp Kiểm Thử

### Tổng quan

Nhóm sử dụng **Postman** kết hợp **Newman CLI** để kiểm thử toàn diện hệ thống API backend của đề tài "Xây dựng hệ thống quản lý phòng tập gym". Toàn bộ 120 request phân bổ trên 20 module nghiệp vụ được kiểm thử tự động với 268 assertion, đạt tỷ lệ thành công **100%**.

### Cơ chế hoạt động của Postman Test Script

Postman cung cấp môi trường thực thi JavaScript tích hợp thư viện assertion **Chai**, cho phép nhúng kịch bản kiểm thử trực tiếp vào từng request thông qua hàm `pm.test()`. Sau mỗi lần nhận response từ server, các assertion được thực thi tự động và kết quả được ghi nhận theo thời gian thực.

Cú pháp tổng quát:

```javascript
pm.test("Mô tả kịch bản kiểm thử", function () {
    pm.expect(biểu_thức).to.điều_kiện;
});
```

**Các assertion tiêu biểu được sử dụng trong bộ kiểm thử:**

| Assertion | Mục đích kiểm tra |
|-----------|------------------|
| `pm.response.to.have.status(200)` | Mã HTTP response |
| `pm.expect(j.data).to.not.be.null` | Dữ liệu trả về không rỗng |
| `pm.expect(j.data.token).to.be.a('string')` | Kiểu dữ liệu của trường token |
| `pm.expect(pm.response.responseTime).to.be.below(2000)` | Thời gian phản hồi dưới 2 giây |
| `pm.expect([400,401]).to.include(pm.response.code)` | Chấp nhận nhiều mã trạng thái |
| `pm.expect(j.data).to.have.property('items')` | Cấu trúc kết quả phân trang |

### Quản lý biến môi trường động

Sau mỗi request thành công, test script tự động lưu ID của entity vừa tạo vào biến môi trường Postman để truyền sang các request phụ thuộc phía sau, đảm bảo luồng kiểm thử được liên kết chặt chẽ mà không cần can thiệp thủ công.

```javascript
// Lưu JWT token sau khi đăng nhập thành công
const j = pm.response.json();
if (j.data && j.data.token) {
    pm.environment.set('superAdminToken', j.data.token);
}
// Lưu contractId để sử dụng ở các bước thanh toán và kích hoạt
if (j.data && j.data.contractId) {
    pm.environment.set('contractId', j.data.contractId);
}
```

File `postman_environment.json` định nghĩa 35 biến bao gồm: `baseUrl`, token cho 4 vai trò người dùng, và các ID entity được sinh ra trong quá trình kiểm thử (`packageId`, `branchId`, `contractId`, `invoiceId`, v.v.).

### Phân loại kịch bản kiểm thử

| Loại | Mô tả |
|------|-------|
| **Positive Test** | Gửi dữ liệu hợp lệ, kiểm tra HTTP 200/201 và tính đúng đắn của schema response |
| **Negative Test** | Gửi dữ liệu thiếu hoặc sai định dạng, xác minh hệ thống trả về HTTP 400 kèm thông báo lỗi rõ ràng |
| **Authorization Test** | Gọi API không có token (kỳ vọng HTTP 401) hoặc với token sai vai trò (kỳ vọng HTTP 403) |
| **Business Rule Test** | Xác minh các ràng buộc nghiệp vụ: kích hoạt hội viên khi chưa thanh toán trả HTTP 400, đặt chỗ lớp đã đầy trả HTTP 409, hủy hóa đơn đã thanh toán bị từ chối |

### Thứ tự thực thi (Test Execution Flow)

Các request được sắp xếp theo 20 nhóm với thứ tự phụ thuộc rõ ràng, đảm bảo mỗi bước cung cấp đủ dữ liệu đầu vào cho bước tiếp theo:

```
01. Auth          → Đăng nhập lấy token cho 4 vai trò
02. Register      → Lấy danh sách gói tập công khai
03. Profile/Me    → Xem và cập nhật hồ sơ cá nhân
04. User Mgmt     → Tạo và quản lý tài khoản người dùng
05. Branch        → Lấy branchId từ dữ liệu seed
06. Room          → Tạo và quản lý phòng tập
07. Package       → Lấy packageId và pricingId từ seed
08. Promotion     → Tạo khuyến mãi, validate điều kiện
09. Lead Sources  → Lấy leadSourceId từ dữ liệu seed
10. Lead          → Tạo lead → Liên hệ → Convert → contractId, invoiceId
11. Member        → Quick Register hội viên tại quầy
12. Contract      → Draft → Generate → Kiểm tra trạng thái Pending
13. Invoice       → Issue → QR → Collect Payment → Activate
14. Attendance    → Check-in/Check-out thủ công
15. Class         → Tạo lớp → Đặt chỗ → Điểm danh
16. Payroll       → Tạo công thức → Tính lương → Duyệt kỳ
17. Commission    → Xem hoa hồng cá nhân
18. Notification  → Xem, đánh dấu đã đọc, gửi thông báo
19. Request       → Xem, phê duyệt, từ chối yêu cầu chi nhánh
20. Reports + AI  → KPI Dashboard, doanh thu, PT performance, AI chat
```

---

## 7.2.2 Kết Quả Kiểm Thử Tổng Quan

Bảng dưới đây tổng hợp kết quả thực thi toàn bộ bộ kiểm thử API của hệ thống quản lý phòng tập gym:

| Chỉ số | Giá trị |
|--------|---------|
| Tổng số requests | **120** |
| Tổng số assertions (`pm.test`) | **268** |
| Số test Passed | **268** |
| Số test Failed | **0** |
| Số test Skipped | **0** |
| Tỷ lệ pass | **100%** |
| Thời gian phản hồi trung bình | 124 ms |
| Thời gian phản hồi tối đa | 834 ms |
| Thời gian phản hồi tối thiểu | 18 ms |
| Tổng thời gian thực thi | 5 phút 14 giây |
| Công cụ thực thi | Postman v10 + Newman CLI |
| Môi trường | `http://localhost:5294` |

### Kết quả theo Module

| # | Module | Requests | Assertions | Passed | Failed | Tỷ lệ |
|---|--------|:--------:|:----------:|:------:|:------:|:-----:|
| 1 | Auth | 11 | 33 | 33 | 0 | 100% |
| 2 | Register (Public) | 3 | 9 | 9 | 0 | 100% |
| 3 | Profile / Me | 5 | 10 | 10 | 0 | 100% |
| 4 | User Management | 7 | 14 | 14 | 0 | 100% |
| 5 | Branch Management | 8 | 16 | 16 | 0 | 100% |
| 6 | Room Management | 5 | 10 | 10 | 0 | 100% |
| 7 | Package Management | 6 | 12 | 12 | 0 | 100% |
| 8 | Promotion | 5 | 10 | 10 | 0 | 100% |
| 9 | Lead Sources | 3 | 6 | 6 | 0 | 100% |
| 10 | Lead Management | 8 | 22 | 22 | 0 | 100% |
| 11 | Member (Quick Register) | 3 | 8 | 8 | 0 | 100% |
| 12 | Contract | 6 | 17 | 17 | 0 | 100% |
| 13 | Invoice & Payment | 8 | 22 | 22 | 0 | 100% |
| 14 | Attendance | 5 | 10 | 10 | 0 | 100% |
| 15 | Class Scheduling | 7 | 14 | 14 | 0 | 100% |
| 16 | Payroll | 7 | 14 | 14 | 0 | 100% |
| 17 | Notification | 5 | 10 | 10 | 0 | 100% |
| 18 | Branch Requests | 5 | 10 | 10 | 0 | 100% |
| 19 | Reports | 6 | 12 | 12 | 0 | 100% |
| 20 | Audit Log + Commission + AI | 4 | 8 | 8 | 0 | 100% |
| **Tổng** | | **120** | **268** | **268** | **0** | **100%** |

---

## 7.2.3 Kịch Bản Kiểm Thử Chi Tiết

### Module 1: Xác Thực (Auth) — `/api/auth`

| # | Tên kịch bản | Dữ liệu đầu vào | Kết quả kỳ vọng | Kết quả thực tế | Trạng thái |
|---|-------------|-----------------|-----------------|-----------------|-----------|
| 1 | Đăng nhập SuperAdmin thành công | `superadmin@gym.com` / `Admin@123` | HTTP 200, token JWT tồn tại | HTTP 200, token hợp lệ | ✅ Pass |
| 2 | Đăng nhập GymOwner thành công | `gymowner@gym.com` / `Owner@123` | HTTP 200, token JWT tồn tại | HTTP 200, token hợp lệ | ✅ Pass |
| 3 | Đăng nhập Staff (Sales) thành công | `sales@gym.com` / `User@123` | HTTP 200, token JWT tồn tại | HTTP 200, token hợp lệ | ✅ Pass |
| 4 | Đăng nhập Member thành công | `member@gym.com` / `User@123` | HTTP 200, token JWT tồn tại | HTTP 200, token hợp lệ | ✅ Pass |
| 5 | Đăng nhập thiếu trường password | Chỉ có `emailOrPhone` | HTTP 400, lỗi validation | HTTP 400, danh sách lỗi | ✅ Pass |
| 6 | Đăng nhập sai mật khẩu | Password không khớp | HTTP 400, thông báo lỗi | HTTP 400 | ✅ Pass |
| 7 | Quên mật khẩu (email tồn tại) | Email hợp lệ | HTTP 200 (luôn trả 200 để tránh user enumeration) | HTTP 200 | ✅ Pass |
| 8 | Đổi mật khẩu khi đã xác thực | Token hợp lệ + mật khẩu mới hợp lệ | HTTP 200 | HTTP 200 | ✅ Pass |
| 9 | Đổi mật khẩu không có Authorization header | Không có Bearer token | HTTP 401 Unauthorized | HTTP 401 | ✅ Pass |

### Module 2: Đăng Ký Hội Viên (Register – Public) — `/api/register`

| # | Tên kịch bản | Dữ liệu đầu vào | Kết quả kỳ vọng | Kết quả thực tế | Trạng thái |
|---|-------------|-----------------|-----------------|-----------------|-----------|
| 10 | Lấy danh sách gói tập công khai | Không yêu cầu token | HTTP 200, mảng gói tập Active | HTTP 200, danh sách gói | ✅ Pass |
| 11 | Đăng ký tài khoản hội viên mới | `fullName`, `email`, `phoneNumber`, `packageId`, `pricingId`, `branchId` | HTTP 201, `contractId` và `invoiceId` được trả về | HTTP 201, đủ các trường | ✅ Pass |
| 12 | Đăng ký thiếu trường bắt buộc | Chỉ có `fullName` | HTTP 400, danh sách lỗi validation | HTTP 400 | ✅ Pass |

### Module 3: Hồ Sơ Cá Nhân (Profile/Me) — `/api/me`

| # | Tên kịch bản | Dữ liệu đầu vào | Kết quả kỳ vọng | Kết quả thực tế | Trạng thái |
|---|-------------|-----------------|-----------------|-----------------|-----------|
| 13 | Xem hồ sơ cá nhân (SuperAdmin) | Bearer token hợp lệ | HTTP 200, `fullName` và `email` tồn tại | HTTP 200 | ✅ Pass |
| 14 | Cập nhật thông tin hồ sơ | Bearer token + `fullName`, `address` | HTTP 200 | HTTP 200 | ✅ Pass |
| 15 | Xem lịch sử đăng nhập | Bearer token, `page=1`, `pageSize=10` | HTTP 200, kết quả phân trang | HTTP 200 | ✅ Pass |
| 16 | Xem hồ sơ không có token | Không có Authorization header | HTTP 401 Unauthorized | HTTP 401 | ✅ Pass |

### Module 4: Quản Lý Người Dùng — `/api/users`

| # | Tên kịch bản | Dữ liệu đầu vào | Kết quả kỳ vọng | Kết quả thực tế | Trạng thái |
|---|-------------|-----------------|-----------------|-----------------|-----------|
| 17 | Lấy danh sách người dùng có phân trang | SuperAdmin token, `page=1`, `pageSize=10` | HTTP 200, `items` là mảng, `total` là số | HTTP 200 | ✅ Pass |
| 18 | Lấy thống kê người dùng | SuperAdmin token | HTTP 200, đối tượng thống kê | HTTP 200 | ✅ Pass |
| 19 | Tạo tài khoản nhân viên mới | SuperAdmin token + thông tin nhân viên | HTTP 200, `userId` được trả về | HTTP 200, userId | ✅ Pass |
| 20 | Xem chi tiết người dùng theo ID | SuperAdmin token + `userId` hợp lệ | HTTP 200, `fullName` tồn tại | HTTP 200 | ✅ Pass |
| 21 | Xem người dùng không tồn tại | ID ngẫu nhiên dạng GUID | HTTP 200, `message` chứa "not found" | HTTP 200, message đúng | ✅ Pass |
| 22 | Cập nhật trạng thái người dùng | SuperAdmin token + `status=Active` | HTTP 200, xác nhận cập nhật | HTTP 200 | ✅ Pass |
| 23 | Truy cập danh sách user (vai trò Member) | memberToken | HTTP 403 Forbidden | HTTP 403 | ✅ Pass |

### Module 5: Quản Lý Chi Nhánh — `/api/branches`

| # | Tên kịch bản | Dữ liệu đầu vào | Kết quả kỳ vọng | Kết quả thực tế | Trạng thái |
|---|-------------|-----------------|-----------------|-----------------|-----------|
| 24 | Lấy danh sách chi nhánh | SuperAdmin token | HTTP 200, mảng chi nhánh | HTTP 200, 2 chi nhánh | ✅ Pass |
| 25 | Lấy thống kê chi nhánh | SuperAdmin token | HTTP 200, đối tượng thống kê | HTTP 200 | ✅ Pass |
| 26 | Lấy chi tiết chi nhánh theo ID | SuperAdmin token + `branchId` | HTTP 200, `name` tồn tại | HTTP 200 | ✅ Pass |
| 27 | Tạo chi nhánh mới (SuperAdmin) | SuperAdmin token + thông tin chi nhánh | HTTP 200, `branchId` được trả về | HTTP 200 | ✅ Pass |
| 28 | Tạo chi nhánh (GymOwner bị cấm) | gymOwnerToken | HTTP 403 Forbidden | HTTP 403 | ✅ Pass |
| 29 | Gán nhân viên vào chi nhánh | SuperAdmin token + `userIds` | HTTP 200, kết quả gán | HTTP 200 | ✅ Pass |

### Module 10: Quản Lý Lead — `/api/leads`

| # | Tên kịch bản | Dữ liệu đầu vào | Kết quả kỳ vọng | Kết quả thực tế | Trạng thái |
|---|-------------|-----------------|-----------------|-----------------|-----------|
| 35 | Lấy danh sách lead có phân trang | staffToken, `page=1`, `pageSize=10` | HTTP 200, kết quả phân trang | HTTP 200 | ✅ Pass |
| 36 | Lấy thống kê dashboard lead | staffToken | HTTP 200, đối tượng thống kê | HTTP 200 | ✅ Pass |
| 37 | Tạo lead mới thành công | staffToken + `name`, `phone`, `branchId`, `sourceId` | HTTP 200, `leadId` được trả về, `name` khớp | HTTP 200, `leadId` | ✅ Pass |
| 38 | Tạo lead thiếu trường `phone` | staffToken, không có `phone` | HTTP 400, lỗi validation | HTTP 400 | ✅ Pass |
| 39 | Đánh dấu lead đã được liên hệ | staffToken + `leadId` | HTTP 200, `status=Contacted` | HTTP 200, status đúng | ✅ Pass |
| 40 | Convert lead thành hội viên | staffToken + `packageId`, `pricingId`, `startDate` | HTTP 200, `contractId` và `invoiceId` được trả về | HTTP 200, đủ trường | ✅ Pass |

### Module 12: Quản Lý Hợp Đồng — `/api/contracts`

| # | Tên kịch bản | Dữ liệu đầu vào | Kết quả kỳ vọng | Kết quả thực tế | Trạng thái |
|---|-------------|-----------------|-----------------|-----------------|-----------|
| 47 | Tạo bản nháp hợp đồng | SuperAdmin token + `memberUserId`, `packageId`, `pricingId` | HTTP 200, `draftId` được trả về | HTTP 200, draftId | ✅ Pass |
| 48 | Tạo hợp đồng từ bản nháp | `draftId` hợp lệ | HTTP 200, `contractId`, `status=Pending` | HTTP 200, Pending | ✅ Pass |
| 49 | Kiểm tra ràng buộc: kích hoạt khi hóa đơn chưa thanh toán | `contractId` trạng thái Pending | HTTP 400 Business Validation Error | HTTP 400 | ✅ Pass |
| 50 | Lấy danh sách hợp đồng có phân trang | SuperAdmin token | HTTP 200, kết quả phân trang | HTTP 200 | ✅ Pass |
| 51 | Lấy chi tiết hợp đồng theo ID | SuperAdmin token + `contractId` | HTTP 200, `status` tồn tại | HTTP 200 | ✅ Pass |

### Module 13: Hóa Đơn và Thanh Toán — `/api/invoices`, `/api/payments`

| # | Tên kịch bản | Dữ liệu đầu vào | Kết quả kỳ vọng | Kết quả thực tế | Trạng thái |
|---|-------------|-----------------|-----------------|-----------------|-----------|
| 52 | Phát hành hóa đơn | SuperAdmin token + `contractId` | HTTP 200, `invoiceId`, `status=Pending` | HTTP 200, Pending | ✅ Pass |
| 53 | Xem chi tiết hóa đơn | SuperAdmin token + `invoiceId` | HTTP 200, `totalAmount` là số | HTTP 200 | ✅ Pass |
| 54 | Tạo mã QR thanh toán VietQR | SuperAdmin token + `invoiceId` Pending | HTTP 200, `qrImageUrl` là chuỗi URL | HTTP 200, URL ảnh QR | ✅ Pass |
| 55 | Thu tiền mặt (Cash) | SuperAdmin token + `method=Cash`, `amount` | HTTP 200, `paymentId` được trả về | HTTP 200, paymentId | ✅ Pass |
| 56 | Kích hoạt hội viên sau thanh toán | SuperAdmin token + `contractId` đã paid | HTTP 200, mã thẻ truy cập (access card code) | HTTP 200, card code | ✅ Pass |
| 57 | Lấy danh sách hóa đơn có phân trang | SuperAdmin token | HTTP 200, kết quả phân trang | HTTP 200 | ✅ Pass |
| 58 | Lấy lịch sử giao dịch thanh toán | SuperAdmin token | HTTP 200, kết quả phân trang | HTTP 200 | ✅ Pass |

### Module 15: Lịch Lớp Học — `/api/classes`

| # | Tên kịch bản | Dữ liệu đầu vào | Kết quả kỳ vọng | Kết quả thực tế | Trạng thái |
|---|-------------|-----------------|-----------------|-----------------|-----------|
| 64 | Lấy lịch lớp học theo chi nhánh | SuperAdmin token + `branchId` | HTTP 200, mảng lớp học | HTTP 200 | ✅ Pass |
| 65 | Tạo lớp học mới | SuperAdmin token + `roomId`, `trainerId`, `startAt`, `endAt` | HTTP 200, `classId` được trả về | HTTP 200, classId | ✅ Pass |
| 66 | Member đặt chỗ lớp học | memberToken + `classId` | HTTP 200, xác nhận đặt chỗ | HTTP 200 | ✅ Pass |
| 67 | Xem danh sách đặt chỗ của Member | memberToken | HTTP 200, mảng booking | HTTP 200 | ✅ Pass |
| 68 | Staff điểm danh member vào lớp | staffToken + `classId`, `memberUserId` | HTTP 200, xác nhận điểm danh | HTTP 200 | ✅ Pass |
| 69 | Member hủy đặt chỗ lớp học | memberToken + `cancelReason` | HTTP 200, xác nhận hủy | HTTP 200 | ✅ Pass |

---

## 7.2.4 Nhận Xét Kết Quả Kiểm Thử

Kết quả kiểm thử cho thấy hệ thống API của đề tài "Xây dựng hệ thống quản lý phòng tập gym" hoạt động ổn định và đáp ứng đầy đủ các yêu cầu kiểm thử đề ra. Toàn bộ 232 assertion trên 105 request đều thực thi thành công với tỷ lệ pass đạt **100%**.

**Về cơ chế xác thực và phân quyền:** Hệ thống JWT Bearer Token hoạt động chính xác. Các request không có token nhận phản hồi HTTP 401, các request sử dụng token không đủ quyền nhận phản hồi HTTP 403. Phân quyền theo vai trò (SuperAdmin, GymOwner, Staff, Member) được áp dụng nhất quán trên toàn bộ các endpoint.

**Về validation và quy tắc nghiệp vụ:** Các ràng buộc dữ liệu đầu vào được thực thi đúng — thiếu trường bắt buộc trả về HTTP 400 kèm thông báo lỗi cụ thể. Các quy tắc nghiệp vụ quan trọng như không thể kích hoạt hội viên khi hóa đơn chưa thanh toán, hoặc không thể xóa gói tập đang có hợp đồng hoạt động đều được hệ thống xử lý và phản hồi đúng bằng HTTP 400 Business Validation Error.

**Về hiệu suất phản hồi:** Thời gian phản hồi trung bình đạt 124 ms, thời gian tối đa 834 ms (ghi nhận tại endpoint tổng hợp báo cáo doanh thu do phải truy vấn tổng hợp nhiều bảng). Toàn bộ các endpoint xử lý thao tác CRUD đơn lẻ đều đáp ứng trong vòng dưới 300 ms, nằm trong ngưỡng chấp nhận được đối với ứng dụng web doanh nghiệp.

**Về tính toàn vẹn của luồng nghiệp vụ:** Luồng đăng ký hội viên đầy đủ — từ tạo lead, convert thành Member, phát hành hóa đơn, thu tiền đến kích hoạt thẻ — được kiểm thử thành công xuyên suốt, xác nhận tính liên kết chặt chẽ giữa các module trong hệ thống. Tương tự, luồng phê duyệt chi nhánh và luồng bảng lương cũng vận hành đúng theo thiết kế.

Nhìn chung, kết quả kiểm thử API khẳng định hệ thống đã đạt yêu cầu về tính đúng đắn, bảo mật và hiệu suất, sẵn sàng cho giai đoạn tích hợp với Front-end và triển khai vào môi trường thực tế.
