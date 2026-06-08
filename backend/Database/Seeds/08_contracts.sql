-- =====================================================
-- 08_CONTRACTS.SQL
-- Seed hợp đồng hội viên — 260 contracts
-- ContractStatus: Pending, Active, Expired, Cancelled
-- =====================================================

-- =====================================================
-- CONTRACTS 001-011 (giữ nguyên — invoices/payments reference chúng)
-- =====================================================
INSERT INTO "Contracts"
    ("ContractId","MemberUserId","PackageId","StaffId",
     "OriginalPrice","DiscountAmount","DealPrice","Note",
     "Status","StartDate","EndDate",
     "TotalPrivateSessions","UsedPrivateSessions",
     "TotalGroupSessions","UsedGroupSessions",
     "CreatedAt","UpdatedAt")
VALUES
-- C01: Active - Member An - Basic 3 tháng
('ffffffff-0001-0000-0000-000000000001','00000000-0004-0000-0000-000000000001','cccccccc-0001-0000-0000-000000000001','00000000-0003-0000-0000-000000000006',1399000,139900,1259100,'Hội viên mới đăng ký, áp dụng khuyến mãi khai trương 10%','Active',NOW()-interval '30 days',NOW()+interval '60 days',0,0,0,0,NOW()-interval '30 days',null),
-- C02: Active - Member Bích - Premium 1 tháng
('ffffffff-0001-0000-0000-000000000002','00000000-0004-0000-0000-000000000002','cccccccc-0001-0000-0000-000000000002','00000000-0003-0000-0000-000000000006',899000,0,899000,null,'Active',NOW()-interval '15 days',NOW()+interval '15 days',4,2,4,1,NOW()-interval '15 days',NOW()-interval '5 days'),
-- C03: Active - Member Cường - Elite 6 tháng
('ffffffff-0001-0000-0000-000000000003','00000000-0004-0000-0000-000000000003','cccccccc-0001-0000-0000-000000000003','00000000-0003-0000-0000-000000000006',7999000,0,7999000,'Hội viên VIP, ưu tiên PT Đỗ Hải Đăng','Active',NOW()-interval '60 days',NOW()+interval '120 days',12,8,12,5,NOW()-interval '60 days',null),
-- C04: Active - Member Dung - Basic 1 tháng
('ffffffff-0001-0000-0000-000000000004','00000000-0004-0000-0000-000000000004','cccccccc-0001-0000-0000-000000000001','00000000-0003-0000-0000-000000000006',499000,0,499000,null,'Active',NOW()-interval '10 days',NOW()+interval '20 days',0,0,0,0,NOW()-interval '10 days',null),
-- C05: Active - Member Em - Premium 3 tháng
('ffffffff-0001-0000-0000-000000000005','00000000-0004-0000-0000-000000000005','cccccccc-0001-0000-0000-000000000002','00000000-0003-0000-0000-000000000007',2499000,249900,2249100,'Khuyến mãi mùa hè 10%','Active',NOW()-interval '20 days',NOW()+interval '70 days',4,1,4,2,NOW()-interval '20 days',null),
-- C06: Active - Member Phương - Elite 12 tháng
('ffffffff-0001-0000-0000-000000000006','00000000-0004-0000-0000-000000000006','cccccccc-0001-0000-0000-000000000003','00000000-0003-0000-0000-000000000007',14999000,1499900,13499100,'Gói Elite 1 năm, ưu tiên lịch tập buổi sáng','Active',NOW()-interval '45 days',NOW()+interval '320 days',12,3,12,4,NOW()-interval '45 days',null),
-- C07: Active - Member Giang - Trial 7 ngày
('ffffffff-0001-0000-0000-000000000007','00000000-0004-0000-0000-000000000007','cccccccc-0001-0000-0000-000000000004','00000000-0003-0000-0000-000000000006',0,0,0,'Gói dùng thử miễn phí','Active',NOW()-interval '3 days',NOW()+interval '4 days',0,0,0,0,NOW()-interval '3 days',null),
-- C08: Pending - Member Hương - Basic 1 tháng
('ffffffff-0001-0000-0000-000000000008','00000000-0004-0000-0000-000000000008','cccccccc-0001-0000-0000-000000000001','00000000-0003-0000-0000-000000000006',499000,0,499000,'Chờ thanh toán','Pending',NOW(),NOW()+interval '30 days',0,0,0,0,NOW(),null),
-- C09: Expired - Member Ký - Basic 6 tháng (cũ)
('ffffffff-0001-0000-0000-000000000009','00000000-0004-0000-0000-000000000009','cccccccc-0001-0000-0000-000000000001','00000000-0003-0000-0000-000000000006',2599000,0,2599000,'Gói cũ đã hết hạn','Expired',NOW()-interval '400 days',NOW()-interval '220 days',0,0,0,0,NOW()-interval '400 days',NOW()-interval '220 days'),
-- C10: Active - Member Ký - Basic 3 tháng (gia hạn)
('ffffffff-0001-0000-0000-000000000010','00000000-0004-0000-0000-000000000009','cccccccc-0001-0000-0000-000000000001','00000000-0003-0000-0000-000000000006',1399000,0,1399000,'Gia hạn sau khi hết gói 6 tháng cũ','Active',NOW()-interval '30 days',NOW()+interval '60 days',0,0,0,0,NOW()-interval '30 days',null),
-- C11: Cancelled - Member Lan - Basic 1 tháng
('ffffffff-0001-0000-0000-000000000011','00000000-0004-0000-0000-000000000010','cccccccc-0001-0000-0000-000000000001','00000000-0003-0000-0000-000000000006',499000,0,499000,'Khách yêu cầu hủy vì lý do cá nhân','Cancelled',NOW()-interval '5 days',NOW()+interval '25 days',0,0,0,0,NOW()-interval '5 days',NOW()-interval '1 day');


-- =====================================================
-- CONTRACTS 012+ (Generated dynamically inside 09_invoices.sql to maintain 1-to-1 relationship)
-- =====================================================


-- =====================================================
-- CONTRACT DRAFTS (keep existing)
-- =====================================================
DO $$
DECLARE
  staff_ids uuid[];
  member_ids uuid[];
  pricing_rec record;
  s_count int;
  m_count int;
  created timestamptz;
  expires timestamptz;
  is_used_val boolean;
  note_val text;
  discount_val numeric;
  original_val numeric;
BEGIN
  -- Lấy danh sách Staffs (Sales/Receptionist)
  SELECT ARRAY(SELECT "UserId" FROM "Staffs") INTO staff_ids;
  -- Lấy danh sách Members
  SELECT ARRAY(SELECT "UserId" FROM "Members") INTO member_ids;
  
  s_count := array_length(staff_ids, 1);
  m_count := array_length(member_ids, 1);

  -- Lặp qua 20 bản ghi để tạo draft
  FOR i IN 1..20 LOOP
    -- Chọn ngẫu nhiên/tuần tự một gói pricing
    SELECT "PackagePricingId", "PackageId", "Price"
    INTO pricing_rec
    FROM "PackagePricings"
    OFFSET (i % 10) LIMIT 1;
    
    is_used_val := CASE WHEN i % 3 = 0 THEN true ELSE false END;
    created := NOW() - (i || ' days')::interval - (i * 2 || ' hours')::interval;
    expires := created + interval '2 days';
    
    note_val := CASE 
      WHEN is_used_val THEN 'Đã hoàn tất thanh toán và chuyển thành hợp đồng chính thức.'
      WHEN expires < NOW() THEN 'Hết hạn thanh toán - Khách hàng hẹn suy nghĩ thêm.'
      ELSE 'Đang thương lượng - Gửi báo giá đặc biệt qua email.'
    END;
    
    original_val := pricing_rec."Price";
    discount_val := CASE WHEN i % 4 = 0 THEN ROUND(original_val * 0.05) ELSE 0 END;

    INSERT INTO "ContractDrafts"
        ("DraftId","CreatedByStaffId","MemberUserId","PackageId","PricingId",
         "StartDate","Note","OriginalPrice","DiscountAmount","DealPrice",
         "PromotionIdsJson","IsUsed","CreatedAt","ExpiresAt")
    VALUES (
        gen_random_uuid(),
        staff_ids[(i % s_count) + 1],
        member_ids[(i % m_count) + 1],
        pricing_rec."PackageId",
        pricing_rec."PackagePricingId",
        created + interval '1 day',
        note_val,
        original_val,
        discount_val,
        original_val - discount_val,
        CASE WHEN discount_val > 0 THEN '["eeeeeeee-0002-0000-0000-000000000005"]' ELSE '[]' END,
        is_used_val,
        created,
        expires
    );
  END LOOP;
END $$;
