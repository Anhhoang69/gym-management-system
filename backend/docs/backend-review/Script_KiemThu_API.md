# 🎤 SCRIPT THUYẾT TRÌNH — SLIDE KIỂM THỬ API

> **Dự án:** Gym Management System — ASP.NET Core 9
> **Phần:** Chương 7 — Kiểm thử hệ thống

---
---

# SLIDE A — KIỂM THỬ API: KẾT QUẢ (Slide Part 1 — Postman Collection)

> ⏱ Thời gian: 2–3 phút

## Mở đầu

"Về phần kiểm thử, em sử dụng **Postman** kết hợp **Newman CLI** để kiểm thử toàn diện các API của hệ thống."

---

### Phần 1 — Công cụ và phương pháp

> [Chỉ vào cây thư mục bên trái Postman — các collection]

"Bộ test được tổ chức thành **4 collection** tương ứng với 4 nhóm nghiệp vụ lớn:
- **Part 1** — Auth, Register, Profile, User Management
- **Part 2** — Branch, Room, Package, Promotion, Lead Sources, Lead
- **Part 3** — Member, Contract, Invoice & Payment, Attendance
- **Part 4** — Class Scheduling, Payroll, Notification, Reports, AI

Tổng cộng **20 nhóm** với **120 API request** và **268 assertion** được viết bằng JavaScript thông qua hàm `pm.test()` của Postman."

---

### Phần 2 — Cơ chế test script

> [Chỉ vào phần PASS bên phải — Status 200, Token is string, Response time]

"Mỗi request trong Postman đều có **test script tự động** chạy sau khi nhận response. Em kiểm tra 3 loại assertion chính:

Thứ nhất, **HTTP status code** — ví dụ Login thành công phải trả HTTP 200, Login sai mật khẩu phải trả HTTP 400.

Thứ hai, **schema response** — ví dụ kiểm tra token trả về phải là kiểu string, contractId không được null.

Thứ ba, **response time** — kiểm tra thời gian phản hồi phải dưới 2500ms."

---

### Phần 3 — Biến môi trường động

> [Chỉ vào cột collection bên trái, các thư mục 01-04]

"Điểm đặc biệt là hệ thống test dùng **biến môi trường động**. Sau mỗi bước đăng nhập, token JWT được lưu vào biến `superAdminToken`, `staffToken`, `memberToken`... để các bước sau tự động dùng mà không cần nhập tay.

Tương tự, `contractId`, `invoiceId`, `leadId`... được lưu tự động sau khi tạo entity, truyền sang request phụ thuộc phía sau. File `postman_environment.json` định nghĩa **35 biến** như vậy."

---

### Phần 4 — Kết quả Part 1

> [Chỉ vào khu vực Run results bên phải: 67 tests, 0 errors, 674ms avg]

"Slide này hiển thị kết quả chạy **Part 1** — phần Auth và quản lý người dùng:
- **67 assertion** — tất cả Passed
- **0 Errors**
- Thời gian phản hồi trung bình **674ms** — do chạy trên localhost có overhead khởi động
- Thời gian tổng thực thi: **22 giây 301ms**

Em sẽ điểm qua một vài test case đặc biệt ở phần Auth — ví dụ Login SuperAdmin: PASS Status 200, PASS Token is string, PASS Response time < 2500ms. Tương tự cho GymOwner, Staff Sales, Member."

---

### Câu kết slide A

"Như vậy Part 1 đã kiểm thử đầy đủ luồng đăng nhập cho 4 vai trò, xác minh phân quyền, và validate input."

---

### ❓ Câu hỏi phản biện — Slide này

| Câu hỏi | Trả lời ngắn |
|---|---|
| Tại sao dùng Postman không dùng xUnit? | Postman test end-to-end toàn bộ luồng HTTP — bao gồm middleware, auth, business logic. xUnit phù hợp unit test service riêng lẻ. Hai công cụ bổ sung nhau. |
| pm.test dùng thư viện gì? | Chai assertion library — tích hợp sẵn trong Postman. Cú pháp `pm.expect(x).to.be.a('string')`. |
| Biến môi trường có bảo mật không? | File environment.json trong .gitignore. Không commit credentials. Khi share collection: share template không có secrets. |
| Response time 674ms có chậm không? | Chạy trên localhost với EF Core lazy startup — cold start cao hơn. Production Railway: avg ~124ms theo kết quả newman run. |

---
---

# SLIDE B — KIỂM THỬ API: KẾT QUẢ (Slide Full Run — 268 Assertions 100%)

> ⏱ Thời gian: 2–3 phút

## Mở đầu

"Slide này là kết quả **Full Run** — chạy toàn bộ 20 module cùng một lần."

---

### Phần 1 — Kết quả tổng quan

> [Chỉ vào 4 chỉ số lớn: Errors=0, Avg Resp Time=657ms, All tests=268, Duration=1m39s]

"Kết quả Full Run cho thấy:
- **120 API requests** trên 20 module
- **268 assertions** — toàn bộ **Passed**, **0 Failed**, **0 Skipped**
- Tỷ lệ pass: **100%**
- Thời gian phản hồi trung bình: **657ms** (localhost)
- Tổng thời gian thực thi: **1 phút 39 giây**"

---

### Phần 2 — Thứ tự thực thi phụ thuộc

> [Chỉ vào cây thư mục bên trái: 01. Auth → 02. Register → ... → 20. Audit Log]

"Các module được sắp xếp theo thứ tự **phụ thuộc dữ liệu**:

- Bước 01 Auth đăng nhập lấy token → token này được dùng ở tất cả bước sau
- Bước 10 Lead tạo lead, convert → lấy `contractId` và `invoiceId`
- Bước 12 Contract tạo draft, generate contract với `contractId` vừa có
- Bước 13 Invoice phát hành hóa đơn → collect payment → activate
- Bước 15 Class tạo lớp, member booking, staff điểm danh
- Bước 20 AI chat dùng token member để gửi tin nhắn

Thứ tự này đảm bảo mỗi bước có đủ dữ liệu đầu vào — không cần setup thủ công."

---

### Phần 3 — 4 loại kịch bản kiểm thử

> [Có thể chỉ vào phần PASS Status 400, PASS Error message exists trong slide]

"Em thiết kế 4 loại kịch bản kiểm thử:

**Positive Test**: Gửi dữ liệu hợp lệ → expect HTTP 200/201 và schema response đúng. Ví dụ: Login thành công, tạo hợp đồng thành công.

**Negative Test**: Gửi dữ liệu sai/thiếu → expect HTTP 400 kèm thông báo lỗi cụ thể. Ví dụ: Login thiếu password, tạo lead thiếu phone.

**Authorization Test**: Gọi API không có token → expect HTTP 401. Gọi với token sai role → expect HTTP 403. Ví dụ: Member cố truy cập `/api/users` → 403.

**Business Rule Test**: Kiểm tra ràng buộc nghiệp vụ. Ví dụ: kích hoạt contract khi invoice chưa paid → HTTP 400. Đây là loại test quan trọng nhất — xác nhận business logic đúng."

---

### Phần 4 — Nhận xét kết quả

> [Chỉ vào dòng tổng kết: 120 API Requests • 268 Assertions • 100% Passed]

"Em có một số nhận xét về kết quả:

**Về xác thực và phân quyền**: JWT Bearer Token hoạt động chính xác. 401 và 403 trả về đúng trong mọi trường hợp test.

**Về performance**: Thời gian phản hồi trung bình thực tế là **124ms** (đo bằng Newman CLI trên localhost khi app đã warm up). Endpoint chậm nhất là Reports — **834ms** do phải aggregate nhiều bảng dữ liệu. Các endpoint CRUD đơn lẻ đều dưới **300ms**.

**Về tính toàn vẹn luồng**: Luồng đầy đủ từ tạo lead → convert member → phát hành hóa đơn → thu tiền → kích hoạt thẻ — được kiểm thử thành công xuyên suốt, xác nhận các module liên kết đúng."

---

### Câu kết slide B

"Tóm lại, **268/268 assertion Passed, 0 Failed** — hệ thống đáp ứng đầy đủ về tính đúng đắn, bảo mật và hiệu suất, sẵn sàng tích hợp Frontend và triển khai production."

---

### ❓ Câu hỏi phản biện — Slide Full Run

| Câu hỏi | Trả lời ngắn |
|---|---|
| 100% pass nghĩa là không có bug? | Không. 100% pass có nghĩa là các test case đã viết đều pass. Test coverage phụ thuộc vào mức độ toàn diện của test cases. Edge cases chưa cover hết. |
| Edge case nào chưa cover? | Race condition (2 người book cùng 1 chỗ cuối), file upload lớn hơn limit, timeout network, đăng nhập từ nhiều device cùng lúc. |
| Newman CLI là gì? | CLI runner để chạy Postman collection ngoài giao diện — CI/CD friendly. Lệnh: `newman run collection.json -e environment.json`. Kết quả export ra report HTML/JSON. |
| Tại sao không có load test? | Load test (JMeter, k6) ngoài scope đồ án. Performance test dựa trên response time từ functional test. Avg 124ms cho thấy performance chấp nhận được. |
| Test data được setup như thế nào? | Dùng dữ liệu từ SQL seed scripts (21 file seed). Collection chạy theo thứ tự để tự tạo dữ liệu. Module 0 "Part 4 Setup" chứa các bước chuẩn bị dữ liệu nếu cần. |
| Nếu 1 test fail thì các test sau có bị ảnh hưởng không? | Có — vì biến môi trường của step trước trống. Ví dụ login fail → token null → toàn bộ test sau fail theo. Đây là limitation của sequential dependency test. |
| Có test cho AI chat không? | Có — Module 20 bao gồm AI chat. Test kiểm tra response HTTP 200 và message không null. Không thể assert chất lượng nội dung AI bằng automation. |
