-- =====================================================
-- SEED-ALL.SQL
-- GymFit Gym Management System - Master Seed Script
-- =====================================================
--
-- Cách chạy:
--   psql -U postgres -d GymDB -f seed-all.sql
--
-- Hoặc với connection string:
--   psql "host=localhost port=5432 dbname=GymDB user=postgres password=yourpassword" -f seed-all.sql
--
-- Lưu ý:
--   - Script này phải được chạy từ thư mục chứa file seed-all.sql
--   - Đảm bảo đã chạy migrations trước khi seed
--   - Toàn bộ dữ liệu cũ sẽ bị XÓA và thay thế bằng dữ liệu mới
--
-- =====================================================

\echo '================================================='
\echo 'GymFit Database Seed Script'
\echo 'Starting seed process...'
\echo '================================================='

-- Bật extension cho gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\echo ''
\echo '[00] Cleaning up existing data...'
\i 00_cleanup.sql

\echo '[01] Seeding Roles...'
\i 01_roles.sql

\echo '[02] Seeding Users...'
\i 02_users.sql

\echo '[03] Seeding Branches...'
\i 03_branches.sql

\echo '[04] Seeding Rooms...'
\i 04_rooms.sql

\echo '[05] Seeding Packages...'
\i 05_packages.sql

\echo '[06] Seeding Members & Staffs...'
\i 06_members.sql

\echo '[07] Seeding Leads...'
\i 07_leads.sql

\echo '[08] Seeding Contracts...'
\i 08_contracts.sql

\echo '[09] Seeding Invoices...'
\i 09_invoices.sql

\echo '[10] Seeding Payments...'
\i 10_payments.sql

\echo '[11] Seeding Classes...'
\i 11_classes.sql

\echo '[12] Seeding Bookings...'
\i 12_bookings.sql

\echo '[13] Seeding Attendances...'
\i 13_attendances.sql

\echo '[14] Seeding Promotions...'
\i 14_promotions.sql

\echo '[15] Seeding Notifications...'
\i 15_notifications.sql

\echo '[16] Seeding Payrolls...'
\i 16_payrolls.sql

\echo '[17] Seeding Reports/Audit data...'
\i 17_reports.sql

\echo '[18] Seeding AI data...'
\i 18_ai_data.sql

\echo '[20] Seeding AI usage logs (Token + Tool execution)...'
\i 20_ai_logs.sql

\echo '[99] Seeding Demo data...'
\i 99_demo_data.sql

\echo ''
\echo '================================================='
\echo 'Seed completed successfully!'
\echo ''
\echo 'Demo accounts (password: 123456Aa@):'
\echo '  SuperAdmin : superadmin@gymfit.vn'
\echo '  GymOwner   : gymowner@gymfit.vn'
\echo '  BranchAdmin: branchadmin.q1@gymfit.vn'
\echo '  PT Q1      : pt.nguyen@gymfit.vn'
\echo '  Sales Q1   : sales.q1@gymfit.vn'
\echo '  Member     : nguyen.van.an@gmail.com'
\echo '================================================='
