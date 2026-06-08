-- =====================================================
-- 11_CLASSES.SQL
-- Seed lớp học – đa dạng loại và trạng thái
-- =====================================================

-- =====================================================
-- CLASSES (10 Static Classes)
-- ClassType: Yoga, Boxing, Cardio, Crossfit, Zumba, PersonalTraining
-- ClassStatus: Scheduled, Cancelled, Completed
-- =====================================================
INSERT INTO "Classes"
    ("ClassId","Title","Description","Date","StartTime","EndTime",
     "ClassType","Status","Capacity","MinCapacity",
     "TrainerStaffId","RoomId")
VALUES

-- Lớp 1: Yoga - COMPLETED
(
    'cccccccc-0002-0000-0000-000000000001',
    'Yoga Sức Sống Buổi Sáng',
    'Lớp Yoga tập trung vào hít thở và tư thế cơ bản, giúp thư giãn và tăng cường độ dẻo dai. Phù hợp cho người mới bắt đầu và người đã có kinh nghiệm.',
    CURRENT_DATE - interval '14 days',
    '07:00', '08:00',
    'Yoga', 'Completed', 20, 5,
    '00000000-0003-0000-0000-000000000004',
    'bbbbbbbb-0001-0000-0000-000000000001'
),

-- Lớp 2: Cardio - COMPLETED
(
    'cccccccc-0002-0000-0000-000000000002',
    'Cardio Đốt Cháy Mỡ',
    'Bài tập cardio cường độ vừa, kết hợp nhảy dây, đi bộ nhanh và đạp xe tĩnh. Mục tiêu đốt mỡ và cải thiện sức bền tim mạch.',
    CURRENT_DATE - interval '7 days',
    '17:30', '18:30',
    'Cardio', 'Completed', 25, 5,
    '00000000-0003-0000-0000-000000000003',
    'bbbbbbbb-0001-0000-0000-000000000002'
),

-- Lớp 3: Yoga - SCHEDULED (hôm nay)
(
    'cccccccc-0002-0000-0000-000000000003',
    'Yoga Thư Giãn Buổi Sáng',
    'Kết hợp các tư thế Yoga phục hồi và kỹ thuật thở sâu. Giúp giảm stress, tăng sự tập trung và cải thiện giấc ngủ.',
    CURRENT_DATE,
    '07:00', '08:00',
    'Yoga', 'Scheduled', 20, 5,
    '00000000-0003-0000-0000-000000000004',
    'bbbbbbbb-0001-0000-0000-000000000001'
),

-- Lớp 4: Boxing - SCHEDULED (ngày mai)
(
    'cccccccc-0002-0000-0000-000000000004',
    'Boxing Cơ Bản',
    'Học kỹ thuật đấm, đỡ và di chuyển cơ bản trong boxing. Bài tập kết hợp cardio và kỹ năng tự vệ. Mang lại cảm giác tự tin và sức mạnh.',
    CURRENT_DATE + interval '1 day',
    '18:00', '19:30',
    'Boxing', 'Scheduled', 15, 4,
    '00000000-0003-0000-0000-000000000005',
    'bbbbbbbb-0001-0000-0000-000000000003'
),

-- Lớp 5: Zumba - SCHEDULED (ngày kia) - ĐÃ ĐẦY CHỖ
(
    'cccccccc-0002-0000-0000-000000000005',
    'Zumba Party - Vũ Điệu Nhiệt Đới',
    'Lớp Zumba sôi động với nhạc Latin và Caribê. Kết hợp múa và aerobic, đốt cháy calo trong không khí vui tươi. Không cần kinh nghiệm múa trước.',
    CURRENT_DATE + interval '2 days',
    '19:00', '20:00',
    'Zumba', 'Scheduled', 22, 5,
    '00000000-0003-0000-0000-000000000004',
    'bbbbbbbb-0001-0000-0000-000000000007'
),

-- Lớp 6: CrossFit - SCHEDULED
(
    'cccccccc-0002-0000-0000-000000000006',
    'CrossFit Cường Độ Cao (HIIT)',
    'Lớp CrossFit với các bài WOD (Workout Of the Day) đa dạng. Kết hợp sức mạnh, sức bền và linh hoạt. Phù hợp người đã có nền tảng thể lực tốt.',
    CURRENT_DATE + interval '3 days',
    '06:00', '07:00',
    'Crossfit', 'Scheduled', 20, 5,
    '00000000-0003-0000-0000-000000000005',
    'bbbbbbbb-0001-0000-0000-000000000009'
),

-- Lớp 7: PT - SCHEDULED (buổi PT cá nhân)
(
    'cccccccc-0002-0000-0000-000000000007',
    'PT Cá Nhân - Cường',
    'Buổi PT cá nhân dành riêng cho hội viên Lê Đức Cường. Chương trình tăng cơ phần trên cơ thể.',
    CURRENT_DATE + interval '1 day',
    '09:00', '10:00',
    'PersonalTraining', 'Scheduled', 1, 1,
    '00000000-0003-0000-0000-000000000005',
    'bbbbbbbb-0001-0000-0000-000000000004'
),

-- Lớp 8: Cardio - CANCELLED
(
    'cccccccc-0002-0000-0000-000000000008',
    'Cardio Nhảy Dây',
    'Lớp tập nhảy dây cường độ cao, đốt cháy nhiều calo trong thời gian ngắn.',
    CURRENT_DATE - interval '3 days',
    '17:00', '18:00',
    'Cardio', 'Cancelled', 25, 8,
    '00000000-0003-0000-0000-000000000003',
    'bbbbbbbb-0001-0000-0000-000000000002'
),

-- Lớp 9: Yoga - COMPLETED (tuần trước - Q7)
(
    'cccccccc-0002-0000-0000-000000000009',
    'Yoga Nâng Cao - Cân Bằng & Linh Hoạt',
    'Lớp Yoga nâng cao với các tư thế thăng bằng và ngược đầu. Yêu cầu có nền tảng Yoga cơ bản.',
    CURRENT_DATE - interval '10 days',
    '08:00', '09:30',
    'Yoga', 'Completed', 18, 5,
    '00000000-0003-0000-0000-000000000004',
    'bbbbbbbb-0001-0000-0000-000000000006'
),

-- Lớp 10: Zumba - SCHEDULED (Q7 tuần sau)
(
    'cccccccc-0002-0000-0000-000000000010',
    'Zumba Fitness Weekend',
    'Buổi Zumba cuối tuần đặc biệt với playlist nhạc mới cập nhật. Thích hợp mọi lứa tuổi và thể lực.',
    CURRENT_DATE + interval '5 days',
    '09:00', '10:00',
    'Zumba', 'Scheduled', 22, 5,
    '00000000-0003-0000-0000-000000000004',
    'bbbbbbbb-0001-0000-0000-000000000007'
);


-- =====================================================
-- CLASSES BULK GENERATION (180+ Classes)
-- =====================================================
DO $$
DECLARE
  branch_ids uuid[] := ARRAY[
    'aaaaaaaa-0001-0000-0000-000000000001'::uuid, -- Q1
    'aaaaaaaa-0001-0000-0000-000000000002'::uuid, -- Q7
    'aaaaaaaa-0001-0000-0000-000000000004'::uuid, -- TD
    'aaaaaaaa-0001-0000-0000-000000000003'::uuid, -- BT
    'aaaaaaaa-0001-0000-0000-000000000005'::uuid, -- BD
    'aaaaaaaa-0001-0000-0000-000000000006'::uuid  -- DN
  ];

  class_types text[] := ARRAY['Yoga', 'Cardio', 'Zumba', 'Crossfit', 'Boxing', 'PersonalTraining'];
  
  -- Time slots
  start_times text[] := ARRAY['06:00', '07:30', '09:00', '11:00', '15:00', '17:30', '19:00'];
  end_times   text[] := ARRAY['07:00', '08:30', '10:00', '12:00', '16:00', '18:30', '20:00'];

  days_ago     int;
  branch_idx   int;
  c_type       text;
  slot_idx     int;
  class_date   date;
  c_status     text;
  capacity     int;
  min_capacity int;
  trainer_id   uuid;
  room_id      uuid;
  class_n      int := 0;
  title        text;
  description  text;
BEGIN
  -- Generate classes day by day from 84 days ago to 14 days in the future.
  FOR days_ago IN -14..84 LOOP
    class_date := (CURRENT_DATE - (days_ago || ' days')::interval)::date;

    -- Pick 2 branches per day to keep spacing natural
    FOR b_step IN 0..1 LOOP
      branch_idx := ((((days_ago + 100) * 2 + b_step) % 6) + 1);
      
      -- Class Type cycling
      c_type := class_types[(((days_ago + 100) * 3 + b_step * 7) % 6) + 1];

      -- Branch conditions for historical opening dates
      IF branch_idx = 6 AND days_ago > 30 THEN
        CONTINUE; -- DN opened 30 days ago
      END IF;

      IF branch_idx = 5 AND days_ago > 120 THEN
        CONTINUE; -- BD opened 120 days ago
      END IF;

      -- Title & Description setup
      CASE c_type
        WHEN 'Yoga' THEN
          title := 'Yoga Sức Sống ' || CASE WHEN b_step = 0 THEN 'Buổi Sáng' ELSE 'Thư Giãn' END;
          description := 'Lớp tập trung vào hít thở, dẻo dai và phục hồi cơ thể.';
          capacity := 20; min_capacity := 5;
        WHEN 'Cardio' THEN
          title := 'Cardio Đốt Mỡ ' || CASE WHEN b_step = 0 THEN 'Cường Độ Cao' ELSE 'Bền Bỉ' END;
          description := 'Bài tập năng động giúp đốt cháy calo và tăng cường hệ tim mạch.';
          capacity := 25; min_capacity := 5;
        WHEN 'Zumba' THEN
          title := 'Zumba Dance Party';
          description := 'Vũ điệu Zumba sôi động trên nền nhạc Latin.';
          capacity := 22; min_capacity := 5;
        WHEN 'Crossfit' THEN
          title := 'CrossFit WOD ' || CASE WHEN b_step = 0 THEN 'Sức Mạng' ELSE 'Thể Lực' END;
          description := 'Kết hợp tạ, cardio cường độ cao theo bài WOD.';
          capacity := 20; min_capacity := 5;
        WHEN 'Boxing' THEN
          title := 'Boxing Cơ Bản & Phản Xạ';
          description := 'Học đấm, tự vệ và rèn luyện thể lực cốt lõi.';
          capacity := 15; min_capacity := 4;
        ELSE -- PersonalTraining
          title := 'PT 1 kèm 1 - Chuyên sâu';
          description := 'Buổi tập riêng biệt được cá nhân hóa bởi HLV chuyên nghiệp.';
          capacity := 1; min_capacity := 1;
      END CASE;

      -- Slot picking
      slot_idx := ((((days_ago + 100) * 5 + b_step * 11) % 7) + 1);

      -- Status
      IF class_date < CURRENT_DATE THEN
        c_status := CASE WHEN (days_ago + b_step) % 20 = 0 THEN 'Cancelled' ELSE 'Completed' END;
      ELSE
        c_status := 'Scheduled';
      END IF;

      -- PT assignment
      IF branch_idx = 1 THEN
        -- Q1 PTs
        CASE (class_n % 10)
          WHEN 0,1,2,3 THEN trainer_id := '00000000-0003-0000-0000-000000000005'::uuid; -- Đăng (40%)
          WHEN 4,5,6   THEN trainer_id := '00000000-0003-0000-0000-000000000003'::uuid; -- Tuấn (30%)
          ELSE              trainer_id := '00000000-0003-0000-0000-000000000010'::uuid; -- Châu (30%)
        END CASE;
      ELSIF branch_idx = 2 THEN
        -- Q7 PTs
        CASE (class_n % 10)
          WHEN 0,1,2,3 THEN trainer_id := '00000000-0003-0000-0000-000000000009'::uuid; -- Phong (40%)
          WHEN 4,5,6   THEN trainer_id := '00000000-0003-0000-0000-000000000004'::uuid; -- Mai (30%)
          ELSE              trainer_id := '00000000-0003-0000-0000-000000000011'::uuid; -- Hưng (30%)
        END CASE;
      ELSE
        -- Other branches: select PT/HeadPT dynamically
        SELECT "UserId" INTO trainer_id
        FROM "Staffs"
        WHERE "BranchId" = branch_ids[branch_idx] AND "Position" IN ('PT', 'HeadPT')
        ORDER BY ((class_n * 17) % 7)
        LIMIT 1;
      END IF;

      -- Room assignment
      IF c_type = 'Yoga' THEN
        SELECT "RoomId" INTO room_id FROM "Rooms" WHERE "BranchId" = branch_ids[branch_idx] AND "Name" LIKE '%Yoga%' LIMIT 1;
      ELSIF c_type = 'Zumba' THEN
        SELECT "RoomId" INTO room_id FROM "Rooms" WHERE "BranchId" = branch_ids[branch_idx] AND ("Name" LIKE '%Zumba%' OR "Name" LIKE '%Yoga%' OR "Name" LIKE '%Group%') LIMIT 1;
      ELSIF c_type = 'Crossfit' THEN
        SELECT "RoomId" INTO room_id FROM "Rooms" WHERE "BranchId" = branch_ids[branch_idx] AND ("Name" LIKE '%CrossFit%' OR "Name" LIKE '%Gym%') LIMIT 1;
      ELSIF c_type = 'Cardio' THEN
        SELECT "RoomId" INTO room_id FROM "Rooms" WHERE "BranchId" = branch_ids[branch_idx] AND ("Name" LIKE '%Cardio%' OR "Name" LIKE '%Gym%') LIMIT 1;
      ELSIF c_type = 'Boxing' THEN
        SELECT "RoomId" INTO room_id FROM "Rooms" WHERE "BranchId" = branch_ids[branch_idx] AND ("Name" LIKE '%Boxing%' OR "Name" LIKE '%Gym%') LIMIT 1;
      ELSE
        SELECT "RoomId" INTO room_id FROM "Rooms" WHERE "BranchId" = branch_ids[branch_idx] AND "Name" LIKE '%Gym%' LIMIT 1;
      END IF;

      IF room_id IS NULL THEN
        SELECT "RoomId" INTO room_id FROM "Rooms" WHERE "BranchId" = branch_ids[branch_idx] LIMIT 1;
      END IF;

      IF trainer_id IS NOT NULL AND room_id IS NOT NULL THEN
        INSERT INTO "Classes"
            ("ClassId","Title","Description","Date","StartTime","EndTime",
             "ClassType","Status","Capacity","MinCapacity",
             "TrainerStaffId","RoomId")
        VALUES (
            gen_random_uuid(),
            title,
            description,
            class_date,
            start_times[slot_idx]::time,
            end_times[slot_idx]::time,
            c_type,
            c_status,
            capacity,
            min_capacity,
            trainer_id,
            room_id
        );
        class_n := class_n + 1;
      END IF;

    END LOOP;
  END LOOP;
END $$;
