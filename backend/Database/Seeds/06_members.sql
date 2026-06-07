-- =====================================================
-- 06_MEMBERS.SQL
-- Seed bảng Members, Staffs, PTProfiles
-- =====================================================

-- =====================================================
-- STAFFS
-- Gắn nhân viên vào chi nhánh + vị trí
-- =====================================================
INSERT INTO "Staffs"
    ("UserId","BranchId","Position","CommissionRate","BaseSalary")
VALUES
-- BranchAdmin Q1
('00000000-0003-0000-0000-000000000001', 'aaaaaaaa-0001-0000-0000-000000000001', 'BranchAdmin', null, 15000000),
-- BranchAdmin Q7
('00000000-0003-0000-0000-000000000002', 'aaaaaaaa-0001-0000-0000-000000000002', 'BranchAdmin', null, 15000000),
-- PT Q1
('00000000-0003-0000-0000-000000000003', 'aaaaaaaa-0001-0000-0000-000000000001', 'PT', null, 8000000),
-- PT Q7
('00000000-0003-0000-0000-000000000004', 'aaaaaaaa-0001-0000-0000-000000000002', 'PT', null, 8000000),
-- HeadPT Q1
('00000000-0003-0000-0000-000000000005', 'aaaaaaaa-0001-0000-0000-000000000001', 'HeadPT', null, 12000000),
-- Sales Q1
('00000000-0003-0000-0000-000000000006', 'aaaaaaaa-0001-0000-0000-000000000001', 'Sales', 8.00, 7000000),
-- Sales Q7
('00000000-0003-0000-0000-000000000007', 'aaaaaaaa-0001-0000-0000-000000000002', 'Sales', 8.00, 7000000),
-- Receptionist Q1
('00000000-0003-0000-0000-000000000008', 'aaaaaaaa-0001-0000-0000-000000000001', 'Receptionist', null, 6000000);

-- =====================================================
-- PT PROFILES
-- =====================================================
INSERT INTO "PTProfiles"
    ("StaffUserId","ExperienceYears","BioDescription","Specialization","Certificate")
VALUES
(
    '00000000-0003-0000-0000-000000000003',
    6,
    'Huấn luyện viên Phạm Quốc Tuấn với 6 năm kinh nghiệm trong lĩnh vực thể hình và gym. Chuyên môn về tăng cơ, giảm mỡ và phục hồi chấn thương.',
    'Tăng cơ, Giảm mỡ, Phục hồi chấn thương',
    'ACE Personal Trainer, NASM-CPT'
),
(
    '00000000-0003-0000-0000-000000000004',
    4,
    'HLV Vũ Thị Mai – chuyên gia về Yoga và Zumba với 4 năm huấn luyện. Cam kết mang lại sự cân bằng giữa thể chất và tinh thần cho học viên.',
    'Yoga, Zumba, Pilates',
    'RYT-200 Yoga Alliance, Zumba Instructor License'
),
(
    '00000000-0003-0000-0000-000000000005',
    10,
    'Head PT Đỗ Hải Đăng – 10 năm kinh nghiệm trong ngành gym với nhiều học viên đạt thành tích cao trong các cuộc thi thể hình. Là người dẫn dắt đội ngũ PT toàn chi nhánh.',
    'Thể hình chuyên nghiệp, CrossFit, Sức mạnh',
    'CSCS, NSCA, ISSA Master Trainer'
);

-- =====================================================
-- MEMBERS
-- =====================================================
INSERT INTO "Members" ("UserId")
VALUES
    ('00000000-0004-0000-0000-000000000001'),
    ('00000000-0004-0000-0000-000000000002'),
    ('00000000-0004-0000-0000-000000000003'),
    ('00000000-0004-0000-0000-000000000004'),
    ('00000000-0004-0000-0000-000000000005'),
    ('00000000-0004-0000-0000-000000000006'),
    ('00000000-0004-0000-0000-000000000007'),
    ('00000000-0004-0000-0000-000000000008'),
    ('00000000-0004-0000-0000-000000000009'),
    ('00000000-0004-0000-0000-000000000010');
