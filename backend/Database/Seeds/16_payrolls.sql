-- =====================================================
-- 16_PAYROLLS.SQL
-- Seed PayrollFormulas + PayrollRecords + Commissions
-- =====================================================

-- =====================================================
-- PAYROLL FORMULAS
-- =====================================================
INSERT INTO "PayrollFormulas"
    ("FormulaId","Name","DefaultBaseSalary","CommissionPerSession",
     "KpiSessionThreshold","KpiBonus","IsActive",
     "CreatedByUserId","CreatedAt","UpdatedAt")
VALUES

-- Formula tháng 4/2025
(
    '11111111-0001-0000-0000-000000000001',
    'Công Thức Lương T4/2025',
    8000000,
    150000,
    20,
    2000000,
    false,
    '00000000-0002-0000-0000-000000000001',
    NOW() - interval '60 days',
    NOW() - interval '30 days'
),

-- Formula tháng 5/2025 (hiện tại - active)
(
    '11111111-0001-0000-0000-000000000002',
    'Công Thức Lương T5/2025',
    8000000,
    160000,
    18,
    2000000,
    true,
    '00000000-0002-0000-0000-000000000001',
    NOW() - interval '20 days',
    null
);

-- =====================================================
-- COMMISSIONS
-- Hoa hồng từ các hợp đồng đã thanh toán thành công
-- =====================================================
INSERT INTO "Commissions"
    ("CommissionId","StaffId","ContractId","InvoiceId",
     "Percent","Amount","Status","CreatedAt")
VALUES

-- Commission cho Sales Q1 (Hoàng Thị Ngọc) từ các hợp đồng Q1
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000006',
    'ffffffff-0001-0000-0000-000000000001',
    'aaaaaaab-0001-0000-0000-000000000001',
    8.00, 100728,
    'Approved',
    NOW() - interval '30 days'
),
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000006',
    'ffffffff-0001-0000-0000-000000000002',
    'aaaaaaab-0001-0000-0000-000000000002',
    8.00, 71920,
    'Approved',
    NOW() - interval '15 days'
),
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000006',
    'ffffffff-0001-0000-0000-000000000003',
    'aaaaaaab-0001-0000-0000-000000000003',
    8.00, 639920,
    'Approved',
    NOW() - interval '60 days'
),
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000006',
    'ffffffff-0001-0000-0000-000000000004',
    'aaaaaaab-0001-0000-0000-000000000004',
    8.00, 39920,
    'Approved',
    NOW() - interval '10 days'
),
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000006',
    'ffffffff-0001-0000-0000-000000000010',
    'aaaaaaab-0001-0000-0000-000000000010',
    8.00, 111920,
    'Approved',
    NOW() - interval '30 days'
),

-- Commission cho Sales Q7 (Bùi Thành Long)
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000007',
    'ffffffff-0001-0000-0000-000000000005',
    'aaaaaaab-0001-0000-0000-000000000005',
    8.00, 179928,
    'Approved',
    NOW() - interval '20 days'
),
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000007',
    'ffffffff-0001-0000-0000-000000000006',
    'aaaaaaab-0001-0000-0000-000000000006',
    8.00, 1079928,
    'Approved',
    NOW() - interval '45 days'
);

-- =====================================================
-- PAYROLL RECORDS - Tháng 4/2025 (ĐÃ THANH TOÁN)
-- PayrollStatus: Draft, Approved, Paid
-- =====================================================
INSERT INTO "PayrollRecords"
    ("PayrollId","StaffId","FormulaId","PeriodMonth","PeriodYear",
     "BaseSalary","SessionCount","SessionCommission","KpiBonus","SalesCommission",
     "TotalSalary","Status","Note",
     "CalculatedAt","ApprovedAt","ApprovedByUserId")
VALUES

-- PT Phạm Quốc Tuấn - T4/2025 - Paid
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000003',
    '11111111-0001-0000-0000-000000000001',
    4, 2025,
    8000000, 22, 3300000, 2000000, 0,
    13300000,
    'Paid',
    'Tháng 4 dạy đủ KPI, nhận thưởng 2 triệu',
    NOW() - interval '20 days',
    NOW() - interval '15 days',
    '00000000-0002-0000-0000-000000000001'
),

-- PT Vũ Thị Mai (Q7) - T4/2025 - Paid
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000004',
    '11111111-0001-0000-0000-000000000001',
    4, 2025,
    8000000, 18, 2700000, 2000000, 0,
    12700000,
    'Paid',
    'Đạt KPI tháng 4',
    NOW() - interval '20 days',
    NOW() - interval '15 days',
    '00000000-0002-0000-0000-000000000001'
),

-- HeadPT Đỗ Hải Đăng - T4/2025 - Paid
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000005',
    '11111111-0001-0000-0000-000000000001',
    4, 2025,
    12000000, 30, 4500000, 2000000, 0,
    18500000,
    'Paid',
    'Head PT xuất sắc tháng 4',
    NOW() - interval '20 days',
    NOW() - interval '15 days',
    '00000000-0002-0000-0000-000000000001'
),

-- Sales Hoàng Thị Ngọc (Q1) - T4/2025 - Paid
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000006',
    '11111111-0001-0000-0000-000000000001',
    4, 2025,
    7000000, 0, 0, 0, 852488,
    7852488,
    'Paid',
    'Hoa hồng tháng 4 từ 5 hợp đồng',
    NOW() - interval '20 days',
    NOW() - interval '15 days',
    '00000000-0002-0000-0000-000000000001'
),

-- Sales Bùi Thành Long (Q7) - T4/2025 - Approved (chưa trả)
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000007',
    '11111111-0001-0000-0000-000000000001',
    4, 2025,
    7000000, 0, 0, 0, 1259856,
    8259856,
    'Approved',
    'Hoa hồng tháng 4 từ 2 hợp đồng giá trị cao',
    NOW() - interval '20 days',
    NOW() - interval '15 days',
    '00000000-0002-0000-0000-000000000001'
),

-- Receptionist Trịnh Thị Hoa - T4/2025 - Paid
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000008',
    '11111111-0001-0000-0000-000000000001',
    4, 2025,
    6000000, 0, 0, 0, 0,
    6000000,
    'Paid',
    null,
    NOW() - interval '20 days',
    NOW() - interval '15 days',
    '00000000-0002-0000-0000-000000000001'
),

-- =====================================================
-- PAYROLL RECORDS - Tháng 5/2025 (DRAFT)
-- =====================================================
-- PT Phạm Quốc Tuấn - T5/2025 - Draft
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000003',
    '11111111-0001-0000-0000-000000000002',
    5, 2025,
    8000000, 14, 2240000, 0, 0,
    10240000,
    'Draft',
    'Đang tính toán, chưa đủ buổi KPI',
    NOW() - interval '2 days',
    null, null
),

-- HeadPT Đỗ Hải Đăng - T5/2025 - Draft
(
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000005',
    '11111111-0001-0000-0000-000000000002',
    5, 2025,
    12000000, 18, 2880000, 2000000, 0,
    16880000,
    'Draft',
    null,
    NOW() - interval '2 days',
    null, null
);
