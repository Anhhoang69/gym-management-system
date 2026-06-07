-- =====================================================
-- 00_CLEANUP.SQL
-- Xóa toàn bộ dữ liệu seed (đúng thứ tự dependency)
-- =====================================================

-- Disable triggers tạm thời (nếu cần)
-- SET session_replication_role = replica;

-- =====================================================
-- AI / SYSTEM
-- =====================================================
DELETE FROM "AIContextCaches";
DELETE FROM "AIRecommendations";
DELETE FROM "ChatHistories";

-- =====================================================
-- AUDIT / NOTIFICATIONS
-- =====================================================
DELETE FROM "AuditLogs";
DELETE FROM "NotificationRecipients";
DELETE FROM "Notifications";
DELETE FROM "LoginHistories";
DELETE FROM "OtpCodes";

-- =====================================================
-- REQUESTS
-- =====================================================
DELETE FROM "Requests";

-- =====================================================
-- PAYROLL
-- =====================================================
DELETE FROM "PayrollRecords";
DELETE FROM "PayrollFormulas";

-- =====================================================
-- ATTENDANCE / BOOKING
-- =====================================================
DELETE FROM "Attendances";
DELETE FROM "AccessCards";
DELETE FROM "ClassBookings";
DELETE FROM "Classes";

-- =====================================================
-- BILLING
-- =====================================================
DELETE FROM "Commissions";
DELETE FROM "Payments";
DELETE FROM "Invoices";

-- =====================================================
-- CONTRACT
-- =====================================================
DELETE FROM "ContractAdjusts";
DELETE FROM "ContractPromotions";
DELETE FROM "ContractDrafts";
DELETE FROM "Contracts";

-- =====================================================
-- PROMOTIONS
-- =====================================================
DELETE FROM "Promotions";

-- =====================================================
-- MEMBERS / LEADS
-- =====================================================
DELETE FROM "Leads";
DELETE FROM "LeadSources";
DELETE FROM "Members";

-- =====================================================
-- STAFF
-- =====================================================
DELETE FROM "PTProfiles";
DELETE FROM "Staffs";

-- =====================================================
-- IDENTITY (Users / Roles)
-- =====================================================
DELETE FROM "AspNetUserRoles";
DELETE FROM "AspNetUserClaims";
DELETE FROM "AspNetUserLogins";
DELETE FROM "AspNetUserTokens";
DELETE FROM "AspNetUsers";
DELETE FROM "AspNetRoleClaims";
DELETE FROM "AspNetRoles";

-- =====================================================
-- ROOMS / BRANCHES
-- =====================================================
DELETE FROM "RoomImages";
DELETE FROM "Rooms";
DELETE FROM "BranchImages";
DELETE FROM "Branches";

-- =====================================================
-- PACKAGES
-- =====================================================
DELETE FROM "PackageFeatures";
DELETE FROM "PackagePricings";
DELETE FROM "PackagePolicies";
DELETE FROM "Packages";
