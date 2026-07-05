-- =====================================================
-- 09_INVOICES.SQL
-- Seed hóa đơn — 570 invoices, 12 tháng dữ liệu
-- CRITICAL: Invoice.UpdatedAt = ngày payment processed
--           Revenue report lọc theo: Status='Paid' AND UpdatedAt in month
-- =====================================================

-- =====================================================
-- INVOICES 001-011 (giữ nguyên — payments reference chúng)
-- =====================================================
INSERT INTO "Invoices"
    ("InvoiceId","ContractId","MemberId","InvoiceCode",
     "Subtotal","DiscountAmount","TaxAmount","TotalAmount",
     "Status","CreatedByStaffId","CreatedAt","UpdatedAt")
VALUES
('aaaaaaab-0001-0000-0000-000000000001','ffffffff-0001-0000-0000-000000000001','00000000-0004-0000-0000-000000000001','INV-2025-001',1399000,139900,0,1259100,'Paid','00000000-0003-0000-0000-000000000006',NOW()-interval '30 days',NOW()-interval '28 days'),
('aaaaaaab-0001-0000-0000-000000000002','ffffffff-0001-0000-0000-000000000002','00000000-0004-0000-0000-000000000002','INV-2025-002',899000,0,0,899000,'Paid','00000000-0003-0000-0000-000000000006',NOW()-interval '15 days',NOW()-interval '14 days'),
('aaaaaaab-0001-0000-0000-000000000003','ffffffff-0001-0000-0000-000000000003','00000000-0004-0000-0000-000000000003','INV-2025-003',7999000,0,0,7999000,'Paid','00000000-0003-0000-0000-000000000006',NOW()-interval '60 days',NOW()-interval '58 days'),
('aaaaaaab-0001-0000-0000-000000000004','ffffffff-0001-0000-0000-000000000004','00000000-0004-0000-0000-000000000004','INV-2025-004',499000,0,0,499000,'Paid','00000000-0003-0000-0000-000000000006',NOW()-interval '10 days',NOW()-interval '9 days'),
('aaaaaaab-0001-0000-0000-000000000005','ffffffff-0001-0000-0000-000000000005','00000000-0004-0000-0000-000000000005','INV-2025-005',2499000,249900,0,2249100,'Paid','00000000-0003-0000-0000-000000000007',NOW()-interval '20 days',NOW()-interval '18 days'),
('aaaaaaab-0001-0000-0000-000000000006','ffffffff-0001-0000-0000-000000000006','00000000-0004-0000-0000-000000000006','INV-2025-006',14999000,1499900,0,13499100,'Paid','00000000-0003-0000-0000-000000000007',NOW()-interval '45 days',NOW()-interval '43 days'),
('aaaaaaab-0001-0000-0000-000000000007','ffffffff-0001-0000-0000-000000000007','00000000-0004-0000-0000-000000000007','INV-2025-007',0,0,0,0,'Paid','00000000-0003-0000-0000-000000000006',NOW()-interval '3 days',NOW()-interval '3 days'),
('aaaaaaab-0001-0000-0000-000000000008','ffffffff-0001-0000-0000-000000000008','00000000-0004-0000-0000-000000000008','INV-2025-008',499000,0,0,499000,'Pending','00000000-0003-0000-0000-000000000006',NOW(),null),
('aaaaaaab-0001-0000-0000-000000000009','ffffffff-0001-0000-0000-000000000009','00000000-0004-0000-0000-000000000009','INV-2025-009',2599000,0,0,2599000,'Paid','00000000-0003-0000-0000-000000000006',NOW()-interval '400 days',NOW()-interval '398 days'),
('aaaaaaab-0001-0000-0000-000000000010','ffffffff-0001-0000-0000-000000000010','00000000-0004-0000-0000-000000000009','INV-2025-010',1399000,0,0,1399000,'Paid','00000000-0003-0000-0000-000000000006',NOW()-interval '30 days',NOW()-interval '29 days'),
('aaaaaaab-0001-0000-0000-000000000011','ffffffff-0001-0000-0000-000000000011','00000000-0004-0000-0000-000000000010','INV-2025-011',499000,0,0,499000,'Cancelled','00000000-0003-0000-0000-000000000006',NOW()-interval '5 days',NOW()-interval '1 day');

-- =====================================================
-- INVOICES BULK — Revenue targets per month:
-- T6/2025 ~32.5M  T7/2025 ~48M   T8/2025 ~65M   T9/2025 ~68M
-- T10/2025 ~73M   T11/2025 ~78.5M T12/2025 ~84M  T1/2026 ~94M
-- T2/2026 ~81M    T3/2026 ~73M    T4/2026 ~65M   T5/2026 ~57M
-- T6/2026 >=24M (MTD, UpdatedAt 01-08/06/2026)
--
-- Strategy:
--   - Generate 559 additional invoices for contracts of members 011-230
--   - UpdatedAt (payment date) distributed across 13 months
--   - Most invoices are Paid; ~10% Pending/Overdue/Cancelled
--   - CreatedByStaffId = Sales/Receptionist of correct branch
-- =====================================================
DO $$
DECLARE
  -- Month config: (days_ago_start, days_ago_end, target_revenue, count)
  -- Each row: months listed with midpoint days ago + revenue target
  months       record;
  month_data   int[][] := ARRAY[
  --  [paid_count, days_min, days_max, revenue_avg_per_invoice(in 1000s)]
    [20, 335, 365, 1750],   -- T6/2025: 20 invoices ~35M
    [30, 303, 334, 1700],   -- T7/2025: 30 invoices ~51M
    [40, 272, 302, 1700],   -- T8/2025: 40 invoices ~68M
    [42, 242, 271, 1680],   -- T9/2025
    [45, 212, 241, 1700],   -- T10/2025
    [48, 181, 211, 1700],   -- T11/2025
    [52, 151, 180, 1680],   -- T12/2025
    [58, 121, 150, 1690],   -- T1/2026
    [50, 91, 120, 1700],    -- T2/2026
    [45, 61, 90, 1700],     -- T3/2026
    [40, 31, 60, 1700],     -- T4/2026
    [35, 9, 30, 1700],      -- T5/2026
    [15, 2, 8, 1700],       -- T6/2026 MTD
    [5, 0, 1, 1800]         -- T7/2026 (Today/Yesterday)
  ];

  -- Sales staff rotating per month
  sales_roster uuid[] := ARRAY[
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

  member_ids   uuid[] := ARRAY(
    SELECT ('00000000-0004-0000-0000-' || lpad(n::text, 12, '0'))::uuid
    FROM generate_series(11, 230) n
  );

  global_n     int := 12;  -- start after existing 011
  m_idx        int;
  inv_n        int;
  inv_count    int;
  days_min     int;
  days_max     int;
  rev_avg      numeric;
  inv_status   text;
  member_id    uuid;
  staff_id     uuid;
  amount       numeric;
  subtotal     numeric;
  discount     numeric;
  updated_at   timestamptz;
  created_at_v timestamptz;
  pay_days     int;
  contract_id  uuid;

  -- Contract generation variables
  pkg_id       uuid;
  duration_m   int;
  priv_total   int;
  priv_used    int;
  grp_total    int;
  grp_used     int;
  start_dt     date;
  end_dt       date;
  c_status     text;

  -- Amounts cycling (to hit revenue targets)
  amounts_basic   numeric[] := ARRAY[499000,1399000,2599000,4799000];
  amounts_premium numeric[] := ARRAY[899000,2499000,4699000,8699000];
  amounts_elite   numeric[] := ARRAY[1499000,3999000,7499000,13999000];

BEGIN
  FOR m_idx IN 1..13 LOOP
    inv_count := month_data[m_idx][1];
    days_min  := month_data[m_idx][2];
    days_max  := month_data[m_idx][3];

    FOR inv_n IN 1..inv_count LOOP
      -- Member cycling through 011-230
      member_id := member_ids[((global_n - 12) % 220) + 1];

      -- Staff cycling
      staff_id := sales_roster[((global_n - 1) % 12) + 1];

      -- Determine package and base price
      CASE (global_n % 20)
        WHEN 0,1,2,3,4,5,6,7 THEN
          pkg_id := 'cccccccc-0001-0000-0000-000000000001'::uuid; -- basic
          amount := amounts_basic[((global_n % 4) + 1)];
        WHEN 8,9,10,11,12,13 THEN
          pkg_id := 'cccccccc-0001-0000-0000-000000000002'::uuid; -- premium
          amount := amounts_premium[((global_n % 4) + 1)];
        ELSE
          pkg_id := 'cccccccc-0001-0000-0000-000000000003'::uuid; -- elite
          amount := amounts_elite[((global_n % 4) + 1)];
      END CASE;

      -- Determine duration based on amount index
      CASE (global_n % 4)
        WHEN 0 THEN duration_m := 1;
        WHEN 1 THEN duration_m := 3;
        WHEN 2 THEN duration_m := 6;
        ELSE        duration_m := 12;
      END CASE;

      -- Session setup for PT and Group classes
      IF pkg_id = 'cccccccc-0001-0000-0000-000000000002'::uuid THEN     -- premium
        priv_total := duration_m * 4; grp_total := duration_m * 4;
      ELSIF pkg_id = 'cccccccc-0001-0000-0000-000000000003'::uuid THEN  -- elite
        priv_total := duration_m * 12; grp_total := duration_m * 12;
      ELSE                                                              -- basic
        priv_total := 0; grp_total := 0;
      END IF;

      priv_used := CASE WHEN priv_total > 0 THEN FLOOR(priv_total * 0.5 * random()) ELSE 0 END;
      grp_used  := CASE WHEN grp_total > 0 THEN FLOOR(grp_total * 0.6 * random()) ELSE 0 END;

      -- Small discount for some
      discount := CASE WHEN global_n % 10 = 0 THEN ROUND(amount * 0.1) ELSE 0 END;
      subtotal  := amount;
      amount    := amount - discount;

      -- Payment date within month range
      pay_days   := days_min + ((global_n * 7) % (days_max - days_min + 1));
      updated_at := NOW() - (pay_days || ' days')::interval;
      created_at_v := updated_at - interval '1 day';

      -- Status: mostly Paid, some exceptions
      CASE (global_n % 15)
        WHEN 0    THEN inv_status := 'Pending';
        WHEN 1    THEN inv_status := 'Overdue';
        WHEN 14   THEN inv_status := 'Cancelled';
        ELSE           inv_status := 'Paid';
      END CASE;

      -- Pending/Cancelled don't have UpdatedAt as payment date
      IF inv_status IN ('Pending') THEN
        updated_at := null;
      ELSIF inv_status = 'Cancelled' THEN
        updated_at := created_at_v + interval '2 days';
      END IF;

      -- Contract status and dates
      start_dt := created_at_v::date;
      end_dt   := (start_dt + (duration_m || ' months')::interval)::date;

      IF inv_status = 'Cancelled' THEN
        c_status := 'Cancelled';
      ELSIF inv_status IN ('Pending', 'Overdue') THEN
        c_status := 'Pending';
      ELSIF end_dt < CURRENT_DATE THEN
        c_status := 'Expired';
      ELSE
        c_status := 'Active';
      END IF;

      -- Generate Contract first to respect 1-to-1 relationship
      contract_id := gen_random_uuid();
      INSERT INTO "Contracts"
          ("ContractId","MemberUserId","PackageId","StaffId",
           "OriginalPrice","DiscountAmount","DealPrice","Note",
           "Status","StartDate","EndDate",
           "TotalPrivateSessions","UsedPrivateSessions",
           "TotalGroupSessions","UsedGroupSessions",
           "CreatedAt","UpdatedAt")
      VALUES (
          contract_id,
          member_id,
          pkg_id,
          staff_id,
          subtotal, discount, amount,
          null,
          c_status,
          start_dt,
          end_dt,
          priv_total, priv_used,
          grp_total, grp_used,
          created_at_v,
          updated_at
      );

      INSERT INTO "Invoices"
          ("InvoiceId","ContractId","MemberId","InvoiceCode",
           "Subtotal","DiscountAmount","TaxAmount","TotalAmount",
           "Status","CreatedByStaffId","CreatedAt","UpdatedAt")
      VALUES (
          gen_random_uuid(),
          contract_id,
          member_id,
          'INV-' || to_char(created_at_v, 'YYYY') || '-' || lpad(global_n::text, 5, '0'),
          subtotal, discount, 0, amount,
          inv_status,
          staff_id,
          created_at_v,
          updated_at
      );

      global_n := global_n + 1;
    END LOOP;
  END LOOP;
END $$;

-- =====================================================
-- THÊM ContractId cho invoices quan trọng
-- (Link invoices to their contracts for proper reporting)
-- Note: Bulk invoices above use ContractId=null which is acceptable
-- because Revenue report uses CreatedByStaffId.Branch for revenue_by_branch
-- =====================================================
UPDATE "Invoices" SET "ContractId" = 'ffffffff-0001-0000-0000-000000000001' WHERE "InvoiceCode" = 'INV-2025-001';
UPDATE "Invoices" SET "ContractId" = 'ffffffff-0001-0000-0000-000000000002' WHERE "InvoiceCode" = 'INV-2025-002';
UPDATE "Invoices" SET "ContractId" = 'ffffffff-0001-0000-0000-000000000003' WHERE "InvoiceCode" = 'INV-2025-003';
UPDATE "Invoices" SET "ContractId" = 'ffffffff-0001-0000-0000-000000000004' WHERE "InvoiceCode" = 'INV-2025-004';
UPDATE "Invoices" SET "ContractId" = 'ffffffff-0001-0000-0000-000000000005' WHERE "InvoiceCode" = 'INV-2025-005';
UPDATE "Invoices" SET "ContractId" = 'ffffffff-0001-0000-0000-000000000006' WHERE "InvoiceCode" = 'INV-2025-006';
UPDATE "Invoices" SET "ContractId" = 'ffffffff-0001-0000-0000-000000000009' WHERE "InvoiceCode" = 'INV-2025-009';
UPDATE "Invoices" SET "ContractId" = 'ffffffff-0001-0000-0000-000000000010' WHERE "InvoiceCode" = 'INV-2025-010';
