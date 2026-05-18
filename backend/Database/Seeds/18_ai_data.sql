-- =====================================================
-- 18_AI_DATA.SQL
-- Seed dữ liệu AI: ChatHistories, AIRecommendations, AIContextCaches
-- =====================================================

-- =====================================================
-- CHAT HISTORIES (AI Assistant conversations)
-- Role: "user" hoặc "assistant"
-- =====================================================
INSERT INTO "ChatHistories"
    ("Id","MemberId","Role","Message","CreatedAt")
VALUES

-- =====================================================
-- Cuộc trò chuyện 1: Member An - Hỏi về giảm mỡ
-- =====================================================
(
    gen_random_uuid(),
    '00000000-0004-0000-0000-000000000001',
    'user',
    'Tôi muốn giảm 5kg trong 2 tháng, bạn có thể tư vấn chế độ tập luyện không?',
    NOW() - interval '20 days'
),
(
    gen_random_uuid(),
    '00000000-0004-0000-0000-000000000001',
    'assistant',
    'Chào Nguyễn Văn An! Để giảm 5kg trong 2 tháng là hoàn toàn khả thi với kế hoạch phù hợp. Tôi đề xuất:\n\n**Lịch tập 5 buổi/tuần:**\n- Thứ 2, 4: Cardio cường độ vừa (45 phút)\n- Thứ 3, 5: Tập tạ toàn thân (60 phút)\n- Thứ 7: Yoga hoặc nhóm lớp học (60 phút)\n\n**Dinh dưỡng:**\n- Giảm 300-500 kcal/ngày so với mức duy trì\n- Tăng protein (1.6-2g/kg cân nặng)\n- Uống đủ 2-3 lít nước/ngày\n\nBạn có câu hỏi gì thêm không?',
    NOW() - interval '20 days'
),
(
    gen_random_uuid(),
    '00000000-0004-0000-0000-000000000001',
    'user',
    'Tôi nên ăn gì trước và sau khi tập gym?',
    NOW() - interval '20 days'
),
(
    gen_random_uuid(),
    '00000000-0004-0000-0000-000000000001',
    'assistant',
    'Rất tốt! Dinh dưỡng quanh buổi tập rất quan trọng:\n\n**Trước tập (1-2 tiếng):**\n- Carbs phức hợp: cơm, bánh mì nguyên cám, khoai lang\n- Protein nhẹ: ức gà, trứng luộc\n- Tránh đồ béo và chất xơ cao\n\n**Sau tập (30-60 phút):**\n- Protein nhanh: whey protein, trứng, ức gà\n- Carbs: cơm, bánh mì\n- Ví dụ: 2 quả trứng + 1 bát cơm\n\nBạn đang tập vào buổi sáng hay buổi tối?',
    NOW() - interval '20 days'
),

-- =====================================================
-- Cuộc trò chuyện 2: Member Cường - Tăng cơ
-- =====================================================
(
    gen_random_uuid(),
    '00000000-0004-0000-0000-000000000003',
    'user',
    'Tôi đang dùng gói Elite và muốn tăng cơ bắp tối đa. Cần tập như thế nào?',
    NOW() - interval '15 days'
),
(
    gen_random_uuid(),
    '00000000-0004-0000-0000-000000000003',
    'assistant',
    'Xin chào Lê Đức Cường! Với gói Elite bạn đang sử dụng, bạn có 12 buổi PT/tháng – đây là lợi thế rất lớn!\n\n**Chương trình tăng cơ Push-Pull-Legs (6 ngày/tuần):**\n- Thứ 2: Push (Ngực, Vai, Tay sau)\n- Thứ 3: Pull (Lưng, Tay trước)\n- Thứ 4: Legs (Chân, Bắp chân)\n- Thứ 5-7: Lặp lại\n- Chủ nhật: Nghỉ ngơi\n\n**Dinh dưỡng tăng cơ:**\n- Tăng thêm 300-500 kcal/ngày\n- Protein: 2-2.2g/kg cân nặng\n- Ưu tiên thịt bò, ức gà, cá, trứng, đậu nành\n\nHuấn luyện viên Đỗ Hải Đăng sẽ hỗ trợ bạn thiết kế program cụ thể trong buổi PT nhé!',
    NOW() - interval '15 days'
),
(
    gen_random_uuid(),
    '00000000-0004-0000-0000-000000000003',
    'user',
    'Tôi nên dùng thực phẩm bổ sung gì không?',
    NOW() - interval '14 days'
),
(
    gen_random_uuid(),
    '00000000-0004-0000-0000-000000000003',
    'assistant',
    'Về thực phẩm bổ sung cho mục tiêu tăng cơ:\n\n**Cần thiết:**\n- **Whey Protein:** 25-30g sau tập, giúp phục hồi cơ nhanh\n- **Creatine Monohydrate:** 3-5g/ngày, tăng sức mạnh và khối lượng cơ\n\n**Tùy chọn:**\n- **BCAA:** Uống trong buổi tập để giảm đau cơ\n- **Vitamin D & Omega-3:** Hỗ trợ sức khỏe tổng thể\n\n**Lưu ý:** Thực phẩm bổ sung chỉ chiếm 10-20% kết quả. Chế độ tập luyện và dinh dưỡng từ thực phẩm tự nhiên là nền tảng. Bạn có cân nặng và chiều cao để tôi tính toán chính xác hơn không?',
    NOW() - interval '14 days'
),

-- =====================================================
-- Cuộc trò chuyện 3: Member Phương - Yoga & sức khỏe
-- =====================================================
(
    gen_random_uuid(),
    '00000000-0004-0000-0000-000000000006',
    'user',
    'Tôi muốn biết lợi ích của Yoga và nên tập lớp nào?',
    NOW() - interval '10 days'
),
(
    gen_random_uuid(),
    '00000000-0004-0000-0000-000000000006',
    'assistant',
    'Chào Võ Thị Phương! Yoga mang lại rất nhiều lợi ích tuyệt vời:\n\n**Lợi ích thể chất:**\n- Tăng độ dẻo dai và linh hoạt\n- Cải thiện tư thế cơ thể\n- Tăng sức mạnh cơ bắp (đặc biệt core)\n- Giảm đau lưng mãn tính\n\n**Lợi ích tinh thần:**\n- Giảm stress và lo âu đáng kể\n- Cải thiện chất lượng giấc ngủ\n- Tăng khả năng tập trung\n\n**Lớp phù hợp tại GymFit:**\n- 🌅 **Yoga Thư Giãn Buổi Sáng** - Mỗi thứ 2, 4, 6 lúc 07:00 (phòng Yoga Q1)\n- 🌙 **Yoga Nâng Cao** - Thứ 3, 5 lúc 19:00 (phòng Yoga VIP Q7)\n\nBạn thích tập buổi sáng hay buổi tối?',
    NOW() - interval '10 days'
),

-- =====================================================
-- Cuộc trò chuyện 4: Member Bích - Hỏi về gói
-- =====================================================
(
    gen_random_uuid(),
    '00000000-0004-0000-0000-000000000002',
    'user',
    'Tôi đang dùng gói Premium, nên nâng cấp lên Elite không?',
    NOW() - interval '5 days'
),
(
    gen_random_uuid(),
    '00000000-0004-0000-0000-000000000002',
    'assistant',
    'Chào Trần Thị Bích! Hãy để tôi giúp bạn so sánh:\n\n**Gói Premium (đang dùng):**\n- 4 buổi PT cá nhân/tháng\n- 4 buổi lớp nhóm/tháng\n- Check-in đa chi nhánh\n\n**Gói Elite:**\n- 12 buổi PT cá nhân/tháng (+8 buổi)\n- 12 buổi lớp nhóm/tháng\n- Phòng tắm VIP\n- Tư vấn sức khỏe định kỳ\n- Ưu tiên đặt lịch\n\n**Nên nâng cấp nếu:**\n✅ Bạn muốn tập cường độ cao hơn\n✅ Muốn PT hướng dẫn nhiều buổi hơn\n✅ Cần lịch tập linh hoạt hơn\n\n**Phí nâng cấp:** Theo chính sách, bạn chỉ trả phần chênh lệch theo số ngày còn lại của hợp đồng hiện tại.\n\nBạn có muốn tôi tính toán chi phí cụ thể không?',
    NOW() - interval '5 days'
);

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
