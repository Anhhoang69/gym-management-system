-- =====================================================
-- 02_USERS.SQL
-- Seed tất cả Users (Identity + Roles)
-- Password mặc định: 123456Aa@
-- Hash BCrypt format được ASP.NET Identity tạo ra
-- =====================================================

-- =====================================================
-- NOTE: Đây là BCrypt hash của "123456Aa@"
-- Generated bằng ASP.NET Identity v2 password hashing
-- =====================================================

-- =====================================================
-- SUPERADMIN
-- =====================================================
INSERT INTO "AspNetUsers"
    ("Id","UserName","NormalizedUserName","Email","NormalizedEmail",
     "EmailConfirmed","PasswordHash","SecurityStamp","ConcurrencyStamp",
     "PhoneNumber","PhoneNumberConfirmed","TwoFactorEnabled",
     "LockoutEnabled","AccessFailedCount",
     "FullName","Gender","Birthday","Address","AvatarUrl",
     "Status","CreatedAt","UpdatedAt","LastLoginAt","InitialBranchId","LanguagePreference")
VALUES
(
    '00000000-0001-0000-0000-000000000001',
    'superadmin@gymfit.vn', 'SUPERADMIN@GYMFIT.VN',
    'superadmin@gymfit.vn', 'SUPERADMIN@GYMFIT.VN',
    true,
    'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',
    gen_random_uuid()::text, gen_random_uuid()::text,
    '0901000001', false, false,
    true, 0,
    'Quản Trị Viên Hệ Thống', 'Male', '1985-03-15',
    '123 Nguyễn Huệ, Quận 1, TP.HCM', null,
    'Active', NOW() - interval '365 days', null, NOW() - interval '1 day',
    null, 'vi'
),

-- =====================================================
-- GYMOWNER
-- =====================================================
(
    '00000000-0002-0000-0000-000000000001',
    'gymowner@gymfit.vn', 'GYMOWNER@GYMFIT.VN',
    'gymowner@gymfit.vn', 'GYMOWNER@GYMFIT.VN',
    true,
    'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',
    gen_random_uuid()::text, gen_random_uuid()::text,
    '0901000002', false, false,
    true, 0,
    'Trần Minh Khoa', 'Male', '1980-07-22',
    '456 Lê Lợi, Quận 1, TP.HCM', null,
    'Active', NOW() - interval '300 days', null, NOW() - interval '2 days',
    null, 'vi'
),

-- =====================================================
-- STAFF - BranchAdmin Chi nhánh Quận 1
-- =====================================================
(
    '00000000-0003-0000-0000-000000000001',
    'branchadmin.q1@gymfit.vn', 'BRANCHADMIN.Q1@GYMFIT.VN',
    'branchadmin.q1@gymfit.vn', 'BRANCHADMIN.Q1@GYMFIT.VN',
    true,
    'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',
    gen_random_uuid()::text, gen_random_uuid()::text,
    '0901000003', false, false,
    true, 0,
    'Nguyễn Thị Lan', 'Female', '1990-05-10',
    '12 Hai Bà Trưng, Quận 1, TP.HCM', null,
    'Active', NOW() - interval '200 days', null, NOW() - interval '1 day',
    null, 'vi'
),

-- =====================================================
-- STAFF - BranchAdmin Chi nhánh Quận 7
-- =====================================================
(
    '00000000-0003-0000-0000-000000000002',
    'branchadmin.q7@gymfit.vn', 'BRANCHADMIN.Q7@GYMFIT.VN',
    'branchadmin.q7@gymfit.vn', 'BRANCHADMIN.Q7@GYMFIT.VN',
    true,
    'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',
    gen_random_uuid()::text, gen_random_uuid()::text,
    '0901000004', false, false,
    true, 0,
    'Lê Văn Hùng', 'Male', '1988-11-30',
    '89 Nguyễn Thị Thập, Quận 7, TP.HCM', null,
    'Active', NOW() - interval '180 days', null, NOW() - interval '3 days',
    null, 'vi'
),

-- =====================================================
-- STAFF - PT (Personal Trainer) Chi nhánh Quận 1
-- =====================================================
(
    '00000000-0003-0000-0000-000000000003',
    'pt.nguyen@gymfit.vn', 'PT.NGUYEN@GYMFIT.VN',
    'pt.nguyen@gymfit.vn', 'PT.NGUYEN@GYMFIT.VN',
    true,
    'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',
    gen_random_uuid()::text, gen_random_uuid()::text,
    '0901000005', false, false,
    true, 0,
    'Phạm Quốc Tuấn', 'Male', '1993-02-14',
    '55 Trần Hưng Đạo, Quận 1, TP.HCM', null,
    'Active', NOW() - interval '150 days', null, NOW() - interval '1 day',
    null, 'vi'
),

-- =====================================================
-- STAFF - PT Chi nhánh Quận 7
-- =====================================================
(
    '00000000-0003-0000-0000-000000000004',
    'pt.mai@gymfit.vn', 'PT.MAI@GYMFIT.VN',
    'pt.mai@gymfit.vn', 'PT.MAI@GYMFIT.VN',
    true,
    'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',
    gen_random_uuid()::text, gen_random_uuid()::text,
    '0901000006', false, false,
    true, 0,
    'Vũ Thị Mai', 'Female', '1995-08-20',
    '200 Nguyễn Lương Bằng, Quận 7, TP.HCM', null,
    'Active', NOW() - interval '120 days', null, NOW() - interval '2 days',
    null, 'vi'
),

-- =====================================================
-- STAFF - HeadPT Chi nhánh Quận 1
-- =====================================================
(
    '00000000-0003-0000-0000-000000000005',
    'headpt.q1@gymfit.vn', 'HEADPT.Q1@GYMFIT.VN',
    'headpt.q1@gymfit.vn', 'HEADPT.Q1@GYMFIT.VN',
    true,
    'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',
    gen_random_uuid()::text, gen_random_uuid()::text,
    '0901000007', false, false,
    true, 0,
    'Đỗ Hải Đăng', 'Male', '1989-04-05',
    '77 Pasteur, Quận 1, TP.HCM', null,
    'Active', NOW() - interval '160 days', null, NOW() - interval '1 day',
    null, 'vi'
),

-- =====================================================
-- STAFF - Sales Chi nhánh Quận 1
-- =====================================================
(
    '00000000-0003-0000-0000-000000000006',
    'sales.q1@gymfit.vn', 'SALES.Q1@GYMFIT.VN',
    'sales.q1@gymfit.vn', 'SALES.Q1@GYMFIT.VN',
    true,
    'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',
    gen_random_uuid()::text, gen_random_uuid()::text,
    '0901000008', false, false,
    true, 0,
    'Hoàng Thị Ngọc', 'Female', '1997-12-03',
    '34 Bùi Viện, Quận 1, TP.HCM', null,
    'Active', NOW() - interval '130 days', null, NOW() - interval '1 day',
    null, 'vi'
),

-- =====================================================
-- STAFF - Sales Chi nhánh Quận 7
-- =====================================================
(
    '00000000-0003-0000-0000-000000000007',
    'sales.q7@gymfit.vn', 'SALES.Q7@GYMFIT.VN',
    'sales.q7@gymfit.vn', 'SALES.Q7@GYMFIT.VN',
    true,
    'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',
    gen_random_uuid()::text, gen_random_uuid()::text,
    '0901000009', false, false,
    true, 0,
    'Bùi Thành Long', 'Male', '1994-09-17',
    '145 Lê Văn Lương, Quận 7, TP.HCM', null,
    'Active', NOW() - interval '110 days', null, NOW() - interval '2 days',
    null, 'vi'
),

-- =====================================================
-- STAFF - Receptionist Chi nhánh Quận 1
-- =====================================================
(
    '00000000-0003-0000-0000-000000000008',
    'receptionist.q1@gymfit.vn', 'RECEPTIONIST.Q1@GYMFIT.VN',
    'receptionist.q1@gymfit.vn', 'RECEPTIONIST.Q1@GYMFIT.VN',
    true,
    'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',
    gen_random_uuid()::text, gen_random_uuid()::text,
    '0901000010', false, false,
    true, 0,
    'Trịnh Thị Hoa', 'Female', '1998-06-25',
    '9 Đinh Tiên Hoàng, Quận 1, TP.HCM', null,
    'Active', NOW() - interval '100 days', null, NOW() - interval '1 day',
    null, 'vi'
),

-- =====================================================
-- MEMBERS (10 hội viên)
-- =====================================================
(
    '00000000-0004-0000-0000-000000000001',
    'nguyen.van.an@gmail.com', 'NGUYEN.VAN.AN@GMAIL.COM',
    'nguyen.van.an@gmail.com', 'NGUYEN.VAN.AN@GMAIL.COM',
    true,
    'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',
    gen_random_uuid()::text, gen_random_uuid()::text,
    '0912345001', false, false,
    true, 0,
    'Nguyễn Văn An', 'Male', '1995-03-20',
    '25 Lý Tự Trọng, Quận 1, TP.HCM', null,
    'Active', NOW() - interval '180 days', null, NOW() - interval '5 days',
    null, 'vi'
),
(
    '00000000-0004-0000-0000-000000000002',
    'tran.thi.bich@gmail.com', 'TRAN.THI.BICH@GMAIL.COM',
    'tran.thi.bich@gmail.com', 'TRAN.THI.BICH@GMAIL.COM',
    true,
    'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',
    gen_random_uuid()::text, gen_random_uuid()::text,
    '0912345002', false, false,
    true, 0,
    'Trần Thị Bích', 'Female', '1998-07-15',
    '67 Nguyễn Đình Chiểu, Quận 3, TP.HCM', null,
    'Active', NOW() - interval '150 days', null, NOW() - interval '3 days',
    null, 'vi'
),
(
    '00000000-0004-0000-0000-000000000003',
    'le.duc.cuong@gmail.com', 'LE.DUC.CUONG@GMAIL.COM',
    'le.duc.cuong@gmail.com', 'LE.DUC.CUONG@GMAIL.COM',
    true,
    'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',
    gen_random_uuid()::text, gen_random_uuid()::text,
    '0912345003', false, false,
    true, 0,
    'Lê Đức Cường', 'Male', '1992-11-08',
    '14 Trần Phú, Quận 5, TP.HCM', null,
    'Active', NOW() - interval '120 days', null, NOW() - interval '7 days',
    null, 'vi'
),
(
    '00000000-0004-0000-0000-000000000004',
    'pham.thi.dung@gmail.com', 'PHAM.THI.DUNG@GMAIL.COM',
    'pham.thi.dung@gmail.com', 'PHAM.THI.DUNG@GMAIL.COM',
    true,
    'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',
    gen_random_uuid()::text, gen_random_uuid()::text,
    '0912345004', false, false,
    true, 0,
    'Phạm Thị Dung', 'Female', '2000-01-30',
    '88 Cách Mạng Tháng 8, Quận 3, TP.HCM', null,
    'Active', NOW() - interval '90 days', null, NOW() - interval '2 days',
    null, 'vi'
),
(
    '00000000-0004-0000-0000-000000000005',
    'hoang.van.em@gmail.com', 'HOANG.VAN.EM@GMAIL.COM',
    'hoang.van.em@gmail.com', 'HOANG.VAN.EM@GMAIL.COM',
    true,
    'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',
    gen_random_uuid()::text, gen_random_uuid()::text,
    '0912345005', false, false,
    true, 0,
    'Hoàng Văn Em', 'Male', '1993-05-22',
    '320 Lý Thường Kiệt, Quận 10, TP.HCM', null,
    'Active', NOW() - interval '60 days', null, NOW() - interval '10 days',
    null, 'vi'
),
(
    '00000000-0004-0000-0000-000000000006',
    'vo.thi.phuong@gmail.com', 'VO.THI.PHUONG@GMAIL.COM',
    'vo.thi.phuong@gmail.com', 'VO.THI.PHUONG@GMAIL.COM',
    true,
    'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',
    gen_random_uuid()::text, gen_random_uuid()::text,
    '0912345006', false, false,
    true, 0,
    'Võ Thị Phương', 'Female', '1996-09-12',
    '45 Phạm Ngọc Thạch, Quận 3, TP.HCM', null,
    'Active', NOW() - interval '45 days', null, NOW() - interval '4 days',
    null, 'vi'
),
(
    '00000000-0004-0000-0000-000000000007',
    'dang.minh.giang@gmail.com', 'DANG.MINH.GIANG@GMAIL.COM',
    'dang.minh.giang@gmail.com', 'DANG.MINH.GIANG@GMAIL.COM',
    true,
    'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',
    gen_random_uuid()::text, gen_random_uuid()::text,
    '0912345007', false, false,
    true, 0,
    'Đặng Minh Giang', 'Male', '1991-12-25',
    '102 Điện Biên Phủ, Bình Thạnh, TP.HCM', null,
    'Active', NOW() - interval '30 days', null, NOW() - interval '1 day',
    null, 'vi'
),
(
    '00000000-0004-0000-0000-000000000008',
    'nguyen.thi.huong@gmail.com', 'NGUYEN.THI.HUONG@GMAIL.COM',
    'nguyen.thi.huong@gmail.com', 'NGUYEN.THI.HUONG@GMAIL.COM',
    true,
    'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',
    gen_random_uuid()::text, gen_random_uuid()::text,
    '0912345008', false, false,
    true, 0,
    'Nguyễn Thị Hương', 'Female', '1999-04-18',
    '56 Hoàng Văn Thụ, Phú Nhuận, TP.HCM', null,
    'Active', NOW() - interval '20 days', null, NOW() - interval '2 days',
    null, 'vi'
),
(
    '00000000-0004-0000-0000-000000000009',
    'tran.van.ky@gmail.com', 'TRAN.VAN.KY@GMAIL.COM',
    'tran.van.ky@gmail.com', 'TRAN.VAN.KY@GMAIL.COM',
    true,
    'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',
    gen_random_uuid()::text, gen_random_uuid()::text,
    '0912345009', false, false,
    true, 0,
    'Trần Văn Ký', 'Male', '1997-08-03',
    '78 Võ Thị Sáu, Quận 3, TP.HCM', null,
    'Active', NOW() - interval '400 days', null, NOW() - interval '60 days',
    null, 'vi'
),
(
    '00000000-0004-0000-0000-000000000010',
    'ly.thi.lan@gmail.com', 'LY.THI.LAN@GMAIL.COM',
    'ly.thi.lan@gmail.com', 'LY.THI.LAN@GMAIL.COM',
    true,
    'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',
    gen_random_uuid()::text, gen_random_uuid()::text,
    '0912345010', false, false,
    true, 0,
    'Lý Thị Lan', 'Female', '2001-02-14',
    '33 Nguyễn Trãi, Quận 5, TP.HCM', null,
    'Active', NOW() - interval '10 days', null, null,
    null, 'vi'
);

-- =====================================================
-- USER - ROLE ASSIGNMENTS
-- =====================================================
INSERT INTO "AspNetUserRoles" ("UserId", "RoleId")
VALUES
    -- SuperAdmin
    ('00000000-0001-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001'),
    -- GymOwner
    ('00000000-0002-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002'),
    -- Staff
    ('00000000-0003-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003'),
    ('00000000-0003-0000-0000-000000000002', '11111111-0000-0000-0000-000000000003'),
    ('00000000-0003-0000-0000-000000000003', '11111111-0000-0000-0000-000000000003'),
    ('00000000-0003-0000-0000-000000000004', '11111111-0000-0000-0000-000000000003'),
    ('00000000-0003-0000-0000-000000000005', '11111111-0000-0000-0000-000000000003'),
    ('00000000-0003-0000-0000-000000000006', '11111111-0000-0000-0000-000000000003'),
    ('00000000-0003-0000-0000-000000000007', '11111111-0000-0000-0000-000000000003'),
    ('00000000-0003-0000-0000-000000000008', '11111111-0000-0000-0000-000000000003'),
    -- Members
    ('00000000-0004-0000-0000-000000000001', '11111111-0000-0000-0000-000000000004'),
    ('00000000-0004-0000-0000-000000000002', '11111111-0000-0000-0000-000000000004'),
    ('00000000-0004-0000-0000-000000000003', '11111111-0000-0000-0000-000000000004'),
    ('00000000-0004-0000-0000-000000000004', '11111111-0000-0000-0000-000000000004'),
    ('00000000-0004-0000-0000-000000000005', '11111111-0000-0000-0000-000000000004'),
    ('00000000-0004-0000-0000-000000000006', '11111111-0000-0000-0000-000000000004'),
    ('00000000-0004-0000-0000-000000000007', '11111111-0000-0000-0000-000000000004'),
    ('00000000-0004-0000-0000-000000000008', '11111111-0000-0000-0000-000000000004'),
    ('00000000-0004-0000-0000-000000000009', '11111111-0000-0000-0000-000000000004'),
    ('00000000-0004-0000-0000-000000000010', '11111111-0000-0000-0000-000000000004');
