-- =====================================================
-- 16_PAYROLLS.SQL
-- Seed PayrollFormulas + PayrollRecords (6 tháng) + Commissions
-- Period: T11/2025 → T4/2026 (đã Paid) + T5/2026 (Approved) + T6/2026 (Draft)
-- =====================================================

-- =====================================================
-- PAYROLL FORMULAS
-- =====================================================
INSERT INTO "PayrollFormulas"
    ("FormulaId","Name","DefaultBaseSalary","CommissionPerSession",
     "KpiSessionThreshold","KpiBonus","IsActive",
     "CreatedByUserId","CreatedAt","UpdatedAt")
VALUES
(
    '11111111-0001-0000-0000-000000000001',
    'Công Thức Lương H2/2025',
    8000000, 150000, 20, 2000000, false,
    '00000000-0002-0000-0000-000000000001',
    NOW() - interval '210 days', NOW() - interval '90 days'
),
(
    '11111111-0001-0000-0000-000000000002',
    'Công Thức Lương Q1/2026',
    8500000, 160000, 18, 2000000, false,
    '00000000-0002-0000-0000-000000000001',
    NOW() - interval '90 days', NOW() - interval '30 days'
),
(
    '11111111-0001-0000-0000-000000000003',
    'Công Thức Lương Q2/2026 (Active)',
    9000000, 170000, 18, 2500000, true,
    '00000000-0002-0000-0000-000000000001',
    NOW() - interval '30 days', null
);

-- =====================================================
-- COMMISSIONS — 7 hợp đồng cũ đã approved
-- =====================================================
INSERT INTO "Commissions"
    ("CommissionId","StaffId","ContractId","InvoiceId",
     "Percent","Amount","Status","CreatedAt")
VALUES
(gen_random_uuid(),'00000000-0003-0000-0000-000000000006','ffffffff-0001-0000-0000-000000000001','aaaaaaab-0001-0000-0000-000000000001',8.00,100728,'Approved',NOW()-interval '28 days'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000006','ffffffff-0001-0000-0000-000000000002','aaaaaaab-0001-0000-0000-000000000002',8.00,71920,'Approved',NOW()-interval '14 days'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000006','ffffffff-0001-0000-0000-000000000003','aaaaaaab-0001-0000-0000-000000000003',8.00,639920,'Approved',NOW()-interval '58 days'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000006','ffffffff-0001-0000-0000-000000000004','aaaaaaab-0001-0000-0000-000000000004',8.00,39920,'Approved',NOW()-interval '9 days'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000006','ffffffff-0001-0000-0000-000000000010','aaaaaaab-0001-0000-0000-000000000010',8.00,111920,'Approved',NOW()-interval '29 days'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000007','ffffffff-0001-0000-0000-000000000005','aaaaaaab-0001-0000-0000-000000000005',8.00,179928,'Approved',NOW()-interval '18 days'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000007','ffffffff-0001-0000-0000-000000000006','aaaaaaab-0001-0000-0000-000000000006',8.00,1079928,'Approved',NOW()-interval '43 days');

-- =====================================================
-- COMMISSIONS BULK — Sales staff từ bulk invoices
-- =====================================================
DO $$
DECLARE
  sales_staff uuid[] := ARRAY[
    '00000000-0003-0000-0000-000000000006'::uuid,
    '00000000-0003-0000-0000-000000000007'::uuid,
    '00000000-0003-0000-0000-000000000012'::uuid,
    '00000000-0003-0000-0000-000000000013'::uuid,
    '00000000-0003-0000-0000-000000000019'::uuid,
    '00000000-0003-0000-0000-000000000020'::uuid,
    '00000000-0003-0000-0000-000000000024'::uuid,
    '00000000-0003-0000-0000-000000000025'::uuid,
    '00000000-0003-0000-0000-000000000029'::uuid,
    '00000000-0003-0000-0000-000000000030'::uuid,
    '00000000-0003-0000-0000-000000000034'::uuid,
    '00000000-0003-0000-0000-000000000035'::uuid
  ];
  inv    record;
  n      int := 0;
  sid    uuid;
BEGIN
  FOR inv IN
    SELECT "InvoiceId", "ContractId", "TotalAmount", "CreatedByStaffId", "UpdatedAt"
    FROM "Invoices"
    WHERE "Status" = 'Paid'
      AND "TotalAmount" > 0
      AND "InvoiceId" NOT IN (
        'aaaaaaab-0001-0000-0000-000000000001'::uuid,
        'aaaaaaab-0001-0000-0000-000000000002'::uuid,
        'aaaaaaab-0001-0000-0000-000000000003'::uuid,
        'aaaaaaab-0001-0000-0000-000000000004'::uuid,
        'aaaaaaab-0001-0000-0000-000000000005'::uuid,
        'aaaaaaab-0001-0000-0000-000000000006'::uuid,
        'aaaaaaab-0001-0000-0000-000000000007'::uuid,
        'aaaaaaab-0001-0000-0000-000000000008'::uuid,
        'aaaaaaab-0001-0000-0000-000000000009'::uuid,
        'aaaaaaab-0001-0000-0000-000000000010'::uuid,
        'aaaaaaab-0001-0000-0000-000000000011'::uuid
      )
    ORDER BY "UpdatedAt"
  LOOP
    n := n + 1;
    sid := COALESCE(inv."CreatedByStaffId", sales_staff[(n % 12) + 1]);

    INSERT INTO "Commissions"
        ("CommissionId","StaffId","ContractId","InvoiceId",
         "Percent","Amount","Status","CreatedAt")
    VALUES (
        gen_random_uuid(),
        sid, inv."ContractId",
        inv."InvoiceId",
        8.00,
        ROUND(inv."TotalAmount" * 0.08),
        'Approved',
        COALESCE(inv."UpdatedAt", NOW())
    );
  END LOOP;
END $$;

-- =====================================================
-- PAYROLL RECORDS — DO block 8 tháng × 36 staff
-- T11/2025 (Paid) T12/2025 (Paid) T1/2026 (Paid) T2/2026 (Paid) T3/2026 (Paid) T4/2026 (Paid) T5/2026 (Approved) T6/2026 partial (Draft)
-- =====================================================
DO $$
DECLARE
  -- Staff configuration: (StaffId, Position, BaseSalary, BranchAdmin indicator)
  staff_config record;

  -- Month config: (month, year, formula_idx, calc_days, days_ago_end)
  -- Month and Year will be dynamically calculated relative to NOW() in the execution loop
  months_cfg int[][] := ARRAY[
    [0, 0, 1, 210, 181],
    [0, 0, 1, 180, 151],
    [0, 0, 2, 150, 121],
    [0, 0, 2, 120, 91],
    [0, 0, 2, 90, 61],
    [0, 0, 2, 60, 31],
    [0, 0, 3, 30, 9],
    [0, 0, 3, 8, 1]
  ];

  formula_ids uuid[] := ARRAY[
    '11111111-0001-0000-0000-000000000001'::uuid,
    '11111111-0001-0000-0000-000000000002'::uuid,
    '11111111-0001-0000-0000-000000000003'::uuid
  ];

  m_idx         int;
  period_month  int;
  period_year   int;
  formula_idx   int;
  formula_id    uuid;
  p_status      text;
  calc_days     int;

  staff_ids     uuid[] := ARRAY[
    '00000000-0003-0000-0000-000000000001'::uuid,
    '00000000-0003-0000-0000-000000000002'::uuid,
    '00000000-0003-0000-0000-000000000003'::uuid,
    '00000000-0003-0000-0000-000000000004'::uuid,
    '00000000-0003-0000-0000-000000000005'::uuid,
    '00000000-0003-0000-0000-000000000006'::uuid,
    '00000000-0003-0000-0000-000000000007'::uuid,
    '00000000-0003-0000-0000-000000000008'::uuid,
    '00000000-0003-0000-0000-000000000009'::uuid,
    '00000000-0003-0000-0000-000000000010'::uuid,
    '00000000-0003-0000-0000-000000000011'::uuid,
    '00000000-0003-0000-0000-000000000012'::uuid,
    '00000000-0003-0000-0000-000000000013'::uuid,
    '00000000-0003-0000-0000-000000000014'::uuid,
    '00000000-0003-0000-0000-000000000015'::uuid,
    '00000000-0003-0000-0000-000000000016'::uuid,
    '00000000-0003-0000-0000-000000000017'::uuid,
    '00000000-0003-0000-0000-000000000018'::uuid,
    '00000000-0003-0000-0000-000000000019'::uuid,
    '00000000-0003-0000-0000-000000000020'::uuid,
    '00000000-0003-0000-0000-000000000021'::uuid,
    '00000000-0003-0000-0000-000000000022'::uuid,
    '00000000-0003-0000-0000-000000000023'::uuid,
    '00000000-0003-0000-0000-000000000024'::uuid,
    '00000000-0003-0000-0000-000000000025'::uuid,
    '00000000-0003-0000-0000-000000000026'::uuid,
    '00000000-0003-0000-0000-000000000027'::uuid,
    '00000000-0003-0000-0000-000000000028'::uuid,
    '00000000-0003-0000-0000-000000000029'::uuid,
    '00000000-0003-0000-0000-000000000030'::uuid,
    '00000000-0003-0000-0000-000000000031'::uuid,
    '00000000-0003-0000-0000-000000000032'::uuid,
    '00000000-0003-0000-0000-000000000033'::uuid,
    '00000000-0003-0000-0000-000000000034'::uuid,
    '00000000-0003-0000-0000-000000000035'::uuid,
    '00000000-0003-0000-0000-000000000036'::uuid
  ];

  -- Position config per staff index (0-based)
  positions     text[] := ARRAY[
    'BranchAdmin','BranchAdmin','PT','PT','HeadPT','Sales','Sales','Receptionist',
    'HeadPT','PT','PT','Sales','Sales','Receptionist','Receptionist',
    'BranchAdmin','HeadPT','PT','Sales','Sales','Receptionist',
    'BranchAdmin','PT','Sales','Sales','Receptionist',
    'BranchAdmin','PT','Sales','Sales','Receptionist',
    'BranchAdmin','PT','Sales','Sales','Receptionist'
  ];

  -- Base salaries per position
  base_salaries numeric[] := ARRAY[
    15000000,15000000,8000000,8000000,12000000,7000000,7000000,6000000,
    12000000,8000000,8000000,7000000,7000000,6000000,6000000,
    14000000,11000000,8000000,7000000,7000000,6000000,
    13000000,8000000,7000000,7000000,6000000,
    13000000,8000000,7000000,7000000,6000000,
    13000000,8000000,7000000,7000000,6000000
  ];

  s_idx         int;
  sid           uuid;
  position      text;
  base_sal      numeric;
  sess_count    int;
  sess_comm     numeric;
  kpi_bonus     numeric;
  sales_comm    numeric;
  total_sal     numeric;
  comm_rate     numeric := 160000;
  kpi_thresh    int := 18;
  kpi_b         numeric := 2000000;
  approved_at   timestamptz;
  calc_at       timestamptz;

BEGIN
  FOR m_idx IN 1..8 LOOP
    period_month := EXTRACT(MONTH FROM (NOW() - ((8 - m_idx) || ' month')::interval));
    period_year  := EXTRACT(YEAR FROM (NOW() - ((8 - m_idx) || ' month')::interval));
    formula_idx  := months_cfg[m_idx][3];
    formula_id   := formula_ids[formula_idx];
    calc_days    := months_cfg[m_idx][4] - 5;  -- calculated ~5 days after period end

    -- Status based on month
    IF m_idx <= 6 THEN
      p_status := 'Paid';
    ELSIF m_idx = 7 THEN
      p_status := 'Approved';
    ELSE
      p_status := 'Draft';
    END IF;

    calc_at     := NOW() - (calc_days || ' days')::interval;
    approved_at := CASE WHEN p_status IN ('Approved','Paid')
                        THEN calc_at + interval '3 days'
                        ELSE null END;

    -- Only include staff that existed at that point
    -- TD/BT/BD/DN branches joined around months_cfg[6-8]
    FOR s_idx IN 1..36 LOOP
      sid      := staff_ids[s_idx];
      position := positions[s_idx];
      base_sal := base_salaries[s_idx];

      -- Skip new branches (TD/BT/BD/DN) for early months
      -- TD (s_idx 16-21) joined ~245 days ago
      -- BT (s_idx 22-26) joined ~120 days ago
      -- BD (s_idx 27-31) joined ~118 days ago
      -- DN (s_idx 32-36) joined ~38 days ago
      IF s_idx >= 16 AND s_idx <= 21 AND calc_days > 245 THEN CONTINUE; END IF;
      IF s_idx >= 22 AND s_idx <= 26 AND calc_days > 120 THEN CONTINUE; END IF;
      IF s_idx >= 27 AND s_idx <= 31 AND calc_days > 118 THEN CONTINUE; END IF;
      IF s_idx >= 32 AND s_idx <= 36 AND calc_days > 38  THEN CONTINUE; END IF;

      -- Session count for PT/HeadPT
      sess_count := 0;
      sess_comm  := 0;
      kpi_bonus  := 0;
      sales_comm := 0;

      -- Fetch formula values dynamically for this period
      SELECT "CommissionPerSession", "KpiSessionThreshold", "KpiBonus"
      INTO comm_rate, kpi_thresh, kpi_b
      FROM "PayrollFormulas"
      WHERE "FormulaId" = formula_id;

      IF position IN ('PT', 'HeadPT') THEN
        -- Query actual completed sessions from Classes table where there is at least one Attended booking in that month/year
        SELECT COUNT(*)
        INTO sess_count
        FROM "Classes" c
        WHERE c."TrainerStaffId" = sid
          AND c."Status" = 'Completed'
          AND EXISTS (
            SELECT 1 FROM "ClassBookings" cb 
            WHERE cb."ClassId" = c."ClassId" 
              AND cb."Status" = 'Attended'
          )
          AND EXTRACT(MONTH FROM c."Date") = period_month
          AND EXTRACT(YEAR FROM c."Date") = period_year;

        sess_comm  := sess_count * comm_rate;
        kpi_bonus  := CASE WHEN sess_count >= kpi_thresh THEN kpi_b ELSE 0 END;
      ELSIF position = 'Sales' THEN
        -- Query actual approved commission sum from Commissions table for this sales staff in this period
        SELECT COALESCE(SUM("Amount"), 0)
        INTO sales_comm
        FROM "Commissions"
        WHERE "StaffId" = sid
          AND "Status" = 'Approved'
          AND EXTRACT(MONTH FROM "CreatedAt") = period_month
          AND EXTRACT(YEAR FROM "CreatedAt") = period_year;
      END IF;

      total_sal := base_sal + sess_comm + kpi_bonus + sales_comm;

      INSERT INTO "PayrollRecords"
          ("PayrollId","StaffId","FormulaId","PeriodMonth","PeriodYear",
           "BaseSalary","SessionCount","SessionCommission","KpiBonus","SalesCommission",
           "TotalSalary","Status","Note",
           "CalculatedAt","ApprovedAt","ApprovedByUserId")
      VALUES (
          gen_random_uuid(),
          sid, formula_id,
          period_month, period_year,
          base_sal,
          sess_count, sess_comm, kpi_bonus, sales_comm,
          total_sal,
          p_status,
          CASE p_status
            WHEN 'Draft'    THEN 'Đang tính toán cho tháng ' || period_month || '/' || period_year
            WHEN 'Approved' THEN 'Đã duyệt, chờ giải ngân'
            WHEN 'Paid'     THEN 'Đã thanh toán qua chuyển khoản'
            ELSE null
          END,
          calc_at,
          approved_at,
          CASE WHEN p_status IN ('Approved','Paid')
               THEN '00000000-0002-0000-0000-000000000001'::uuid
               ELSE null END
      );
    END LOOP;
  END LOOP;
END $$;
