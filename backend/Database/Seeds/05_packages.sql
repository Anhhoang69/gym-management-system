-- =====================================================
-- 05_PACKAGES.SQL
-- Seed gói hội viên, chính sách, tính năng, bảng giá
-- =====================================================

-- =====================================================
-- PACKAGES
-- Giữ tên tiếng Anh, mô tả tiếng Việt
-- =====================================================
INSERT INTO "Packages"
    ("PackageId","Name","Description","ThumbnailUrl","Tier",
     "IsPtIncluded","PrivatePtLimit","GroupPtLimit",
     "MaxCheckinsPerWeek","BadgeLabel","DisplayOrder",
     "Status","CreatedAt")
VALUES
(
    'cccccccc-0001-0000-0000-000000000001',
    'Basic',
    'Gói cơ bản – Tiếp cận toàn bộ khu vực tập gym với đầy đủ trang thiết bị hiện đại. Phù hợp cho những ai mới bắt đầu hành trình rèn luyện sức khỏe.',
    '/img/packages/basic.jpg',
    'Basic',
    false, 0, 0, 7,
    null, 1, 'Active',
    NOW() - interval '300 days'
),
(
    'cccccccc-0001-0000-0000-000000000002',
    'Premium',
    'Gói nâng cao – Bao gồm buổi tập cùng huấn luyện viên cá nhân (PT). Lý tưởng cho những ai muốn có lộ trình tập luyện khoa học và cá nhân hóa.',
    '/img/packages/premium.jpg',
    'Premium',
    true, 4, 4, 7,
    'Phổ biến', 2, 'Active',
    NOW() - interval '300 days'
),
(
    'cccccccc-0001-0000-0000-000000000003',
    'Elite',
    'Gói cao cấp – Tập luyện không giới hạn với đặc quyền VIP. Sở hữu nhiều buổi PT nhất, ưu tiên đặt lịch lớp học và hưởng toàn bộ tiện ích cao cấp.',
    '/img/packages/elite.jpg',
    'Elite',
    true, 12, 12, 7,
    'Bán chạy nhất', 3, 'Active',
    NOW() - interval '300 days'
),
(
    'cccccccc-0001-0000-0000-000000000004',
    'Trial',
    'Gói dùng thử 7 ngày – Trải nghiệm miễn phí toàn bộ cơ sở vật chất trong 1 tuần. Không cần cam kết dài hạn, phù hợp cho khách hàng mới muốn tìm hiểu.',
    '/img/packages/trial.jpg',
    'Basic',
    false, 0, 0, 3,
    'Dùng thử', 4, 'Active',
    NOW() - interval '300 days'
);

-- =====================================================
-- PACKAGE POLICIES
-- =====================================================
INSERT INTO "PackagePolicies"
    ("PackageId","ChangeFeeDefault","ProrationRule",
     "UpgradeAllowed","DowngradeAllowed",
     "FreezeAllowed","MaxFreezeDays","MaxFreezeCount","FreezeFee",
     "TransferAllowed","EarlyRenewAllowed","AllowMultiBranch")
VALUES
(
    'cccccccc-0001-0000-0000-000000000001',
    100000, 'Standard', true, false, true, 14, 1, 50000, false, true, false
),
(
    'cccccccc-0001-0000-0000-000000000002',
    150000, 'Standard', true, true, true, 21, 2, 50000, false, true, true
),
(
    'cccccccc-0001-0000-0000-000000000003',
    200000, 'Standard', true, true, true, 30, 3, 50000, true, true, true
),
(
    'cccccccc-0001-0000-0000-000000000004',
    0, 'None', false, false, false, 0, 0, 0, false, false, false
);

-- =====================================================
-- PACKAGE FEATURES (tiếng Việt)
-- =====================================================
-- Basic features
INSERT INTO "PackageFeatures" ("PackageFeatureId","PackageId","Content","DisplayOrder") VALUES
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000001', 'Sử dụng toàn bộ khu vực tập gym', 1),
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000001', 'Tủ đồ và phòng tắm', 2),
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000001', 'Trang thiết bị tập gym hiện đại', 3),
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000001', 'Check-in không giới hạn trong tuần', 4);

-- Premium features
INSERT INTO "PackageFeatures" ("PackageFeatureId","PackageId","Content","DisplayOrder") VALUES
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000002', 'Tất cả tính năng gói Basic', 1),
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000002', '4 buổi PT cá nhân mỗi tháng', 2),
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000002', '4 buổi lớp học nhóm mỗi tháng', 3),
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000002', 'Kế hoạch dinh dưỡng cơ bản', 4),
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000002', 'Check-in đa chi nhánh', 5);

-- Elite features
INSERT INTO "PackageFeatures" ("PackageFeatureId","PackageId","Content","DisplayOrder") VALUES
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000003', 'Tất cả tính năng gói Premium', 1),
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000003', '12 buổi PT cá nhân mỗi tháng', 2),
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000003', '12 buổi lớp học nhóm mỗi tháng', 3),
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000003', 'Kế hoạch dinh dưỡng chuyên sâu', 4),
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000003', 'Phòng tắm VIP riêng tư', 5),
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000003', 'Ưu tiên đặt lịch lớp học', 6),
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000003', 'Tư vấn sức khỏe định kỳ hàng tháng', 7);

-- Trial features
INSERT INTO "PackageFeatures" ("PackageFeatureId","PackageId","Content","DisplayOrder") VALUES
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000004', 'Sử dụng toàn bộ khu vực gym trong 7 ngày', 1),
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000004', 'Tối đa 3 lần check-in mỗi tuần', 2),
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000004', 'Tư vấn PT miễn phí 1 buổi', 3);

-- =====================================================
-- PACKAGE PRICINGS
-- =====================================================
-- Basic pricing
INSERT INTO "PackagePricings" ("PackagePricingId","PackageId","DurationMonths","Price","OriginalPrice")
VALUES
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000001', 1,  499000,  599000),
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000001', 3,  1399000, 1599000),
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000001', 6,  2599000, 2999000),
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000001', 12, 4799000, 5799000);

-- Premium pricing
INSERT INTO "PackagePricings" ("PackagePricingId","PackageId","DurationMonths","Price","OriginalPrice")
VALUES
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000002', 1,  899000,  999000),
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000002', 3,  2499000, 2799000),
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000002', 6,  4799000, 5499000),
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000002', 12, 8999000, 10799000);

-- Elite pricing
INSERT INTO "PackagePricings" ("PackagePricingId","PackageId","DurationMonths","Price","OriginalPrice")
VALUES
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000003', 1,  1499000, 1799000),
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000003', 3,  4199000, 4999000),
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000003', 6,  7999000, 9599000),
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000003', 12, 14999000, 17999000);

-- Trial pricing (free, 0 months = 7 days logic handled in app)
INSERT INTO "PackagePricings" ("PackagePricingId","PackageId","DurationMonths","Price","OriginalPrice")
VALUES
    (gen_random_uuid(), 'cccccccc-0001-0000-0000-000000000004', 0, 0, 0);
