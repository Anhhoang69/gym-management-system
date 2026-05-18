-- =====================================================
-- 11_CLASSES.SQL
-- Seed lớp học – đa dạng loại và trạng thái
-- =====================================================

-- =====================================================
-- CLASSES
-- ClassType: Yoga, Boxing, Cardio, Crossfit, Zumba, PersonalTraining
-- ClassStatus: Scheduled, Cancelled, Completed
-- =====================================================
INSERT INTO "Classes"
    ("ClassId","Title","Description","Date","StartTime","EndTime",
     "ClassType","Status","Capacity","MinCapacity",
     "TrainerStaffId","RoomId")
VALUES

-- Lớp 1: Yoga - COMPLETED
(
    'cccccccc-0002-0000-0000-000000000001',
    'Yoga Sức Sống Buổi Sáng',
    'Lớp Yoga tập trung vào hít thở và tư thế cơ bản, giúp thư giãn và tăng cường độ dẻo dai. Phù hợp cho người mới bắt đầu và người đã có kinh nghiệm.',
    CURRENT_DATE - interval '14 days',
    '07:00', '08:00',
    'Yoga', 'Completed', 20, 5,
    '00000000-0003-0000-0000-000000000004',
    'bbbbbbbb-0001-0000-0000-000000000001'
),

-- Lớp 2: Cardio - COMPLETED
(
    'cccccccc-0002-0000-0000-000000000002',
    'Cardio Đốt Cháy Mỡ',
    'Bài tập cardio cường độ vừa, kết hợp nhảy dây, đi bộ nhanh và đạp xe tĩnh. Mục tiêu đốt mỡ và cải thiện sức bền tim mạch.',
    CURRENT_DATE - interval '7 days',
    '17:30', '18:30',
    'Cardio', 'Completed', 25, 5,
    '00000000-0003-0000-0000-000000000003',
    'bbbbbbbb-0001-0000-0000-000000000002'
),

-- Lớp 3: Yoga - SCHEDULED (hôm nay)
(
    'cccccccc-0002-0000-0000-000000000003',
    'Yoga Thư Giãn Buổi Sáng',
    'Kết hợp các tư thế Yoga phục hồi và kỹ thuật thở sâu. Giúp giảm stress, tăng sự tập trung và cải thiện giấc ngủ.',
    CURRENT_DATE,
    '07:00', '08:00',
    'Yoga', 'Scheduled', 20, 5,
    '00000000-0003-0000-0000-000000000004',
    'bbbbbbbb-0001-0000-0000-000000000001'
),

-- Lớp 4: Boxing - SCHEDULED (ngày mai)
(
    'cccccccc-0002-0000-0000-000000000004',
    'Boxing Cơ Bản',
    'Học kỹ thuật đấm, đỡ và di chuyển cơ bản trong boxing. Bài tập kết hợp cardio và kỹ năng tự vệ. Mang lại cảm giác tự tin và sức mạnh.',
    CURRENT_DATE + interval '1 day',
    '18:00', '19:30',
    'Boxing', 'Scheduled', 15, 4,
    '00000000-0003-0000-0000-000000000005',
    'bbbbbbbb-0001-0000-0000-000000000003'
),

-- Lớp 5: Zumba - SCHEDULED (ngày kia) - ĐÃ ĐẦY CHỖ
(
    'cccccccc-0002-0000-0000-000000000005',
    'Zumba Party - Vũ Điệu Nhiệt Đới',
    'Lớp Zumba sôi động với nhạc Latin và Caribê. Kết hợp múa và aerobic, đốt cháy calo trong không khí vui tươi. Không cần kinh nghiệm múa trước.',
    CURRENT_DATE + interval '2 days',
    '19:00', '20:00',
    'Zumba', 'Scheduled', 22, 5,
    '00000000-0003-0000-0000-000000000004',
    'bbbbbbbb-0001-0000-0000-000000000007'
),

-- Lớp 6: CrossFit - SCHEDULED
(
    'cccccccc-0002-0000-0000-000000000006',
    'CrossFit Cường Độ Cao (HIIT)',
    'Lớp CrossFit với các bài WOD (Workout Of the Day) đa dạng. Kết hợp sức mạnh, sức bền và linh hoạt. Phù hợp người đã có nền tảng thể lực tốt.',
    CURRENT_DATE + interval '3 days',
    '06:00', '07:00',
    'Crossfit', 'Scheduled', 20, 5,
    '00000000-0003-0000-0000-000000000005',
    'bbbbbbbb-0001-0000-0000-000000000009'
),

-- Lớp 7: PT - SCHEDULED (buổi PT cá nhân)
(
    'cccccccc-0002-0000-0000-000000000007',
    'PT Cá Nhân - Cường',
    'Buổi PT cá nhân dành riêng cho hội viên Lê Đức Cường. Chương trình tăng cơ phần trên cơ thể.',
    CURRENT_DATE + interval '1 day',
    '09:00', '10:00',
    'PersonalTraining', 'Scheduled', 1, 1,
    '00000000-0003-0000-0000-000000000005',
    'bbbbbbbb-0001-0000-0000-000000000004'
),

-- Lớp 8: Cardio - CANCELLED
(
    'cccccccc-0002-0000-0000-000000000008',
    'Cardio Nhảy Dây',
    'Lớp tập nhảy dây cường độ cao, đốt cháy nhiều calo trong thời gian ngắn.',
    CURRENT_DATE - interval '3 days',
    '17:00', '18:00',
    'Cardio', 'Cancelled', 25, 8,
    '00000000-0003-0000-0000-000000000003',
    'bbbbbbbb-0001-0000-0000-000000000002'
),

-- Lớp 9: Yoga - COMPLETED (tuần trước - Q7)
(
    'cccccccc-0002-0000-0000-000000000009',
    'Yoga Nâng Cao - Cân Bằng & Linh Hoạt',
    'Lớp Yoga nâng cao với các tư thế thăng bằng và ngược đầu. Yêu cầu có nền tảng Yoga cơ bản.',
    CURRENT_DATE - interval '10 days',
    '08:00', '09:30',
    'Yoga', 'Completed', 18, 5,
    '00000000-0003-0000-0000-000000000004',
    'bbbbbbbb-0001-0000-0000-000000000006'
),

-- Lớp 10: Zumba - SCHEDULED (Q7 tuần sau)
(
    'cccccccc-0002-0000-0000-000000000010',
    'Zumba Fitness Weekend',
    'Buổi Zumba cuối tuần đặc biệt với playlist nhạc mới cập nhật. Thích hợp mọi lứa tuổi và thể lực.',
    CURRENT_DATE + interval '5 days',
    '09:00', '10:00',
    'Zumba', 'Scheduled', 22, 5,
    '00000000-0003-0000-0000-000000000004',
    'bbbbbbbb-0001-0000-0000-000000000007'
);
