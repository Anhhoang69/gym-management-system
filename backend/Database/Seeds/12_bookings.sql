-- =====================================================
-- 12_BOOKINGS.SQL
-- Seed đặt chỗ lớp học
-- =====================================================

-- =====================================================
-- CLASS BOOKINGS (25 Static Bookings)
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


-- =====================================================
-- CLASS BOOKINGS BULK GENERATION (1,200+ Bookings)
-- =====================================================
DO $$
DECLARE
  class_rec      record;
  branch_id      uuid;
  branch_members uuid[];
  m_count        int;
  num_bookings   int;
  start_idx      int;
  member_idx     int;
  member_id      uuid;
  b_status       text;
  checked_in     timestamptz;
  cancelled_at   timestamptz;
  cancel_reason  text;
  note           text;
  booked_at      timestamptz;
BEGIN
  FOR class_rec IN
    SELECT c."ClassId", c."Date", c."StartTime", c."EndTime", c."ClassType", c."Status", r."BranchId"
    FROM "Classes" c
    JOIN "Rooms" r ON c."RoomId" = r."RoomId"
    WHERE c."ClassId" NOT IN (
      'cccccccc-0002-0000-0000-000000000001'::uuid,
      'cccccccc-0002-0000-0000-000000000002'::uuid,
      'cccccccc-0002-0000-0000-000000000003'::uuid,
      'cccccccc-0002-0000-0000-000000000004'::uuid,
      'cccccccc-0002-0000-0000-000000000005'::uuid,
      'cccccccc-0002-0000-0000-000000000006'::uuid,
      'cccccccc-0002-0000-0000-000000000007'::uuid,
      'cccccccc-0002-0000-0000-000000000008'::uuid,
      'cccccccc-0002-0000-0000-000000000009'::uuid,
      'cccccccc-0002-0000-0000-000000000010'::uuid
    )
  LOOP
    branch_id := class_rec."BranchId";

    -- Get members of this branch
    SELECT ARRAY(
      SELECT m."UserId"
      FROM "Members" m
      JOIN "AspNetUsers" u ON m."UserId" = u."Id"
      WHERE u."InitialBranchId" = branch_id OR u."InitialBranchId" IS NULL
    ) INTO branch_members;

    m_count := array_length(branch_members, 1);
    IF m_count IS NULL OR m_count = 0 THEN
      SELECT ARRAY(SELECT "UserId" FROM "Members") INTO branch_members;
      m_count := array_length(branch_members, 1);
    END IF;

    -- Determine number of bookings
    IF class_rec."ClassType" = 'PersonalTraining' THEN
      num_bookings := 1;
    ELSE
      -- Average of ~7.5 bookings per group class
      num_bookings := (abs(hashtext(class_rec."ClassId"::text)) % 6) + 5; -- 5 to 10
      num_bookings := LEAST(num_bookings, m_count);
    END IF;

    start_idx := abs(hashtext(class_rec."ClassId"::text)) % m_count;

    FOR k IN 0..(num_bookings - 1) LOOP
      member_idx := (start_idx + k) % m_count + 1;
      member_id  := branch_members[member_idx];

      -- Status selection
      IF class_rec."Status" = 'Completed' THEN
        CASE (k % 12)
          WHEN 0    THEN b_status := 'NoShow';
          WHEN 1,2  THEN b_status := 'Cancelled';
          ELSE           b_status := 'Attended';
        END CASE;
      ELSIF class_rec."Status" = 'Cancelled' THEN
        b_status := 'Cancelled';
      ELSE
        b_status := CASE WHEN k % 10 = 0 THEN 'Cancelled' ELSE 'Booked' END;
      END IF;

      -- Set dates
      booked_at := class_rec."Date" - interval '3 days';

      IF b_status = 'Attended' THEN
        checked_in := class_rec."Date" + (class_rec."StartTime"::time - interval '5 minutes');
        cancelled_at := null;
        cancel_reason := null;
        note := CASE WHEN k % 4 = 0 THEN 'Tập luyện tốt, đầy đủ bài tập.' ELSE null END;
      ELSIF b_status = 'Cancelled' THEN
        checked_in := null;
        cancelled_at := class_rec."Date" - interval '1 day';
        cancel_reason := 'Bận lịch cá nhân';
        note := null;
      ELSE
        checked_in := null;
        cancelled_at := null;
        cancel_reason := null;
        note := null;
      END IF;

      INSERT INTO "ClassBookings"
          ("MemberUserId","ClassId","BookedAt","Status",
           "SessionNote","CancelReason","CancelledAt","CheckedInAt")
      VALUES (
          member_id,
          class_rec."ClassId",
          booked_at,
          b_status,
          note,
          cancel_reason,
          cancelled_at,
          checked_in
      );
    END LOOP;
  END LOOP;
END $$;
