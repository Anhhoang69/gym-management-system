-- =====================================================
-- 18_AI_DATA.SQL
-- Seed dữ liệu AI: ChatHistories, AIRecommendations, AIContextCaches
-- =====================================================

-- =====================================================-- =====================================================
-- CHAT HISTORIES (AI Assistant conversations)
-- UserId = MemberId for members, UserRole = 'Member'
-- =====================================================
INSERT INTO "ChatHistories"
    ("Id","UserId","MemberId","UserRole","Role","Message","CreatedAt")
VALUES

-- Cuộc trò chuyện 1: Member An - Giảm mỡ
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','00000000-0004-0000-0000-000000000001','Member','user','Tôi muốn giảm 5kg trong 2 tháng, bạn có thể tư vấn chế độ tập luyện không?',NOW()-interval '20 days'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','00000000-0004-0000-0000-000000000001','Member','assistant','Chào Nguyễn Văn An! Để giảm 5kg trong 2 tháng là hoàn toàn khả thi với kế hoạch phù hợp. Tôi đề xuất:\n\n**Lịch tập 5 buổi/tuần:**\n- Thứ 2, 4: Cardio cường độ vừa (45 phút)\n- Thứ 3, 5: Tập tạ toàn thân (60 phút)\n- Thứ 7: Yoga hoặc nhóm lớp học (60 phút)\n\n**Dinh dưỡng:**\n- Giảm 300-500 kcal/ngày so với mức duy trì\n- Tăng protein (1.6-2g/kg cân nặng)\n- Uống đủ 2-3 lít nước/ngày\n\nBạn có câu hỏi gì thêm không?',NOW()-interval '20 days'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','00000000-0004-0000-0000-000000000001','Member','user','Tôi nên ăn gì trước và sau khi tập gym?',NOW()-interval '20 days'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000001','00000000-0004-0000-0000-000000000001','Member','assistant','Rất tốt! Dinh dưỡng quanh buổi tập rất quan trọng:\n\n**Trước tập (1-2 tiếng):**\n- Carbs phức hợp: cơm, bánh mì nguyên cám, khoai lang\n- Protein nhẹ: ức gà, trứng luộc\n\n**Sau tập (30-60 phút):**\n- Protein nhanh: whey protein, trứng, ức gà\n- Carbs: cơm, bánh mì\n- Ví dụ: 2 quả trứng + 1 bát cơm\n\nBạn đang tập vào buổi sáng hay buổi tối?',NOW()-interval '20 days'),

-- Cuộc trò chuyện 2: Member Cường - Tăng cơ
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','00000000-0004-0000-0000-000000000003','Member','user','Tôi đang dùng gói Elite và muốn tăng cơ bắp tối đa. Cần tập như thế nào?',NOW()-interval '15 days'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','00000000-0004-0000-0000-000000000003','Member','assistant','Xin chào Lê Đức Cường! Với gói Elite bạn đang sử dụng, bạn có 12 buổi PT/tháng.\n\n**Chương trình Push-Pull-Legs (6 ngày/tuần):**\n- Thứ 2: Push (Ngực, Vai, Tay sau)\n- Thứ 3: Pull (Lưng, Tay trước)\n- Thứ 4: Legs (Chân, Bắp chân)\n- Thứ 5-7: Lặp lại\n- Chủ nhật: Nghỉ ngơi\n\n**Dinh dưỡng tăng cơ:**\n- Tăng thêm 300-500 kcal/ngày\n- Protein: 2-2.2g/kg cân nặng\n\nHuấn luyện viên Đỗ Hải Đăng sẽ hỗ trợ bạn nhé!',NOW()-interval '15 days'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','00000000-0004-0000-0000-000000000003','Member','user','Tôi nên dùng thực phẩm bổ sung gì không?',NOW()-interval '14 days'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000003','00000000-0004-0000-0000-000000000003','Member','assistant','Về thực phẩm bổ sung cho mục tiêu tăng cơ:\n\n**Cần thiết:**\n- **Whey Protein:** 25-30g sau tập\n- **Creatine Monohydrate:** 3-5g/ngày\n\n**Tùy chọn:**\n- **BCAA:** Uống trong buổi tập\n- **Vitamin D & Omega-3:** Hỗ trợ sức khỏe tổng thể\n\nBạn có cân nặng và chiều cao để tôi tính toán chính xác hơn không?',NOW()-interval '14 days'),

-- Cuộc trò chuyện 3: Member Phương - Yoga & sức khỏe
(gen_random_uuid(),'00000000-0004-0000-0000-000000000006','00000000-0004-0000-0000-000000000006','Member','user','Tôi muốn biết lợi ích của Yoga và nên tập lớp nào?',NOW()-interval '10 days'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000006','00000000-0004-0000-0000-000000000006','Member','assistant','Chào Võ Thị Phương! Yoga mang lại rất nhiều lợi ích:\n\n**Thể chất:**\n- Tăng độ dẻo dai, cải thiện tư thế\n- Tăng sức mạnh core, giảm đau lưng\n\n**Tinh thần:**\n- Giảm stress, cải thiện giấc ngủ\n\n**Lớp phù hợp tại GymFit:**\n- Yoga Buổi Sáng (T2,T4,T6 07:00)\n- Yoga Nâng Cao (T3,T5 19:00)\n\nBạn thích tập buổi sáng hay tối?',NOW()-interval '10 days'),

-- Cuộc trò chuyện 4: Member Bích - Hỏi về gói
(gen_random_uuid(),'00000000-0004-0000-0000-000000000002','00000000-0004-0000-0000-000000000002','Member','user','Tôi đang dùng gói Premium, nên nâng cấp lên Elite không?',NOW()-interval '5 days'),
(gen_random_uuid(),'00000000-0004-0000-0000-000000000002','00000000-0004-0000-0000-000000000002','Member','assistant','Chào Trần Thị Bích! Để tôi so sánh:\n\n**Premium:** 4 buổi PT + 4 buổi nhóm/tháng\n**Elite:** 12 buổi PT + 12 buổi nhóm + VIP amenities\n\n**Nên nâng cấp nếu:**\n✅ Muốn tập cường độ cao hơn\n✅ Cần nhiều buổi PT hơn\n✅ Muốn lịch tập linh hoạt\n\nBạn có muốn tôi tính chi phí nâng cấp cụ thể không?',NOW()-interval '5 days'),

-- Cuộc trò chuyện 5: Staff Q1 - Hỏi về Dashboard
(gen_random_uuid(),'00000000-0003-0000-0000-000000000006',NULL,'Staff','user','Tháng này doanh thu Q1 đạt bao nhiêu so với tháng trước?',NOW()-interval '2 days'),
(gen_random_uuid(),'00000000-0003-0000-0000-000000000006',NULL,'Staff','assistant','Dựa trên dữ liệu hệ thống, chi nhánh Quận 1 tháng này đã đạt doanh thu tốt với nhiều hợp đồng mới được ký kết. Dashboard Revenue Analytics sẽ cho bạn thấy chi tiết so sánh month-over-month. Bạn có muốn tôi phân tích xu hướng cụ thể không?',NOW()-interval '2 days');

-- =====================================================
-- AI RECOMMENDATIONS (Kế hoạch tập được AI tạo ra)
-- =====================================================
INSERT INTO "AIRecommendations"
    ("Id","MemberId","Goal","Intent","RawJson","WorkoutPlan","NutritionAdvice","CreatedAt")
VALUES

-- Recommendation cho Member An - Giảm mỡ
(
    gen_random_uuid(),
    '00000000-0004-0000-0000-000000000001',
    'Giảm 5kg trong 2 tháng',
    'fitness',
    '{"goal":"weight_loss","duration":"2_months","intensity":"moderate","frequency":"5_days_week"}',
    '## Kế Hoạch Tập Luyện - Giảm Mỡ\n\n**Tuần 1-4: Giai đoạn khởi động**\n- T2, T4: Cardio nhẹ 30 phút + Tập tạ toàn thân 30 phút\n- T3, T5: Tập tạ theo nhóm cơ (Ngực/Lưng luân phiên)\n- T7: Yoga hoặc bơi lội 45 phút\n\n**Tuần 5-8: Tăng cường độ**\n- Tăng thời gian Cardio lên 45 phút\n- Thêm HIIT 2 lần/tuần\n- Tiếp tục Yoga cuối tuần để phục hồi\n\n**Chỉ số cần theo dõi:**\n- Cân nặng: đo mỗi sáng thứ 2\n- Vòng bụng: đo 2 tuần/lần\n- Năng lượng và chất lượng giấc ngủ',
    '## Chế Độ Dinh Dưỡng - Hỗ Trợ Giảm Mỡ\n\n**Mục tiêu:** Thâm hụt 400 kcal/ngày\n\n**Thực đơn mẫu:**\n- Sáng: 2 trứng luộc + bánh mì nguyên cám + 1 quả chuối\n- Trưa: Cơm gạo lứt + ức gà nướng + rau luộc\n- Chiều (trước tập): Whey protein + 1 quả táo\n- Tối (sau tập): Cơm + cá hồi + rau xào\n- Trước ngủ: 200ml sữa tách béo\n\n**Lưu ý quan trọng:**\n- Uống 2.5-3 lít nước/ngày\n- Tránh đường tinh luyện và đồ chiên\n- Ăn protein trước tiên trong mỗi bữa',
    NOW() - interval '20 days'
),

-- Recommendation cho Member Cường - Tăng cơ
(
    gen_random_uuid(),
    '00000000-0004-0000-0000-000000000003',
    'Tăng cơ bắp tối đa',
    'fitness',
    '{"goal":"muscle_gain","experience":"intermediate","frequency":"6_days_week","supplements":true}',
    '## Kế Hoạch Tăng Cơ - Push Pull Legs\n\n**Lịch tập 6 ngày:**\n- T2 (Push): Bench Press 4x8, OHP 3x10, Tricep dips 3x12\n- T3 (Pull): Deadlift 4x6, Pull-up 4x10, Barbell Row 3x10\n- T4 (Legs): Squat 4x8, Leg Press 3x12, Romanian Deadlift 3x10\n- T5, T6, T7: Lặp lại T2-T4\n- CN: Nghỉ ngơi hoàn toàn\n\n**Progressive Overload:**\n- Tăng 2.5kg mỗi 2 tuần cho các bài Squat, Deadlift, Bench\n- Ghi chép số tạ và reps mỗi buổi tập\n\n**Với 12 buổi PT/tháng (gói Elite):**\n- HLV sẽ điều chỉnh form và cường độ\n- Check-in tiến độ mỗi 2 tuần',
    '## Dinh Dưỡng Tăng Cơ\n\n**Mục tiêu:** Surplus 300-400 kcal/ngày\n**Protein:** 170-180g/ngày (85kg × 2g)\n\n**Thực đơn mẫu cho ngày tập:**\n- Sáng: 4 trứng + yến mạch + chuối\n- Tiền tập (2h trước): Cơm + ức gà 200g\n- Trong tập: BCAA + nước\n- Hậu tập ngay: Whey 30g + chuối\n- Bữa chính tối: Cơm gạo lứt + thịt bò 200g + rau\n- Trước ngủ: Casein protein hoặc phô mai cottage\n\n**Thực phẩm bổ sung đề xuất:**\n- Creatine Monohydrate: 5g/ngày\n- Whey Protein: 1-2 lần/ngày\n- Vitamin D3: 2000IU/ngày',
    NOW() - interval '15 days'
),

-- Recommendation cho Member Phương - Sức khỏe tổng thể
(
    gen_random_uuid(),
    '00000000-0004-0000-0000-000000000006',
    'Cải thiện sức khỏe tổng thể và giảm stress',
    'fitness',
    '{"goal":"wellness","preference":"yoga_zumba","intensity":"low_to_moderate"}',
    '## Kế Hoạch Sức Khỏe & Yoga\n\n**Lịch tập kết hợp (5 buổi/tuần):**\n- T2, T5 (07:00): Yoga Buổi Sáng 60 phút - Tập trung vào hít thở và thư giãn\n- T3 (19:00): Zumba 60 phút - Vui vẻ, đốt calo\n- T6 (08:00): Yoga Nâng Cao 90 phút - Tư thế cân bằng\n- T7 (09:00): Zumba Weekend - Nhạc sôi động\n\n**Thêm vào:**\n- Thiền định 10 phút mỗi sáng\n- Đi bộ 20-30 phút buổi tối\n\n**Mục tiêu theo dõi:**\n- Chất lượng giấc ngủ (app Sleep Tracker)\n- Mức độ stress (thang 1-10 mỗi ngày)\n- Độ dẻo dai: chụp ảnh pose trước/sau 1 tháng',
    '## Dinh Dưỡng Cho Sức Khỏe Tổng Thể\n\n**Nguyên tắc:**\n- Ăn đủ 3 bữa chính, không bỏ bữa\n- 50% rau và trái cây trong mỗi bữa\n- Giảm đường và thức ăn chế biến sẵn\n\n**Thực phẩm tốt cho Yoga:**\n- Trước tập nhẹ: Trái cây, bánh mì nướng\n- Sau tập: Sinh tố rau xanh + protein\n- Thường xuyên: Nghệ, gừng, trà xanh\n\n**Bổ sung nên có:**\n- Magnesium: 300mg/ngày (tốt cho giấc ngủ và cơ bắp)\n- Omega-3: 1000mg/ngày\n- Vitamin C: 500mg/ngày',
    NOW() - interval '10 days'
);

-- =====================================================
-- AI CONTEXT CACHES
-- (Ngữ cảnh được lưu để AI sử dụng cho lần sau)
-- =====================================================
INSERT INTO "AIContextCaches"
    ("MemberId","CachedContext","UpdatedAt")
VALUES
(
    '00000000-0004-0000-0000-000000000001',
    '{"memberName":"Nguyễn Văn An","goal":"Giảm 5kg","currentPackage":"Basic","sessionsLeft":0,"checkinsThisWeek":2,"lastChatTopic":"dinh dưỡng trước và sau tập","preferredTime":"morning","fitnessLevel":"beginner"}',
    NOW() - interval '20 days'
),
(
    '00000000-0004-0000-0000-000000000003',
    '{"memberName":"Lê Đức Cường","goal":"Tăng cơ","currentPackage":"Elite","privatePtLeft":4,"groupPtLeft":7,"checkinsThisWeek":5,"lastChatTopic":"thực phẩm bổ sung","preferredTime":"morning","fitnessLevel":"intermediate","weight":"85kg","height":"175cm"}',
    NOW() - interval '14 days'
),
(
    '00000000-0004-0000-0000-000000000006',
    '{"memberName":"Võ Thị Phương","goal":"Sức khỏe tổng thể và giảm stress","currentPackage":"Elite","privatePtLeft":9,"groupPtLeft":8,"checkinsThisWeek":3,"lastChatTopic":"lớp Yoga và lợi ích","preferredTime":"morning","fitnessLevel":"intermediate","preferredClass":"Yoga,Zumba"}',
    NOW() - interval '10 days'
);


-- =====================================================
-- AI DATA BULK GENERATION (ChatHistories, Recommendations, Caches)
-- =====================================================
DO $$
DECLARE
  member_ids uuid[];
  staff_ids  uuid[];
  owner_id   uuid := '00000000-0002-0000-0000-000000000001'::uuid;
  
  m_count    int;
  s_count    int;
  member_id  uuid;
  staff_id   uuid;
  
  -- Conversations prompts
  user_prompts text[] := ARRAY[
    'Lịch tập của tôi tuần này thế nào?',
    'Tôi còn bao nhiêu buổi PT cá nhân?',
    'Làm thế nào để giảm cân hiệu quả?',
    'Cho tôi xem lịch sử check-in tháng này.',
    'Tôi có thể đổi lịch học lớp Yoga không?'
  ];
  
  ai_responses text[] := ARRAY[
    'Chào bạn! Lịch tập tuần này của bạn gồm 3 lớp Yoga và 2 buổi PT cá nhân.',
    'Chào bạn! Bạn còn lại 6 buổi PT cá nhân chưa sử dụng trong hợp đồng hiện tại.',
    'Chào bạn! Để giảm cân, bạn nên kết hợp tập HIIT với giảm 300 kcal khẩu phần ăn hàng ngày.',
    'Chào bạn! Tháng này bạn đã check-in thành công 12 lần tại các chi nhánh.',
    'Chào bạn! Bạn có thể tự đổi lịch trên ứng dụng trước giờ học 2 tiếng.'
  ];

  staff_prompts text[] := ARRAY[
    'Báo cáo doanh thu tuần này của chi nhánh?',
    'Danh sách leads chưa liên hệ hôm nay?',
    'Danh sách PT đang rảnh giờ cao điểm?'
  ];
  
  staff_responses text[] := ARRAY[
    'Doanh thu tuần này của chi nhánh đạt 12.5 triệu VNĐ, tăng 8% so với tuần trước.',
    'Có 5 leads mới chưa được liên hệ hôm nay. Tôi đã gửi danh sách qua email.',
    'PT Đăng và PT Tuấn đang rảnh từ 14:00 đến 16:00 hôm nay.'
  ];
  
  n_days_ago int;
  created_at timestamptz;
BEGIN
  SELECT ARRAY(SELECT "UserId" FROM "Members") INTO member_ids;
  SELECT ARRAY(SELECT "UserId" FROM "Staffs") INTO staff_ids;
  
  m_count := array_length(member_ids, 1);
  s_count := array_length(staff_ids, 1);

  -- 1. Generate ChatHistories (250+ messages)
  -- Member chats
  FOR k IN 1..100 LOOP
    member_id := member_ids[(k % m_count) + 1];
    n_days_ago := (k % 25) + 1;
    created_at := NOW() - (n_days_ago || ' days')::interval;

    -- User message
    INSERT INTO "ChatHistories" ("Id","UserId","MemberId","UserRole","Role","Message","CreatedAt")
    VALUES (gen_random_uuid(), member_id, member_id, 'Member', 'user', user_prompts[(k % 5) + 1], created_at);
    
    -- Assistant response
    INSERT INTO "ChatHistories" ("Id","UserId","MemberId","UserRole","Role","Message","CreatedAt")
    VALUES (gen_random_uuid(), member_id, member_id, 'Member', 'assistant', ai_responses[(k % 5) + 1], created_at + interval '1 minute');
  END LOOP;

  -- Staff chats
  FOR k IN 1..20 LOOP
    staff_id := staff_ids[(k % s_count) + 1];
    n_days_ago := (k % 15) + 1;
    created_at := NOW() - (n_days_ago || ' days')::interval;

    -- User message
    INSERT INTO "ChatHistories" ("Id","UserId","MemberId","UserRole","Role","Message","CreatedAt")
    VALUES (gen_random_uuid(), staff_id, null, 'Staff', 'user', staff_prompts[(k % 3) + 1], created_at);
    
    -- Assistant response
    INSERT INTO "ChatHistories" ("Id","UserId","MemberId","UserRole","Role","Message","CreatedAt")
    VALUES (gen_random_uuid(), staff_id, null, 'Staff', 'assistant', staff_responses[(k % 3) + 1], created_at + interval '1 minute');
  END LOOP;

  -- 2. Generate AIRecommendations (30+ records)
  FOR k IN 11..45 LOOP
    member_id := member_ids[(k % m_count) + 1];
    INSERT INTO "AIRecommendations"
        ("Id","MemberId","Goal","Intent","RawJson","WorkoutPlan","NutritionAdvice","CreatedAt")
    VALUES (
        gen_random_uuid(),
        member_id,
        CASE WHEN k % 2 = 0 THEN 'Tăng cơ bắp tay' ELSE 'Cải thiện tim mạch' END,
        'fitness',
        '{"goal":"gain","intensity":"moderate"}',
        'Lịch tập đề xuất: 3 buổi tạ/tuần với các bài đa khớp (Squat, Deadlift, Bench Press). Tập trung tăng tạ lũy tiến.',
        'Dinh dưỡng đề xuất: Bổ sung 2.0g protein/kg trọng lượng cơ thể. Uống nhiều nước và ngủ đủ 8 tiếng.',
        NOW() - (k % 15 || ' days')::interval
    );
  END LOOP;

  -- 3. Generate AIContextCaches (50+ records)
  FOR k IN 11..65 LOOP
    member_id := member_ids[(k % m_count) + 1];
    INSERT INTO "AIContextCaches"
        ("MemberId","CachedContext","UpdatedAt")
    VALUES (
        member_id,
        '{"memberName":"Member ' || k::text || '","goal":"Tập luyện đều đặn","currentPackage":"Basic","checkinsThisWeek":3}',
        NOW() - (k % 10 || ' days')::interval
    )
    ON CONFLICT ("MemberId") DO UPDATE 
    SET "CachedContext" = EXCLUDED."CachedContext", "UpdatedAt" = EXCLUDED."UpdatedAt";
  END LOOP;
END $$;
