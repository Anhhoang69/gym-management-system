-- =====================================================
-- 07_LEADS.SQL
-- Seed nguồn lead và danh sách khách hàng tiềm năng
-- =====================================================

-- =====================================================
-- LEAD SOURCES
-- =====================================================
INSERT INTO "LeadSources" ("Id","Name","Score","IsActive")
VALUES
    ('dddddddd-0001-0000-0000-000000000001', 'Facebook', 20, true),
    ('dddddddd-0001-0000-0000-000000000002', 'Giới thiệu từ bạn bè', 35, true),
    ('dddddddd-0001-0000-0000-000000000003', 'Khách ghé trực tiếp (Walk-in)', 30, true),
    ('dddddddd-0001-0000-0000-000000000004', 'Google Ads', 25, true),
    ('dddddddd-0001-0000-0000-000000000005', 'Instagram', 18, true),
    ('dddddddd-0001-0000-0000-000000000006', 'Tiktok', 15, true),
    ('dddddddd-0001-0000-0000-000000000007', 'Sự kiện offline', 28, true),
    ('dddddddd-0001-0000-0000-000000000008', 'Zalo OA', 22, true);

-- =====================================================
-- LEADS
-- Đa dạng trạng thái: New, Contacted, Qualified, Converted, Lost
-- =====================================================
INSERT INTO "Leads"
    ("LeadId","Name","Phone","Email","SourceId","Status","Note",
     "LostReason","LastContactedAt","ContactCount","Score",
     "AssignedToStaffId","CreatedByUserId","BranchId","ConvertedMemberUserId",
     "CreatedAt","UpdatedAt")
VALUES

-- Lead 1: New (chưa liên lạc)
(
    'eeeeeeee-0001-0000-0000-000000000001',
    'Nguyễn Văn Bảo', '0933001001', 'bao.nguyen99@gmail.com',
    'dddddddd-0001-0000-0000-000000000001', 'New', 'Khách hỏi về gói 3 tháng trên Facebook',
    null, null, 0, 20,
    '00000000-0003-0000-0000-000000000006', '00000000-0003-0000-0000-000000000006',
    'aaaaaaaa-0001-0000-0000-000000000001', null,
    NOW() - interval '5 days', null
),

-- Lead 2: Contacted (đã liên lạc)
(
    'eeeeeeee-0001-0000-0000-000000000002',
    'Lê Thị Cẩm Tú', '0933001002', 'camtu.le@gmail.com',
    'dddddddd-0001-0000-0000-000000000003', 'Contacted', 'Khách đến xem phòng tập, quan tâm gói Basic',
    null, NOW() - interval '2 days', 2, 50,
    '00000000-0003-0000-0000-000000000006', '00000000-0003-0000-0000-000000000006',
    'aaaaaaaa-0001-0000-0000-000000000001', null,
    NOW() - interval '7 days', NOW() - interval '2 days'
),

-- Lead 3: Qualified (đủ điều kiện)
(
    'eeeeeeee-0001-0000-0000-000000000003',
    'Trần Minh Đức', '0933001003', 'minhduc.tran@gmail.com',
    'dddddddd-0001-0000-0000-000000000002', 'Qualified', 'Khách được giới thiệu bởi hội viên An, quan tâm gói Premium 6 tháng',
    null, NOW() - interval '1 day', 4, 75,
    '00000000-0003-0000-0000-000000000006', '00000000-0003-0000-0000-000000000006',
    'aaaaaaaa-0001-0000-0000-000000000001', null,
    NOW() - interval '14 days', NOW() - interval '1 day'
),

-- Lead 4: Converted (đã chuyển đổi thành Member)
(
    'eeeeeeee-0001-0000-0000-000000000004',
    'Nguyễn Văn An', '0912345001', 'nguyen.van.an@gmail.com',
    'dddddddd-0001-0000-0000-000000000003', 'Converted', 'Khách ghé trực tiếp chi nhánh Q1, đăng ký gói Basic 3 tháng',
    null, NOW() - interval '175 days', 5, 90,
    '00000000-0003-0000-0000-000000000006', '00000000-0003-0000-0000-000000000006',
    'aaaaaaaa-0001-0000-0000-000000000001', '00000000-0004-0000-0000-000000000001',
    NOW() - interval '185 days', NOW() - interval '175 days'
),

-- Lead 5: Converted
(
    'eeeeeeee-0001-0000-0000-000000000005',
    'Trần Thị Bích', '0912345002', 'tran.thi.bich@gmail.com',
    'dddddddd-0001-0000-0000-000000000001', 'Converted', 'Khách từ Facebook Ads, mua gói Premium 1 tháng',
    null, NOW() - interval '148 days', 3, 85,
    '00000000-0003-0000-0000-000000000006', '00000000-0003-0000-0000-000000000006',
    'aaaaaaaa-0001-0000-0000-000000000001', '00000000-0004-0000-0000-000000000002',
    NOW() - interval '155 days', NOW() - interval '148 days'
),

-- Lead 6: Lost (đã mất)
(
    'eeeeeeee-0001-0000-0000-000000000006',
    'Phạm Văn Sơn', '0933001006', 'vanson.pham@gmail.com',
    'dddddddd-0001-0000-0000-000000000004', 'Lost', 'Khách từ Google, cân nhắc chi phí',
    'Khách thấy giá gói cao hơn đối thủ, chọn gym khác gần nhà hơn',
    NOW() - interval '10 days', 6, 30,
    '00000000-0003-0000-0000-000000000007', '00000000-0003-0000-0000-000000000007',
    'aaaaaaaa-0001-0000-0000-000000000002', null,
    NOW() - interval '25 days', NOW() - interval '10 days'
),

-- Lead 7: New (Q7 branch)
(
    'eeeeeeee-0001-0000-0000-000000000007',
    'Ngô Thị Hạnh', '0933001007', 'hanh.ngo@gmail.com',
    'dddddddd-0001-0000-0000-000000000008', 'New', 'Khách hỏi trên Zalo, muốn biết thêm về lớp Yoga',
    null, null, 0, 22,
    '00000000-0003-0000-0000-000000000007', '00000000-0003-0000-0000-000000000007',
    'aaaaaaaa-0001-0000-0000-000000000002', null,
    NOW() - interval '2 days', null
),

-- Lead 8: Qualified (Q7 branch)
(
    'eeeeeeee-0001-0000-0000-000000000008',
    'Đinh Văn Khải', '0933001008', 'khai.dinh@gmail.com',
    'dddddddd-0001-0000-0000-000000000007', 'Qualified', 'Gặp tại sự kiện fitness Q7, muốn đăng ký Elite 12 tháng',
    null, NOW() - interval '3 days', 3, 80,
    '00000000-0003-0000-0000-000000000007', '00000000-0003-0000-0000-000000000007',
    'aaaaaaaa-0001-0000-0000-000000000002', null,
    NOW() - interval '10 days', NOW() - interval '3 days'
);
