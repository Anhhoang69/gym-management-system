-- =====================================================
-- 13_ATTENDANCES.SQL
-- Seed thẻ ra vào và lịch sử check-in
-- =====================================================

-- =====================================================
-- ACCESS CARDS
-- AccessCardStatus: Active, Lost, Expired, Disabled, Inactive
-- =====================================================
INSERT INTO "AccessCards"
    ("AccessCardId","CardCode","MemberUserId","Status","IssueDate","ExpireDate")
VALUES
-- Member An - Active
('dddddddd-0002-0000-0000-000000000001', 'GYM-2025-001001', '00000000-0004-0000-0000-000000000001', 'Active', NOW() - interval '180 days', NOW() + interval '60 days'),
-- Member Bích - Active
('dddddddd-0002-0000-0000-000000000002', 'GYM-2025-001002', '00000000-0004-0000-0000-000000000002', 'Active', NOW() - interval '150 days', NOW() + interval '15 days'),
-- Member Cường - Active
('dddddddd-0002-0000-0000-000000000003', 'GYM-2025-001003', '00000000-0004-0000-0000-000000000003', 'Active', NOW() - interval '120 days', NOW() + interval '120 days'),
-- Member Dung - Active
('dddddddd-0002-0000-0000-000000000004', 'GYM-2025-001004', '00000000-0004-0000-0000-000000000004', 'Active', NOW() - interval '90 days', NOW() + interval '20 days'),
-- Member Em - Active
('dddddddd-0002-0000-0000-000000000005', 'GYM-2025-001005', '00000000-0004-0000-0000-000000000005', 'Active', NOW() - interval '60 days', NOW() + interval '70 days'),
-- Member Phương - Active
('dddddddd-0002-0000-0000-000000000006', 'GYM-2025-001006', '00000000-0004-0000-0000-000000000006', 'Active', NOW() - interval '45 days', NOW() + interval '320 days'),
-- Member Giang - Active (Trial)
('dddddddd-0002-0000-0000-000000000007', 'GYM-2025-001007', '00000000-0004-0000-0000-000000000007', 'Active', NOW() - interval '3 days', NOW() + interval '4 days'),
-- Member Ký - Active (thẻ mới)
('dddddddd-0002-0000-0000-000000000010', 'GYM-2025-001009B', '00000000-0004-0000-0000-000000000009', 'Active', NOW() - interval '30 days', NOW() + interval '60 days');

-- =====================================================
-- ATTENDANCES (Lịch sử check-in)
-- =====================================================
INSERT INTO "Attendances"
    ("AttendanceId","MemberUserId","CardId","BranchId","CheckinAt","CheckoutAt")
VALUES

-- Member An - Check-in tuần này
(gen_random_uuid(), '00000000-0004-0000-0000-000000000001', 'dddddddd-0002-0000-0000-000000000001', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '1 day' + time '07:05', NOW() - interval '1 day' + time '08:45'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000001', 'dddddddd-0002-0000-0000-000000000001', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '3 days' + time '18:00', NOW() - interval '3 days' + time '19:30'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000001', 'dddddddd-0002-0000-0000-000000000001', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '5 days' + time '07:10', NOW() - interval '5 days' + time '08:50'),

-- Member Bích - Check-in tuần này
(gen_random_uuid(), '00000000-0004-0000-0000-000000000002', 'dddddddd-0002-0000-0000-000000000002', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '2 days' + time '17:30', NOW() - interval '2 days' + time '19:00'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000002', 'dddddddd-0002-0000-0000-000000000002', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '4 days' + time '17:45', NOW() - interval '4 days' + time '19:15'),

-- Member Cường - Check-in thường xuyên (Elite)
(gen_random_uuid(), '00000000-0004-0000-0000-000000000003', 'dddddddd-0002-0000-0000-000000000003', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '1 day' + time '06:00', NOW() - interval '1 day' + time '08:00'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000003', 'dddddddd-0002-0000-0000-000000000003', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '2 days' + time '06:05', NOW() - interval '2 days' + time '07:45'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000003', 'dddddddd-0002-0000-0000-000000000003', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '3 days' + time '06:00', NOW() - interval '3 days' + time '08:00'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000003', 'dddddddd-0002-0000-0000-000000000003', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '5 days' + time '06:10', NOW() - interval '5 days' + time '07:50'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000003', 'dddddddd-0002-0000-0000-000000000003', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '6 days' + time '06:00', NOW() - interval '6 days' + time '08:00'),

-- Member Dung - Check-in ít
(gen_random_uuid(), '00000000-0004-0000-0000-000000000004', 'dddddddd-0002-0000-0000-000000000004', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '4 days' + time '09:00', NOW() - interval '4 days' + time '10:30'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000004', 'dddddddd-0002-0000-0000-000000000004', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '7 days' + time '09:15', NOW() - interval '7 days' + time '10:45'),

-- Member Em - Check-in tuần trước
(gen_random_uuid(), '00000000-0004-0000-0000-000000000005', 'dddddddd-0002-0000-0000-000000000005', 'aaaaaaaa-0001-0000-0000-000000000002', NOW() - interval '1 day' + time '18:00', NOW() - interval '1 day' + time '19:30'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000005', 'dddddddd-0002-0000-0000-000000000005', 'aaaaaaaa-0001-0000-0000-000000000002', NOW() - interval '3 days' + time '18:15', NOW() - interval '3 days' + time '19:45'),

-- Member Phương - Check-in Q7 (Elite - đa chi nhánh)
(gen_random_uuid(), '00000000-0004-0000-0000-000000000006', 'dddddddd-0002-0000-0000-000000000006', 'aaaaaaaa-0001-0000-0000-000000000002', NOW() - interval '1 day' + time '07:00', NOW() - interval '1 day' + time '08:30'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000006', 'dddddddd-0002-0000-0000-000000000006', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '2 days' + time '07:00', NOW() - interval '2 days' + time '09:00'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000006', 'dddddddd-0002-0000-0000-000000000006', 'aaaaaaaa-0001-0000-0000-000000000002', NOW() - interval '4 days' + time '07:05', NOW() - interval '4 days' + time '08:35'),

-- Member Giang - Check-in Trial
(gen_random_uuid(), '00000000-0004-0000-0000-000000000007', 'dddddddd-0002-0000-0000-000000000007', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '2 days' + time '10:00', NOW() - interval '2 days' + time '11:30'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000007', 'dddddddd-0002-0000-0000-000000000007', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '1 day' + time '10:00', null),

-- Member Ký - Check-in mới
(gen_random_uuid(), '00000000-0004-0000-0000-000000000009', 'dddddddd-0002-0000-0000-000000000010', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '5 days' + time '17:30', NOW() - interval '5 days' + time '19:00'),
(gen_random_uuid(), '00000000-0004-0000-0000-000000000009', 'dddddddd-0002-0000-0000-000000000010', 'aaaaaaaa-0001-0000-0000-000000000001', NOW() - interval '10 days' + time '18:00', NOW() - interval '10 days' + time '19:30');
