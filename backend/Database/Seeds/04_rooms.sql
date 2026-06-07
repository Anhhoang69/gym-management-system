-- =====================================================
-- 04_ROOMS.SQL
-- Seed phòng tập theo chi nhánh
-- =====================================================

-- =====================================================
-- ROOMS - Chi nhánh Quận 1
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
-- ROOMS - Chi nhánh Quận 7
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
);

-- =====================================================
-- ROOM IMAGES
-- =====================================================
INSERT INTO "RoomImages" ("RoomImageId","RoomId","ImageUrl","CreatedAt")
VALUES
    (gen_random_uuid(), 'bbbbbbbb-0001-0000-0000-000000000001', '/images/rooms/yoga-q1.jpg', NOW()),
    (gen_random_uuid(), 'bbbbbbbb-0001-0000-0000-000000000002', '/images/rooms/cardio-q1.jpg', NOW()),
    (gen_random_uuid(), 'bbbbbbbb-0001-0000-0000-000000000004', '/images/rooms/gym-q1.jpg', NOW()),
    (gen_random_uuid(), 'bbbbbbbb-0001-0000-0000-000000000006', '/images/rooms/yoga-q7.jpg', NOW()),
    (gen_random_uuid(), 'bbbbbbbb-0001-0000-0000-000000000007', '/images/rooms/zumba-q7.jpg', NOW());
