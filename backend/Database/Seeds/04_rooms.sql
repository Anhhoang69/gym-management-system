-- =====================================================
-- 04_ROOMS.SQL
-- Seed phòng tập theo chi nhánh — 6 chi nhánh
-- =====================================================

-- =====================================================
-- ROOMS - Chi nhánh Quận 1 (5 rooms)
-- =====================================================
INSERT INTO "Rooms"
    ("RoomId","Name","RoomNumber","Capacity","Status","BranchId")
VALUES
(
    'bbbbbbbb-0001-0000-0000-000000000001',
    'Phòng Yoga',
    'Y01',
    20,
    'Active',
    'aaaaaaaa-0001-0000-0000-000000000001'
),
(
    'bbbbbbbb-0001-0000-0000-000000000002',
    'Phòng Cardio',
    'C01',
    30,
    'Active',
    'aaaaaaaa-0001-0000-0000-000000000001'
),
(
    'bbbbbbbb-0001-0000-0000-000000000003',
    'Phòng Boxing',
    'B01',
    15,
    'Active',
    'aaaaaaaa-0001-0000-0000-000000000001'
),
(
    'bbbbbbbb-0001-0000-0000-000000000004',
    'Phòng Gym Chính',
    'G01',
    50,
    'Active',
    'aaaaaaaa-0001-0000-0000-000000000001'
),
(
    'bbbbbbbb-0001-0000-0000-000000000005',
    'Phòng Group Class',
    'GC01',
    25,
    'Maintenance',
    'aaaaaaaa-0001-0000-0000-000000000001'
),

-- =====================================================
-- ROOMS - Chi nhánh Quận 7 (4 rooms)
-- =====================================================
(
    'bbbbbbbb-0001-0000-0000-000000000006',
    'Phòng Yoga VIP',
    'Y01',
    18,
    'Active',
    'aaaaaaaa-0001-0000-0000-000000000002'
),
(
    'bbbbbbbb-0001-0000-0000-000000000007',
    'Phòng Zumba',
    'Z01',
    22,
    'Active',
    'aaaaaaaa-0001-0000-0000-000000000002'
),
(
    'bbbbbbbb-0001-0000-0000-000000000008',
    'Phòng Gym Tổng Hợp',
    'G01',
    40,
    'Active',
    'aaaaaaaa-0001-0000-0000-000000000002'
),
(
    'bbbbbbbb-0001-0000-0000-000000000009',
    'Phòng CrossFit',
    'CF01',
    20,
    'Active',
    'aaaaaaaa-0001-0000-0000-000000000002'
),

-- =====================================================
-- ROOMS - Chi nhánh Bình Thạnh (3 rooms)
-- =====================================================
(
    'bbbbbbbb-0001-0000-0000-000000000010',
    'Phòng Yoga',
    'Y01',
    15,
    'Active',
    'aaaaaaaa-0001-0000-0000-000000000003'
),
(
    'bbbbbbbb-0001-0000-0000-000000000011',
    'Phòng Gym Chính',
    'G01',
    35,
    'Active',
    'aaaaaaaa-0001-0000-0000-000000000003'
),
(
    'bbbbbbbb-0001-0000-0000-000000000012',
    'Phòng Cardio',
    'C01',
    20,
    'Active',
    'aaaaaaaa-0001-0000-0000-000000000003'
),

-- =====================================================
-- ROOMS - Chi nhánh Thủ Đức (4 rooms)
-- =====================================================
(
    'bbbbbbbb-0001-0000-0000-000000000013',
    'Phòng Yoga',
    'Y01',
    20,
    'Active',
    'aaaaaaaa-0001-0000-0000-000000000004'
),
(
    'bbbbbbbb-0001-0000-0000-000000000014',
    'Phòng Cardio',
    'C01',
    25,
    'Active',
    'aaaaaaaa-0001-0000-0000-000000000004'
),
(
    'bbbbbbbb-0001-0000-0000-000000000015',
    'Phòng Gym Chính',
    'G01',
    40,
    'Active',
    'aaaaaaaa-0001-0000-0000-000000000004'
),
(
    'bbbbbbbb-0001-0000-0000-000000000016',
    'Phòng Zumba',
    'Z01',
    20,
    'Active',
    'aaaaaaaa-0001-0000-0000-000000000004'
),

-- =====================================================
-- ROOMS - Chi nhánh Bình Dương (2 rooms)
-- =====================================================
(
    'bbbbbbbb-0001-0000-0000-000000000017',
    'Phòng Yoga',
    'Y01',
    15,
    'Active',
    'aaaaaaaa-0001-0000-0000-000000000005'
),
(
    'bbbbbbbb-0001-0000-0000-000000000018',
    'Phòng Gym Chính',
    'G01',
    30,
    'Active',
    'aaaaaaaa-0001-0000-0000-000000000005'
),

-- =====================================================
-- ROOMS - Chi nhánh Đà Nẵng (2 rooms)
-- =====================================================
(
    'bbbbbbbb-0001-0000-0000-000000000019',
    'Phòng Yoga',
    'Y01',
    15,
    'Active',
    'aaaaaaaa-0001-0000-0000-000000000006'
),
(
    'bbbbbbbb-0001-0000-0000-000000000020',
    'Phòng Gym Chính',
    'G01',
    30,
    'Active',
    'aaaaaaaa-0001-0000-0000-000000000006'
);

-- =====================================================
-- ROOM IMAGES
-- =====================================================
INSERT INTO "RoomImages" ("RoomImageId","RoomId","ImageUrl","CreatedAt")
VALUES
    (gen_random_uuid(), 'bbbbbbbb-0001-0000-0000-000000000001', '/images/rooms/yoga-q1.jpg',     NOW()),
    (gen_random_uuid(), 'bbbbbbbb-0001-0000-0000-000000000002', '/images/rooms/cardio-q1.jpg',   NOW()),
    (gen_random_uuid(), 'bbbbbbbb-0001-0000-0000-000000000004', '/images/rooms/gym-q1.jpg',      NOW()),
    (gen_random_uuid(), 'bbbbbbbb-0001-0000-0000-000000000006', '/images/rooms/yoga-q7.jpg',     NOW()),
    (gen_random_uuid(), 'bbbbbbbb-0001-0000-0000-000000000007', '/images/rooms/zumba-q7.jpg',    NOW()),
    (gen_random_uuid(), 'bbbbbbbb-0001-0000-0000-000000000008', '/images/rooms/gym-q7.jpg',      NOW()),
    (gen_random_uuid(), 'bbbbbbbb-0001-0000-0000-000000000010', '/images/rooms/yoga-bt.jpg',     NOW()),
    (gen_random_uuid(), 'bbbbbbbb-0001-0000-0000-000000000013', '/images/rooms/yoga-td.jpg',     NOW()),
    (gen_random_uuid(), 'bbbbbbbb-0001-0000-0000-000000000015', '/images/rooms/gym-td.jpg',      NOW()),
    (gen_random_uuid(), 'bbbbbbbb-0001-0000-0000-000000000017', '/images/rooms/yoga-bd.jpg',     NOW()),
    (gen_random_uuid(), 'bbbbbbbb-0001-0000-0000-000000000019', '/images/rooms/yoga-dn.jpg',     NOW());
