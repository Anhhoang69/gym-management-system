-- =====================================================
-- 14_PROMOTIONS.SQL
-- Seed khuyến mãi – đa dạng loại và trạng thái
-- Timeline: T6/2025 → T6/2026 (demo 09/06/2026)
-- =====================================================

-- =====================================================
-- PROMOTIONS
-- PromotionStatus: Active, Inactive, Expired
-- DiscountType: Percentage, FixedAmount
-- ApplicationRuleType: BestDiscount, HighestPriority, NonStackable
-- =====================================================
INSERT INTO "Promotions"
    ("PromotionId","Name","Code","Status","DiscountType","DiscountValue",
     "ApplicablePackageId","ApplicableBranchId","ContractType",
     "StartDate","EndDate","MaxUsage","CurrentUsage",
     "SalesChannel","MinContractValue","ApplicationRule","Priority",
     "CreatedByUserId","CreatedAt","UpdatedAt")
VALUES

-- Promo 1: Khai trương Q1 T6/2025 - EXPIRED
(
    'eeeeeeee-0002-0000-0000-000000000001',
    'Khuyến Mãi Khai Trương GymFit Quận 1',
    'KHAITUONG10',
    'Expired',
    'Percentage', 10,
    null, null, null,
    TIMESTAMP '2025-06-01 00:00:00',
    TIMESTAMP '2025-08-31 23:59:59',
    200, 147,
    null, 500000,
    'BestDiscount', 1,
    '00000000-0002-0000-0000-000000000001',
    TIMESTAMP '2025-05-28 08:00:00',
    TIMESTAMP '2025-08-31 23:59:59'
),

-- Promo 2: Mùa hè 2025 - INACTIVE (đã qua, không còn hiệu lực)
(
    'eeeeeeee-0002-0000-0000-000000000002',
    'Ưu Đãi Mùa Hè 2025 - Giảm 10%',
    'SUMMER2025',
    'Inactive',
    'Percentage', 10,
    null, null, null,
    TIMESTAMP '2025-07-01 00:00:00',
    TIMESTAMP '2025-09-30 23:59:59',
    100, 87,
    null, 899000,
    'BestDiscount', 2,
    '00000000-0001-0000-0000-000000000001',
    TIMESTAMP '2025-06-25 09:00:00',
    TIMESTAMP '2025-09-30 23:59:59'
),

-- Promo 3: Giảm cố định 200k cho gói Basic - ACTIVE (đang chạy)
(
    'eeeeeeee-0002-0000-0000-000000000003',
    'Ưu Đãi Hội Viên Mới - Gói Basic',
    'NEWMEM200K',
    'Active',
    'FixedAmount', 200000,
    'cccccccc-0001-0000-0000-000000000001',
    null, 'NewContract',
    TIMESTAMP '2026-01-01 00:00:00',
    TIMESTAMP '2026-12-31 23:59:59',
    300, 52,
    'Walk-in', 499000,
    'BestDiscount', 3,
    '00000000-0002-0000-0000-000000000001',
    TIMESTAMP '2025-12-28 10:00:00',
    null
),

-- Promo 4: Sinh nhật GymFit 1 năm - EXPIRED (T6/2026 đã qua 1 tuần trước)
(
    'eeeeeeee-0002-0000-0000-000000000004',
    'Sinh Nhật 1 Năm GymFit - 15% Gói Elite',
    'BIRTHDAY15',
    'Expired',
    'Percentage', 15,
    'cccccccc-0001-0000-0000-000000000003',
    null, null,
    TIMESTAMP '2026-06-01 00:00:00',
    TIMESTAMP '2026-06-07 23:59:59',
    30, 8,
    null, 7999000,
    'NonStackable', 1,
    '00000000-0001-0000-0000-000000000001',
    TIMESTAMP '2026-05-30 08:00:00',
    TIMESTAMP '2026-06-07 23:59:59'
),

-- Promo 5: Referral - giảm 300k - ACTIVE (chương trình thường trực)
(
    'eeeeeeee-0002-0000-0000-000000000005',
    'Giới Thiệu Bạn Bè - Giảm 300.000đ',
    'REFERRAL300K',
    'Active',
    'FixedAmount', 300000,
    null, null, null,
    TIMESTAMP '2025-06-01 00:00:00',
    TIMESTAMP '2026-12-31 23:59:59',
    500, 75,
    'Referral', 899000,
    'BestDiscount', 4,
    '00000000-0002-0000-0000-000000000001',
    TIMESTAMP '2025-05-30 08:00:00',
    null
),

-- Promo 6: Chi nhánh Q7 khai trương T7/2025 - INACTIVE
(
    'eeeeeeee-0002-0000-0000-000000000006',
    'Khai Trương Chi Nhánh Quận 7 - Tặng 1 Tháng',
    'Q7OPEN',
    'Inactive',
    'FixedAmount', 499000,
    null,
    'aaaaaaaa-0001-0000-0000-000000000002',
    'NewContract',
    TIMESTAMP '2025-07-01 00:00:00',
    TIMESTAMP '2025-08-31 23:59:59',
    50, 41,
    null, null,
    'NonStackable', 1,
    '00000000-0001-0000-0000-000000000001',
    TIMESTAMP '2025-06-28 09:00:00',
    TIMESTAMP '2025-08-31 23:59:59'
),

-- Promo 7: Tết 2026 - EXPIRED (T1/2026, doanh thu đỉnh)
(
    'eeeeeeee-0002-0000-0000-000000000007',
    'Ưu Đãi Tết Nguyên Đán 2026 - Giảm 20%',
    'TET2026',
    'Expired',
    'Percentage', 20,
    null, null, null,
    TIMESTAMP '2026-01-15 00:00:00',
    TIMESTAMP '2026-02-15 23:59:59',
    150, 128,
    null, 899000,
    'BestDiscount', 1,
    '00000000-0001-0000-0000-000000000001',
    TIMESTAMP '2026-01-10 08:00:00',
    TIMESTAMP '2026-02-15 23:59:59'
),

-- Promo 8: Mùa hè 2026 - ACTIVE (đang chạy, mới bắt đầu T6/2026)
(
    'eeeeeeee-0002-0000-0000-000000000008',
    'Ưu Đãi Mùa Hè 2026 - Giảm 10%',
    'SUMMER2026',
    'Active',
    'Percentage', 10,
    null, null, null,
    TIMESTAMP '2026-06-01 00:00:00',
    TIMESTAMP '2026-08-31 23:59:59',
    200, 12,
    null, 899000,
    'BestDiscount', 2,
    '00000000-0001-0000-0000-000000000001',
    TIMESTAMP '2026-05-25 10:00:00',
    null
),

-- Promo 9: Khai trương Đà Nẵng T5/2026 - ACTIVE
(
    'eeeeeeee-0002-0000-0000-000000000009',
    'Khai Trương Chi Nhánh Đà Nẵng - Giảm 15%',
    'DANOPENDN',
    'Active',
    'Percentage', 15,
    null,
    'aaaaaaaa-0001-0000-0000-000000000006',
    'NewContract',
    TIMESTAMP '2026-05-01 00:00:00',
    TIMESTAMP '2026-07-31 23:59:59',
    100, 7,
    null, 499000,
    'BestDiscount', 1,
    '00000000-0001-0000-0000-000000000001',
    TIMESTAMP '2026-04-28 09:00:00',
    null
);

-- =====================================================
-- CONTRACT PROMOTIONS (liên kết promo đã áp dụng)
-- =====================================================
INSERT INTO "ContractPromotions" ("ContractId","PromotionId","AppliedAt")
VALUES
-- Demo members dùng SUMMER2025 (các hợp đồng ký T7-T9/2025)
('ffffffff-0001-0000-0000-000000000001', 'eeeeeeee-0002-0000-0000-000000000002', TIMESTAMP '2025-07-15 10:30:00'),
('ffffffff-0001-0000-0000-000000000005', 'eeeeeeee-0002-0000-0000-000000000002', TIMESTAMP '2025-08-01 09:15:00'),
('ffffffff-0001-0000-0000-000000000006', 'eeeeeeee-0002-0000-0000-000000000002', TIMESTAMP '2025-08-20 14:00:00'),
-- Hợp đồng khai trương Q7 dùng Q7OPEN
('ffffffff-0001-0000-0000-000000000003', 'eeeeeeee-0002-0000-0000-000000000006', TIMESTAMP '2025-07-05 11:00:00'),
-- Hợp đồng sau Tết dùng TET2026
('ffffffff-0001-0000-0000-000000000007', 'eeeeeeee-0002-0000-0000-000000000007', TIMESTAMP '2026-01-20 10:00:00'),
('ffffffff-0001-0000-0000-000000000008', 'eeeeeeee-0002-0000-0000-000000000007', TIMESTAMP '2026-01-25 14:30:00'),
-- Hợp đồng mới T6/2026 dùng SUMMER2026
('ffffffff-0001-0000-0000-000000000009', 'eeeeeeee-0002-0000-0000-000000000008', TIMESTAMP '2026-06-03 09:00:00'),
('ffffffff-0001-0000-0000-000000000010', 'eeeeeeee-0002-0000-0000-000000000008', TIMESTAMP '2026-06-05 11:30:00');


-- =====================================================
-- AUTO-APPLY CONTRACT PROMOTIONS FOR BULK CONTRACTS WITH DISCOUNTS
-- =====================================================
DO $$
DECLARE
  contract_rec record;
  promo_id uuid;
BEGIN
  FOR contract_rec IN 
    SELECT "ContractId", "DiscountAmount", "CreatedAt" 
    FROM "Contracts" 
    WHERE "DiscountAmount" > 0 
      AND "ContractId" NOT IN (SELECT "ContractId" FROM "ContractPromotions")
  LOOP
    -- Map to the correct promotion based on CreatedAt date and discount amount
    IF contract_rec."CreatedAt" >= TIMESTAMP '2025-06-01' AND contract_rec."CreatedAt" <= TIMESTAMP '2025-08-31' THEN
      promo_id := 'eeeeeeee-0002-0000-0000-000000000001'::uuid; -- Khai trương Q1
    ELSIF contract_rec."CreatedAt" >= TIMESTAMP '2025-07-01' AND contract_rec."CreatedAt" <= TIMESTAMP '2025-09-30' AND (contract_rec."ContractId"::text LIKE '%3%' OR contract_rec."ContractId"::text LIKE '%a%') THEN
      promo_id := 'eeeeeeee-0002-0000-0000-000000000006'::uuid; -- Q7 Open
    ELSIF contract_rec."CreatedAt" >= TIMESTAMP '2025-07-01' AND contract_rec."CreatedAt" <= TIMESTAMP '2025-09-30' THEN
      promo_id := 'eeeeeeee-0002-0000-0000-000000000002'::uuid; -- Summer 2025
    ELSIF contract_rec."CreatedAt" >= TIMESTAMP '2026-01-15' AND contract_rec."CreatedAt" <= TIMESTAMP '2026-02-15' THEN
      promo_id := 'eeeeeeee-0002-0000-0000-000000000007'::uuid; -- Tết 2026
    ELSIF contract_rec."CreatedAt" >= TIMESTAMP '2026-05-01' AND contract_rec."CreatedAt" <= TIMESTAMP '2026-07-31' AND (contract_rec."ContractId"::text LIKE '%5%' OR contract_rec."ContractId"::text LIKE '%b%') THEN
      promo_id := 'eeeeeeee-0002-0000-0000-000000000009'::uuid; -- Khai trương Đà Nẵng
    ELSIF contract_rec."CreatedAt" >= TIMESTAMP '2026-06-01' THEN
      promo_id := 'eeeeeeee-0002-0000-0000-000000000008'::uuid; -- Summer 2026
    ELSE
      -- Referral or New Member
      IF contract_rec."DiscountAmount" = 200000 THEN
        promo_id := 'eeeeeeee-0002-0000-0000-000000000003'::uuid; -- NEWMEM200K
      ELSE
        promo_id := 'eeeeeeee-0002-0000-0000-000000000005'::uuid; -- REFERRAL300K
      END IF;
    END IF;

    -- Double check that promotion exists
    IF EXISTS (SELECT 1 FROM "Promotions" WHERE "PromotionId" = promo_id) THEN
      INSERT INTO "ContractPromotions" ("ContractId", "PromotionId", "AppliedAt")
      VALUES (contract_rec."ContractId", promo_id, contract_rec."CreatedAt")
      ON CONFLICT ("ContractId", "PromotionId") DO NOTHING;
    END IF;
  END LOOP;
END $$;

