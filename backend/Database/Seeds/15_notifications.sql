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


-- =====================================================
-- NOTIFICATIONS BULK GENERATION (150+ Notifications & 800+ Recipients)
-- =====================================================
DO $$
DECLARE
  types       text[] := ARRAY['Info', 'System', 'Approval', 'Contract', 'Payment', 'Promotion', 'Schedule', 'Payroll'];
  
  -- Members and staff arrays
  member_ids  uuid[];
  staff_ids   uuid[];
  m_count     int;
  s_count     int;
  
  -- Loop variables
  n_id        uuid;
  n_type      text;
  n_title     text;
  n_msg       text;
  n_days_ago  int;
  n_created   timestamptz;
  
  rec_user_id uuid;
  rec_is_read boolean;
  rec_read_at timestamptz;
  
  num_recipients int;
  start_idx   int;
BEGIN
  -- Query all member and staff IDs
  SELECT ARRAY(SELECT "UserId" FROM "Members") INTO member_ids;
  SELECT ARRAY(SELECT "UserId" FROM "Staffs") INTO staff_ids;
  
  m_count := array_length(member_ids, 1);
  s_count := array_length(staff_ids, 1);

  FOR k IN 11..150 LOOP
    -- Cycle type
    n_type := types[(k % 8) + 1];
    n_days_ago := (k % 30) + 1; -- 1 to 30 days ago
    n_created := NOW() - (n_days_ago || ' days')::interval;

    -- Setup Title & Message based on Type
    CASE n_type
      WHEN 'Info' THEN
        n_title := 'Nhắc nhở tập luyện định kỳ';
        n_msg := 'Bạn đã không check-in trong 3 ngày qua. Đừng bỏ lỡ lịch tập để duy trì thể hình đẹp nhé!';
      WHEN 'System' THEN
        n_title := 'Cập nhật hệ thống thành công';
        n_msg := 'Hệ thống GymFit đã cập nhật phiên bản mới v2.6 với nhiều tính năng thông minh hơn.';
      WHEN 'Approval' THEN
        n_title := 'Yêu cầu của bạn đã được duyệt';
        n_msg := 'Yêu cầu điều chỉnh lịch tập hoặc gói hội viên của bạn đã được admin chi nhánh phê duyệt.';
      WHEN 'Contract' THEN
        n_title := 'Hạn hợp đồng hội viên';
        n_msg := 'Hợp đồng tập luyện của bạn sắp kết thúc. Vui lòng liên hệ quầy lễ tân để gia hạn gói mới.';
      WHEN 'Payment' THEN
        n_title := 'Hóa đơn đã thanh toán';
        n_msg := 'Thanh toán của bạn cho gói dịch vụ tại GymFit đã được ghi nhận thành công trên hệ thống.';
      WHEN 'Promotion' THEN
        n_title := 'Ưu đãi đặc biệt mùa hè';
        n_msg := 'Chương trình ưu đãi giảm giá lên tới 15% cho khách hàng đăng ký mới gói Premium và Elite.';
      WHEN 'Schedule' THEN
        n_title := 'Lịch học thay đổi';
        n_msg := 'Lớp học nhóm của bạn đã được điều chỉnh thời gian hoặc huấn luyện viên mới. Vui lòng kiểm tra lại lịch.';
      ELSE -- Payroll
        n_title := 'Thông báo bảng lương mới';
        n_msg := 'Bảng lương và hoa hồng tháng của bạn đã được tổng hợp xong và gửi đi xét duyệt.';
    END CASE;

    n_id := gen_random_uuid();
    INSERT INTO "Notifications"
        ("NotificationId","Title","Message","Type","SenderId","ActionUrl","CreatedAt")
    VALUES (
        n_id,
        n_title,
        n_msg,
        n_type,
        CASE WHEN n_type IN ('Schedule', 'Approval', 'Payment') THEN staff_ids[(k % s_count) + 1] ELSE null END,
        CASE WHEN n_type = 'Payment' THEN '/membership' WHEN n_type = 'Schedule' THEN '/classes' ELSE null END,
        n_created
    );

    -- Recipients assignment
    IF n_type IN ('System', 'Promotion') THEN
      -- Broadcast to multiple users (e.g. 25-30 members)
      num_recipients := 25 + (k % 6); -- 25 to 30 recipients
      start_idx := (k * 17) % m_count;
      FOR r IN 0..(num_recipients - 1) LOOP
        rec_user_id := member_ids[((start_idx + r) % m_count) + 1];
        rec_is_read := (r % 3 != 0); -- 66% read rate
        rec_read_at := CASE WHEN rec_is_read THEN n_created + interval '2 hours' ELSE null END;
        
        INSERT INTO "NotificationRecipients"
            ("NotificationRecipientId","NotificationId","UserId","IsRead","ReadAt","IsDeleted","CreatedAt")
        VALUES (
            gen_random_uuid(),
            n_id,
            rec_user_id,
            rec_is_read,
            rec_read_at,
            false,
            n_created
        );
      END LOOP;
    ELSIF n_type = 'Payroll' THEN
      -- Sent to 1 staff member
      rec_user_id := staff_ids[(k % s_count) + 1];
      rec_is_read := (k % 2 = 0);
      rec_read_at := CASE WHEN rec_is_read THEN n_created + interval '1 hour' ELSE null END;
      
      INSERT INTO "NotificationRecipients"
          ("NotificationRecipientId","NotificationId","UserId","IsRead","ReadAt","IsDeleted","CreatedAt")
      VALUES (
          gen_random_uuid(),
          n_id,
          rec_user_id,
          rec_is_read,
          rec_read_at,
          false,
          n_created
      );
    ELSE
      -- Sent to 1 member
      rec_user_id := member_ids[(k % m_count) + 1];
      rec_is_read := (k % 2 = 0);
      rec_read_at := CASE WHEN rec_is_read THEN n_created + interval '1 hour' ELSE null END;

      INSERT INTO "NotificationRecipients"
          ("NotificationRecipientId","NotificationId","UserId","IsRead","ReadAt","IsDeleted","CreatedAt")
      VALUES (
          gen_random_uuid(),
          n_id,
          rec_user_id,
          rec_is_read,
          rec_read_at,
          false,
          n_created
      );
    END IF;

  END LOOP;
END $$;
