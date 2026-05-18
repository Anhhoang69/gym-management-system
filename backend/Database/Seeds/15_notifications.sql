-- =====================================================
-- 15_NOTIFICATIONS.SQL
-- Seed thông báo hệ thống
-- =====================================================

-- =====================================================
-- NOTIFICATIONS
-- NotificationType: Info, System, Approval, Contract, Payment, Promotion, Schedule, Payroll
-- =====================================================
INSERT INTO "Notifications"
    ("NotificationId","Title","Message","Type","SenderId","ActionUrl","CreatedAt")
VALUES

-- Thông báo hệ thống: Chào mừng
(
    'ffffffff-0002-0000-0000-000000000001',
    'Chào mừng đến với GymFit!',
    'Chào mừng bạn đã gia nhập GymFit! Hãy khám phá các tính năng và bắt đầu hành trình rèn luyện sức khỏe của bạn.',
    'System', null, '/dashboard',
    NOW() - interval '30 days'
),

-- Thông báo hợp đồng: Sắp hết hạn
(
    'ffffffff-0002-0000-0000-000000000002',
    'Hợp đồng sắp hết hạn',
    'Hợp đồng gói Basic của bạn sẽ hết hạn trong 15 ngày nữa. Hãy gia hạn sớm để không gián đoạn việc tập luyện!',
    'Contract', null, '/membership/renew',
    NOW() - interval '15 days'
),

-- Thông báo thanh toán thành công
(
    'ffffffff-0002-0000-0000-000000000003',
    'Thanh toán thành công',
    'Giao dịch thanh toán gói Premium 1 tháng của bạn đã được xác nhận thành công. Chúc bạn tập luyện vui vẻ!',
    'Payment', '00000000-0003-0000-0000-000000000006', '/membership',
    NOW() - interval '15 days'
),

-- Thông báo lớp học mới
(
    'ffffffff-0002-0000-0000-000000000004',
    'Lớp Yoga mới đã được lên lịch',
    'Lớp "Yoga Thư Giãn Buổi Sáng" sẽ diễn ra vào hôm nay lúc 07:00. Đừng quên đặt chỗ nếu bạn chưa đăng ký!',
    'Schedule', '00000000-0003-0000-0000-000000000004', '/classes',
    NOW() - interval '1 day'
),

-- Thông báo khuyến mãi
(
    'ffffffff-0002-0000-0000-000000000005',
    'Ưu Đãi Mùa Hè 2025 - Giảm 10%!',
    'GymFit triển khai chương trình khuyến mãi mùa hè với ưu đãi giảm 10% cho tất cả gói Premium và Elite. Áp dụng đến hết tháng 7/2025. Dùng mã: SUMMER2025',
    'Promotion', null, '/packages',
    NOW() - interval '30 days'
),

-- Thông báo lương đã duyệt
(
    'ffffffff-0002-0000-0000-000000000006',
    'Bảng lương tháng 4/2025 đã được duyệt',
    'Bảng lương tháng 4/2025 của bạn đã được GymOwner xét duyệt. Lương sẽ được chuyển khoản trong vòng 3 ngày làm việc.',
    'Payroll', '00000000-0002-0000-0000-000000000001', '/payroll',
    NOW() - interval '20 days'
),

-- Thông báo phê duyệt yêu cầu
(
    'ffffffff-0002-0000-0000-000000000007',
    'Yêu cầu đóng băng hợp đồng đã được chấp thuận',
    'Yêu cầu tạm dừng hợp đồng của bạn đã được chấp thuận. Hợp đồng sẽ được đóng băng từ ngày 01/05/2025 đến ngày 15/05/2025.',
    'Approval', '00000000-0003-0000-0000-000000000001', '/membership',
    NOW() - interval '25 days'
),

-- Thông báo hệ thống bảo trì
(
    'ffffffff-0002-0000-0000-000000000008',
    'Thông báo bảo trì hệ thống',
    'Hệ thống sẽ tạm ngưng bảo trì từ 02:00 - 04:00 sáng ngày 20/05/2025. Xin lỗi vì sự bất tiện này!',
    'System', null, null,
    NOW() - interval '1 day'
),

-- Thông báo nhắc nhở tập luyện
(
    'ffffffff-0002-0000-0000-000000000009',
    'Bạn chưa check-in tuần này!',
    'Chúng tôi nhận thấy bạn chưa ghé thăm GymFit tuần này. Đặt lịch tập ngay hôm nay để duy trì thói quen tốt!',
    'Info', null, '/classes',
    NOW() - interval '3 days'
),

-- Thông báo hết hạn thẻ
(
    'ffffffff-0002-0000-0000-000000000010',
    'Thẻ ra vào hết hạn',
    'Thẻ ra vào của bạn sẽ hết hạn trong 7 ngày. Vui lòng đến quầy lễ tân để gia hạn hoặc đổi thẻ mới.',
    'Contract', null, '/profile',
    NOW() - interval '7 days'
);

-- =====================================================
-- NOTIFICATION RECIPIENTS
-- =====================================================
INSERT INTO "NotificationRecipients"
    ("NotificationRecipientId","NotificationId","UserId","IsRead","ReadAt","IsDeleted","CreatedAt")
VALUES

-- Thông báo 1: Chào mừng (gửi cho tất cả members mới)
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000001', '00000000-0004-0000-0000-000000000001', true, NOW() - interval '29 days', false, NOW() - interval '30 days'),
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000001', '00000000-0004-0000-0000-000000000002', true, NOW() - interval '28 days', false, NOW() - interval '30 days'),
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000001', '00000000-0004-0000-0000-000000000007', false, null, false, NOW() - interval '3 days'),
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000001', '00000000-0004-0000-0000-000000000008', false, null, false, NOW()),
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000001', '00000000-0004-0000-0000-000000000010', false, null, false, NOW() - interval '10 days'),

-- Thông báo 2: Sắp hết hạn (cho member Bích)
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000002', '00000000-0004-0000-0000-000000000002', false, null, false, NOW() - interval '15 days'),

-- Thông báo 3: Thanh toán thành công (cho member Bích)
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000003', '00000000-0004-0000-0000-000000000002', true, NOW() - interval '14 days', false, NOW() - interval '15 days'),

-- Thông báo 4: Lớp học mới (broadcast toàn chi nhánh Q1)
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000004', '00000000-0004-0000-0000-000000000001', false, null, false, NOW() - interval '1 day'),
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000004', '00000000-0004-0000-0000-000000000002', true, NOW() - interval '22 hours', false, NOW() - interval '1 day'),
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000004', '00000000-0004-0000-0000-000000000003', false, null, false, NOW() - interval '1 day'),
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000004', '00000000-0004-0000-0000-000000000004', false, null, false, NOW() - interval '1 day'),

-- Thông báo 5: Khuyến mãi (broadcast toàn hệ thống)
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000005', '00000000-0004-0000-0000-000000000001', true, NOW() - interval '28 days', false, NOW() - interval '30 days'),
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000005', '00000000-0004-0000-0000-000000000002', true, NOW() - interval '28 days', false, NOW() - interval '30 days'),
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000005', '00000000-0004-0000-0000-000000000003', true, NOW() - interval '27 days', false, NOW() - interval '30 days'),
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000005', '00000000-0004-0000-0000-000000000004', false, null, false, NOW() - interval '30 days'),
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000005', '00000000-0004-0000-0000-000000000005', true, NOW() - interval '26 days', false, NOW() - interval '30 days'),

-- Thông báo 6: Lương (cho các Staff)
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000006', '00000000-0003-0000-0000-000000000003', true, NOW() - interval '18 days', false, NOW() - interval '20 days'),
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000006', '00000000-0003-0000-0000-000000000004', false, null, false, NOW() - interval '20 days'),
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000006', '00000000-0003-0000-0000-000000000005', true, NOW() - interval '19 days', false, NOW() - interval '20 days'),
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000006', '00000000-0003-0000-0000-000000000006', true, NOW() - interval '19 days', false, NOW() - interval '20 days'),

-- Thông báo 7: Phê duyệt (cho member Cường)
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000007', '00000000-0004-0000-0000-000000000003', true, NOW() - interval '24 days', false, NOW() - interval '25 days'),

-- Thông báo 8: Bảo trì (toàn hệ thống)
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000008', '00000000-0001-0000-0000-000000000001', true, NOW() - interval '20 hours', false, NOW() - interval '1 day'),
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000008', '00000000-0002-0000-0000-000000000001', false, null, false, NOW() - interval '1 day'),
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000008', '00000000-0003-0000-0000-000000000001', false, null, false, NOW() - interval '1 day'),

-- Thông báo 9: Nhắc nhở (member ít check-in)
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000009', '00000000-0004-0000-0000-000000000004', false, null, false, NOW() - interval '3 days'),
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000009', '00000000-0004-0000-0000-000000000009', false, null, false, NOW() - interval '3 days'),

-- Thông báo 10: Thẻ hết hạn (member Bích)
(gen_random_uuid(), 'ffffffff-0002-0000-0000-000000000010', '00000000-0004-0000-0000-000000000002', false, null, false, NOW() - interval '7 days');
