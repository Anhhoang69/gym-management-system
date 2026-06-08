-- =====================================================
-- 13_ATTENDANCES.SQL
-- Seed thẻ ra vào và lịch sử check-in
-- Access Cards: 230 members
-- Attendances: ~18.000 check-ins qua 12 tháng
-- =====================================================

-- =====================================================
-- ACCESS CARDS — 8 cards cũ (giữ nguyên IDs)
-- =====================================================
INSERT INTO "AccessCards"
    ("AccessCardId","CardCode","MemberUserId","Status","IssueDate","ExpireDate")
VALUES
('dddddddd-0002-0000-0000-000000000001', 'GYM-2025-001001', '00000000-0004-0000-0000-000000000001', 'Active',  NOW()-interval '180 days', NOW()+interval '60 days'),
('dddddddd-0002-0000-0000-000000000002', 'GYM-2025-001002', '00000000-0004-0000-0000-000000000002', 'Active',  NOW()-interval '150 days', NOW()+interval '15 days'),
('dddddddd-0002-0000-0000-000000000003', 'GYM-2025-001003', '00000000-0004-0000-0000-000000000003', 'Active',  NOW()-interval '120 days', NOW()+interval '120 days'),
('dddddddd-0002-0000-0000-000000000004', 'GYM-2025-001004', '00000000-0004-0000-0000-000000000004', 'Active',  NOW()-interval '90 days',  NOW()+interval '20 days'),
('dddddddd-0002-0000-0000-000000000005', 'GYM-2025-001005', '00000000-0004-0000-0000-000000000005', 'Active',  NOW()-interval '60 days',  NOW()+interval '70 days'),
('dddddddd-0002-0000-0000-000000000006', 'GYM-2025-001006', '00000000-0004-0000-0000-000000000006', 'Active',  NOW()-interval '45 days',  NOW()+interval '320 days'),
('dddddddd-0002-0000-0000-000000000007', 'GYM-2025-001007', '00000000-0004-0000-0000-000000000007', 'Active',  NOW()-interval '3 days',   NOW()+interval '4 days'),
('dddddddd-0002-0000-0000-000000000010', 'GYM-2025-001009', '00000000-0004-0000-0000-000000000009', 'Active',  NOW()-interval '30 days',  NOW()+interval '60 days');

-- =====================================================
-- ACCESS CARDS — Members 011-230 (bulk generate)
-- =====================================================
DO $$
DECLARE
  n           int;
  i           int;
  member_id   uuid;
  card_code   text;
  issue_date  date;
  expire_date date;
  card_status text;
  days_ago    int;
BEGIN
  FOR n IN 11..230 LOOP
    i := n - 11;
    member_id  := ('00000000-0004-0000-0000-' || lpad(n::text, 12, '0'))::uuid;
    card_code  := 'GYM-2025-' || lpad(n::text, 6, '0');
    days_ago   := GREATEST(2, 350 - i);
    issue_date := (NOW() - (days_ago || ' days')::interval)::date;

    -- Duration based on contract pattern
    CASE (i % 10)
      WHEN 0,1,2    THEN expire_date := issue_date + interval '1 month';
      WHEN 3,4,5,6  THEN expire_date := issue_date + interval '3 months';
      WHEN 7,8      THEN expire_date := issue_date + interval '6 months';
      ELSE               expire_date := issue_date + interval '12 months';
    END CASE;

    card_status := CASE
      WHEN expire_date < CURRENT_DATE THEN 'Expired'
      WHEN i % 40 = 0                 THEN 'Lost'
      ELSE 'Active'
    END;

    INSERT INTO "AccessCards"
        ("AccessCardId","CardCode","MemberUserId","Status","IssueDate","ExpireDate")
    VALUES (
        gen_random_uuid(),
        card_code,
        member_id,
        card_status,
        issue_date,
        expire_date
    );
  END LOOP;
END $$;

-- =====================================================
-- ATTENDANCES (10 members cũ — giữ nguyên pattern)
-- =====================================================
INSERT INTO "Attendances"
    ("AttendanceId","MemberUserId","CardId","BranchId","CheckinAt","CheckoutAt")
VALUES
-- Member An
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','dddddddd-0002-0000-0000-000000000001','aaaaaaaa-0001-0000-0000-000000000001',NOW()-interval '1 day'+time '07:05',NOW()-interval '1 day'+time '08:45'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','dddddddd-0002-0000-0000-000000000001','aaaaaaaa-0001-0000-0000-000000000001',NOW()-interval '3 days'+time '18:00',NOW()-interval '3 days'+time '19:30'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','dddddddd-0002-0000-0000-000000000001','aaaaaaaa-0001-0000-0000-000000000001',NOW()-interval '5 days'+time '07:10',NOW()-interval '5 days'+time '08:50'),
-- Member Bích
(gen_random_uuid(),'00000000-0004-0000-0000-000000000002','dddddddd-0002-0000-0000-000000000002','aaaaaaaa-0001-0000-0000-000000000001',NOW()-interval '2 days'+time '17:30',NOW()-interval '2 days'+time '19:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000002','dddddddd-0002-0000-0000-000000000002','aaaaaaaa-0001-0000-0000-000000000001',NOW()-interval '4 days'+time '17:45',NOW()-interval '4 days'+time '19:15'),
-- Member Cường
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','dddddddd-0002-0000-0000-000000000003','aaaaaaaa-0001-0000-0000-000000000001',NOW()-interval '1 day'+time '06:00',NOW()-interval '1 day'+time '08:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','dddddddd-0002-0000-0000-000000000003','aaaaaaaa-0001-0000-0000-000000000001',NOW()-interval '2 days'+time '06:05',NOW()-interval '2 day'+time '07:45'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','dddddddd-0002-0000-0000-000000000003','aaaaaaaa-0001-0000-0000-000000000001',NOW()-interval '3 days'+time '06:00',NOW()-interval '3 days'+time '08:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','dddddddd-0002-0000-0000-000000000003','aaaaaaaa-0001-0000-0000-000000000001',NOW()-interval '5 days'+time '06:10',NOW()-interval '5 days'+time '07:50'),
-- Member Em
(gen_random_uuid(),'00000000-0004-0000-0000-000000000005','dddddddd-0002-0000-0000-000000000005','aaaaaaaa-0001-0000-0000-000000000002',NOW()-interval '1 day'+time '18:00',NOW()-interval '1 day'+time '19:30'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000005','dddddddd-0002-0000-0000-000000000005','aaaaaaaa-0001-0000-0000-000000000002',NOW()-interval '3 days'+time '18:15',NOW()-interval '3 days'+time '19:45'),
-- Member Phương
(gen_random_uuid(),'00000000-0004-0000-0000-000000000006','dddddddd-0002-0000-0000-000000000006','aaaaaaaa-0001-0000-0000-000000000002',NOW()-interval '1 day'+time '06:30',NOW()-interval '1 day'+time '08:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000006','dddddddd-0002-0000-0000-000000000006','aaaaaaaa-0001-0000-0000-000000000002',NOW()-interval '2 days'+time '06:45',NOW()-interval '2 days'+time '08:15'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000006','dddddddd-0002-0000-0000-000000000006','aaaaaaaa-0001-0000-0000-000000000002',NOW()-interval '4 days'+time '17:00',NOW()-interval '4 days'+time '18:30'),
-- Member Giang
(gen_random_uuid(),'00000000-0004-0000-0000-000000000007','dddddddd-0002-0000-0000-000000000007','aaaaaaaa-0001-0000-0000-000000000001',NOW()-interval '2 days'+time '10:00',NOW()-interval '2 days'+time '11:00'),
-- Member Ký
(gen_random_uuid(),'00000000-0004-0000-0000-000000000009','dddddddd-0002-0000-0000-000000000010','aaaaaaaa-0001-0000-0000-000000000001',NOW()-interval '2 days'+time '07:00',NOW()-interval '2 days'+time '08:30'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000009','dddddddd-0002-0000-0000-000000000010','aaaaaaaa-0001-0000-0000-000000000001',NOW()-interval '5 days'+time '07:15',NOW()-interval '5 days'+time '08:45');

-- =====================================================
-- ATTENDANCES BULK — Members 011-230 × 12 months
-- Strategy:
--   - Each active member averages 10-14 visits/month
--   - 6 branches distributed by member range
--   - Peak hours: 06:00-08:00 (morning) and 17:00-20:00 (evening)
--   - Weekend attendance ~60% of weekday
--   - Total target: ~18.000 check-ins
-- =====================================================
DO $$
DECLARE
  -- Checkin time slots cycling
  checkin_hours int[] := ARRAY[6,6,7,7,7,8,17,17,18,18,19,19,9,10];
  checkin_mins  int[] := ARRAY[0,30,0,15,30,0,0,30,0,30,0,30,0,0];
  duration_mins int[] := ARRAY[90,60,90,75,90,60,90,75,90,60,90,75,60,75];

  -- Branch distribution for members
  branch_ids uuid[] := ARRAY[
    'aaaaaaaa-0001-0000-0000-000000000001'::uuid,  -- Q1
    'aaaaaaaa-0001-0000-0000-000000000002'::uuid,  -- Q7
    'aaaaaaaa-0001-0000-0000-000000000004'::uuid,  -- TD
    'aaaaaaaa-0001-0000-0000-000000000003'::uuid,  -- BT
    'aaaaaaaa-0001-0000-0000-000000000005'::uuid,  -- BD
    'aaaaaaaa-0001-0000-0000-000000000006'::uuid   -- DN
  ];

  n            int;
  i            int;
  member_id    uuid;
  card_id      uuid;
  branch_id    uuid;
  card_days    int;     -- days since card issued
  days_start   int;
  d            int;
  week_day     int;     -- day of week (0=Sun, 6=Sat)
  visit_prob   int;     -- visits per 10 days
  slot         int;
  cin_hr       int;
  cin_mn       int;
  dur          int;
  checkin_ts   timestamptz;
  checkout_ts  timestamptz;
BEGIN
  FOR n IN 11..230 LOOP
    i := n - 11;

    member_id := ('00000000-0004-0000-0000-' || lpad(n::text, 12, '0'))::uuid;

    -- Get card for this member (most recent active card)
    SELECT "AccessCardId" INTO card_id
    FROM "AccessCards"
    WHERE "MemberUserId" = member_id
      AND "Status" != 'Lost'
    ORDER BY "IssueDate" DESC
    LIMIT 1;

    IF card_id IS NULL THEN CONTINUE; END IF;

    -- Branch assignment by member range
    CASE
      WHEN i < 75  THEN branch_id := branch_ids[1];  -- Q1: members 011-085
      WHEN i < 135 THEN branch_id := branch_ids[2];  -- Q7: members 086-145
      WHEN i < 165 THEN branch_id := branch_ids[3];  -- TD: members 146-175
      WHEN i < 188 THEN branch_id := branch_ids[4];  -- BT: members 176-198
      WHEN i < 205 THEN branch_id := branch_ids[5];  -- BD: members 199-215
      ELSE              branch_id := branch_ids[6];  -- DN: members 216-230
    END CASE;

    -- Visit frequency based on package (Elite=5/week, Premium=3-4/week, Basic=2-3/week)
    visit_prob := CASE
      WHEN i % 20 >= 15 AND i % 20 <= 18 THEN 5  -- Elite: ~5 per 10 days
      WHEN i % 20 >= 9  AND i % 20 <= 14 THEN 4  -- Premium: ~4 per 10 days
      ELSE                                     3  -- Basic: ~3 per 10 days
    END;

    -- Days since member created (card issued)
    days_start := GREATEST(2, 350 - i);

    -- Generate attendances day by day (from card_issue_date to now)
    d := days_start;
    WHILE d > 0 LOOP
      -- Check if this day has a visit (based on probability)
      -- Use modulo to simulate visiting pattern
      IF (d * 13 + i * 7) % 10 < visit_prob THEN
        -- Check day of week (simulate weekday vs weekend)
        week_day := EXTRACT(DOW FROM (NOW() - (d || ' days')::interval))::int;
        -- Weekend reduces visits to 60%
        IF week_day IN (0, 6) AND (d + i) % 10 >= 6 THEN
          d := d - 1;
          CONTINUE;
        END IF;

        -- Pick time slot
        slot := ((d * 3 + i * 5) % 14) + 1;
        cin_hr := checkin_hours[slot];
        cin_mn := checkin_mins[slot];
        dur    := duration_mins[slot];

        checkin_ts  := (NOW() - (d || ' days')::interval)::date + make_interval(hours := cin_hr, mins := cin_mn);
        checkout_ts := checkin_ts + make_interval(mins := dur);

        INSERT INTO "Attendances"
            ("AttendanceId","MemberUserId","CardId","BranchId","CheckinAt","CheckoutAt")
        VALUES (
            gen_random_uuid(),
            member_id,
            card_id,
            branch_id,
            checkin_ts,
            checkout_ts
        );
      END IF;

      d := d - 1;
    END LOOP;

  END LOOP;
END $$;

-- =====================================================
-- TODAY'S CHECK-INS (09/06/2026 — Demo day)
-- =====================================================
DO $$
DECLARE
  demo_members uuid[] := ARRAY[
    '00000000-0004-0000-0000-000000000001'::uuid,
    '00000000-0004-0000-0000-000000000003'::uuid,
    '00000000-0004-0000-0000-000000000006'::uuid,
    '00000000-0004-0000-0000-000000000021'::uuid,
    '00000000-0004-0000-0000-000000000022'::uuid,
    '00000000-0004-0000-0000-000000000035'::uuid,
    '00000000-0004-0000-0000-000000000050'::uuid,
    '00000000-0004-0000-0000-000000000078'::uuid
  ];
  branch_for_demo uuid[] := ARRAY[
    'aaaaaaaa-0001-0000-0000-000000000001'::uuid,
    'aaaaaaaa-0001-0000-0000-000000000001'::uuid,
    'aaaaaaaa-0001-0000-0000-000000000002'::uuid,
    'aaaaaaaa-0001-0000-0000-000000000002'::uuid,
    'aaaaaaaa-0001-0000-0000-000000000004'::uuid,
    'aaaaaaaa-0001-0000-0000-000000000004'::uuid,
    'aaaaaaaa-0001-0000-0000-000000000001'::uuid,
    'aaaaaaaa-0001-0000-0000-000000000002'::uuid
  ];
  checkin_offsets text[] := ARRAY['06:05','06:30','07:15','07:45','08:00','09:30','17:00','17:30'];
  card_id uuid;
  k       int;
BEGIN
  FOR k IN 1..array_length(demo_members, 1) LOOP
    SELECT "AccessCardId" INTO card_id
    FROM "AccessCards"
    WHERE "MemberUserId" = demo_members[k]
      AND "Status" = 'Active'
    ORDER BY "IssueDate" DESC LIMIT 1;

    IF card_id IS NOT NULL THEN
      INSERT INTO "Attendances"
          ("AttendanceId","MemberUserId","CardId","BranchId","CheckinAt","CheckoutAt")
      VALUES (
          gen_random_uuid(),
          demo_members[k],
          card_id,
          branch_for_demo[k],
          CURRENT_DATE + checkin_offsets[k]::time,
          CASE WHEN k <= 6
               THEN CURRENT_DATE + checkin_offsets[k]::time + interval '90 minutes'
               ELSE null  -- still checked in
          END
      );
    END IF;
  END LOOP;
END $$;
