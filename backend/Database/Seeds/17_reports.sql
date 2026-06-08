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


-- =====================================================
-- AUDIT LOGS & LOGIN HISTORIES BULK GENERATION
-- =====================================================
DO $$
DECLARE
  staff_ids uuid[];
  user_ids  uuid[];
  branch_ids uuid[];
  
  s_count   int;
  u_count   int;
  b_count   int;
  
  action_types text[] := ARRAY['CREATE', 'UPDATE', 'DELETE'];
  entity_types text[] := ARRAY['Contract', 'Payment', 'Invoice', 'Member', 'Branch', 'Class'];
  
  log_created timestamptz;
BEGIN
  -- Get arrays
  SELECT ARRAY(SELECT "UserId" FROM "Staffs") INTO staff_ids;
  SELECT ARRAY(SELECT "Id" FROM "AspNetUsers") INTO user_ids;
  SELECT ARRAY(SELECT "BranchId" FROM "Branches") INTO branch_ids;
  
  s_count := array_length(staff_ids, 1);
  u_count := array_length(user_ids, 1);
  b_count := array_length(branch_ids, 1);

  -- 1. Generate 30 AuditLogs
  FOR k IN 1..30 LOOP
    log_created := NOW() - (k || ' days')::interval - (k || ' hours')::interval;
    INSERT INTO "AuditLogs"
        ("AuditLogId","UserId","EntityType","EntityId","Action",
         "OldValue","NewValue","CreatedAt","BranchId")
    VALUES (
        gen_random_uuid(),
        staff_ids[(k % s_count) + 1],
        entity_types[(k % 6) + 1],
        gen_random_uuid(), -- dummy entity id
        action_types[(k % 3) + 1],
        CASE WHEN k % 2 = 0 THEN '{"status":"Pending"}' ELSE null END,
        '{"status":"Updated","updatedBy":"system"}',
        log_created,
        branch_ids[(k % b_count) + 1]
    );
  END LOOP;

  -- 2. Generate 20 LoginHistories
  FOR k IN 1..20 LOOP
    INSERT INTO "LoginHistories"
        ("LoginHistoryId","UserId","IpAddress","UserAgent","LoginAt","IsRevoked")
    VALUES (
        gen_random_uuid(),
        user_ids[(k % u_count) + 1],
        '192.168.2.' || (10 + k)::text,
        'Mozilla/5.0 Chrome/' || (110 + k)::text || '.0.0.0 Safari/537.36',
        NOW() - (k * 6 || ' hours')::interval,
        false
    );
  END LOOP;
END $$;


-- =====================================================
-- REQUESTS BULK GENERATION (Yêu cầu hỗ trợ / phê duyệt)
-- =====================================================
DO $$
DECLARE
  user_ids uuid[];
  staff_ids uuid[];
  branch_ids uuid[];
  contract_ids uuid[];
  class_ids uuid[];
  
  u_count int;
  s_count int;
  b_count int;
  c_count int;
  cl_count int;
  
  req_created timestamptz;
  req_status text;
  req_type text;
  req_cat text;
  req_title text;
  req_desc text;
  req_resp text;
  
  rel_type text;
  rel_id uuid;
  handler_id uuid;
  resolved timestamptz;
BEGIN
  -- Lấy danh sách ID
  SELECT ARRAY(SELECT "Id" FROM "AspNetUsers") INTO user_ids;
  SELECT ARRAY(SELECT "UserId" FROM "Staffs") INTO staff_ids;
  SELECT ARRAY(SELECT "BranchId" FROM "Branches") INTO branch_ids;
  SELECT ARRAY(SELECT "ContractId" FROM "Contracts") INTO contract_ids;
  SELECT ARRAY(SELECT "ClassId" FROM "Classes") INTO class_ids;
  
  u_count := array_length(user_ids, 1);
  s_count := array_length(staff_ids, 1);
  b_count := array_length(branch_ids, 1);
  c_count := array_length(contract_ids, 1);
  cl_count := array_length(class_ids, 1);

  FOR k IN 1..35 LOOP
    req_created := NOW() - (k * 2 || ' days')::interval - (k || ' hours')::interval;
    
    -- Xoay vòng loại và danh mục yêu cầu
    CASE (k % 4)
      WHEN 0 THEN
        req_type := 'Support';
        req_cat := 'ContractChange';
        req_title := 'Yêu cầu đổi gói tập sang chi nhánh khác';
        req_desc := 'Tôi mới chuyển nhà sang quận khác và muốn đổi chi nhánh chính của hợp đồng sang chi nhánh gần nhất.';
        rel_type := 'Contract';
        rel_id := contract_ids[(k % c_count) + 1];
      WHEN 1 THEN
        req_type := 'Complaint';
        req_cat := 'ContractChange';
        req_title := 'Phàn nàn về thái độ phục vụ của nhân viên';
        req_desc := 'Nhân viên quầy lễ tân chi nhánh có thái độ không thân thiện khi tôi hỏi về lịch tập PT. Đề xuất chấn chỉnh.';
        rel_type := 'Branch';
        rel_id := branch_ids[(k % b_count) + 1];
      WHEN 2 THEN
        req_type := 'Approval';
        req_cat := 'RefundRequest';
        req_title := 'Yêu cầu phê duyệt hoàn trả học phí lớp đặc biệt';
        req_desc := 'Khách hàng yêu cầu hoàn phí do lớp PT bị hủy từ phía trung tâm. Đã nộp đủ hóa đơn đính kèm.';
        rel_type := 'Contract';
        rel_id := contract_ids[(k % c_count) + 1];
      ELSE
        req_type := 'Support';
        req_cat := 'RefundRequest';
        req_title := 'Lỗi thanh toán trùng hai lần hóa đơn';
        req_desc := 'Tôi thanh toán gói cước qua QR code nhưng hệ thống trừ tiền 2 lần. Vui lòng kiểm tra và hoàn tiền lại.';
        rel_type := 'Class';
        rel_id := class_ids[(k % cl_count) + 1];
    END CASE;

    -- Xoay vòng trạng thái và phản hồi
    CASE (k % 5)
      WHEN 0 THEN
        req_status := 'Pending';
        req_resp := null;
        handler_id := null;
        resolved := null;
      WHEN 1 THEN
        req_status := 'InProgress';
        req_resp := 'Bộ phận chăm sóc khách hàng đang kiểm tra giao dịch với ngân hàng liên kết.';
        handler_id := staff_ids[(k % s_count) + 1];
        resolved := null;
      WHEN 2 THEN
        req_status := 'Resolved';
        req_resp := 'Đã xử lý điều chỉnh trên hệ thống. Hợp đồng của quý khách đã được chuyển chi nhánh thành công.';
        handler_id := staff_ids[(k % s_count) + 1];
        resolved := req_created + interval '1 day';
      WHEN 3 THEN
        req_status := 'Approved';
        req_resp := 'Yêu cầu hoàn tiền đã được phê duyệt bởi Quản lý phòng tập. Tiền sẽ được hoàn về tài khoản trong 3 ngày làm việc.';
        handler_id := staff_ids[(k % s_count) + 1];
        resolved := req_created + interval '12 hours';
      ELSE
        req_status := 'Rejected';
        req_resp := 'Không đồng ý phê duyệt hoàn tiền do vi phạm điều khoản hợp đồng (đã quá hạn 7 ngày đổi trả).';
        handler_id := staff_ids[(k % s_count) + 1];
        resolved := req_created + interval '2 days';
    END CASE;

    INSERT INTO "Requests"
        ("RequestId","UserId","Type","Category","Title","Description",
         "Status","ResponseMessage","AttachmentUrl","Payload",
         "RelatedEntityType","RelatedEntityId",
         "HandledByUserId","ResolvedAt","CreatedAt")
    VALUES (
        gen_random_uuid(),
        user_ids[(k % u_count) + 1],
        req_type,
        req_cat,
        req_title || ' (Mã ' || k || ')',
        req_desc,
        req_status,
        req_resp,
        CASE WHEN k % 3 = 0 THEN 'http://example.com/attachments/req_' || k || '.png' ELSE null END,
        CASE WHEN req_cat = 'RefundRequest' THEN '{"refundAmount": 500000}' ELSE null END,
        rel_type,
        rel_id,
        handler_id,
        resolved,
        req_created
    );
  END LOOP;
END $$;
