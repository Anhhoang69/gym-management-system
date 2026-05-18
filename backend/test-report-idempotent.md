# K?ch B?n Ki?m Th? (Idempotent Design)
Do yêu c?u ch?y ki?m th? liên t?c trên cùng m?t DB mà không th?c hi?n reset, toàn b? k?ch b?n ki?m th? dã du?c thi?t k? l?i theo hu?ng **Hoàn toàn d?c l?p (Idempotent)**:
1. **Random Hóa D? Li?u:** M?i API t?o m?i (`Create Lead`, `Create Package`, `Create Room`...) d?u du?c nhúng bi?n d?ng `{{$timestamp}}`, `{{$randomEmail}}` và Pre-request Script t? t?o s? di?n tho?i `{{randomPhone}}` chu?n 10 s?.
2. **Cô l?p Tr?ng Thái (State Isolation):**
   - Các API có m?c th?i gian tinh (nhu T?o L?p H?c, Tính Luong) dã du?c thêm Script d? t? d?ng sinh ra Tháng/Nam ho?c Ngày gi? h?p l? trong tuong lai.
   - Các API thay d?i tr?ng thái (nhu `Approve Request`, `Reject Request`) du?c trích xu?t thông minh (nh?m m?c tiêu vào các Request th?c s? dang `Pending` thay vì Request tinh).

Tuy nhiên, trong mô hình API khép kín, m?t s? bài toán State r?t khó d? làm 100% xanh mà không có Tear-down script (ví d?: Check-in b?ng m?t ContractId n?u b? d?t gãy ? bu?c thanh toán tru?c dó s? gây 404). Backend v?n dang b?o v? d? li?u c?c k? t?t.
