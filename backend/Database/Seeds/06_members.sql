-- =====================================================
-- 06_MEMBERS.SQL
-- Seed bảng Members, Staffs, PTProfiles
-- =====================================================

-- =====================================================
-- STAFFS — 36 staff, 6 chi nhánh
-- =====================================================
INSERT INTO "Staffs"
    ("UserId","BranchId","Position","CommissionRate","BaseSalary")
VALUES
-- Q1 Branch (8 staff)
('00000000-0003-0000-0000-000000000001', 'aaaaaaaa-0001-0000-0000-000000000001', 'BranchAdmin',  null,  15000000),
('00000000-0003-0000-0000-000000000003', 'aaaaaaaa-0001-0000-0000-000000000001', 'PT',           null,   8000000),
('00000000-0003-0000-0000-000000000005', 'aaaaaaaa-0001-0000-0000-000000000001', 'HeadPT',       null,  12000000),
('00000000-0003-0000-0000-000000000006', 'aaaaaaaa-0001-0000-0000-000000000001', 'Sales',        8.00,   7000000),
('00000000-0003-0000-0000-000000000008', 'aaaaaaaa-0001-0000-0000-000000000001', 'Receptionist', null,   6000000),
('00000000-0003-0000-0000-000000000010', 'aaaaaaaa-0001-0000-0000-000000000001', 'PT',           null,   8000000),
('00000000-0003-0000-0000-000000000012', 'aaaaaaaa-0001-0000-0000-000000000001', 'Sales',        8.00,   7000000),
('00000000-0003-0000-0000-000000000015', 'aaaaaaaa-0001-0000-0000-000000000001', 'Receptionist', null,   6000000),

-- Q7 Branch (7 staff)
('00000000-0003-0000-0000-000000000002', 'aaaaaaaa-0001-0000-0000-000000000002', 'BranchAdmin',  null,  15000000),
('00000000-0003-0000-0000-000000000004', 'aaaaaaaa-0001-0000-0000-000000000002', 'PT',           null,   8000000),
('00000000-0003-0000-0000-000000000007', 'aaaaaaaa-0001-0000-0000-000000000002', 'Sales',        8.00,   7000000),
('00000000-0003-0000-0000-000000000009', 'aaaaaaaa-0001-0000-0000-000000000002', 'HeadPT',       null,  12000000),
('00000000-0003-0000-0000-000000000011', 'aaaaaaaa-0001-0000-0000-000000000002', 'PT',           null,   8000000),
('00000000-0003-0000-0000-000000000013', 'aaaaaaaa-0001-0000-0000-000000000002', 'Sales',        8.00,   7000000),
('00000000-0003-0000-0000-000000000014', 'aaaaaaaa-0001-0000-0000-000000000002', 'Receptionist', null,   6000000),

-- Thủ Đức Branch (6 staff)
('00000000-0003-0000-0000-000000000016', 'aaaaaaaa-0001-0000-0000-000000000004', 'BranchAdmin',  null,  14000000),
('00000000-0003-0000-0000-000000000017', 'aaaaaaaa-0001-0000-0000-000000000004', 'HeadPT',       null,  11000000),
('00000000-0003-0000-0000-000000000018', 'aaaaaaaa-0001-0000-0000-000000000004', 'PT',           null,   8000000),
('00000000-0003-0000-0000-000000000019', 'aaaaaaaa-0001-0000-0000-000000000004', 'Sales',        8.00,   7000000),
('00000000-0003-0000-0000-000000000020', 'aaaaaaaa-0001-0000-0000-000000000004', 'Sales',        8.00,   7000000),
('00000000-0003-0000-0000-000000000021', 'aaaaaaaa-0001-0000-0000-000000000004', 'Receptionist', null,   6000000),

-- Bình Thạnh Branch (5 staff)
('00000000-0003-0000-0000-000000000022', 'aaaaaaaa-0001-0000-0000-000000000003', 'BranchAdmin',  null,  13000000),
('00000000-0003-0000-0000-000000000023', 'aaaaaaaa-0001-0000-0000-000000000003', 'PT',           null,   8000000),
('00000000-0003-0000-0000-000000000024', 'aaaaaaaa-0001-0000-0000-000000000003', 'Sales',        8.00,   7000000),
('00000000-0003-0000-0000-000000000025', 'aaaaaaaa-0001-0000-0000-000000000003', 'Sales',        8.00,   7000000),
('00000000-0003-0000-0000-000000000026', 'aaaaaaaa-0001-0000-0000-000000000003', 'Receptionist', null,   6000000),

-- Bình Dương Branch (5 staff)
('00000000-0003-0000-0000-000000000027', 'aaaaaaaa-0001-0000-0000-000000000005', 'BranchAdmin',  null,  13000000),
('00000000-0003-0000-0000-000000000028', 'aaaaaaaa-0001-0000-0000-000000000005', 'PT',           null,   8000000),
('00000000-0003-0000-0000-000000000029', 'aaaaaaaa-0001-0000-0000-000000000005', 'Sales',        8.00,   7000000),
('00000000-0003-0000-0000-000000000030', 'aaaaaaaa-0001-0000-0000-000000000005', 'Sales',        8.00,   7000000),
('00000000-0003-0000-0000-000000000031', 'aaaaaaaa-0001-0000-0000-000000000005', 'Receptionist', null,   6000000),

-- Đà Nẵng Branch (5 staff)
('00000000-0003-0000-0000-000000000032', 'aaaaaaaa-0001-0000-0000-000000000006', 'BranchAdmin',  null,  13000000),
('00000000-0003-0000-0000-000000000033', 'aaaaaaaa-0001-0000-0000-000000000006', 'PT',           null,   8000000),
('00000000-0003-0000-0000-000000000034', 'aaaaaaaa-0001-0000-0000-000000000006', 'Sales',        8.00,   7000000),
('00000000-0003-0000-0000-000000000035', 'aaaaaaaa-0001-0000-0000-000000000006', 'Sales',        8.00,   7000000),
('00000000-0003-0000-0000-000000000036', 'aaaaaaaa-0001-0000-0000-000000000006', 'Receptionist', null,   6000000);

-- =====================================================
-- PT PROFILES — 9 PT/HeadPT
-- =====================================================
INSERT INTO "PTProfiles"
    ("StaffUserId","ExperienceYears","BioDescription","Specialization","Certificate")
VALUES
-- HeadPT Q1: Đỗ Hải Đăng
(
    '00000000-0003-0000-0000-000000000005',
    10,
    'Head PT Đỗ Hải Đăng – 10 năm kinh nghiệm trong ngành gym với nhiều học viên đạt thành tích cao trong các cuộc thi thể hình. Là người dẫn dắt đội ngũ PT toàn chi nhánh Q1.',
    'Thể hình chuyên nghiệp, CrossFit, Sức mạnh',
    'CSCS, NSCA, ISSA Master Trainer'
),
-- PT Q1: Phạm Quốc Tuấn
(
    '00000000-0003-0000-0000-000000000003',
    6,
    'HLV Phạm Quốc Tuấn với 6 năm kinh nghiệm thể hình và gym. Chuyên môn về tăng cơ, giảm mỡ và phục hồi chấn thương cho người tập từ cơ bản đến nâng cao.',
    'Tăng cơ, Giảm mỡ, Phục hồi chấn thương',
    'ACE Personal Trainer, NASM-CPT'
),
-- PT Q1 #2: Lê Thị Minh Châu
(
    '00000000-0003-0000-0000-000000000010',
    5,
    'HLV Lê Thị Minh Châu chuyên về Yoga và Zumba. 5 năm kinh nghiệm giúp học viên cân bằng thể chất và tinh thần, đặc biệt hiệu quả với người học lần đầu.',
    'Yoga, Zumba, Pilates, Thiền định',
    'RYT-200 Yoga Alliance, Zumba Instructor License'
),
-- HeadPT Q7: Trần Văn Phong
(
    '00000000-0003-0000-0000-000000000009',
    8,
    'Head PT Trần Văn Phong – 8 năm kinh nghiệm, chuyên sâu về thể hình và CrossFit. Từng đạt huy chương Bạc cuộc thi Thể hình Mở Quốc gia 2022.',
    'CrossFit, Thể hình, Boxing, HIIT',
    'CSCS, CrossFit Level 2 Trainer, ACSM'
),
-- PT Q7: Vũ Thị Mai
(
    '00000000-0003-0000-0000-000000000004',
    4,
    'HLV Vũ Thị Mai – chuyên gia về Yoga và Zumba với 4 năm huấn luyện. Cam kết mang lại sự cân bằng giữa thể chất và tinh thần cho học viên.',
    'Yoga, Zumba, Pilates',
    'RYT-200 Yoga Alliance, Zumba Instructor License'
),
-- PT Q7 #2: Đinh Quốc Hưng
(
    '00000000-0003-0000-0000-000000000011',
    4,
    'HLV Đinh Quốc Hưng – chuyên về Cardio và Zumba. Năng lượng cao, phong cách huấn luyện sôi động, rất được học viên trẻ yêu thích.',
    'Zumba, Cardio, Dance Fitness',
    'Zumba Education Specialist, ACE Group Fitness'
),
-- HeadPT Thủ Đức: Trần Hữu Nghĩa
(
    '00000000-0003-0000-0000-000000000017',
    7,
    'Head PT Trần Hữu Nghĩa – 7 năm kinh nghiệm phát triển chương trình tập cá nhân hóa. Đặc biệt giỏi trong việc tư vấn dinh dưỡng song hành với luyện tập.',
    'Tăng cơ, Giảm cân, Dinh dưỡng thể thao',
    'NASM-CPT, Precision Nutrition Level 1'
),
-- PT Thủ Đức: Phạm Thị Hằng
(
    '00000000-0003-0000-0000-000000000018',
    3,
    'HLV Phạm Thị Hằng – 3 năm kinh nghiệm, chuyên về Yoga buổi sáng và chương trình phục hồi sức khỏe. Phong cách nhẹ nhàng, kiên nhẫn với người mới bắt đầu.',
    'Yoga, Stretching, Phục hồi',
    'RYT-200 Yoga Alliance'
),
-- PT Bình Thạnh: Lê Văn Sơn
(
    '00000000-0003-0000-0000-000000000023',
    3,
    'HLV Lê Văn Sơn – 3 năm kinh nghiệm, nhiệt huyết và trẻ trung. Chuyên huấn luyện thể hình cơ bản cho sinh viên và người mới bắt đầu tập gym.',
    'Gym cơ bản, Tăng cơ, Cardio',
    'ACE Personal Trainer'
),
-- PT Bình Dương: Trần Hoài Nam
(
    '00000000-0003-0000-0000-000000000028',
    3,
    'HLV Trần Hoài Nam – 3 năm kinh nghiệm, tận tâm và chuyên nghiệp. Hiểu rõ nhu cầu của công nhân và nhân viên văn phòng, thiết kế chương trình tập phù hợp.',
    'Thể hình, Giảm stress, Gym tổng hợp',
    'ACE Personal Trainer, NASM-CPT'
),
-- PT Đà Nẵng: Nguyễn Thị Hoa
(
    '00000000-0003-0000-0000-000000000033',
    2,
    'HLV Nguyễn Thị Hoa – 2 năm kinh nghiệm, chuyên về Yoga và Pilates. Phong cách thân thiện, phù hợp cho cả người mới và người có kinh nghiệm tập luyện.',
    'Yoga, Pilates, Thiền định',
    'RYT-200 Yoga Alliance'
);

-- =====================================================
-- MEMBERS — 230 members
-- =====================================================
-- Members 001-010 (existing)
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

-- Members 011-230 (bulk generate)
INSERT INTO "Members" ("UserId")
SELECT ('00000000-0004-0000-0000-' || lpad(n::text, 12, '0'))::uuid
FROM generate_series(11, 230) n;
