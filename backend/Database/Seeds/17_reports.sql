-- =====================================================
-- 17_REPORTS.SQL
-- Seed AuditLogs + LoginHistories + Requests
-- (Dữ liệu hỗ trợ báo cáo và theo dõi hoạt động)
-- =====================================================

-- =====================================================
-- AUDIT LOGS
-- =====================================================
INSERT INTO "AuditLogs"
    ("AuditLogId","UserId","EntityType","EntityId","Action",
     "OldValue","NewValue","CreatedAt","BranchId")
VALUES

-- Staff tạo hợp đồng
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000006',
    'Contract', 'ffffffff-0001-0000-0000-000000000001', 'CREATE',
    null,
    '{"status":"Active","package":"Basic","dealPrice":1259100}',
    NOW() - interval '30 days',
    'aaaaaaaa-0001-0000-0000-000000000001'
),
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000006',
    'Contract', 'ffffffff-0001-0000-0000-000000000002', 'CREATE',
    null,
    '{"status":"Active","package":"Premium","dealPrice":899000}',
    NOW() - interval '15 days',
    'aaaaaaaa-0001-0000-0000-000000000001'
),
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000006',
    'Contract', 'ffffffff-0001-0000-0000-000000000003', 'CREATE',
    null,
    '{"status":"Active","package":"Elite","dealPrice":7999000}',
    NOW() - interval '60 days',
    'aaaaaaaa-0001-0000-0000-000000000001'
),

-- Payment được xử lý
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000006',
    'Payment', 'aaaaaaab-0001-0000-0000-000000000001', 'UPDATE',
    '{"status":"Pending"}',
    '{"status":"Completed","method":"BankTransfer","amount":1259100}',
    NOW() - interval '30 days',
    'aaaaaaaa-0001-0000-0000-000000000001'
),
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000006',
    'Payment', 'aaaaaaab-0001-0000-0000-000000000002', 'UPDATE',
    '{"status":"Pending"}',
    '{"status":"Completed","method":"EWallet","amount":899000}',
    NOW() - interval '15 days',
    'aaaaaaaa-0001-0000-0000-000000000001'
),

-- GymOwner duyệt bảng lương
(
    gen_random_uuid(),
    '00000000-0002-0000-0000-000000000001',
    'PayrollRecord', '00000000-0000-0000-0000-000000000001', 'UPDATE',
    '{"status":"Draft"}',
    '{"status":"Approved"}',
    NOW() - interval '15 days',
    null
),

-- Admin cập nhật thông tin chi nhánh
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000001',
    'Branch', 'aaaaaaaa-0001-0000-0000-000000000001', 'UPDATE',
    '{"openingHours":"06:00 - 21:00"}',
    '{"openingHours":"06:00 - 22:00"}',
    NOW() - interval '30 days',
    'aaaaaaaa-0001-0000-0000-000000000001'
),

-- Hủy hợp đồng
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000001',
    'Contract', 'ffffffff-0001-0000-0000-000000000011', 'UPDATE',
    '{"status":"Active"}',
    '{"status":"Cancelled","reason":"Khách yêu cầu hủy vì lý do cá nhân"}',
    NOW() - interval '1 day',
    'aaaaaaaa-0001-0000-0000-000000000001'
),

-- Lead chuyển đổi thành Member
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000006',
    'Lead', 'eeeeeeee-0001-0000-0000-000000000004', 'UPDATE',
    '{"status":"Qualified"}',
    '{"status":"Converted","convertedMemberId":"00000000-0004-0000-0000-000000000001"}',
    NOW() - interval '175 days',
    'aaaaaaaa-0001-0000-0000-000000000001'
),

-- Cập nhật trạng thái lead
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000006',
    'Lead', 'eeeeeeee-0001-0000-0000-000000000002', 'UPDATE',
    '{"status":"New"}',
    '{"status":"Contacted","note":"Đã gọi điện, khách quan tâm"}',
    NOW() - interval '2 days',
    'aaaaaaaa-0001-0000-0000-000000000001'
),

-- Tạo promotion mới
(
    gen_random_uuid(),
    '00000000-0001-0000-0000-000000000001',
    'Promotion', 'eeeeeeee-0002-0000-0000-000000000002', 'CREATE',
    null,
    '{"name":"Ưu Đãi Mùa Hè 2025","code":"SUMMER2025","discount":"10%"}',
    NOW() - interval '35 days',
    null
);

-- =====================================================
-- LOGIN HISTORIES
-- =====================================================
INSERT INTO "LoginHistories"
    ("LoginHistoryId","UserId","IpAddress","UserAgent","LoginAt","IsRevoked")
VALUES
(gen_random_uuid(), '00000000-0001-0000-0000-000000000001', '127.0.0.1', 'Mozilla/5.0 Chrome/124', NOW() - interval '1 day', false),
(gen_random_uuid(), '00000000-0002-0000-0000-000000000001', '192.168.1.100', 'Mozilla/5.0 Chrome/124', NOW() - interval '2 days', false),
(gen_random_uuid(), '00000000-0003-0000-0000-000000000001', '192.168.1.101', 'Mozilla/5.0 Firefox/125', NOW() - interval '1 day', false),
(gen_random_uuid(), '00000000-0003-0000-0000-000000000006', '192.168.1.105', 'Mozilla/5.0 Chrome/124', NOW() - interval '1 day', false),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000001', '10.0.0.50', 'Mozilla/5.0 Safari/17', NOW() - interval '5 days', false),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000001', '10.0.0.50', 'GymFit-Mobile/2.1 iOS', NOW() - interval '3 days', false),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000002', '10.0.0.51', 'GymFit-Mobile/2.1 Android', NOW() - interval '3 days', false),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000003', '10.0.0.52', 'Mozilla/5.0 Chrome/124', NOW() - interval '1 day', false),
-- Revoked session (suspicious activity)
(gen_random_uuid(), '00000000-0004-0000-0000-000000000005', '10.0.1.200', 'Mozilla/5.0 Chrome/124', NOW() - interval '2 hours', true),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000005', '10.0.1.200', 'GymFit-Mobile/2.1 Android', NOW() - interval '1 hour', false);

-- =====================================================
-- REQUESTS (Yêu cầu hỗ trợ / phê duyệt)
-- RequestType: Support, Complaint, Approval
-- RequestCategory: BranchCreate, BranchUpdate, BranchDeactivate, ContractChange, RefundRequest
-- RequestStatus: Pending, InProgress, Resolved, Rejected, Approved, Cancelled
-- =====================================================
INSERT INTO "Requests"
    ("RequestId","UserId","Type","Category","Title","Description",
     "Status","ResponseMessage","AttachmentUrl","Payload",
     "RelatedEntityType","RelatedEntityId",
     "HandledByUserId","ResolvedAt","CreatedAt")
VALUES

-- Request 1: Mở chi nhánh mới - PENDING
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000001',
    'Approval', 'BranchCreate',
    'Yêu cầu mở chi nhánh GymFit Bình Thạnh',
    'Đề xuất mở chi nhánh mới tại Quận Bình Thạnh theo kế hoạch mở rộng Q2/2025. Đã tìm được mặt bằng và nhân sự.',
    'Pending', null, null,
    '{"branchId":"aaaaaaaa-0001-0000-0000-000000000003"}',
    'Branch', 'aaaaaaaa-0001-0000-0000-000000000003',
    null, null, NOW() - interval '30 days'
),

-- Request 2: Hỗ trợ kỹ thuật - RESOLVED
(
    gen_random_uuid(),
    '00000000-0004-0000-0000-000000000002',
    'Support', 'ContractChange',
    'Không thể đặt lịch lớp Yoga buổi sáng',
    'Tôi bị lỗi khi cố đặt chỗ lớp Yoga 07:00 sáng. Hệ thống báo lỗi "Không thể đặt chỗ". Vui lòng hỗ trợ.',
    'Resolved', 'Lỗi đã được khắc phục. Bạn có thể đặt lịch lại bình thường.', null, null,
    'Class', 'cccccccc-0002-0000-0000-000000000003',
    '00000000-0003-0000-0000-000000000001',
    NOW() - interval '5 days', NOW() - interval '7 days'
),

-- Request 3: Khiếu nại - IN PROGRESS
(
    gen_random_uuid(),
    '00000000-0004-0000-0000-000000000004',
    'Complaint', 'ContractChange',
    'Phòng Cardio bị ồn ào và thiếu thiết bị',
    'Phòng Cardio thường xuyên thiếu máy tập, và tiếng nhạc quá to gây khó chịu. Mong ban quản lý cải thiện.',
    'InProgress', 'Chúng tôi đã ghi nhận phản ánh và đang xem xét.', null, null,
    'Branch', 'aaaaaaaa-0001-0000-0000-000000000001',
    '00000000-0003-0000-0000-000000000001',
    null, NOW() - interval '10 days'
),

-- Request 4: Hoàn tiền hợp đồng - APPROVED
(
    gen_random_uuid(),
    '00000000-0004-0000-0000-000000000010',
    'Support', 'RefundRequest',
    'Yêu cầu hoàn tiền hợp đồng đã hủy',
    'Tôi đã hủy hợp đồng Basic vì lý do sức khỏe. Xin hoàn lại phần ngày còn lại theo chính sách.',
    'Approved',
    'Yêu cầu đã được duyệt. Số tiền 450.000đ sẽ được hoàn lại trong 7 ngày làm việc.',
    null,
    '{"contractId":"ffffffff-0001-0000-0000-000000000011","refundAmount":450000}',
    'Contract', 'ffffffff-0001-0000-0000-000000000011',
    '00000000-0003-0000-0000-000000000001',
    NOW() - interval '1 day', NOW() - interval '2 days'
);
