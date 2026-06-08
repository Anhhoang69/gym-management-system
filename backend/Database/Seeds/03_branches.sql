-- =====================================================
-- 03_BRANCHES.SQL
-- Seed chi nhánh Gym — 6 chi nhánh
-- =====================================================

-- =====================================================
-- BRANCHES
-- BranchStatus: Pending, Active, Inactive, Closed
-- =====================================================
INSERT INTO "Branches"
    ("BranchId","Name","Address","Email","Hotline","Description","OpeningHours","Status","CreatedAt","UpdatedAt")
VALUES
-- Chi nhánh 1: Quận 1 (Flagship - khai trương đầu tiên T6/2025)
(
    'aaaaaaaa-0001-0000-0000-000000000001',
    'GymFit Quận 1',
    '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
    'q1@gymfit.vn',
    '0281000001',
    'Chi nhánh trung tâm tại Quận 1 – Flagship store của GymFit Vietnam. Trang bị hiện đại, không gian thoáng đãng hơn 1.000m², phù hợp cho mọi đối tượng từ người mới bắt đầu đến vận động viên chuyên nghiệp.',
    '06:00 - 22:00',
    'Active',
    NOW() - interval '365 days',
    NOW() - interval '30 days'
),
-- Chi nhánh 2: Quận 7 (Premium - khai trương T7/2025)
(
    'aaaaaaaa-0001-0000-0000-000000000002',
    'GymFit Quận 7',
    '456 Nguyễn Thị Thập, Phường Tân Phú, Quận 7, TP.HCM',
    'q7@gymfit.vn',
    '0281000002',
    'Chi nhánh Quận 7 – Toạ lạc tại trung tâm Phú Mỹ Hưng, phục vụ cư dân và chuyên gia trong khu vực. Hệ thống phòng tập đẳng cấp quốc tế với khu vực VIP lounge và yoga studio riêng biệt.',
    '05:30 - 22:30',
    'Active',
    NOW() - interval '300 days',
    NOW() - interval '15 days'
),
-- Chi nhánh 3: Bình Thạnh (đã Active - khai trương T2/2026)
(
    'aaaaaaaa-0001-0000-0000-000000000003',
    'GymFit Bình Thạnh',
    '78 Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP.HCM',
    'binhcanh@gymfit.vn',
    '0281000003',
    'Chi nhánh Bình Thạnh – Gần các trường đại học lớn, chương trình ưu đãi dành riêng cho sinh viên và học sinh. Không gian thân thiện, hiện đại với mức giá phù hợp.',
    '06:00 - 21:30',
    'Active',
    NOW() - interval '120 days',
    NOW() - interval '5 days'
),
-- Chi nhánh 4: Thủ Đức (khai trương T10/2025)
(
    'aaaaaaaa-0001-0000-0000-000000000004',
    'GymFit Thủ Đức',
    '789 Phạm Văn Đồng, Phường Hiệp Bình Chánh, Thủ Đức, TP.HCM',
    'thuduc@gymfit.vn',
    '0281000004',
    'Chi nhánh Thủ Đức – Phục vụ khu vực đông dân cư và các khu công nghệ cao. Trang bị đầy đủ máy móc hiện đại, sân tập ngoài trời và phòng yoga rộng rãi.',
    '06:00 - 22:00',
    'Active',
    NOW() - interval '245 days',
    NOW() - interval '10 days'
),
-- Chi nhánh 5: Bình Dương (khai trương T2/2026)
(
    'aaaaaaaa-0001-0000-0000-000000000005',
    'GymFit Bình Dương',
    '200 Đại lộ Bình Dương, Phường Hiệp Thành, Thủ Dầu Một, Bình Dương',
    'binhduong@gymfit.vn',
    '0274000005',
    'Chi nhánh Bình Dương – Mở rộng ra tỉnh thành đầu tiên của GymFit. Phục vụ cộng đồng công nhân và chuyên gia tại các khu công nghiệp tỉnh Bình Dương.',
    '06:00 - 21:00',
    'Active',
    NOW() - interval '118 days',
    NOW() - interval '5 days'
),
-- Chi nhánh 6: Đà Nẵng (khai trương T5/2026 - mới nhất)
(
    'aaaaaaaa-0001-0000-0000-000000000006',
    'GymFit Đà Nẵng',
    '88 Nguyễn Văn Linh, Phường Thạc Gián, Thanh Khê, Đà Nẵng',
    'danang@gymfit.vn',
    '0236000006',
    'Chi nhánh Đà Nẵng – Mở rộng miền Trung. Vị trí thuận tiện tại trung tâm thành phố biển xinh đẹp. Phòng tập hiện đại với view hướng biển.',
    '06:00 - 21:00',
    'Active',
    NOW() - interval '38 days',
    NOW() - interval '2 days'
);

-- =====================================================
-- BRANCH IMAGES
-- =====================================================
INSERT INTO "BranchImages" ("BranchImageId","BranchId","ImageUrl","CreatedAt")
VALUES
    (gen_random_uuid(), 'aaaaaaaa-0001-0000-0000-000000000001', '/images/branches/q1-main.jpg',      NOW()),
    (gen_random_uuid(), 'aaaaaaaa-0001-0000-0000-000000000001', '/images/branches/q1-gym.jpg',       NOW()),
    (gen_random_uuid(), 'aaaaaaaa-0001-0000-0000-000000000001', '/images/branches/q1-pool.jpg',      NOW()),
    (gen_random_uuid(), 'aaaaaaaa-0001-0000-0000-000000000002', '/images/branches/q7-main.jpg',      NOW()),
    (gen_random_uuid(), 'aaaaaaaa-0001-0000-0000-000000000002', '/images/branches/q7-yoga.jpg',      NOW()),
    (gen_random_uuid(), 'aaaaaaaa-0001-0000-0000-000000000003', '/images/branches/bt-main.jpg',      NOW()),
    (gen_random_uuid(), 'aaaaaaaa-0001-0000-0000-000000000004', '/images/branches/td-main.jpg',      NOW()),
    (gen_random_uuid(), 'aaaaaaaa-0001-0000-0000-000000000005', '/images/branches/bd-main.jpg',      NOW()),
    (gen_random_uuid(), 'aaaaaaaa-0001-0000-0000-000000000006', '/images/branches/dn-main.jpg',      NOW());

-- =====================================================
-- CẬP NHẬT InitialBranchId cho Staff Users (Q1 + Q7 hiện có)
-- =====================================================
UPDATE "AspNetUsers"
SET "InitialBranchId" = 'aaaaaaaa-0001-0000-0000-000000000001'
WHERE "Id" IN (
    '00000000-0003-0000-0000-000000000001',
    '00000000-0003-0000-0000-000000000003',
    '00000000-0003-0000-0000-000000000004',
    '00000000-0003-0000-0000-000000000005',
    '00000000-0003-0000-0000-000000000006',
    '00000000-0003-0000-0000-000000000008'
);

UPDATE "AspNetUsers"
SET "InitialBranchId" = 'aaaaaaaa-0001-0000-0000-000000000002'
WHERE "Id" IN (
    '00000000-0003-0000-0000-000000000002',
    '00000000-0003-0000-0000-000000000007',
    '00000000-0003-0000-0000-000000000009'
);

-- Staff Thủ Đức (ID 016-021 — thêm ở 02_users.sql)
UPDATE "AspNetUsers"
SET "InitialBranchId" = 'aaaaaaaa-0001-0000-0000-000000000004'
WHERE "Id" IN (
    '00000000-0003-0000-0000-000000000016',
    '00000000-0003-0000-0000-000000000017',
    '00000000-0003-0000-0000-000000000018',
    '00000000-0003-0000-0000-000000000019',
    '00000000-0003-0000-0000-000000000020',
    '00000000-0003-0000-0000-000000000021'
);

-- Staff Bình Thạnh (ID 022-026)
UPDATE "AspNetUsers"
SET "InitialBranchId" = 'aaaaaaaa-0001-0000-0000-000000000003'
WHERE "Id" IN (
    '00000000-0003-0000-0000-000000000022',
    '00000000-0003-0000-0000-000000000023',
    '00000000-0003-0000-0000-000000000024',
    '00000000-0003-0000-0000-000000000025',
    '00000000-0003-0000-0000-000000000026'
);

-- Staff Bình Dương (ID 027-031)
UPDATE "AspNetUsers"
SET "InitialBranchId" = 'aaaaaaaa-0001-0000-0000-000000000005'
WHERE "Id" IN (
    '00000000-0003-0000-0000-000000000027',
    '00000000-0003-0000-0000-000000000028',
    '00000000-0003-0000-0000-000000000029',
    '00000000-0003-0000-0000-000000000030',
    '00000000-0003-0000-0000-000000000031'
);

-- Staff Đà Nẵng (ID 032-036)
UPDATE "AspNetUsers"
SET "InitialBranchId" = 'aaaaaaaa-0001-0000-0000-000000000006'
WHERE "Id" IN (
    '00000000-0003-0000-0000-000000000032',
    '00000000-0003-0000-0000-000000000033',
    '00000000-0003-0000-0000-000000000034',
    '00000000-0003-0000-0000-000000000035',
    '00000000-0003-0000-0000-000000000036'
);
