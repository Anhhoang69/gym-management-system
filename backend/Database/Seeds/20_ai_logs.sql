-- =====================================================
-- 20_AI_LOGS.SQL
-- Seed AITokenUsageLogs + AIToolExecutionLogs
-- Mục tiêu: Dashboard AI Usage Stats cho SuperAdmin/GymOwner
-- Coverage: 30 ngày gần nhất (T5/2026 - T6/2026)
-- =====================================================
--
-- AITokenUsageLogs: Lịch sử tiêu thụ token mỗi lượt chat
--   Columns: Id, UserId, UserRole, PromptTokens, CompletionTokens, Model, CreatedAt
--
-- AIToolExecutionLogs: Lịch sử gọi AI tool (Semantic Kernel)
--   Columns: Id, UserId, UserRole, StaffPosition, ToolName,
--             ArgumentsJson, Success, DurationMs, ErrorMessage, ExecutedAt
-- =====================================================

-- =====================================================
-- AI TOKEN USAGE LOGS
-- Phân bố: ~400 records trong 30 ngày
-- Roles: Member (~180), Staff (~120), GymOwner (~60), SuperAdmin (~40)
-- Model: gpt-4o-mini
-- =====================================================
INSERT INTO "AITokenUsageLogs"
    ("Id","UserId","UserRole","PromptTokens","CompletionTokens","Model","CreatedAt")
VALUES

-- =====================================================
-- WEEK 1: T5/10 - T5/16 (cách đây ~24-30 ngày)
-- =====================================================

-- Member An (heavy AI user - Dedicated)
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',310,580,'gpt-4o-mini',TIMESTAMP '2026-05-10 06:45:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',285,620,'gpt-4o-mini',TIMESTAMP '2026-05-12 07:10:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',340,710,'gpt-4o-mini',TIMESTAMP '2026-05-14 06:50:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',290,540,'gpt-4o-mini',TIMESTAMP '2026-05-15 19:20:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',310,650,'gpt-4o-mini',TIMESTAMP '2026-05-16 07:05:00'),

-- Member Cường (Elite user - tập 5-6 buổi/tuần)
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',350,780,'gpt-4o-mini',TIMESTAMP '2026-05-10 08:30:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',320,690,'gpt-4o-mini',TIMESTAMP '2026-05-13 17:45:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',280,610,'gpt-4o-mini',TIMESTAMP '2026-05-15 08:00:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',410,850,'gpt-4o-mini',TIMESTAMP '2026-05-16 06:40:00'),

-- Member Phương (Yoga - hỏi về lớp học)
(gen_random_uuid(),'00000000-0004-0000-0000-000000000006','Member',270,590,'gpt-4o-mini',TIMESTAMP '2026-05-11 07:00:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000006','Member',300,640,'gpt-4o-mini',TIMESTAMP '2026-05-14 07:30:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000006','Member',260,510,'gpt-4o-mini',TIMESTAMP '2026-05-16 08:00:00'),

-- Member Bích (Premium - hỏi về nâng cấp)
(gen_random_uuid(),'00000000-0004-0000-0000-000000000002','Member',290,620,'gpt-4o-mini',TIMESTAMP '2026-05-11 19:30:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000002','Member',310,680,'gpt-4o-mini',TIMESTAMP '2026-05-15 18:00:00'),

-- Member Dung (Casual user)
(gen_random_uuid(),'00000000-0004-0000-0000-000000000004','Member',220,480,'gpt-4o-mini',TIMESTAMP '2026-05-12 20:00:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000004','Member',240,510,'gpt-4o-mini',TIMESTAMP '2026-05-16 20:30:00'),

-- Member Em (Q7 branch)
(gen_random_uuid(),'00000000-0004-0000-0000-000000000005','Member',280,600,'gpt-4o-mini',TIMESTAMP '2026-05-13 17:00:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000005','Member',265,570,'gpt-4o-mini',TIMESTAMP '2026-05-15 17:30:00'),

-- Staff Sales Q1 - Hoàng Thị Ngọc
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff',380,720,'gpt-4o-mini',TIMESTAMP '2026-05-10 09:15:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff',420,840,'gpt-4o-mini',TIMESTAMP '2026-05-12 10:30:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff',360,780,'gpt-4o-mini',TIMESTAMP '2026-05-14 09:00:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff',395,810,'gpt-4o-mini',TIMESTAMP '2026-05-16 09:45:00'),

-- Staff HeadPT Q1 - Đỗ Hải Đăng
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff',340,700,'gpt-4o-mini',TIMESTAMP '2026-05-10 07:30:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff',360,740,'gpt-4o-mini',TIMESTAMP '2026-05-13 07:00:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff',310,680,'gpt-4o-mini',TIMESTAMP '2026-05-15 07:15:00'),

-- Staff BranchAdmin Q1 - Nguyễn Thị Lan
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff',450,920,'gpt-4o-mini',TIMESTAMP '2026-05-10 08:00:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff',480,980,'gpt-4o-mini',TIMESTAMP '2026-05-12 08:30:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff',410,860,'gpt-4o-mini',TIMESTAMP '2026-05-14 08:45:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff',430,900,'gpt-4o-mini',TIMESTAMP '2026-05-16 08:15:00'),

-- GymOwner
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',520,1050,'gpt-4o-mini',TIMESTAMP '2026-05-10 09:00:00'),
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',580,1120,'gpt-4o-mini',TIMESTAMP '2026-05-12 10:00:00'),
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',490,1000,'gpt-4o-mini',TIMESTAMP '2026-05-15 09:30:00'),

-- SuperAdmin
(gen_random_uuid(),'00000000-0001-0000-0000-000000000001','SuperAdmin',650,1200,'gpt-4o-mini',TIMESTAMP '2026-05-11 10:00:00'),
(gen_random_uuid(),'00000000-0001-0000-0000-000000000001','SuperAdmin',720,1380,'gpt-4o-mini',TIMESTAMP '2026-05-15 10:30:00'),

-- =====================================================
-- WEEK 2: T5/17 - T5/23 (cách đây ~17-23 ngày)
-- =====================================================

-- Member An
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',295,560,'gpt-4o-mini',TIMESTAMP '2026-05-17 06:55:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',330,680,'gpt-4o-mini',TIMESTAMP '2026-05-19 07:00:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',275,590,'gpt-4o-mini',TIMESTAMP '2026-05-21 07:15:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',340,720,'gpt-4o-mini',TIMESTAMP '2026-05-22 19:00:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',290,610,'gpt-4o-mini',TIMESTAMP '2026-05-23 07:05:00'),

-- Member Cường
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',380,800,'gpt-4o-mini',TIMESTAMP '2026-05-17 08:20:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',310,660,'gpt-4o-mini',TIMESTAMP '2026-05-20 06:50:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',350,750,'gpt-4o-mini',TIMESTAMP '2026-05-22 08:10:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',290,630,'gpt-4o-mini',TIMESTAMP '2026-05-23 07:30:00'),

-- Member Phương
(gen_random_uuid(),'00000000-0004-0000-0000-000000000006','Member',255,540,'gpt-4o-mini',TIMESTAMP '2026-05-18 07:00:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000006','Member',280,600,'gpt-4o-mini',TIMESTAMP '2026-05-21 07:15:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000006','Member',310,650,'gpt-4o-mini',TIMESTAMP '2026-05-23 08:00:00'),

-- Member Bích
(gen_random_uuid(),'00000000-0004-0000-0000-000000000002','Member',300,640,'gpt-4o-mini',TIMESTAMP '2026-05-18 20:00:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000002','Member',270,570,'gpt-4o-mini',TIMESTAMP '2026-05-22 19:30:00'),

-- Member Em
(gen_random_uuid(),'00000000-0004-0000-0000-000000000005','Member',260,540,'gpt-4o-mini',TIMESTAMP '2026-05-19 17:00:00'),

-- Member Dung
(gen_random_uuid(),'00000000-0004-0000-0000-000000000004','Member',230,495,'gpt-4o-mini',TIMESTAMP '2026-05-20 20:15:00'),

-- New Member 007-010 (bulk members từ script)
(gen_random_uuid(),'00000000-0004-0000-0000-000000000007','Member',200,420,'gpt-4o-mini',TIMESTAMP '2026-05-18 19:00:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000008','Member',215,450,'gpt-4o-mini',TIMESTAMP '2026-05-20 18:30:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000009','Member',195,410,'gpt-4o-mini',TIMESTAMP '2026-05-22 19:45:00'),

-- Staff Q1 Sales
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff',405,830,'gpt-4o-mini',TIMESTAMP '2026-05-17 09:30:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff',380,760,'gpt-4o-mini',TIMESTAMP '2026-05-19 10:00:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff',440,890,'gpt-4o-mini',TIMESTAMP '2026-05-21 09:15:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff',360,740,'gpt-4o-mini',TIMESTAMP '2026-05-23 09:30:00'),

-- Staff HeadPT Q1
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff',325,670,'gpt-4o-mini',TIMESTAMP '2026-05-17 07:15:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff',345,710,'gpt-4o-mini',TIMESTAMP '2026-05-20 07:05:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff',300,640,'gpt-4o-mini',TIMESTAMP '2026-05-22 07:30:00'),

-- Staff BranchAdmin Q1
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff',460,940,'gpt-4o-mini',TIMESTAMP '2026-05-17 08:00:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff',420,860,'gpt-4o-mini',TIMESTAMP '2026-05-20 08:30:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff',390,800,'gpt-4o-mini',TIMESTAMP '2026-05-22 08:15:00'),

-- Staff Q7 HeadPT - Trần Văn Phong
(gen_random_uuid(),'00000000-0003-0000-0000-000000000008','Staff',310,660,'gpt-4o-mini',TIMESTAMP '2026-05-17 07:00:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000008','Staff',330,700,'gpt-4o-mini',TIMESTAMP '2026-05-21 07:15:00'),

-- Staff Q7 Sales
(gen_random_uuid(),'00000000-0003-0000-0000-000000000011','Staff',370,750,'gpt-4o-mini',TIMESTAMP '2026-05-18 09:30:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000011','Staff',350,720,'gpt-4o-mini',TIMESTAMP '2026-05-22 10:00:00'),

-- GymOwner
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',560,1080,'gpt-4o-mini',TIMESTAMP '2026-05-17 09:00:00'),
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',610,1180,'gpt-4o-mini',TIMESTAMP '2026-05-20 10:00:00'),
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',520,1020,'gpt-4o-mini',TIMESTAMP '2026-05-23 09:30:00'),

-- SuperAdmin
(gen_random_uuid(),'00000000-0001-0000-0000-000000000001','SuperAdmin',680,1280,'gpt-4o-mini',TIMESTAMP '2026-05-18 10:00:00'),
(gen_random_uuid(),'00000000-0001-0000-0000-000000000001','SuperAdmin',700,1350,'gpt-4o-mini',TIMESTAMP '2026-05-22 11:00:00'),

-- =====================================================
-- WEEK 3: T5/24 - T5/30 (cách đây ~10-16 ngày)
-- =====================================================

-- Member An (peak usage - gần ngày demo)
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',315,670,'gpt-4o-mini',TIMESTAMP '2026-05-24 07:00:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',345,720,'gpt-4o-mini',TIMESTAMP '2026-05-26 06:50:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',295,630,'gpt-4o-mini',TIMESTAMP '2026-05-27 19:15:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',325,690,'gpt-4o-mini',TIMESTAMP '2026-05-29 07:00:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',280,600,'gpt-4o-mini',TIMESTAMP '2026-05-30 07:30:00'),

-- Member Cường
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',365,780,'gpt-4o-mini',TIMESTAMP '2026-05-24 08:00:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',390,820,'gpt-4o-mini',TIMESTAMP '2026-05-26 08:15:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',340,720,'gpt-4o-mini',TIMESTAMP '2026-05-28 07:50:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',310,660,'gpt-4o-mini',TIMESTAMP '2026-05-30 07:00:00'),

-- Member Phương
(gen_random_uuid(),'00000000-0004-0000-0000-000000000006','Member',270,570,'gpt-4o-mini',TIMESTAMP '2026-05-25 07:05:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000006','Member',290,620,'gpt-4o-mini',TIMESTAMP '2026-05-28 08:00:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000006','Member',260,550,'gpt-4o-mini',TIMESTAMP '2026-05-30 08:30:00'),

-- Member Bích
(gen_random_uuid(),'00000000-0004-0000-0000-000000000002','Member',305,650,'gpt-4o-mini',TIMESTAMP '2026-05-24 19:00:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000002','Member',320,680,'gpt-4o-mini',TIMESTAMP '2026-05-27 18:30:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000002','Member',285,600,'gpt-4o-mini',TIMESTAMP '2026-05-30 19:00:00'),

-- More Members
(gen_random_uuid(),'00000000-0004-0000-0000-000000000005','Member',250,530,'gpt-4o-mini',TIMESTAMP '2026-05-25 17:00:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000004','Member',235,500,'gpt-4o-mini',TIMESTAMP '2026-05-26 20:00:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000007','Member',210,440,'gpt-4o-mini',TIMESTAMP '2026-05-27 19:30:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000008','Member',225,475,'gpt-4o-mini',TIMESTAMP '2026-05-29 18:45:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000009','Member',200,425,'gpt-4o-mini',TIMESTAMP '2026-05-30 20:00:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000010','Member',195,415,'gpt-4o-mini',TIMESTAMP '2026-05-28 19:15:00'),

-- Staff
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff',415,840,'gpt-4o-mini',TIMESTAMP '2026-05-24 09:00:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff',395,800,'gpt-4o-mini',TIMESTAMP '2026-05-26 09:30:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff',425,870,'gpt-4o-mini',TIMESTAMP '2026-05-28 09:15:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff',380,770,'gpt-4o-mini',TIMESTAMP '2026-05-30 09:00:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff',335,690,'gpt-4o-mini',TIMESTAMP '2026-05-24 07:30:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff',350,720,'gpt-4o-mini',TIMESTAMP '2026-05-27 07:00:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff',315,660,'gpt-4o-mini',TIMESTAMP '2026-05-30 07:15:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff',475,960,'gpt-4o-mini',TIMESTAMP '2026-05-24 08:00:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff',440,900,'gpt-4o-mini',TIMESTAMP '2026-05-27 08:30:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff',400,820,'gpt-4o-mini',TIMESTAMP '2026-05-30 08:00:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000008','Staff',320,670,'gpt-4o-mini',TIMESTAMP '2026-05-25 07:30:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000011','Staff',360,740,'gpt-4o-mini',TIMESTAMP '2026-05-27 09:45:00'),

-- Staff Thủ Đức BranchAdmin
(gen_random_uuid(),'00000000-0003-0000-0000-000000000015','Staff',390,800,'gpt-4o-mini',TIMESTAMP '2026-05-25 08:30:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000015','Staff',410,840,'gpt-4o-mini',TIMESTAMP '2026-05-29 09:00:00'),

-- GymOwner (tăng usage cuối tháng - review)
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',590,1150,'gpt-4o-mini',TIMESTAMP '2026-05-24 09:00:00'),
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',640,1250,'gpt-4o-mini',TIMESTAMP '2026-05-27 10:00:00'),
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',680,1320,'gpt-4o-mini',TIMESTAMP '2026-05-30 09:30:00'),

-- SuperAdmin
(gen_random_uuid(),'00000000-0001-0000-0000-000000000001','SuperAdmin',710,1360,'gpt-4o-mini',TIMESTAMP '2026-05-25 10:00:00'),
(gen_random_uuid(),'00000000-0001-0000-0000-000000000001','SuperAdmin',690,1320,'gpt-4o-mini',TIMESTAMP '2026-05-29 11:00:00'),

-- =====================================================
-- WEEK 4: T5/31 - T6/8 (cách đây 1-9 ngày — tuần demo)
-- =====================================================

-- Member An (tập trước ngày demo)
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',320,680,'gpt-4o-mini',TIMESTAMP '2026-05-31 07:00:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',300,640,'gpt-4o-mini',TIMESTAMP '2026-06-02 06:55:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',315,670,'gpt-4o-mini',TIMESTAMP '2026-06-04 07:10:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',290,615,'gpt-4o-mini',TIMESTAMP '2026-06-06 19:15:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',340,720,'gpt-4o-mini',TIMESTAMP '2026-06-08 07:05:00'),

-- Member Cường
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',355,760,'gpt-4o-mini',TIMESTAMP '2026-05-31 08:10:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',380,815,'gpt-4o-mini',TIMESTAMP '2026-06-02 08:20:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',345,740,'gpt-4o-mini',TIMESTAMP '2026-06-05 07:50:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',320,680,'gpt-4o-mini',TIMESTAMP '2026-06-07 08:00:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',360,775,'gpt-4o-mini',TIMESTAMP '2026-06-08 06:40:00'),

-- Member Phương
(gen_random_uuid(),'00000000-0004-0000-0000-000000000006','Member',275,585,'gpt-4o-mini',TIMESTAMP '2026-06-01 07:00:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000006','Member',290,620,'gpt-4o-mini',TIMESTAMP '2026-06-04 07:30:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000006','Member',265,560,'gpt-4o-mini',TIMESTAMP '2026-06-07 08:00:00'),

-- Member Bích
(gen_random_uuid(),'00000000-0004-0000-0000-000000000002','Member',310,665,'gpt-4o-mini',TIMESTAMP '2026-06-01 19:30:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000002','Member',295,625,'gpt-4o-mini',TIMESTAMP '2026-06-05 20:00:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000002','Member',330,700,'gpt-4o-mini',TIMESTAMP '2026-06-08 19:15:00'),

-- More Members
(gen_random_uuid(),'00000000-0004-0000-0000-000000000005','Member',260,550,'gpt-4o-mini',TIMESTAMP '2026-06-01 17:00:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000004','Member',240,510,'gpt-4o-mini',TIMESTAMP '2026-06-03 20:30:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000007','Member',220,465,'gpt-4o-mini',TIMESTAMP '2026-06-02 19:00:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000008','Member',215,455,'gpt-4o-mini',TIMESTAMP '2026-06-04 18:45:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000009','Member',205,435,'gpt-4o-mini',TIMESTAMP '2026-06-06 20:00:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000010','Member',198,420,'gpt-4o-mini',TIMESTAMP '2026-06-07 19:30:00'),

-- Staff (tuần trước demo - busy xem report)
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff',430,875,'gpt-4o-mini',TIMESTAMP '2026-05-31 09:15:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff',445,900,'gpt-4o-mini',TIMESTAMP '2026-06-02 09:00:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff',410,835,'gpt-4o-mini',TIMESTAMP '2026-06-04 09:30:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff',425,865,'gpt-4o-mini',TIMESTAMP '2026-06-06 09:15:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff',460,930,'gpt-4o-mini',TIMESTAMP '2026-06-08 09:00:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff',340,705,'gpt-4o-mini',TIMESTAMP '2026-05-31 07:15:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff',360,740,'gpt-4o-mini',TIMESTAMP '2026-06-03 07:00:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff',325,675,'gpt-4o-mini',TIMESTAMP '2026-06-06 07:30:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff',380,780,'gpt-4o-mini',TIMESTAMP '2026-06-08 07:00:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff',490,990,'gpt-4o-mini',TIMESTAMP '2026-05-31 08:00:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff',465,950,'gpt-4o-mini',TIMESTAMP '2026-06-02 08:30:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff',445,910,'gpt-4o-mini',TIMESTAMP '2026-06-05 08:15:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff',510,1020,'gpt-4o-mini',TIMESTAMP '2026-06-08 08:00:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000008','Staff',340,705,'gpt-4o-mini',TIMESTAMP '2026-06-01 07:30:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000008','Staff',355,730,'gpt-4o-mini',TIMESTAMP '2026-06-05 07:15:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000011','Staff',375,760,'gpt-4o-mini',TIMESTAMP '2026-06-02 09:30:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000011','Staff',390,795,'gpt-4o-mini',TIMESTAMP '2026-06-06 10:00:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000015','Staff',405,820,'gpt-4o-mini',TIMESTAMP '2026-06-01 08:30:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000015','Staff',430,870,'gpt-4o-mini',TIMESTAMP '2026-06-05 08:45:00'),

-- GymOwner (cuối tháng + đầu tháng - báo cáo)
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',620,1210,'gpt-4o-mini',TIMESTAMP '2026-05-31 09:00:00'),
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',700,1360,'gpt-4o-mini',TIMESTAMP '2026-06-01 09:30:00'),
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',580,1130,'gpt-4o-mini',TIMESTAMP '2026-06-03 10:00:00'),
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',650,1270,'gpt-4o-mini',TIMESTAMP '2026-06-05 09:30:00'),
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',720,1400,'gpt-4o-mini',TIMESTAMP '2026-06-08 10:00:00'),

-- SuperAdmin (regular monitoring)
(gen_random_uuid(),'00000000-0001-0000-0000-000000000001','SuperAdmin',730,1410,'gpt-4o-mini',TIMESTAMP '2026-06-01 10:00:00'),
(gen_random_uuid(),'00000000-0001-0000-0000-000000000001','SuperAdmin',760,1450,'gpt-4o-mini',TIMESTAMP '2026-06-04 11:00:00'),
(gen_random_uuid(),'00000000-0001-0000-0000-000000000001','SuperAdmin',745,1430,'gpt-4o-mini',TIMESTAMP '2026-06-07 10:30:00'),
(gen_random_uuid(),'00000000-0001-0000-0000-000000000001','SuperAdmin',780,1490,'gpt-4o-mini',TIMESTAMP '2026-06-08 11:00:00');

-- =====================================================
-- AI TOOL EXECUTION LOGS
-- Phân bố: ~350 records trong 30 ngày
-- Success rate: ~95% (333 success, 17 failed)
-- Tools: các công cụ AI theo RBAC role
-- =====================================================
INSERT INTO "AIToolExecutionLogs"
    ("Id","UserId","UserRole","StaffPosition","ToolName",
     "ArgumentsJson","Success","DurationMs","ErrorMessage","ExecutedAt")
VALUES

-- =====================================================
-- MEMBER TOOL CALLS (get_my_schedule, get_attendance_summary, get_membership)
-- =====================================================

-- Member An - get_my_schedule
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',NULL,'get_my_schedule','{"week":"current"}',true,245,NULL,TIMESTAMP '2026-05-10 06:46:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',NULL,'get_attendance_summary','{"month":5,"year":2026}',true,312,NULL,TIMESTAMP '2026-05-12 07:11:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',NULL,'get_membership','{}',true,198,NULL,TIMESTAMP '2026-05-14 06:51:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',NULL,'get_my_schedule','{"week":"next"}',true,265,NULL,TIMESTAMP '2026-05-16 07:06:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',NULL,'get_attendance_summary','{"month":5,"year":2026}',true,290,NULL,TIMESTAMP '2026-05-19 07:01:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',NULL,'get_my_schedule','{"week":"current"}',true,235,NULL,TIMESTAMP '2026-05-22 19:01:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',NULL,'get_membership','{}',true,210,NULL,TIMESTAMP '2026-05-26 06:51:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',NULL,'get_my_schedule','{"week":"current"}',true,255,NULL,TIMESTAMP '2026-05-29 07:01:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',NULL,'get_attendance_summary','{"month":5,"year":2026}',true,305,NULL,TIMESTAMP '2026-05-31 07:01:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',NULL,'get_my_schedule','{"week":"current"}',true,248,NULL,TIMESTAMP '2026-06-02 06:56:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',NULL,'get_attendance_summary','{"month":6,"year":2026}',true,298,NULL,TIMESTAMP '2026-06-04 07:11:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','Member',NULL,'get_membership','{}',true,205,NULL,TIMESTAMP '2026-06-08 07:06:00'),

-- Member Cường - tool calls
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',NULL,'get_membership','{}',true,215,NULL,TIMESTAMP '2026-05-10 08:31:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',NULL,'get_my_schedule','{"week":"current"}',true,270,NULL,TIMESTAMP '2026-05-13 17:46:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',NULL,'get_attendance_summary','{"month":5,"year":2026}',true,315,NULL,TIMESTAMP '2026-05-17 08:21:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',NULL,'get_my_schedule','{"week":"next"}',true,260,NULL,TIMESTAMP '2026-05-22 08:11:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',NULL,'get_membership','{}',true,208,NULL,TIMESTAMP '2026-05-26 08:16:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',NULL,'get_attendance_summary','{"month":5,"year":2026}',true,322,NULL,TIMESTAMP '2026-05-29 07:01:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',NULL,'get_my_schedule','{"week":"current"}',true,245,NULL,TIMESTAMP '2026-06-02 08:21:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',NULL,'get_attendance_summary','{"month":6,"year":2026}',true,310,NULL,TIMESTAMP '2026-06-05 07:51:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','Member',NULL,'get_membership','{}',true,198,NULL,TIMESTAMP '2026-06-08 06:41:00'),

-- Member Phương - tool calls (Yoga focused)
(gen_random_uuid(),'00000000-0004-0000-0000-000000000006','Member',NULL,'get_my_schedule','{"week":"current"}',true,250,NULL,TIMESTAMP '2026-05-11 07:01:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000006','Member',NULL,'get_attendance_summary','{"month":5,"year":2026}',true,295,NULL,TIMESTAMP '2026-05-18 07:01:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000006','Member',NULL,'get_my_schedule','{"week":"next"}',true,262,NULL,TIMESTAMP '2026-05-25 07:06:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000006','Member',NULL,'get_membership','{}',true,205,NULL,TIMESTAMP '2026-06-01 07:01:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000006','Member',NULL,'get_my_schedule','{"week":"current"}',true,248,NULL,TIMESTAMP '2026-06-07 08:01:00'),

-- Member Bích - tool calls
(gen_random_uuid(),'00000000-0004-0000-0000-000000000002','Member',NULL,'get_membership','{}',true,210,NULL,TIMESTAMP '2026-05-11 19:31:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000002','Member',NULL,'get_my_schedule','{"week":"current"}',true,255,NULL,TIMESTAMP '2026-05-18 20:01:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000002','Member',NULL,'get_attendance_summary','{"month":5,"year":2026}',true,308,NULL,TIMESTAMP '2026-05-27 18:31:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000002','Member',NULL,'get_membership','{}',true,200,NULL,TIMESTAMP '2026-06-05 20:01:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000002','Member',NULL,'get_my_schedule','{"week":"current"}',true,260,NULL,TIMESTAMP '2026-06-08 19:16:00'),

-- Member Em - tool calls
(gen_random_uuid(),'00000000-0004-0000-0000-000000000005','Member',NULL,'get_membership','{}',true,212,NULL,TIMESTAMP '2026-05-13 17:01:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000005','Member',NULL,'get_my_schedule','{"week":"current"}',true,258,NULL,TIMESTAMP '2026-05-25 17:01:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000005','Member',NULL,'get_attendance_summary','{"month":5,"year":2026}',true,302,NULL,TIMESTAMP '2026-06-01 17:01:00'),

-- Member tool calls with errors (5% fail rate)
(gen_random_uuid(),'00000000-0004-0000-0000-000000000004','Member',NULL,'get_my_schedule','{"week":"current"}',false,5050,'Tool timeout: upstream data service unavailable',TIMESTAMP '2026-05-16 20:31:00'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000009','Member',NULL,'get_membership','{}',false,3200,'Database connection timeout',TIMESTAMP '2026-05-22 19:46:00'),

-- =====================================================
-- SALES STAFF TOOL CALLS (get_lead_summary, sales_funnel)
-- =====================================================

-- Sales Hoàng Thị Ngọc (Q1)
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff','Sales','get_lead_summary','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001","period":"this_month"}',true,380,NULL,TIMESTAMP '2026-05-10 09:16:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff','Sales','sales_funnel','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001"}',true,420,NULL,TIMESTAMP '2026-05-12 10:31:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff','Sales','get_lead_summary','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001","period":"this_week"}',true,355,NULL,TIMESTAMP '2026-05-14 09:01:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff','Sales','sales_funnel','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001"}',true,435,NULL,TIMESTAMP '2026-05-17 09:31:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff','Sales','get_lead_summary','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001","period":"this_month"}',true,368,NULL,TIMESTAMP '2026-05-19 10:01:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff','Sales','sales_funnel','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001"}',true,445,NULL,TIMESTAMP '2026-05-21 09:16:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff','Sales','get_lead_summary','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001","period":"this_week"}',true,372,NULL,TIMESTAMP '2026-05-24 09:01:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff','Sales','sales_funnel','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001"}',true,458,NULL,TIMESTAMP '2026-05-26 09:31:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff','Sales','get_lead_summary','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001","period":"this_month"}',true,365,NULL,TIMESTAMP '2026-05-28 09:16:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff','Sales','sales_funnel','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001"}',true,440,NULL,TIMESTAMP '2026-05-31 09:16:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff','Sales','get_lead_summary','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001","period":"this_month"}',true,385,NULL,TIMESTAMP '2026-06-02 09:01:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff','Sales','sales_funnel','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001"}',true,450,NULL,TIMESTAMP '2026-06-04 09:31:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff','Sales','get_lead_summary','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001","period":"this_week"}',true,360,NULL,TIMESTAMP '2026-06-06 09:16:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff','Sales','sales_funnel','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001"}',true,425,NULL,TIMESTAMP '2026-06-08 09:01:00'),

-- Sales Q7 - Bùi Thành Long
(gen_random_uuid(),'00000000-0003-0000-0000-000000000011','Staff','Sales','get_lead_summary','{"branchId":"aaaaaaaa-0001-0000-0000-000000000002","period":"this_month"}',true,365,NULL,TIMESTAMP '2026-05-18 09:31:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000011','Staff','Sales','sales_funnel','{"branchId":"aaaaaaaa-0001-0000-0000-000000000002"}',true,415,NULL,TIMESTAMP '2026-05-22 10:01:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000011','Staff','Sales','get_lead_summary','{"branchId":"aaaaaaaa-0001-0000-0000-000000000002","period":"this_month"}',true,378,NULL,TIMESTAMP '2026-05-27 09:46:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000011','Staff','Sales','sales_funnel','{"branchId":"aaaaaaaa-0001-0000-0000-000000000002"}',true,430,NULL,TIMESTAMP '2026-06-02 09:31:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000011','Staff','Sales','get_lead_summary','{"branchId":"aaaaaaaa-0001-0000-0000-000000000002","period":"this_week"}',true,355,NULL,TIMESTAMP '2026-06-06 10:01:00'),

-- Sales with occasional failure
(gen_random_uuid(),'00000000-0003-0000-0000-000000000005','Staff','Sales','sales_funnel','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001"}',false,8200,'Query timeout: too many records in date range',TIMESTAMP '2026-05-23 09:31:00'),

-- =====================================================
-- PT/HeadPT TOOL CALLS (my_teaching_schedule, get_class_attendees)
-- =====================================================

-- HeadPT Đỗ Hải Đăng (Q1)
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff','HeadPT','my_teaching_schedule','{"date":"today"}',true,280,NULL,TIMESTAMP '2026-05-10 07:31:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff','HeadPT','my_teaching_schedule','{"date":"today"}',true,265,NULL,TIMESTAMP '2026-05-12 07:01:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff','HeadPT','my_teaching_schedule','{"week":"current"}',true,310,NULL,TIMESTAMP '2026-05-15 07:16:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff','HeadPT','my_teaching_schedule','{"date":"today"}',true,275,NULL,TIMESTAMP '2026-05-17 07:16:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff','HeadPT','my_teaching_schedule','{"date":"today"}',true,258,NULL,TIMESTAMP '2026-05-20 07:06:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff','HeadPT','my_teaching_schedule','{"week":"current"}',true,295,NULL,TIMESTAMP '2026-05-22 07:31:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff','HeadPT','my_teaching_schedule','{"date":"today"}',true,270,NULL,TIMESTAMP '2026-05-24 07:31:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff','HeadPT','my_teaching_schedule','{"date":"today"}',true,262,NULL,TIMESTAMP '2026-05-27 07:01:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff','HeadPT','my_teaching_schedule','{"week":"current"}',true,308,NULL,TIMESTAMP '2026-05-30 07:16:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff','HeadPT','my_teaching_schedule','{"date":"today"}',true,268,NULL,TIMESTAMP '2026-05-31 07:16:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff','HeadPT','my_teaching_schedule','{"date":"today"}',true,255,NULL,TIMESTAMP '2026-06-03 07:01:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff','HeadPT','my_teaching_schedule','{"week":"current"}',true,302,NULL,TIMESTAMP '2026-06-06 07:31:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000002','Staff','HeadPT','my_teaching_schedule','{"date":"today"}',true,278,NULL,TIMESTAMP '2026-06-08 07:01:00'),

-- HeadPT Q7 - Trần Văn Phong
(gen_random_uuid(),'00000000-0003-0000-0000-000000000008','Staff','HeadPT','my_teaching_schedule','{"date":"today"}',true,272,NULL,TIMESTAMP '2026-05-17 07:01:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000008','Staff','HeadPT','my_teaching_schedule','{"week":"current"}',true,305,NULL,TIMESTAMP '2026-05-21 07:16:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000008','Staff','HeadPT','my_teaching_schedule','{"date":"today"}',true,265,NULL,TIMESTAMP '2026-05-25 07:31:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000008','Staff','HeadPT','my_teaching_schedule','{"date":"today"}',true,278,NULL,TIMESTAMP '2026-06-01 07:31:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000008','Staff','HeadPT','my_teaching_schedule','{"week":"current"}',true,312,NULL,TIMESTAMP '2026-06-05 07:16:00'),

-- =====================================================
-- BRANCH ADMIN TOOL CALLS (branch_revenue, checkin_lookup, get_member_inactives)
-- =====================================================

-- BranchAdmin Q1 - Nguyễn Thị Lan
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff','BranchAdmin','branch_revenue','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001","period":"this_month"}',true,485,NULL,TIMESTAMP '2026-05-10 08:01:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff','BranchAdmin','checkin_lookup','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001","date":"today"}',true,320,NULL,TIMESTAMP '2026-05-12 08:31:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff','BranchAdmin','branch_revenue','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001","period":"last_month"}',true,520,NULL,TIMESTAMP '2026-05-14 08:46:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff','BranchAdmin','checkin_lookup','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001","date":"today"}',true,308,NULL,TIMESTAMP '2026-05-17 08:01:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff','BranchAdmin','branch_revenue','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001","period":"this_month"}',true,498,NULL,TIMESTAMP '2026-05-20 08:31:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff','BranchAdmin','checkin_lookup','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001","date":"today"}',true,315,NULL,TIMESTAMP '2026-05-22 08:16:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff','BranchAdmin','branch_revenue','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001","period":"this_month"}',true,510,NULL,TIMESTAMP '2026-05-24 08:01:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff','BranchAdmin','checkin_lookup','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001","date":"today"}',true,295,NULL,TIMESTAMP '2026-05-27 08:31:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff','BranchAdmin','branch_revenue','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001","period":"this_month"}',true,525,NULL,TIMESTAMP '2026-05-30 08:01:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff','BranchAdmin','branch_revenue','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001","period":"last_month"}',true,545,NULL,TIMESTAMP '2026-05-31 08:01:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff','BranchAdmin','checkin_lookup','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001","date":"today"}',true,310,NULL,TIMESTAMP '2026-06-02 08:31:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff','BranchAdmin','branch_revenue','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001","period":"this_month"}',true,498,NULL,TIMESTAMP '2026-06-05 08:16:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff','BranchAdmin','checkin_lookup','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001","date":"today"}',true,305,NULL,TIMESTAMP '2026-06-08 08:01:00'),

-- BranchAdmin with error
(gen_random_uuid(),'00000000-0003-0000-0000-000000000001','Staff','BranchAdmin','branch_revenue','{"branchId":"aaaaaaaa-0001-0000-0000-000000000001","period":"last_quarter"}',false,6800,'Query complexity exceeded: too many joins for this period range',TIMESTAMP '2026-05-19 09:00:00'),

-- BranchAdmin Thủ Đức
(gen_random_uuid(),'00000000-0003-0000-0000-000000000015','Staff','BranchAdmin','branch_revenue','{"branchId":"aaaaaaaa-0001-0000-0000-000000000003","period":"this_month"}',true,475,NULL,TIMESTAMP '2026-05-25 08:31:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000015','Staff','BranchAdmin','checkin_lookup','{"branchId":"aaaaaaaa-0001-0000-0000-000000000003","date":"today"}',true,298,NULL,TIMESTAMP '2026-05-29 09:01:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000015','Staff','BranchAdmin','branch_revenue','{"branchId":"aaaaaaaa-0001-0000-0000-000000000003","period":"this_month"}',true,490,NULL,TIMESTAMP '2026-06-01 08:31:00'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000015','Staff','BranchAdmin','checkin_lookup','{"branchId":"aaaaaaaa-0001-0000-0000-000000000003","date":"today"}',true,302,NULL,TIMESTAMP '2026-06-05 08:46:00'),

-- =====================================================
-- GYMOWNER TOOL CALLS (global_revenue, system_dashboard, sales_funnel)
-- =====================================================

(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',NULL,'global_revenue','{"period":"this_month"}',true,620,NULL,TIMESTAMP '2026-05-10 09:01:00'),
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',NULL,'sales_funnel','{"period":"this_month"}',true,580,NULL,TIMESTAMP '2026-05-12 10:01:00'),
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',NULL,'global_revenue','{"period":"last_month"}',true,680,NULL,TIMESTAMP '2026-05-15 09:31:00'),
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',NULL,'global_revenue','{"period":"this_month"}',true,640,NULL,TIMESTAMP '2026-05-17 09:01:00'),
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',NULL,'sales_funnel','{"period":"this_quarter"}',true,720,NULL,TIMESTAMP '2026-05-20 10:01:00'),
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',NULL,'global_revenue','{"period":"this_month"}',true,660,NULL,TIMESTAMP '2026-05-24 09:01:00'),
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',NULL,'global_revenue','{"period":"last_6_months"}',true,890,NULL,TIMESTAMP '2026-05-27 10:01:00'),
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',NULL,'global_revenue','{"period":"last_month"}',true,710,NULL,TIMESTAMP '2026-05-31 09:01:00'),
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',NULL,'global_revenue','{"period":"this_month"}',true,635,NULL,TIMESTAMP '2026-06-01 09:31:00'),
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',NULL,'sales_funnel','{"period":"this_month"}',true,595,NULL,TIMESTAMP '2026-06-03 10:01:00'),
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',NULL,'global_revenue','{"period":"this_month"}',true,650,NULL,TIMESTAMP '2026-06-05 09:31:00'),
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',NULL,'global_revenue','{"period":"last_6_months"}',true,920,NULL,TIMESTAMP '2026-06-08 10:01:00'),

-- GymOwner with error
(gen_random_uuid(),'00000000-0002-0000-0000-000000000001','GymOwner',NULL,'global_revenue','{"period":"last_year"}',false,12500,'Query timeout: annual aggregation takes too long',TIMESTAMP '2026-05-22 10:01:00'),

-- =====================================================
-- SUPERADMIN TOOL CALLS (system_dashboard, global_revenue, all tools)
-- =====================================================

(gen_random_uuid(),'00000000-0001-0000-0000-000000000001','SuperAdmin',NULL,'system_dashboard','{}',true,750,NULL,TIMESTAMP '2026-05-11 10:01:00'),
(gen_random_uuid(),'00000000-0001-0000-0000-000000000001','SuperAdmin',NULL,'global_revenue','{"period":"this_month","breakdown":"branch"}',true,820,NULL,TIMESTAMP '2026-05-15 10:31:00'),
(gen_random_uuid(),'00000000-0001-0000-0000-000000000001','SuperAdmin',NULL,'system_dashboard','{}',true,740,NULL,TIMESTAMP '2026-05-18 10:01:00'),
(gen_random_uuid(),'00000000-0001-0000-0000-000000000001','SuperAdmin',NULL,'global_revenue','{"period":"last_6_months","breakdown":"role"}',true,950,NULL,TIMESTAMP '2026-05-22 11:01:00'),
(gen_random_uuid(),'00000000-0001-0000-0000-000000000001','SuperAdmin',NULL,'system_dashboard','{}',true,770,NULL,TIMESTAMP '2026-05-25 10:01:00'),
(gen_random_uuid(),'00000000-0001-0000-0000-000000000001','SuperAdmin',NULL,'global_revenue','{"period":"this_month","breakdown":"package"}',true,845,NULL,TIMESTAMP '2026-05-29 11:01:00'),
(gen_random_uuid(),'00000000-0001-0000-0000-000000000001','SuperAdmin',NULL,'system_dashboard','{}',true,762,NULL,TIMESTAMP '2026-06-01 10:01:00'),
(gen_random_uuid(),'00000000-0001-0000-0000-000000000001','SuperAdmin',NULL,'global_revenue','{"period":"last_month","breakdown":"branch"}',true,880,NULL,TIMESTAMP '2026-06-04 11:01:00'),
(gen_random_uuid(),'00000000-0001-0000-0000-000000000001','SuperAdmin',NULL,'system_dashboard','{}',true,755,NULL,TIMESTAMP '2026-06-07 10:31:00'),
(gen_random_uuid(),'00000000-0001-0000-0000-000000000001','SuperAdmin',NULL,'global_revenue','{"period":"this_month","breakdown":"branch"}',true,835,NULL,TIMESTAMP '2026-06-08 11:01:00'),

-- SuperAdmin with errors (rare)
(gen_random_uuid(),'00000000-0001-0000-0000-000000000001','SuperAdmin',NULL,'system_dashboard','{}',false,15200,'Service temporarily unavailable',TIMESTAMP '2026-05-19 11:00:00'),
(gen_random_uuid(),'00000000-0001-0000-0000-000000000001','SuperAdmin',NULL,'global_revenue','{"period":"all_time"}',false,30000,'Query timeout: all-time aggregation not supported',TIMESTAMP '2026-05-28 10:30:00');


-- =====================================================
-- AI LOGS BULK GENERATION
-- =====================================================
DO $$
DECLARE
  member_ids uuid[];
  staff_ids  uuid[];
  owner_id   uuid := '00000000-0002-0000-0000-000000000001'::uuid;
  admin_id   uuid := '00000000-0001-0000-0000-000000000001'::uuid;
  
  m_count    int;
  s_count    int;
  
  target_user uuid;
  target_role text;
  target_pos  text;
  
  tools      text[] := ARRAY['get_my_schedule', 'get_attendance_summary', 'get_membership', 'get_lead_summary', 'sales_funnel', 'my_teaching_schedule', 'branch_revenue', 'global_revenue', 'system_dashboard'];
  t_count    int := 9;
  tool_name  text;
  
  n_created  timestamptz;
BEGIN
  SELECT ARRAY(SELECT "UserId" FROM "Members") INTO member_ids;
  SELECT ARRAY(SELECT "UserId" FROM "Staffs") INTO staff_ids;
  
  m_count := array_length(member_ids, 1);
  s_count := array_length(staff_ids, 1);

  -- 1. Generate 250 AITokenUsageLogs
  FOR k IN 1..250 LOOP
    n_created := NOW() - (k % 30 || ' days')::interval - (k % 24 || ' hours')::interval;
    
    IF k % 2 = 0 THEN
      target_user := member_ids[(k % m_count) + 1];
      target_role := 'Member';
    ELSE
      target_user := staff_ids[(k % s_count) + 1];
      target_role := 'Staff';
    END IF;

    INSERT INTO "AITokenUsageLogs"
        ("Id","UserId","UserRole","PromptTokens","CompletionTokens","Model","CreatedAt")
    VALUES (
        gen_random_uuid(),
        target_user,
        target_role,
        200 + (k % 300),
        300 + (k % 500),
        'gpt-4o-mini',
        n_created
    );
  END LOOP;

  -- 2. Generate 400 AIToolExecutionLogs
  FOR k IN 1..400 LOOP
    n_created := NOW() - (k % 30 || ' days')::interval - (k % 24 || ' hours')::interval;
    tool_name := tools[(k % t_count) + 1];

    -- Determine user role and position based on tool type
    IF tool_name IN ('get_my_schedule', 'get_attendance_summary', 'get_membership') THEN
      target_user := member_ids[(k % m_count) + 1];
      target_role := 'Member';
      target_pos  := null;
    ELSIF tool_name IN ('get_lead_summary', 'sales_funnel') THEN
      target_user := staff_ids[(k % s_count) + 1];
      target_role := 'Staff';
      target_pos  := 'Sales';
    ELSIF tool_name = 'my_teaching_schedule' THEN
      target_user := staff_ids[(k % s_count) + 1];
      target_role := 'Staff';
      target_pos  := 'PT';
    ELSIF tool_name = 'branch_revenue' THEN
      target_user := staff_ids[(k % s_count) + 1];
      target_role := 'Staff';
      target_pos  := 'BranchAdmin';
    ELSIF tool_name = 'global_revenue' THEN
      target_user := owner_id;
      target_role := 'GymOwner';
      target_pos  := null;
    ELSE -- system_dashboard
      target_user := admin_id;
      target_role := 'SuperAdmin';
      target_pos  := null;
    END IF;

    INSERT INTO "AIToolExecutionLogs"
        ("Id","UserId","UserRole","StaffPosition","ToolName",
         "ArgumentsJson","Success","DurationMs","ErrorMessage","ExecutedAt")
    VALUES (
        gen_random_uuid(),
        target_user,
        target_role,
        target_pos,
        tool_name,
        '{"demo":true}',
        (k % 20 != 0), -- 95% success rate
        150 + (k % 1200),
        CASE WHEN k % 20 = 0 THEN 'Timeout connecting to backend service' ELSE null END,
        n_created
    );
  END LOOP;
END $$;
