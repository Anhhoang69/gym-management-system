-- =====================================================
-- 14_PROMOTIONS.SQL
-- Seed khuyến mãi – đa dạng loại và trạng thái
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

-- Promo 1: Khai trương - 10% cho tất cả gói - EXPIRED
(
    'eeeeeeee-0002-0000-0000-000000000001',
    'Khuyến Mãi Khai Trương GymFit',
    'KHAITUONG10',
    'Expired',
    'Percentage', 10,
    null, null, null,
    NOW() - interval '365 days',
    NOW() - interval '180 days',
    200, 147,
    null, 500000,
    'BestDiscount', 1,
    '00000000-0002-0000-0000-000000000001',
    NOW() - interval '370 days', NOW() - interval '180 days'
),

-- Promo 2: Mùa hè 2025 - 10% cho Premium & Elite - ACTIVE
(
    'eeeeeeee-0002-0000-0000-000000000002',
    'Ưu Đãi Mùa Hè 2025',
    'SUMMER2025',
    'Active',
    'Percentage', 10,
    null, null, null,
    NOW() - interval '30 days',
    NOW() + interval '60 days',
    100, 23,
    null, 899000,
    'BestDiscount', 2,
    '00000000-0001-0000-0000-000000000001',
    NOW() - interval '35 days', null
),

-- Promo 3: Giảm cố định 200k cho gói Basic - ACTIVE
(
    'eeeeeeee-0002-0000-0000-000000000003',
    'Ưu Đãi Hội Viên Mới - Gói Basic',
    'NEWMEM200K',
    'Active',
    'FixedAmount', 200000,
    'cccccccc-0001-0000-0000-000000000001',
    null, 'NewContract',
    NOW() - interval '60 days',
    NOW() + interval '30 days',
    50, 12,
    'Walk-in', 499000,
    'BestDiscount', 3,
    '00000000-0002-0000-0000-000000000001',
    NOW() - interval '65 days', null
),

-- Promo 4: Sinh nhật gym - 15% Elite - ACTIVE
(
    'eeeeeeee-0002-0000-0000-000000000004',
    'Sinh Nhật GymFit - 15% Gói Elite',
    'BIRTHDAY15',
    'Active',
    'Percentage', 15,
    'cccccccc-0001-0000-0000-000000000003',
    null, null,
    NOW() - interval '5 days',
    NOW() + interval '10 days',
    30, 3,
    null, 7999000,
    'NonStackable', 1,
    '00000000-0001-0000-0000-000000000001',
    NOW() - interval '10 days', null
),

-- Promo 5: Referral - giảm 300k - ACTIVE
(
    'eeeeeeee-0002-0000-0000-000000000005',
    'Giới Thiệu Bạn Bè - Giảm 300.000đ',
    'REFERRAL300K',
    'Active',
    'FixedAmount', 300000,
    null, null, null,
    NOW() - interval '90 days',
    NOW() + interval '90 days',
    200, 38,
    'Referral', 899000,
    'BestDiscount', 4,
    '00000000-0002-0000-0000-000000000001',
    NOW() - interval '95 days', null
),

-- Promo 6: Chi nhánh Q7 khai trương - INACTIVE
(
    'eeeeeeee-0002-0000-0000-000000000006',
    'Khai Trương Chi Nhánh Quận 7 - Tặng 1 Tháng',
    'Q7OPEN',
    'Inactive',
    'FixedAmount', 499000,
    null,
    'aaaaaaaa-0001-0000-0000-000000000002',
    'NewContract',
    NOW() - interval '300 days',
    NOW() - interval '240 days',
    50, 41,
    null, null,
    'NonStackable', 1,
    '00000000-0001-0000-0000-000000000001',
    NOW() - interval '310 days', NOW() - interval '240 days'
);

-- =====================================================
-- CONTRACT PROMOTIONS (liên kết promo đã áp dụng)
-- =====================================================
-- Contract 1 (Member An) dùng SUMMER2025 (10%)
INSERT INTO "ContractPromotions" ("ContractId","PromotionId","AppliedAt")
VALUES
    ('ffffffff-0001-0000-0000-000000000001', 'eeeeeeee-0002-0000-0000-000000000002', NOW() - interval '30 days'),
    ('ffffffff-0001-0000-0000-000000000005', 'eeeeeeee-0002-0000-0000-000000000002', NOW() - interval '20 days'),
    ('ffffffff-0001-0000-0000-000000000006', 'eeeeeeee-0002-0000-0000-000000000002', NOW() - interval '45 days');
