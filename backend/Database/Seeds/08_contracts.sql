-- =====================================================
-- 08_CONTRACTS.SQL
-- Seed hợp đồng hội viên – đa dạng trạng thái
-- =====================================================

-- =====================================================
-- CONTRACTS
-- ContractStatus: Pending, Active, Expired, Cancelled
-- =====================================================
INSERT INTO "Contracts"
    ("ContractId","MemberUserId","PackageId","StaffId",
     "OriginalPrice","DiscountAmount","DealPrice","Note",
     "Status","StartDate","EndDate",
     "TotalPrivateSessions","UsedPrivateSessions",
     "TotalGroupSessions","UsedGroupSessions",
     "CreatedAt","UpdatedAt")
VALUES

-- Contract 1: ACTIVE - Member An - Basic 3 tháng
(
    'ffffffff-0001-0000-0000-000000000001',
    '00000000-0004-0000-0000-000000000001',
    'cccccccc-0001-0000-0000-000000000001',
    '00000000-0003-0000-0000-000000000006',
    1399000, 139900, 1259100,
    'Hội viên mới đăng ký tháng đầu tiên, áp dụng khuyến mãi khai trương 10%',
    'Active',
    NOW() - interval '30 days',
    NOW() + interval '60 days',
    0, 0, 0, 0,
    NOW() - interval '30 days', null
),

-- Contract 2: ACTIVE - Member Bích - Premium 1 tháng
(
    'ffffffff-0001-0000-0000-000000000002',
    '00000000-0004-0000-0000-000000000002',
    'cccccccc-0001-0000-0000-000000000002',
    '00000000-0003-0000-0000-000000000006',
    899000, 0, 899000,
    null,
    'Active',
    NOW() - interval '15 days',
    NOW() + interval '15 days',
    4, 2, 4, 1,
    NOW() - interval '15 days', NOW() - interval '5 days'
),

-- Contract 3: ACTIVE - Member Cường - Elite 6 tháng
(
    'ffffffff-0001-0000-0000-000000000003',
    '00000000-0004-0000-0000-000000000003',
    'cccccccc-0001-0000-0000-000000000003',
    '00000000-0003-0000-0000-000000000006',
    7999000, 0, 7999000,
    'Hội viên VIP, ưu tiên PT Đỗ Hải Đăng',
    'Active',
    NOW() - interval '60 days',
    NOW() + interval '120 days',
    12, 8, 12, 5,
    NOW() - interval '60 days', null
),

-- Contract 4: ACTIVE - Member Dung - Basic 1 tháng
(
    'ffffffff-0001-0000-0000-000000000004',
    '00000000-0004-0000-0000-000000000004',
    'cccccccc-0001-0000-0000-000000000001',
    '00000000-0003-0000-0000-000000000006',
    499000, 0, 499000,
    null,
    'Active',
    NOW() - interval '10 days',
    NOW() + interval '20 days',
    0, 0, 0, 0,
    NOW() - interval '10 days', null
),

-- Contract 5: ACTIVE - Member Em - Premium 3 tháng
(
    'ffffffff-0001-0000-0000-000000000005',
    '00000000-0004-0000-0000-000000000005',
    'cccccccc-0001-0000-0000-000000000002',
    '00000000-0003-0000-0000-000000000007',
    2499000, 249900, 2249100,
    'Khuyến mãi mùa hè 10%',
    'Active',
    NOW() - interval '20 days',
    NOW() + interval '70 days',
    4, 1, 4, 2,
    NOW() - interval '20 days', null
),

-- Contract 6: ACTIVE - Member Phương - Elite 12 tháng
(
    'ffffffff-0001-0000-0000-000000000006',
    '00000000-0004-0000-0000-000000000006',
    'cccccccc-0001-0000-0000-000000000003',
    '00000000-0003-0000-0000-000000000007',
    14999000, 1499900, 13499100,
    'Gói Elite 1 năm, ưu tiên lịch tập buổi sáng',
    'Active',
    NOW() - interval '45 days',
    NOW() + interval '320 days',
    12, 3, 12, 4,
    NOW() - interval '45 days', null
),

-- Contract 7: ACTIVE - Member Giang - Trial 7 ngày
(
    'ffffffff-0001-0000-0000-000000000007',
    '00000000-0004-0000-0000-000000000007',
    'cccccccc-0001-0000-0000-000000000004',
    '00000000-0003-0000-0000-000000000006',
    0, 0, 0,
    'Gói dùng thử miễn phí',
    'Active',
    NOW() - interval '3 days',
    NOW() + interval '4 days',
    0, 0, 0, 0,
    NOW() - interval '3 days', null
),

-- Contract 8: PENDING - Member Hương - Basic 1 tháng
(
    'ffffffff-0001-0000-0000-000000000008',
    '00000000-0004-0000-0000-000000000008',
    'cccccccc-0001-0000-0000-000000000001',
    '00000000-0003-0000-0000-000000000006',
    499000, 0, 499000,
    'Chờ thanh toán',
    'Pending',
    NOW(),
    NOW() + interval '30 days',
    0, 0, 0, 0,
    NOW(), null
),

-- Contract 9: EXPIRED - Member Ký - Basic 6 tháng (đã hết hạn)
(
    'ffffffff-0001-0000-0000-000000000009',
    '00000000-0004-0000-0000-000000000009',
    'cccccccc-0001-0000-0000-000000000001',
    '00000000-0003-0000-0000-000000000006',
    2599000, 0, 2599000,
    'Gói cũ đã hết hạn, khách chưa gia hạn',
    'Expired',
    NOW() - interval '400 days',
    NOW() - interval '220 days',
    0, 0, 0, 0,
    NOW() - interval '400 days', NOW() - interval '220 days'
),

-- Contract 10: ACTIVE - Member Ký - Basic 3 tháng mới (gia hạn)
(
    'ffffffff-0001-0000-0000-000000000010',
    '00000000-0004-0000-0000-000000000009',
    'cccccccc-0001-0000-0000-000000000001',
    '00000000-0003-0000-0000-000000000006',
    1399000, 0, 1399000,
    'Gia hạn sau khi hết gói 6 tháng cũ',
    'Active',
    NOW() - interval '30 days',
    NOW() + interval '60 days',
    0, 0, 0, 0,
    NOW() - interval '30 days', null
),

-- Contract 11: CANCELLED - Member Lan - Basic 1 tháng (đã hủy)
(
    'ffffffff-0001-0000-0000-000000000011',
    '00000000-0004-0000-0000-000000000010',
    'cccccccc-0001-0000-0000-000000000001',
    '00000000-0003-0000-0000-000000000006',
    499000, 0, 499000,
    'Khách yêu cầu hủy vì lý do cá nhân',
    'Cancelled',
    NOW() - interval '5 days',
    NOW() + interval '25 days',
    0, 0, 0, 0,
    NOW() - interval '5 days', NOW() - interval '1 day'
);

-- NOTE: ContractPromotions được seed trong file 14_promotions.sql
-- sau khi Promotions đã được tạo

-- =====================================================
-- CONTRACT DRAFTS (bản nháp chờ generate)
-- =====================================================
INSERT INTO "ContractDrafts"
    ("DraftId","CreatedByStaffId","MemberUserId","PackageId","PricingId",
     "StartDate","Note","OriginalPrice","DiscountAmount","DealPrice",
     "PromotionIdsJson","IsUsed","CreatedAt","ExpiresAt")
SELECT
    gen_random_uuid(),
    '00000000-0003-0000-0000-000000000006',
    '00000000-0004-0000-0000-000000000010',
    'cccccccc-0001-0000-0000-000000000002',
    pp."PackagePricingId",
    NOW() + interval '1 day',
    'Dự kiến nâng cấp lên Premium sau khi khách quyết định',
    899000, 0, 899000,
    '[]', false,
    NOW() - interval '2 hours',
    NOW() + interval '22 hours'
FROM "PackagePricings" pp
WHERE pp."PackageId" = 'cccccccc-0001-0000-0000-000000000002'
  AND pp."DurationMonths" = 1
LIMIT 1;
