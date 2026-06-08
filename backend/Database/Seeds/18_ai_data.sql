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
    '{"Goal":"Giảm 5kg trong 2 tháng","DaysPerWeek":5,"Schedule":[{"Day":"Thứ 2","Focus":"Thân trên & Cardio ngắn","Exercises":[{"Name":"Push-Up (Hít đất)","Sets":3,"Reps":"12 - 15","Rest":"60s"},{"Name":"Dumbbell Shoulder Press (Đẩy vai)","Sets":3,"Reps":"12","Rest":"60s"},{"Name":"Lat Pulldown (Kéo xô máy)","Sets":3,"Reps":"12","Rest":"90s"}]},{"Day":"Thứ 3","Focus":"Cardio Đốt Mỡ","Exercises":[{"Name":"Chạy bộ trên máy","Sets":1,"Reps":"30 phút","Rest":"N/A"},{"Name":"Jumping Jacks","Sets":3,"Reps":"45s","Rest":"30s"}]},{"Day":"Thứ 4","Focus":"Nghỉ phục hồi","Exercises":[]},{"Day":"Thứ 5","Focus":"Thân dưới & Core","Exercises":[{"Name":"Squat (Gánh đùi)","Sets":4,"Reps":"12","Rest":"90s"},{"Name":"Plank","Sets":3,"Reps":"60s","Rest":"45s"}]},{"Day":"Thứ 6","Focus":"Cardio & giãn cơ","Exercises":[{"Name":"Đạp xe tĩnh","Sets":1,"Reps":"25 phút","Rest":"N/A"}]}]}',
    '{"DailyCalories":1800,"Macros":{"Protein":135,"Carbs":180,"Fat":50},"MealPlan":[{"Meal":"Bữa sáng","Foods":"2 quả trứng luộc, 2 lát bánh mì đen, 1 quả chuối","Calories":400},{"Meal":"Bữa trưa","Foods":"150g ức gà nướng, 1 bát cơm lứt, súp lơ xanh","Calories":550},{"Meal":"Bữa xế","Foods":"1 muỗng Whey protein, 1 quả táo","Calories":200},{"Meal":"Bữa tối","Foods":"150g cá hồi áp chảo, măng tây, 1/2 củ khoai lang","Calories":650}]}',
    NOW() - interval '20 days'
),

-- Recommendation cho Member Cường - Tăng cơ
(
    gen_random_uuid(),
    '00000000-0004-0000-0000-000000000003',
    'Tăng cơ bắp tối đa',
    'fitness',
    '{"goal":"muscle_gain","experience":"intermediate","frequency":"6_days_week","supplements":true}',
    '{"Goal":"Tăng cơ bắp tối đa","DaysPerWeek":6,"Schedule":[{"Day":"Thứ 2 (Push)","Focus":"Ngực, Vai, Tay sau","Exercises":[{"Name":"Bench Press (Đẩy ngực)","Sets":4,"Reps":"8 - 10","Rest":"90s"},{"Name":"Overhead Press (Đẩy vai tạ đòn)","Sets":3,"Reps":"10","Rest":"90s"},{"Name":"Tricep Pushdown (Kéo tay sau)","Sets":3,"Reps":"12","Rest":"60s"}]},{"Day":"Thứ 3 (Pull)","Focus":"Lưng, Tay trước","Exercises":[{"Name":"Deadlift (Kéo tạ đòn)","Sets":4,"Reps":"6 - 8","Rest":"120s"},{"Name":"Pull-Up (Hít xà đơn)","Sets":4,"Reps":"10","Rest":"90s"},{"Name":"Barbell Curl (Cuốn tạ đòn)","Sets":3,"Reps":"12","Rest":"60s"}]},{"Day":"Thứ 4 (Legs)","Focus":"Đùi & Mông","Exercises":[{"Name":"Barbell Squat (Gánh tạ đòn đùi)","Sets":4,"Reps":"8","Rest":"120s"},{"Name":"Leg Press (Đạp đùi máy)","Sets":3,"Reps":"12","Rest":"90s"}]}]}',
    '{"DailyCalories":2800,"Macros":{"Protein":180,"Carbs":350,"Fat":80},"MealPlan":[{"Meal":"Bữa sáng","Foods":"4 lòng trắng trứng + 2 lòng đỏ xào, 100g yến mạch, 1 quả chuối","Calories":650},{"Meal":"Bữa trưa","Foods":"200g thịt bò phi lê, 2 bát cơm gạo lứt, rau cải luộc","Calories":850},{"Meal":"Bữa xế (Pre-workout)","Foods":"1 củ khoai lang, 150g ức gà, BCAA","Calories":350},{"Meal":"Hậu tập","Foods":"1 muỗng Whey Protein + 1 quả chuối","Calories":250},{"Meal":"Bữa tối","Foods":"200g cá hồi áp chảo, măng tây, cơm lứt","Calories":700}]}',
    NOW() - interval '15 days'
),

-- Recommendation cho Member Phương - Sức khỏe tổng thể
(
    gen_random_uuid(),
    '00000000-0004-0000-0000-000000000006',
    'Cải thiện sức khỏe tổng thể và giảm stress',
    'fitness',
    '{"goal":"wellness","preference":"yoga_zumba","intensity":"low_to_moderate"}',
    '{"Goal":"Cải thiện sức khỏe tổng thể và giảm stress","DaysPerWeek":5,"Schedule":[{"Day":"Thứ 2","Focus":"Yoga Buổi Sáng","Exercises":[{"Name":"Chào mặt trời","Sets":5,"Reps":"10 phút","Rest":"N/A"},{"Name":"Tư thế chiến binh","Sets":3,"Reps":"45s","Rest":"30s"}]},{"Day":"Thứ 3","Focus":"Zumba Dance","Exercises":[{"Name":"Lớp Zumba sôi động","Sets":1,"Reps":"60 phút","Rest":"N/A"}]}]}',
    '{"DailyCalories":1600,"Macros":{"Protein":100,"Carbs":200,"Fat":45},"MealPlan":[{"Meal":"Bữa sáng","Foods":"Sinh tố bơ chuối + hạt chia, 1 lát bánh mì nướng","Calories":350},{"Meal":"Bữa trưa","Foods":"Salad ức gà xé, trứng luộc, dầu olive","Calories":450},{"Meal":"Bữa tối","Foods":"150g cá hồi hấp gừng, súp lơ xanh, cơm lứt","Calories":500}]}',
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
)
ON CONFLICT ("MemberId") DO NOTHING;



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
    IF k % 2 = 0 THEN
      INSERT INTO "AIRecommendations"
          ("Id","MemberId","Goal","Intent","RawJson","WorkoutPlan","NutritionAdvice","CreatedAt")
      VALUES (
          gen_random_uuid(),
          member_id,
          'Tăng cơ bắp tay',
          'fitness',
          '{"goal":"muscle_gain","intensity":"moderate","frequency":"3_days_week"}',
          '{"Goal":"Tăng cơ bắp tay","DaysPerWeek":3,"Schedule":[{"Day":"Thứ 2","Focus":"Tay trước & Tay sau","Exercises":[{"Name":"Barbell Curl (Cuốn tạ đòn)","Sets":4,"Reps":"10 - 12","Rest":"60s"},{"Name":"Tricep Pushdown (Kéo tay sau)","Sets":4,"Reps":"12","Rest":"60s"},{"Name":"Hammer Curl (Cuốn tạ búa)","Sets":3,"Reps":"12","Rest":"60s"}]},{"Day":"Thứ 4","Focus":"Lưng & Cẳng tay","Exercises":[{"Name":"Lat Pulldown (Kéo xô máy)","Sets":4,"Reps":"10","Rest":"90s"},{"Name":"Dumbbell Row (Kéo tạ đơn)","Sets":3,"Reps":"12","Rest":"90s"}]},{"Day":"Thứ 6","Focus":"Ngực & Vai","Exercises":[{"Name":"Bench Press (Đẩy ngực)","Sets":4,"Reps":"8 - 10","Rest":"90s"},{"Name":"Dumbbell Lateral Raise (Dang tạ vai)","Sets":3,"Reps":"15","Rest":"60s"}]}]}',
          '{"DailyCalories":2500,"Macros":{"Protein":150,"Carbs":300,"Fat":70},"MealPlan":[{"Meal":"Bữa sáng","Foods":"3 quả trứng luộc, 2 lát bánh mì nguyên cám","Calories":450},{"Meal":"Bữa trưa","Foods":"200g ức gà, 2 bát cơm trắng, rau xanh","Calories":700},{"Meal":"Bữa tối","Foods":"150g thịt bò phi lê, 1.5 bát cơm lứt, súp lơ xanh","Calories":750},{"Meal":"Bữa phụ","Foods":"1 muỗng Whey protein, 1 quả chuối","Calories":300}]}',
          NOW() - (k % 15 || ' days')::interval
      );
    ELSE
      INSERT INTO "AIRecommendations"
          ("Id","MemberId","Goal","Intent","RawJson","WorkoutPlan","NutritionAdvice","CreatedAt")
      VALUES (
          gen_random_uuid(),
          member_id,
          'Cải thiện tim mạch',
          'fitness',
          '{"goal":"cardio","intensity":"moderate","frequency":"3_days_week"}',
          '{"Goal":"Cải thiện tim mạch","DaysPerWeek":3,"Schedule":[{"Day":"Thứ 3","Focus":"HIIT & Core","Exercises":[{"Name":"Chạy bộ biến tốc trên máy","Sets":1,"Reps":"20 phút","Rest":"N/A"},{"Name":"Jumping Jacks","Sets":3,"Reps":"45s","Rest":"30s"},{"Name":"Plank","Sets":3,"Reps":"60s","Rest":"45s"}]},{"Day":"Thứ 5","Focus":"Đạp xe & Giãn cơ","Exercises":[{"Name":"Đạp xe tĩnh","Sets":1,"Reps":"30 phút","Rest":"N/A"},{"Name":"Giãn cơ toàn thân","Sets":1,"Reps":"10 phút","Rest":"N/A"}]},{"Day":"Thứ 7","Focus":"Lớp nhảy Zumba","Exercises":[{"Name":"Tham gia lớp nhảy Zumba","Sets":1,"Reps":"60 phút","Rest":"N/A"}]}]}',
          '{"DailyCalories":1800,"Macros":{"Protein":120,"Carbs":200,"Fat":50},"MealPlan":[{"Meal":"Bữa sáng","Foods":"1 bát cháo yến mạch, 1 quả táo","Calories":350},{"Meal":"Bữa trưa","Foods":"150g cá áp chảo, 1 bát cơm lứt, salad trộn","Calories":500},{"Meal":"Bữa tối","Foods":"150g ức gà luộc, canh rau củ, 1/2 củ khoai lang","Calories":450},{"Meal":"Bữa phụ","Foods":"1 hũ sữa chua hy lạp, hạt hạnh nhân","Calories":200}]}',
          NOW() - (k % 15 || ' days')::interval
      );
    END IF;
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
