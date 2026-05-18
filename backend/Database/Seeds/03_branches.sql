-- =====================================================
-- 03_BRANCHES.SQL
-- Seed chi nhánh Gym
-- =====================================================

-- =====================================================
-- BRANCHES
-- =====================================================
INSERT INTO "Branches"
    ("BranchId","Name","Address","Email","Hotline","Description","OpeningHours","Status","CreatedAt","UpdatedAt")
VALUES
(
    'aaaaaaaa-0001-0000-0000-000000000001',
    'GymFit Quận 1',
    '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
    'q1@gymfit.vn',
    '0281000001',
    'Chi nhánh trung tâm tại Quận 1 – Trang bị hiện đại, không gian thoáng đãng, phù hợp cho mọi đối tượng từ người mới bắt đầu đến vận động viên chuyên nghiệp.',
    '06:00 - 22:00',
    'Active',
    NOW() - interval '365 days',
    NOW() - interval '30 days'
),
(
    'aaaaaaaa-0001-0000-0000-000000000002',
    'GymFit Quận 7',
    '456 Nguyễn Thị Thập, Phường Tân Phú, Quận 7, TP.HCM',
    'q7@gymfit.vn',
    '0281000002',
    'Chi nhánh Quận 7 – Toạ lạc tại trung tâm Phú Mỹ Hưng, phục vụ cư dân và chuyên gia trong khu vực. Hệ thống phòng tập đẳng cấp quốc tế.',
    '05:30 - 22:30',
    'Active',
    NOW() - interval '300 days',
    NOW() - interval '15 days'
),
(
    'aaaaaaaa-0001-0000-0000-000000000003',
    'GymFit Bình Thạnh',
    '78 Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP.HCM',
    'binhcanh@gymfit.vn',
    '0281000003',
    'Chi nhánh Bình Thạnh – Gần các trường đại học lớn, chương trình ưu đãi dành riêng cho sinh viên và học sinh.',
    '06:00 - 21:30',
    'Pending',
    NOW() - interval '30 days',
    null
);

-- =====================================================
-- BRANCH IMAGES
-- =====================================================
INSERT INTO "BranchImages" ("BranchImageId","BranchId","ImageUrl","CreatedAt")
VALUES
    (gen_random_uuid(), 'aaaaaaaa-0001-0000-0000-000000000001', '/images/branches/q1-main.jpg', NOW()),
    (gen_random_uuid(), 'aaaaaaaa-0001-0000-0000-000000000001', '/images/branches/q1-gym.jpg', NOW()),
    (gen_random_uuid(), 'aaaaaaaa-0001-0000-0000-000000000001', '/images/branches/q1-pool.jpg', NOW()),
    (gen_random_uuid(), 'aaaaaaaa-0001-0000-0000-000000000002', '/images/branches/q7-main.jpg', NOW()),
    (gen_random_uuid(), 'aaaaaaaa-0001-0000-0000-000000000002', '/images/branches/q7-yoga.jpg', NOW());

-- =====================================================
-- CẬP NHẬT InitialBranchId cho Staff Users
-- (Staff thuộc branch nào thì gắn vào đó)
-- =====================================================
UPDATE "AspNetUsers"
SET "InitialBranchId" = 'aaaaaaaa-0001-0000-0000-000000000001'
WHERE "Id" IN (
    '00000000-0003-0000-0000-000000000001',
    '00000000-0003-0000-0000-000000000003',
    '00000000-0003-0000-0000-000000000005',
    '00000000-0003-0000-0000-000000000006',
    '00000000-0003-0000-0000-000000000008'
);

UPDATE "AspNetUsers"
SET "InitialBranchId" = 'aaaaaaaa-0001-0000-0000-000000000002'
WHERE "Id" IN (
    '00000000-0003-0000-0000-000000000002',
    '00000000-0003-0000-0000-000000000004',
    '00000000-0003-0000-0000-000000000007'
);
