# 🎤 Script Thuyết Trình — Slide ERD Giản Lược

> **Thời gian khuyến nghị:** 3–5 phút
> **Phong cách:** Tự tin, nói từ hiểu biết thực tế, không đọc slide

---

## 📢 Lời mở đầu (15 giây)

> *"Đây là sơ đồ ERD giản lược của hệ thống. Em sẽ trình bày theo từng nhóm thực thể để hội đồng dễ theo dõi."*

---

## 🧩 Phần 1 — Nhóm USER (trung tâm ERD) (~40 giây)

> *"Trọng tâm của ERD là thực thể **USER** — đây là bảng gốc kế thừa từ ASP.NET Identity.*

> *USER có hai chuyên biệt hóa:*
> - *Một là **MEMBER** — hội viên, được tạo khi đăng ký gói tập.*
> - *Hai là **STAFF** — nhân viên, với 5 vị trí khác nhau: **BranchAdmin, HeadPT, Sales, PT, Receptionist** — thể hiện bằng ký hiệu vòng tròn chuyên biệt hóa (generalization) trong ERD.*

> *USER còn liên kết với:*
> - ***ROLE** qua bảng trung gian UserRole — để phân quyền JWT.*
> - ***OTP_CODE** và **LOGIN_HISTORY** — phục vụ xác thực 2 bước và audit đăng nhập.*
> - ***AUDITLOG** và **NOTIFICATION** — ghi nhận mọi hành động và gửi thông báo nội bộ."*

---

## 🧩 Phần 2 — Nhóm CRM: LEAD & STAFF (~30 giây)

> *"Về phía **STAFF**:*
> - *Staff **quản lý** LEAD — mỗi lead được assign cho 1 Sales staff.*
> - *Lead có **LEAD_SOURCE** để biết nguồn tiếp cận: Facebook, website, walk-in...*
> - *Khi lead đồng ý mua, hệ thống **Convert** lead thành MEMBER — đây là điểm giao giữa CRM và hệ thống hội viên.*

> *Staff cũng có **PAYROLL_RECORDS** để tính lương, dùng công thức **PAYROLLFORMULA**. PT có thêm quan hệ **Teaches** với CLASS."*

---

## 🧩 Phần 3 — Nhóm MEMBER & hợp đồng (~50 giây)

> *"MEMBER là thực thể trung tâm của nghiệp vụ. MEMBER có các liên kết sau:*

> *Thứ nhất, **ACCESS_CARD** — mỗi hội viên có 1 thẻ vật lý để check-in. Quan hệ 1-1.*

> *Thứ hai, **ATTENDANCE** — mỗi lần quẹt thẻ tạo ra 1 bản ghi điểm danh, thuộc về 1 **BRANCH**.*

> *Thứ ba, luồng hợp đồng:*
> - *MEMBER **ký** CONTRACT thông qua **CONTRACT_DRAFT** — draft là bước preview giá trước khi xác nhận.*
> - *CONTRACT liên kết với **PACKAGE** — gói tập có **PACKAGE_POLICY** (chính sách multi-branch, freeze...) và **PACKAGE_PRICING** (bảng giá theo số tháng).*
> - *CONTRACT được áp dụng **PROMOTION** để giảm giá.*
> - *CONTRACT **issues** ra **INVOICE** — hóa đơn, và INVOICE được thanh toán qua **PAYMENT**.*
> - *Khi Sales chốt hợp đồng, hệ thống tạo **COMMISSION** cho nhân viên đó.*
> - ***CONTRACT_ADJUST** ghi lại lịch sử gia hạn hoặc nâng gói."*

---

## 🧩 Phần 4 — Nhóm lớp học & chi nhánh (~30 giây)

> *"**BRANCH** là đơn vị tổ chức. Trong mỗi chi nhánh có nhiều **ROOM** — phòng tập.*

> *Lịch học (**CLASS**) được tổ chức trong ROOM, do PT **dạy**. Member **booking** vào CLASS.*

> *Staff làm việc (**works at**) tại BRANCH. BRANCH cũng có **PROMOTION** riêng."*

---

## 🧩 Phần 5 — Nhóm AI (~20 giây)

> *"Cuối cùng, ở góc dưới trái, là các thực thể phục vụ **AI Chat Assistant**:*
> - ***CHAT_HISTORY** — lưu lịch sử hội thoại của từng hội viên.*
> - ***AI_CONTEXT_CACHE** — cache thông tin hội viên để không query DB mỗi lần chat.*
> - ***AI_RECOMMENDATION** — lưu kế hoạch tập luyện và dinh dưỡng do AI sinh ra.*

> *Cả 3 đều thuộc về MEMBER theo quan hệ 1-N."*

---

## 🎯 Câu kết (10 giây)

> *"Tổng thể, ERD có khoảng **37 thực thể**, tổ chức thành 5 nhóm nghiệp vụ rõ ràng. Em thiết kế để đảm bảo **tính toàn vẹn tham chiếu** thông qua foreign key và **cascade delete** ở những quan hệ phụ thuộc mạnh."*

---

## ⚠️ Câu hỏi phản biện thường gặp cho slide này

**Q: Tại sao STAFF là generalization thay vì nhiều bảng riêng?**
> "Em chọn single-table inheritance với STAFF là bảng duy nhất, dùng cột **Position** (enum) để phân biệt vai trò. Điều này tránh JOIN phức tạp khi query thông tin nhân viên, đồng thời EF Core hỗ trợ enum-to-string conversion rất tốt."

**Q: Quan hệ USER và MEMBER/STAFF là gì?**
> "Quan hệ 1-1. USER là identity chứa thông tin đăng nhập, MEMBER và STAFF là profile chuyên biệt. Thiết kế này theo pattern Table-per-Hierarchy, phù hợp với ASP.NET Identity."

**Q: Tại sao có CONTRACT_DRAFT riêng thay vì tạo CONTRACT luôn?**
> "CONTRACT_DRAFT là bước xác nhận trước khi commit — staff preview giá, kiểm tra promotion, rồi mới generate contract thật. Draft expire sau 24 giờ, tránh data rác tồn tại lâu trong DB."

**Q: COMMISSION và PAYROLL_RECORDS khác nhau thế nào?**
> "COMMISSION được tạo ngay khi activate contract — ghi nhận hoa hồng của Sales. PAYROLL_RECORDS được tính cuối tháng — tổng hợp BaseSalary + SessionCommission (PT) + KpiBonus + SalesCommission (từ bảng Commissions đã duyệt). Hai bảng phục vụ 2 mục đích khác nhau."

**Q: Tại sao ACCESS_CARD tách riêng thay vì lưu vào MEMBER?**
> "Vì thẻ có vòng đời độc lập: thẻ có thể bị mất (Lost), thay thế, inactive... mà không ảnh hưởng đến MEMBER record. Tách riêng cho phép audit lịch sử thẻ và issue thẻ mới khi cần."

**Q: Cardinality của MEMBER và CONTRACT là gì?**
> "1-N — một hội viên có thể có nhiều contract theo thời gian (gia hạn, nâng gói). Nhưng tại 1 thời điểm chỉ có 1 contract Active. Điều này được check bằng filter Status trong query."

---

## 💡 Tips khi thuyết trình

- **Dùng tay chỉ vào ERD** trên màn hình projector khi đề cập từng thực thể
- **Không cần đọc hết tên bảng** — chỉ focus vào nhóm đang nói
- **Nhấn mạnh quan hệ quan trọng**: MEMBER↔CONTRACT, LEAD→MEMBER (Convert), USER→STAFF/MEMBER
- Nếu hội đồng hỏi sâu về 1 bảng cụ thể → tham chiếu sang file tài liệu module tương ứng
- **Câu mở đầu tự tin**: Đừng nói "Em xin phép trình bày..." — nói thẳng vào nội dung
