-- =====================================================
-- 07_LEADS.SQL
-- Seed nguồn lead và 450 khách hàng tiềm năng
-- Timeline: T6/2025 → T6/2026
-- =====================================================

-- =====================================================
-- LEAD SOURCES (giữ nguyên)
-- =====================================================
INSERT INTO "LeadSources" ("Id","Name","Score","IsActive")
VALUES
    ('dddddddd-0001-0000-0000-000000000001', 'Facebook', 20, true),
    ('dddddddd-0001-0000-0000-000000000002', 'Giới thiệu từ bạn bè', 35, true),
    ('dddddddd-0001-0000-0000-000000000003', 'Khách ghé trực tiếp (Walk-in)', 30, true),
    ('dddddddd-0001-0000-0000-000000000004', 'Google Ads', 25, true),
    ('dddddddd-0001-0000-0000-000000000005', 'Instagram', 18, true),
    ('dddddddd-0001-0000-0000-000000000006', 'Tiktok', 15, true),
    ('dddddddd-0001-0000-0000-000000000007', 'Sự kiện offline', 28, true),
    ('dddddddd-0001-0000-0000-000000000008', 'Zalo OA', 22, true);

-- =====================================================
-- LEADS — 450 leads via DO block
-- Strategy:
--   - 450 leads phân bổ theo 13 tháng (T6/2025 → T6/2026)
--   - 6 branches, 8 sources
--   - Status distribution: New(16%) Contacted(22%) Qualified(18%) Converted(32%) Lost(12%)
--   - Converted leads → ConvertedMemberUserId trỏ đến members 011-144
--   - Sales staff assigned: Q1 → 006/012, Q7 → 007/013, TD → 019/020, BT → 024/025, BD → 029/030, DN → 034/035
-- =====================================================
DO $$
DECLARE
  -- Name pools
  first_names_m text[] := ARRAY['Bảo','Cường','Dũng','Hải','Hùng','Khoa','Long','Nam','Phong','Quân','Sơn','Tài','Trung','Tuấn','Vinh','Mạnh','Khánh','Thắng','Thịnh','Nhân'];
  first_names_f text[] := ARRAY['Ánh','Bích','Châu','Dung','Giang','Hoa','Hương','Khanh','Lan','Linh','Mai','Ngân','Oanh','Phương','Quyên','Sen','Thu','Uyên','Vân','Xuân'];
  last_names    text[] := ARRAY['Nguyễn','Trần','Lê','Phạm','Hoàng','Huỳnh','Vũ','Võ','Đặng','Bùi','Đỗ','Hồ','Ngô','Dương','Lý','Đinh','Tô','Trịnh','Cao','Lâm'];

  -- Branch & Staff config
  branch_ids    uuid[] := ARRAY[
    'aaaaaaaa-0001-0000-0000-000000000001'::uuid,  -- Q1
    'aaaaaaaa-0001-0000-0000-000000000002'::uuid,  -- Q7
    'aaaaaaaa-0001-0000-0000-000000000004'::uuid,  -- TD
    'aaaaaaaa-0001-0000-0000-000000000003'::uuid,  -- BT
    'aaaaaaaa-0001-0000-0000-000000000005'::uuid,  -- BD
    'aaaaaaaa-0001-0000-0000-000000000006'::uuid   -- DN
  ];
  branch_weights int[] := ARRAY[150, 120, 80, 50, 30, 20]; -- target count per branch

  -- Sales staff IDs per branch (primary, secondary)
  sales_staff   uuid[][] := ARRAY[
    ARRAY['00000000-0003-0000-0000-000000000006'::uuid, '00000000-0003-0000-0000-000000000012'::uuid],
    ARRAY['00000000-0003-0000-0000-000000000007'::uuid, '00000000-0003-0000-0000-000000000013'::uuid],
    ARRAY['00000000-0003-0000-0000-000000000019'::uuid, '00000000-0003-0000-0000-000000000020'::uuid],
    ARRAY['00000000-0003-0000-0000-000000000024'::uuid, '00000000-0003-0000-0000-000000000025'::uuid],
    ARRAY['00000000-0003-0000-0000-000000000029'::uuid, '00000000-0003-0000-0000-000000000030'::uuid],
    ARRAY['00000000-0003-0000-0000-000000000034'::uuid, '00000000-0003-0000-0000-000000000035'::uuid]
  ];

  -- Status config: New(16%) Contacted(22%) Qualified(18%) Converted(32%) Lost(12%)
  statuses      text[] := ARRAY['New','New','New','New',
                                 'Contacted','Contacted','Contacted','Contacted','Contacted','Contacted',
                                 'Qualified','Qualified','Qualified','Qualified','Qualified',
                                 'Converted','Converted','Converted','Converted','Converted','Converted','Converted','Converted','Converted',
                                 'Lost','Lost','Lost'];
  -- Source IDs cycle
  source_ids    uuid[] := ARRAY[
    'dddddddd-0001-0000-0000-000000000001'::uuid,
    'dddddddd-0001-0000-0000-000000000003'::uuid,
    'dddddddd-0001-0000-0000-000000000002'::uuid,
    'dddddddd-0001-0000-0000-000000000004'::uuid,
    'dddddddd-0001-0000-0000-000000000005'::uuid,
    'dddddddd-0001-0000-0000-000000000008'::uuid,
    'dddddddd-0001-0000-0000-000000000006'::uuid,
    'dddddddd-0001-0000-0000-000000000007'::uuid
  ];

  -- Lost reasons
  lost_reasons  text[] := ARRAY[
    'Giá cao hơn đối thủ',
    'Địa điểm không thuận tiện',
    'Không có thời gian',
    'Đã đăng ký gym khác',
    'Giá cao hơn đối thủ',
    'Không có thời gian'
  ];

  -- Month offsets from NOW(): maps to T6/2025 to T6/2026
  -- T6/2025 = 365 days ago, T6/2026 = 0-8 days ago
  month_day_offsets int[] := ARRAY[
    365, 340, 320, 300,   -- T6, T7, T8, T9 /2025
    280, 260, 240, 215,   -- T10, T11, T12 /2025, T1/2026
    190, 165, 140, 110,   -- T2, T3, T4, T5 /2026
    5                     -- T6/2026 (current)
  ];
  month_counts int[] := ARRAY[25, 35, 40, 35, 45, 38, 42, 50, 45, 35, 30, 20, 10];

  n            int := 1;
  b_idx        int;
  lead_n       int;
  total_leads  int := 0;
  m_idx        int;  -- month index
  month_count  int;
  s_idx        int;  -- status index
  lead_status  text;
  fname_m      text;
  fname_f      text;
  lname        text;
  full_name    text;
  phone_num    text;
  lead_email   text;
  branch_id    uuid;
  assigned_id  uuid;
  created_by   uuid;
  source_id    uuid;
  conv_member  uuid;
  lead_id      uuid;
  days_ago     int;
  lost_r       text;
  note_txt     text;
  contacted_at timestamptz;
  score_val    int;
  conv_member_idx int := 11; -- start from member 011 for converted leads
BEGIN
  -- Loop through each month
  FOR m_idx IN 1..13 LOOP
    month_count := month_counts[m_idx];
    days_ago    := month_day_offsets[m_idx];

    FOR lead_n IN 1..month_count LOOP
      -- Determine branch (distribute across branches weighted)
      b_idx     := ((total_leads + lead_n - 1) % 6) + 1;
      IF b_idx > 6 THEN b_idx := 6; END IF;

      lead_status := statuses[((n - 1) % array_length(statuses, 1)) + 1];
      source_id   := source_ids[((n - 1) % 8) + 1];
      branch_id   := branch_ids[b_idx];
      assigned_id := sales_staff[b_idx][(((n-1) % 2)) + 1];
      created_by  := assigned_id;

      -- Name
      lname  := last_names[((n - 1) % 20) + 1];
      IF n % 2 = 0 THEN
        fname_f   := first_names_f[((n / 2 - 1) % 20) + 1];
        full_name := lname || ' Thị ' || fname_f;
      ELSE
        fname_m   := first_names_m[(((n - 1) / 2) % 20) + 1];
        full_name := lname || ' Văn ' || fname_m;
      END IF;

      phone_num  := '0933' || lpad(n::text, 6, '0');
      lead_email := lower(regexp_replace(full_name, '[^a-zA-Z0-9]', '', 'g')) || n::text || '@gmail.com';
      lead_id    := gen_random_uuid();
      score_val  := 15 + ((n * 7) % 30);

      -- ConvertedMemberUserId
      conv_member := null;
      IF lead_status = 'Converted' AND conv_member_idx <= 144 THEN
        conv_member := ('00000000-0004-0000-0000-' || lpad(conv_member_idx::text, 12, '0'))::uuid;
        conv_member_idx := conv_member_idx + 1;
      END IF;

      -- LostReason
      lost_r := null;
      IF lead_status = 'Lost' THEN
        lost_r := lost_reasons[((n - 1) % 6) + 1];
      END IF;

      -- Note
      note_txt := CASE lead_status
        WHEN 'New'       THEN 'Khách liên hệ qua ' || (SELECT "Name" FROM "LeadSources" WHERE "Id" = source_id) || ', quan tâm gói tập.'
        WHEN 'Contacted' THEN 'Đã tư vấn, khách đang cân nhắc giữa gói Basic và Premium.'
        WHEN 'Qualified'  THEN 'Khách đã đến xem phòng tập, rất quan tâm, cần thêm thời gian quyết định.'
        WHEN 'Converted' THEN 'Khách đã đăng ký thành công, hài lòng với tư vấn.'
        WHEN 'Lost'      THEN 'Khách không chuyển đổi: ' || COALESCE(lost_r, 'Lý do không rõ')
        ELSE 'Ghi chú từ sales.'
      END;

      -- LastContactedAt
      contacted_at := null;
      IF lead_status NOT IN ('New') THEN
        contacted_at := NOW() - ((days_ago - 2) || ' days')::interval;
      END IF;

      INSERT INTO "Leads"
          ("LeadId","Name","Phone","Email","SourceId","Status","Note",
           "LostReason","LastContactedAt","ContactCount","Score",
           "AssignedToStaffId","CreatedByUserId","BranchId","ConvertedMemberUserId",
           "CreatedAt","UpdatedAt")
      VALUES (
          lead_id,
          full_name,
          phone_num,
          'lead' || n::text || '@example.com',
          source_id,
          lead_status,
          note_txt,
          lost_r,
          contacted_at,
          CASE lead_status
            WHEN 'New' THEN 0
            WHEN 'Contacted' THEN 1 + ((n % 3))
            WHEN 'Qualified'  THEN 2 + ((n % 4))
            WHEN 'Converted' THEN 3 + ((n % 5))
            WHEN 'Lost'      THEN 1 + ((n % 3))
            ELSE 0
          END,
          score_val,
          assigned_id,
          created_by,
          branch_id,
          conv_member,
          NOW() - (days_ago || ' days')::interval - ((lead_n * 2) || ' hours')::interval,
          CASE WHEN lead_status IN ('Converted','Lost','Qualified','Contacted')
               THEN NOW() - ((days_ago - 3) || ' days')::interval
               ELSE null END
      );

      n := n + 1;
    END LOOP;

    total_leads := total_leads + month_count;
  END LOOP;
END $$;

-- =====================================================
-- LEADS HÔM NAY (09/06/2026) — Demo data
-- =====================================================
INSERT INTO "Leads"
    ("LeadId","Name","Phone","Email","SourceId","Status","Note",
     "LostReason","LastContactedAt","ContactCount","Score",
     "AssignedToStaffId","CreatedByUserId","BranchId","ConvertedMemberUserId",
     "CreatedAt","UpdatedAt")
VALUES
(
    gen_random_uuid(),
    'Phạm Thị Diễm', '0971234501', 'lead_demo1@example.com',
    'dddddddd-0001-0000-0000-000000000001', 'New',
    'Khách nhắn tin Facebook hỏi về gói Premium 3 tháng, sắp xếp được buổi chiều.',
    null, null, 0, 20,
    '00000000-0003-0000-0000-000000000006',
    '00000000-0003-0000-0000-000000000006',
    'aaaaaaaa-0001-0000-0000-000000000001', null,
    NOW() - interval '2 hours', null
),
(
    gen_random_uuid(),
    'Trần Hoàng Minh', '0971234502', 'lead_demo2@example.com',
    'dddddddd-0001-0000-0000-000000000003', 'Contacted',
    'Khách ghé trực tiếp buổi sáng, xem qua cơ sở vật chất, quan tâm gói Elite.',
    null, NOW() - interval '1 hour', 1, 38,
    '00000000-0003-0000-0000-000000000007',
    '00000000-0003-0000-0000-000000000007',
    'aaaaaaaa-0001-0000-0000-000000000002', null,
    NOW() - interval '3 hours', NOW() - interval '1 hour'
),
(
    gen_random_uuid(),
    'Lê Thị Bảo Châu', '0971234503', 'lead_demo3@example.com',
    'dddddddd-0001-0000-0000-000000000002', 'New',
    'Được bạn giới thiệu, quan tâm lớp Yoga sáng. Chưa liên lạc được.',
    null, null, 0, 35,
    '00000000-0003-0000-0000-000000000024',
    '00000000-0003-0000-0000-000000000024',
    'aaaaaaaa-0001-0000-0000-000000000003', null,
    NOW() - interval '4 hours', null
);
