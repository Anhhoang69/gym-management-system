-- =====================================================
-- 12_BOOKINGS.SQL
-- Seed đặt chỗ lớp học
-- =====================================================

-- =====================================================
-- CLASS BOOKINGS
-- BookingStatus: Booked, Attended, Cancelled, NoShow
-- =====================================================
INSERT INTO "ClassBookings"
    ("MemberUserId","ClassId","BookedAt","Status",
     "SessionNote","CancelReason","CancelledAt","CheckedInAt")
VALUES

-- Lớp 1: Yoga Buổi Sáng - COMPLETED
('00000000-0004-0000-0000-000000000001', 'cccccccc-0002-0000-0000-000000000001', NOW() - interval '16 days', 'Attended', 'Tập tốt, cần cải thiện tư thế Downward Dog', null, null, NOW() - interval '14 days'),
('00000000-0004-0000-0000-000000000002', 'cccccccc-0002-0000-0000-000000000001', NOW() - interval '16 days', 'Attended', null, null, null, NOW() - interval '14 days'),
('00000000-0004-0000-0000-000000000003', 'cccccccc-0002-0000-0000-000000000001', NOW() - interval '15 days', 'Attended', 'Hội viên cần tập luyện thêm về thở', null, null, NOW() - interval '14 days'),
('00000000-0004-0000-0000-000000000004', 'cccccccc-0002-0000-0000-000000000001', NOW() - interval '15 days', 'NoShow', null, null, null, null),
('00000000-0004-0000-0000-000000000006', 'cccccccc-0002-0000-0000-000000000001', NOW() - interval '15 days', 'Attended', null, null, null, NOW() - interval '14 days'),

-- Lớp 2: Cardio - COMPLETED
('00000000-0004-0000-0000-000000000001', 'cccccccc-0002-0000-0000-000000000002', NOW() - interval '8 days', 'Attended', null, null, null, NOW() - interval '7 days'),
('00000000-0004-0000-0000-000000000002', 'cccccccc-0002-0000-0000-000000000002', NOW() - interval '8 days', 'Cancelled', null, 'Bận việc đột xuất', NOW() - interval '7 days', null),
('00000000-0004-0000-0000-000000000005', 'cccccccc-0002-0000-0000-000000000002', NOW() - interval '8 days', 'Attended', null, null, null, NOW() - interval '7 days'),

-- Lớp 3: Yoga hôm nay - SCHEDULED
('00000000-0004-0000-0000-000000000001', 'cccccccc-0002-0000-0000-000000000003', NOW() - interval '2 days', 'Booked', null, null, null, null),
('00000000-0004-0000-0000-000000000002', 'cccccccc-0002-0000-0000-000000000003', NOW() - interval '1 day', 'Booked', null, null, null, null),
('00000000-0004-0000-0000-000000000004', 'cccccccc-0002-0000-0000-000000000003', NOW() - interval '1 day', 'Booked', null, null, null, null),
('00000000-0004-0000-0000-000000000006', 'cccccccc-0002-0000-0000-000000000003', NOW() - interval '6 hours', 'Booked', null, null, null, null),

-- Lớp 4: Boxing ngày mai - SCHEDULED
('00000000-0004-0000-0000-000000000003', 'cccccccc-0002-0000-0000-000000000004', NOW() - interval '1 day', 'Booked', null, null, null, null),
('00000000-0004-0000-0000-000000000005', 'cccccccc-0002-0000-0000-000000000004', NOW() - interval '12 hours', 'Booked', null, null, null, null),

-- Lớp 5: Zumba - ĐẦY CHỖ (22/22)
('00000000-0004-0000-0000-000000000001', 'cccccccc-0002-0000-0000-000000000005', NOW() - interval '5 days', 'Booked', null, null, null, null),
('00000000-0004-0000-0000-000000000002', 'cccccccc-0002-0000-0000-000000000005', NOW() - interval '5 days', 'Booked', null, null, null, null),
('00000000-0004-0000-0000-000000000003', 'cccccccc-0002-0000-0000-000000000005', NOW() - interval '4 days', 'Booked', null, null, null, null),
('00000000-0004-0000-0000-000000000004', 'cccccccc-0002-0000-0000-000000000005', NOW() - interval '4 days', 'Booked', null, null, null, null),
('00000000-0004-0000-0000-000000000005', 'cccccccc-0002-0000-0000-000000000005', NOW() - interval '3 days', 'Booked', null, null, null, null),
('00000000-0004-0000-0000-000000000006', 'cccccccc-0002-0000-0000-000000000005', NOW() - interval '3 days', 'Booked', null, null, null, null),
('00000000-0004-0000-0000-000000000007', 'cccccccc-0002-0000-0000-000000000005', NOW() - interval '2 days', 'Booked', null, null, null, null),
('00000000-0004-0000-0000-000000000008', 'cccccccc-0002-0000-0000-000000000005', NOW() - interval '2 days', 'Booked', null, null, null, null),

-- Lớp 7: PT cá nhân - Member Cường
('00000000-0004-0000-0000-000000000003', 'cccccccc-0002-0000-0000-000000000007', NOW() - interval '2 days', 'Booked', null, null, null, null),

-- Lớp 9: Yoga Q7 nâng cao - COMPLETED
('00000000-0004-0000-0000-000000000005', 'cccccccc-0002-0000-0000-000000000009', NOW() - interval '12 days', 'Attended', null, null, null, NOW() - interval '10 days'),
('00000000-0004-0000-0000-000000000006', 'cccccccc-0002-0000-0000-000000000009', NOW() - interval '12 days', 'Attended', null, null, null, NOW() - interval '10 days');
