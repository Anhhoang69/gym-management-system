-- =====================================================
-- 99_DEMO_DATA.SQL
-- Dữ liệu demo bổ sung cho dashboard và reports
-- ContractAdjusts, extra attendance, demo scenarios
-- =====================================================

-- =====================================================
-- CONTRACT ADJUSTS (Lịch sử thay đổi hợp đồng)
-- ActionType: Upgrade, Downgrade, Freeze, Resume, Extend
-- Status: Pending, Approved, Rejected
-- =====================================================
INSERT INTO "ContractAdjusts"
    ("ContractAdjustId","ContractId","OldPackageId","NewPackageId",
     "ActionType","ProrationAmount","ChangeFeeAmount","Status",
     "EffectiveFrom","EffectiveTo","ApprovedByStaffId","ApprovedAt","CreatedAt")
VALUES

-- Freeze hợp đồng Member Cường (đã hoàn tất)
(
    gen_random_uuid(),
    'ffffffff-0001-0000-0000-000000000003',
    'cccccccc-0001-0000-0000-000000000003',
    'cccccccc-0001-0000-0000-000000000003',
    'Freeze', 0, 50000,
    'Approved',
    NOW() - interval '45 days',
    NOW() - interval '35 days',
    '00000000-0003-0000-0000-000000000001',
    NOW() - interval '45 days',
    NOW() - interval '46 days'
),

-- Resume sau freeze (đã hoàn tất)
(
    gen_random_uuid(),
    'ffffffff-0001-0000-0000-000000000003',
    'cccccccc-0001-0000-0000-000000000003',
    'cccccccc-0001-0000-0000-000000000003',
    'Resume', 0, 0,
    'Approved',
    NOW() - interval '35 days',
    null,
    '00000000-0003-0000-0000-000000000001',
    NOW() - interval '35 days',
    NOW() - interval '35 days'
),

-- Upgrade từ Basic lên Premium - đang chờ duyệt
(
    gen_random_uuid(),
    'ffffffff-0001-0000-0000-000000000001',
    'cccccccc-0001-0000-0000-000000000001',
    'cccccccc-0001-0000-0000-000000000002',
    'Upgrade', 400000, 150000,
    'Pending',
    NOW() + interval '1 day',
    null,
    null, null,
    NOW() - interval '2 hours'
);

-- =====================================================
-- THÊM ATTENDANCE CHO DASHBOARD STATS
-- (Thêm dữ liệu tháng trước để có số liệu đủ đẹp)
-- =====================================================
INSERT INTO "Attendances"
    ("AttendanceId","MemberUserId","CardId","BranchId","CheckinAt","CheckoutAt")
VALUES
-- Tháng trước - Member An (20 buổi tập)
(gen_random_uuid(), '00000000-0004-0000-0000-000000000001', 'dddddddd-0002-0000-0000-000000000001', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '35 days' + time '07:00', NOW() - interval '35 days' + time '08:30'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000001', 'dddddddd-0002-0000-0000-000000000001', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '37 days' + time '17:30', NOW() - interval '37 days' + time '19:00'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000001', 'dddddddd-0002-0000-0000-000000000001', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '40 days' + time '07:15', NOW() - interval '40 days' + time '08:45'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000001', 'dddddddd-0002-0000-0000-000000000001', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '43 days' + time '17:00', NOW() - interval '43 days' + time '18:30'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000001', 'dddddddd-0002-0000-0000-000000000001', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '46 days' + time '07:00', NOW() - interval '46 days' + time '08:30'),

-- Tháng trước - Member Cường (Elite - tập nhiều)
(gen_random_uuid(), '00000000-0004-0000-0000-000000000003', 'dddddddd-0002-0000-0000-000000000003', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '35 days' + time '06:00', NOW() - interval '35 days' + time '08:00'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000003', 'dddddddd-0002-0000-0000-000000000003', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '36 days' + time '06:05', NOW() - interval '36 days' + time '07:50'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000003', 'dddddddd-0002-0000-0000-000000000003', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '38 days' + time '06:00', NOW() - interval '38 days' + time '08:00'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000003', 'dddddddd-0002-0000-0000-000000000003', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '39 days' + time '06:10', NOW() - interval '39 days' + time '07:45'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000003', 'dddddddd-0002-0000-0000-000000000003', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '41 days' + time '06:00', NOW() - interval '41 days' + time '08:00'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000003', 'dddddddd-0002-0000-0000-000000000003', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '43 days' + time '06:05', NOW() - interval '43 days' + time '08:00'),

-- Tháng trước - Member Phương (Elite Q7)
(gen_random_uuid(), '00000000-0004-0000-0000-000000000006', 'dddddddd-0002-0000-0000-000000000006', 'aaaaaaaa-0001-0000-0000-000000000002', NOW() - interval '50 days' + time '07:00', NOW() - interval '50 days' + time '08:30'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000006', 'dddddddd-0002-0000-0000-000000000006', 'aaaaaaaa-0001-0000-0000-000000000002', NOW() - interval '52 days' + time '07:05', NOW() - interval '52 days' + time '08:35'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000006', 'dddddddd-0002-0000-0000-000000000006', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '54 days' + time '07:00', NOW() - interval '54 days' + time '09:00'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000006', 'dddddddd-0002-0000-0000-000000000006', 'aaaaaaaa-0001-0000-0000-000000000002', NOW() - interval '56 days' + time '07:10', NOW() - interval '56 days' + time '08:40'),

-- Member Ký - tháng cũ (hết hạn)
(gen_random_uuid(), '00000000-0004-0000-0000-000000000009', 'dddddddd-0002-0000-0000-000000000010', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '250 days' + time '18:00', NOW() - interval '250 days' + time '19:30'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000009', 'dddddddd-0002-0000-0000-000000000010', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '260 days' + time '17:30', NOW() - interval '260 days' + time '19:00');

-- =====================================================
-- OTP CODES (Demo - expired)
-- =====================================================
INSERT INTO "OtpCodes"
    ("OtpCodeId","UserId","Code","Purpose","AttemptCount","ExpiresAt","IsUsed","UsedAt","CreatedAt")
VALUES
(
    gen_random_uuid(),
    '00000000-0004-0000-0000-000000000002',
    '234891',
    'PasswordReset',
    1,
    NOW() - interval '1 day',
    true,
    NOW() - interval '1 day',
    NOW() - interval '2 days'
),
(
    gen_random_uuid(),
    '00000000-0004-0000-0000-000000000008',
    '567234',
    '2FA',
    0,
    NOW() - interval '10 minutes',
    false,
    null,
    NOW() - interval '25 minutes'
);

-- =====================================================
-- SUMMARY
-- =====================================================
-- Tổng kết dữ liệu demo:
-- - 4 Roles
-- - 20 Users (2 admin, 8 staff, 10 members)
-- - 3 Branches (2 active, 1 pending)
-- - 9 Rooms across 2 branches
-- - 4 Packages + Policies + Features + Pricings
-- - 10 Members + 8 Staffs + 3 PTProfiles
-- - 8 Leads (New/Contacted/Qualified/Converted/Lost)
-- - 11 Contracts (Pending/Active/Expired/Cancelled)
-- - 11 Invoices (Pending/Paid/Cancelled)
-- - 9 Payments (Completed)
-- - 10 Classes (Scheduled/Completed/Cancelled)
-- - 22+ Bookings
-- - 9 Access Cards + 35+ Attendance records
-- - 6 Promotions + 3 ContractPromotions
-- - 10 Notifications + 25+ Recipients
-- - 2 Payroll Formulas + 7 Commissions + 8 PayrollRecords
-- - 10+ AuditLogs + 10 LoginHistories + 4 Requests
-- - 12 ChatHistories + 3 AIRecommendations + 3 AIContextCaches
-- - ContractDrafts + ContractAdjusts
