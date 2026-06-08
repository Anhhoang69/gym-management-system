-- =====================================================
-- 02_USERS.SQL
-- Seed tất cả Users (Identity + Roles)
-- Password mặc định: 123456Aa@
-- =====================================================

-- =====================================================
-- NOTE: BCrypt hash của "123456Aa@"
-- Generated bằng ASP.NET Identity v2 password hashing
-- =====================================================

-- =====================================================
-- SUPERADMIN + GYMOWNER
-- =====================================================
INSERT INTO "AspNetUsers"
    ("Id","UserName","NormalizedUserName","Email","NormalizedEmail",
     "EmailConfirmed","PasswordHash","SecurityStamp","ConcurrencyStamp",
     "PhoneNumber","PhoneNumberConfirmed","TwoFactorEnabled",
     "LockoutEnabled","AccessFailedCount",
     "FullName","Gender","Birthday","Address","AvatarUrl",
     "Status","CreatedAt","UpdatedAt","LastLoginAt","InitialBranchId","LanguagePreference")
VALUES
(
    '00000000-0001-0000-0000-000000000001',
    'superadmin@gymfit.vn', 'SUPERADMIN@GYMFIT.VN',
    'superadmin@gymfit.vn', 'SUPERADMIN@GYMFIT.VN',
    true,
    'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',
    gen_random_uuid()::text, gen_random_uuid()::text,
    '0901000001', false, false, true, 0,
    'Quản Trị Viên Hệ Thống', 'Male', '1985-03-15',
    '123 Nguyễn Huệ, Quận 1, TP.HCM', null,
    'Active', NOW() - interval '365 days', null, NOW() - interval '1 day',
    null, 'vi'
),
(
    '00000000-0002-0000-0000-000000000001',
    'gymowner@gymfit.vn', 'GYMOWNER@GYMFIT.VN',
    'gymowner@gymfit.vn', 'GYMOWNER@GYMFIT.VN',
    true,
    'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',
    gen_random_uuid()::text, gen_random_uuid()::text,
    '0901000002', false, false, true, 0,
    'Trần Minh Khoa', 'Male', '1980-07-22',
    '456 Lê Lợi, Quận 1, TP.HCM', null,
    'Active', NOW() - interval '300 days', null, NOW() - interval '2 days',
    null, 'vi'
);

-- =====================================================
-- STAFF USERS (36 staff, 6 chi nhánh)
-- =====================================================
INSERT INTO "AspNetUsers"
    ("Id","UserName","NormalizedUserName","Email","NormalizedEmail",
     "EmailConfirmed","PasswordHash","SecurityStamp","ConcurrencyStamp",
     "PhoneNumber","PhoneNumberConfirmed","TwoFactorEnabled",
     "LockoutEnabled","AccessFailedCount",
     "FullName","Gender","Birthday","Address","AvatarUrl",
     "Status","CreatedAt","UpdatedAt","LastLoginAt","InitialBranchId","LanguagePreference")
VALUES
-- Q1 BranchAdmin
('00000000-0003-0000-0000-000000000001','branchadmin.q1@gymfit.vn','BRANCHADMIN.Q1@GYMFIT.VN','branchadmin.q1@gymfit.vn','BRANCHADMIN.Q1@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000003',false,false,true,0,'Nguyễn Thị Lan','Female','1990-05-10','12 Hai Bà Trưng, Quận 1, TP.HCM',null,'Active',NOW()-interval '365 days',null,NOW()-interval '1 day',null,'vi'),
-- Q7 BranchAdmin
('00000000-0003-0000-0000-000000000002','branchadmin.q7@gymfit.vn','BRANCHADMIN.Q7@GYMFIT.VN','branchadmin.q7@gymfit.vn','BRANCHADMIN.Q7@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000004',false,false,true,0,'Lê Văn Hùng','Male','1988-11-30','89 Nguyễn Thị Thập, Quận 7, TP.HCM',null,'Active',NOW()-interval '300 days',null,NOW()-interval '3 days',null,'vi'),
-- Q1 PT
('00000000-0003-0000-0000-000000000003','pt.nguyen@gymfit.vn','PT.NGUYEN@GYMFIT.VN','pt.nguyen@gymfit.vn','PT.NGUYEN@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000005',false,false,true,0,'Phạm Quốc Tuấn','Male','1993-02-14','55 Trần Hưng Đạo, Quận 1, TP.HCM',null,'Active',NOW()-interval '310 days',null,NOW()-interval '1 day',null,'vi'),
-- Q7 PT
('00000000-0003-0000-0000-000000000004','pt.mai@gymfit.vn','PT.MAI@GYMFIT.VN','pt.mai@gymfit.vn','PT.MAI@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000006',false,false,true,0,'Vũ Thị Mai','Female','1995-08-20','200 Nguyễn Lương Bằng, Quận 7, TP.HCM',null,'Active',NOW()-interval '285 days',null,NOW()-interval '2 days',null,'vi'),
-- Q1 HeadPT
('00000000-0003-0000-0000-000000000005','headpt.q1@gymfit.vn','HEADPT.Q1@GYMFIT.VN','headpt.q1@gymfit.vn','HEADPT.Q1@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000007',false,false,true,0,'Đỗ Hải Đăng','Male','1989-04-05','77 Pasteur, Quận 1, TP.HCM',null,'Active',NOW()-interval '350 days',null,NOW()-interval '1 day',null,'vi'),
-- Q1 Sales
('00000000-0003-0000-0000-000000000006','sales.q1@gymfit.vn','SALES.Q1@GYMFIT.VN','sales.q1@gymfit.vn','SALES.Q1@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000008',false,false,true,0,'Hoàng Thị Ngọc','Female','1997-12-03','34 Bùi Viện, Quận 1, TP.HCM',null,'Active',NOW()-interval '320 days',null,NOW()-interval '1 day',null,'vi'),
-- Q7 Sales
('00000000-0003-0000-0000-000000000007','sales.q7@gymfit.vn','SALES.Q7@GYMFIT.VN','sales.q7@gymfit.vn','SALES.Q7@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000009',false,false,true,0,'Bùi Thành Long','Male','1994-09-17','145 Lê Văn Lương, Quận 7, TP.HCM',null,'Active',NOW()-interval '280 days',null,NOW()-interval '2 days',null,'vi'),
-- Q1 Receptionist
('00000000-0003-0000-0000-000000000008','receptionist.q1@gymfit.vn','RECEPTIONIST.Q1@GYMFIT.VN','receptionist.q1@gymfit.vn','RECEPTIONIST.Q1@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000010',false,false,true,0,'Trịnh Thị Hoa','Female','1998-06-25','9 Đinh Tiên Hoàng, Quận 1, TP.HCM',null,'Active',NOW()-interval '300 days',null,NOW()-interval '1 day',null,'vi'),
-- Q7 HeadPT
('00000000-0003-0000-0000-000000000009','headpt.q7@gymfit.vn','HEADPT.Q7@GYMFIT.VN','headpt.q7@gymfit.vn','HEADPT.Q7@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000011',false,false,true,0,'Trần Văn Phong','Male','1987-06-15','210 Nguyễn Thị Thập, Quận 7, TP.HCM',null,'Active',NOW()-interval '295 days',null,NOW()-interval '1 day',null,'vi'),
-- Q1 PT #2
('00000000-0003-0000-0000-000000000010','pt.chau@gymfit.vn','PT.CHAU@GYMFIT.VN','pt.chau@gymfit.vn','PT.CHAU@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000012',false,false,true,0,'Lê Thị Minh Châu','Female','1994-03-22','66 Phạm Ngũ Lão, Quận 1, TP.HCM',null,'Active',NOW()-interval '260 days',null,NOW()-interval '2 days',null,'vi'),
-- Q7 PT #2
('00000000-0003-0000-0000-000000000011','pt.hung@gymfit.vn','PT.HUNG@GYMFIT.VN','pt.hung@gymfit.vn','PT.HUNG@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000013',false,false,true,0,'Đinh Quốc Hưng','Male','1993-08-10','78 Lê Văn Thiêm, Quận 7, TP.HCM',null,'Active',NOW()-interval '250 days',null,NOW()-interval '3 days',null,'vi'),
-- Q1 Sales #2
('00000000-0003-0000-0000-000000000012','sales2.q1@gymfit.vn','SALES2.Q1@GYMFIT.VN','sales2.q1@gymfit.vn','SALES2.Q1@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000014',false,false,true,0,'Vũ Minh Tuấn','Male','1996-11-05','15 Cô Giang, Quận 1, TP.HCM',null,'Active',NOW()-interval '180 days',null,NOW()-interval '1 day',null,'vi'),
-- Q7 Sales #2
('00000000-0003-0000-0000-000000000013','sales2.q7@gymfit.vn','SALES2.Q7@GYMFIT.VN','sales2.q7@gymfit.vn','SALES2.Q7@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000015',false,false,true,0,'Phan Thị Thu','Female','1995-07-18','90 Nguyễn Đức Cảnh, Quận 7, TP.HCM',null,'Active',NOW()-interval '170 days',null,NOW()-interval '2 days',null,'vi'),
-- Q7 Receptionist
('00000000-0003-0000-0000-000000000014','receptionist.q7@gymfit.vn','RECEPTIONIST.Q7@GYMFIT.VN','receptionist.q7@gymfit.vn','RECEPTIONIST.Q7@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000016',false,false,true,0,'Nguyễn Thị Kiều','Female','1998-09-30','155 Hoàng Diệu, Quận 4, TP.HCM',null,'Active',NOW()-interval '150 days',null,NOW()-interval '1 day',null,'vi'),
-- Q1 Receptionist #2
('00000000-0003-0000-0000-000000000015','receptionist2.q1@gymfit.vn','RECEPTIONIST2.Q1@GYMFIT.VN','receptionist2.q1@gymfit.vn','RECEPTIONIST2.Q1@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000017',false,false,true,0,'Ngô Văn Khải','Male','2000-01-12','44 Ngô Quyền, Quận 5, TP.HCM',null,'Active',NOW()-interval '90 days',null,NOW()-interval '1 day',null,'vi'),
-- TD BranchAdmin
('00000000-0003-0000-0000-000000000016','branchadmin.td@gymfit.vn','BRANCHADMIN.TD@GYMFIT.VN','branchadmin.td@gymfit.vn','BRANCHADMIN.TD@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000018',false,false,true,0,'Lý Minh Khoa','Male','1988-04-20','789 Phạm Văn Đồng, Thủ Đức, TP.HCM',null,'Active',NOW()-interval '245 days',null,NOW()-interval '1 day',null,'vi'),
-- TD HeadPT
('00000000-0003-0000-0000-000000000017','headpt.td@gymfit.vn','HEADPT.TD@GYMFIT.VN','headpt.td@gymfit.vn','HEADPT.TD@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000019',false,false,true,0,'Trần Hữu Nghĩa','Male','1990-12-08','500 Kha Vạn Cân, Thủ Đức, TP.HCM',null,'Active',NOW()-interval '240 days',null,NOW()-interval '2 days',null,'vi'),
-- TD PT
('00000000-0003-0000-0000-000000000018','pt.td@gymfit.vn','PT.TD@GYMFIT.VN','pt.td@gymfit.vn','PT.TD@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000020',false,false,true,0,'Phạm Thị Hằng','Female','1995-06-14','100 Võ Văn Ngân, Thủ Đức, TP.HCM',null,'Active',NOW()-interval '235 days',null,NOW()-interval '3 days',null,'vi'),
-- TD Sales #1
('00000000-0003-0000-0000-000000000019','sales1.td@gymfit.vn','SALES1.TD@GYMFIT.VN','sales1.td@gymfit.vn','SALES1.TD@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000021',false,false,true,0,'Đỗ Thành Đạt','Male','1994-02-28','250 Lê Văn Việt, Thủ Đức, TP.HCM',null,'Active',NOW()-interval '230 days',null,NOW()-interval '1 day',null,'vi'),
-- TD Sales #2
('00000000-0003-0000-0000-000000000020','sales2.td@gymfit.vn','SALES2.TD@GYMFIT.VN','sales2.td@gymfit.vn','SALES2.TD@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000022',false,false,true,0,'Cao Thị Lan','Female','1997-09-16','300 Hoàng Diệu 2, Thủ Đức, TP.HCM',null,'Active',NOW()-interval '220 days',null,NOW()-interval '2 days',null,'vi'),
-- TD Receptionist
('00000000-0003-0000-0000-000000000021','receptionist.td@gymfit.vn','RECEPTIONIST.TD@GYMFIT.VN','receptionist.td@gymfit.vn','RECEPTIONIST.TD@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000023',false,false,true,0,'Nguyễn Anh Tuấn','Male','1999-05-03','400 Tô Ngọc Vân, Thủ Đức, TP.HCM',null,'Active',NOW()-interval '215 days',null,NOW()-interval '1 day',null,'vi'),
-- BT BranchAdmin
('00000000-0003-0000-0000-000000000022','branchadmin.bt@gymfit.vn','BRANCHADMIN.BT@GYMFIT.VN','branchadmin.bt@gymfit.vn','BRANCHADMIN.BT@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000024',false,false,true,0,'Trần Thị Duyên','Female','1989-08-25','78 Điện Biên Phủ, Bình Thạnh, TP.HCM',null,'Active',NOW()-interval '120 days',null,NOW()-interval '1 day',null,'vi'),
-- BT PT
('00000000-0003-0000-0000-000000000023','pt.bt@gymfit.vn','PT.BT@GYMFIT.VN','pt.bt@gymfit.vn','PT.BT@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000025',false,false,true,0,'Lê Văn Sơn','Male','1993-10-17','50 Nơ Trang Long, Bình Thạnh, TP.HCM',null,'Active',NOW()-interval '115 days',null,NOW()-interval '2 days',null,'vi'),
-- BT Sales #1
('00000000-0003-0000-0000-000000000024','sales1.bt@gymfit.vn','SALES1.BT@GYMFIT.VN','sales1.bt@gymfit.vn','SALES1.BT@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000026',false,false,true,0,'Hồ Thị Nga','Female','1996-03-09','120 Bạch Đằng, Bình Thạnh, TP.HCM',null,'Active',NOW()-interval '110 days',null,NOW()-interval '1 day',null,'vi'),
-- BT Sales #2
('00000000-0003-0000-0000-000000000025','sales2.bt@gymfit.vn','SALES2.BT@GYMFIT.VN','sales2.bt@gymfit.vn','SALES2.BT@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000027',false,false,true,0,'Võ Minh Trang','Female','1997-11-22','30 Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM',null,'Active',NOW()-interval '108 days',null,NOW()-interval '2 days',null,'vi'),
-- BT Receptionist
('00000000-0003-0000-0000-000000000026','receptionist.bt@gymfit.vn','RECEPTIONIST.BT@GYMFIT.VN','receptionist.bt@gymfit.vn','RECEPTIONIST.BT@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0901000028',false,false,true,0,'Mai Thị Linh','Female','2000-07-14','200 Bình Quới, Bình Thạnh, TP.HCM',null,'Active',NOW()-interval '105 days',null,NOW()-interval '1 day',null,'vi'),
-- BD BranchAdmin
('00000000-0003-0000-0000-000000000027','branchadmin.bd@gymfit.vn','BRANCHADMIN.BD@GYMFIT.VN','branchadmin.bd@gymfit.vn','BRANCHADMIN.BD@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0274000001',false,false,true,0,'Nguyễn Văn Tài','Male','1987-01-30','200 Đại lộ Bình Dương, Bình Dương',null,'Active',NOW()-interval '118 days',null,NOW()-interval '1 day',null,'vi'),
-- BD PT
('00000000-0003-0000-0000-000000000028','pt.bd@gymfit.vn','PT.BD@GYMFIT.VN','pt.bd@gymfit.vn','PT.BD@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0274000002',false,false,true,0,'Trần Hoài Nam','Male','1992-05-08','50 Hùng Vương, Thủ Dầu Một, Bình Dương',null,'Active',NOW()-interval '115 days',null,NOW()-interval '2 days',null,'vi'),
-- BD Sales #1
('00000000-0003-0000-0000-000000000029','sales1.bd@gymfit.vn','SALES1.BD@GYMFIT.VN','sales1.bd@gymfit.vn','SALES1.BD@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0274000003',false,false,true,0,'Lê Thị Thanh','Female','1995-12-19','100 Lê Hồng Phong, Bình Dương',null,'Active',NOW()-interval '112 days',null,NOW()-interval '1 day',null,'vi'),
-- BD Sales #2
('00000000-0003-0000-0000-000000000030','sales2.bd@gymfit.vn','SALES2.BD@GYMFIT.VN','sales2.bd@gymfit.vn','SALES2.BD@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0274000004',false,false,true,0,'Phạm Văn Bình','Male','1996-08-07','80 Yersin, Thủ Dầu Một, Bình Dương',null,'Active',NOW()-interval '110 days',null,NOW()-interval '2 days',null,'vi'),
-- BD Receptionist
('00000000-0003-0000-0000-000000000031','receptionist.bd@gymfit.vn','RECEPTIONIST.BD@GYMFIT.VN','receptionist.bd@gymfit.vn','RECEPTIONIST.BD@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0274000005',false,false,true,0,'Hoàng Thị Mai','Female','1999-04-25','60 Phú Lợi, Thủ Dầu Một, Bình Dương',null,'Active',NOW()-interval '108 days',null,NOW()-interval '1 day',null,'vi'),
-- DN BranchAdmin
('00000000-0003-0000-0000-000000000032','branchadmin.dn@gymfit.vn','BRANCHADMIN.DN@GYMFIT.VN','branchadmin.dn@gymfit.vn','BRANCHADMIN.DN@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0236000001',false,false,true,0,'Lê Thanh Hải','Male','1986-03-12','88 Nguyễn Văn Linh, Thanh Khê, Đà Nẵng',null,'Active',NOW()-interval '38 days',null,NOW()-interval '1 day',null,'vi'),
-- DN PT
('00000000-0003-0000-0000-000000000033','pt.dn@gymfit.vn','PT.DN@GYMFIT.VN','pt.dn@gymfit.vn','PT.DN@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0236000002',false,false,true,0,'Nguyễn Thị Hoa','Female','1994-07-28','45 Phan Chu Trinh, Hải Châu, Đà Nẵng',null,'Active',NOW()-interval '35 days',null,NOW()-interval '2 days',null,'vi'),
-- DN Sales #1
('00000000-0003-0000-0000-000000000034','sales1.dn@gymfit.vn','SALES1.DN@GYMFIT.VN','sales1.dn@gymfit.vn','SALES1.DN@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0236000003',false,false,true,0,'Trần Minh Quân','Male','1995-10-15','20 Trần Phú, Hải Châu, Đà Nẵng',null,'Active',NOW()-interval '33 days',null,NOW()-interval '1 day',null,'vi'),
-- DN Sales #2
('00000000-0003-0000-0000-000000000035','sales2.dn@gymfit.vn','SALES2.DN@GYMFIT.VN','sales2.dn@gymfit.vn','SALES2.DN@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0236000004',false,false,true,0,'Đỗ Thị Phúc','Female','1997-02-03','100 Lê Duẩn, Hải Châu, Đà Nẵng',null,'Active',NOW()-interval '30 days',null,NOW()-interval '2 days',null,'vi'),
-- DN Receptionist
('00000000-0003-0000-0000-000000000036','receptionist.dn@gymfit.vn','RECEPTIONIST.DN@GYMFIT.VN','receptionist.dn@gymfit.vn','RECEPTIONIST.DN@GYMFIT.VN',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0236000005',false,false,true,0,'Cao Văn Long','Male','1999-08-20','50 Hùng Vương, Hải Châu, Đà Nẵng',null,'Active',NOW()-interval '28 days',null,NOW()-interval '1 day',null,'vi');

-- =====================================================
-- MEMBER USERS (001-010) — giữ nguyên existing
-- =====================================================
INSERT INTO "AspNetUsers"
    ("Id","UserName","NormalizedUserName","Email","NormalizedEmail",
     "EmailConfirmed","PasswordHash","SecurityStamp","ConcurrencyStamp",
     "PhoneNumber","PhoneNumberConfirmed","TwoFactorEnabled",
     "LockoutEnabled","AccessFailedCount",
     "FullName","Gender","Birthday","Address","AvatarUrl",
     "Status","CreatedAt","UpdatedAt","LastLoginAt","InitialBranchId","LanguagePreference")
VALUES
('00000000-0004-0000-0000-000000000001','nguyen.van.an@gmail.com','NGUYEN.VAN.AN@GMAIL.COM','nguyen.van.an@gmail.com','NGUYEN.VAN.AN@GMAIL.COM',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0912345001',false,false,true,0,'Nguyễn Văn An','Male','1995-03-20','25 Lý Tự Trọng, Quận 1, TP.HCM',null,'Active',NOW()-interval '180 days',null,NOW()-interval '5 days',null,'vi'),
('00000000-0004-0000-0000-000000000002','tran.thi.bich@gmail.com','TRAN.THI.BICH@GMAIL.COM','tran.thi.bich@gmail.com','TRAN.THI.BICH@GMAIL.COM',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0912345002',false,false,true,0,'Trần Thị Bích','Female','1998-07-15','67 Nguyễn Đình Chiểu, Quận 3, TP.HCM',null,'Active',NOW()-interval '150 days',null,NOW()-interval '3 days',null,'vi'),
('00000000-0004-0000-0000-000000000003','le.duc.cuong@gmail.com','LE.DUC.CUONG@GMAIL.COM','le.duc.cuong@gmail.com','LE.DUC.CUONG@GMAIL.COM',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0912345003',false,false,true,0,'Lê Đức Cường','Male','1992-11-08','14 Trần Phú, Quận 5, TP.HCM',null,'Active',NOW()-interval '120 days',null,NOW()-interval '7 days',null,'vi'),
('00000000-0004-0000-0000-000000000004','pham.thi.dung@gmail.com','PHAM.THI.DUNG@GMAIL.COM','pham.thi.dung@gmail.com','PHAM.THI.DUNG@GMAIL.COM',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0912345004',false,false,true,0,'Phạm Thị Dung','Female','2000-01-30','88 Cách Mạng Tháng 8, Quận 3, TP.HCM',null,'Active',NOW()-interval '90 days',null,NOW()-interval '2 days',null,'vi'),
('00000000-0004-0000-0000-000000000005','hoang.van.em@gmail.com','HOANG.VAN.EM@GMAIL.COM','hoang.van.em@gmail.com','HOANG.VAN.EM@GMAIL.COM',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0912345005',false,false,true,0,'Hoàng Văn Em','Male','1993-05-22','320 Lý Thường Kiệt, Quận 10, TP.HCM',null,'Active',NOW()-interval '60 days',null,NOW()-interval '10 days',null,'vi'),
('00000000-0004-0000-0000-000000000006','vo.thi.phuong@gmail.com','VO.THI.PHUONG@GMAIL.COM','vo.thi.phuong@gmail.com','VO.THI.PHUONG@GMAIL.COM',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0912345006',false,false,true,0,'Võ Thị Phương','Female','1996-09-12','200 Nguyễn Lương Bằng, Quận 7, TP.HCM',null,'Active',NOW()-interval '45 days',null,NOW()-interval '4 days',null,'vi'),
('00000000-0004-0000-0000-000000000007','dang.minh.giang@gmail.com','DANG.MINH.GIANG@GMAIL.COM','dang.minh.giang@gmail.com','DANG.MINH.GIANG@GMAIL.COM',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0912345007',false,false,true,0,'Đặng Minh Giang','Male','1991-12-25','102 Điện Biên Phủ, Bình Thạnh, TP.HCM',null,'Active',NOW()-interval '30 days',null,NOW()-interval '1 day',null,'vi'),
('00000000-0004-0000-0000-000000000008','nguyen.thi.huong@gmail.com','NGUYEN.THI.HUONG@GMAIL.COM','nguyen.thi.huong@gmail.com','NGUYEN.THI.HUONG@GMAIL.COM',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0912345008',false,false,true,0,'Nguyễn Thị Hương','Female','1999-04-18','56 Hoàng Văn Thụ, Phú Nhuận, TP.HCM',null,'Active',NOW()-interval '20 days',null,NOW()-interval '2 days',null,'vi'),
('00000000-0004-0000-0000-000000000009','tran.van.ky@gmail.com','TRAN.VAN.KY@GMAIL.COM','tran.van.ky@gmail.com','TRAN.VAN.KY@GMAIL.COM',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0912345009',false,false,true,0,'Trần Văn Ký','Male','1997-08-03','78 Võ Thị Sáu, Quận 3, TP.HCM',null,'Active',NOW()-interval '400 days',null,NOW()-interval '60 days',null,'vi'),
('00000000-0004-0000-0000-000000000010','ly.thi.lan@gmail.com','LY.THI.LAN@GMAIL.COM','ly.thi.lan@gmail.com','LY.THI.LAN@GMAIL.COM',true,'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',gen_random_uuid()::text,gen_random_uuid()::text,'0912345010',false,false,true,0,'Lý Thị Lan','Female','2001-02-14','33 Nguyễn Trãi, Quận 5, TP.HCM',null,'Active',NOW()-interval '10 days',null,null,null,'vi');

-- =====================================================
-- MEMBER USERS (011-230) — Generate via DO block
-- =====================================================
DO $$
DECLARE
  last_names  text[] := ARRAY['Nguyễn','Trần','Lê','Phạm','Hoàng','Huỳnh','Vũ','Võ','Đặng','Bùi',
                               'Đỗ','Hồ','Ngô','Dương','Lý','Đinh','Tô','Trịnh','Cao','Lâm',
                               'Chu','Phùng','Tạ','Mai','Phan'];
  male_names  text[] := ARRAY['Văn Phong','Văn Đức','Văn Sơn','Văn Tùng','Văn Hải',
                               'Minh Khoa','Minh Long','Minh Nam','Minh Trí','Minh Quân',
                               'Đức Thắng','Đức Tài','Đức Trung','Đức Lâm','Đức Bảo',
                               'Thành Hùng','Thành Khánh','Thành Mạnh','Thành Đạt','Hữu Thịnh',
                               'Hữu Nhân','Hữu Phúc'];
  female_names text[] := ARRAY['Thị Ánh','Thị Nhung','Thị Châu','Thị Diệu','Thị Giang',
                                'Thị Hoa','Thị Lương','Thị Khanh','Thị Ngân','Thị Linh',
                                'Thị Mai','Thị Hạnh','Thị Oanh','Thị Thảo','Thị Quyên',
                                'Thị Sen','Thị Trúc','Thị Uyên','Thị Vân','Thị Xuân',
                                'Ngọc Anh','Kim Chi'];
  addresses   text[] := ARRAY[
    '25 Lý Tự Trọng, Quận 1, TP.HCM',
    '67 Nguyễn Đình Chiểu, Quận 3, TP.HCM',
    '14 Trần Phú, Quận 5, TP.HCM',
    '88 Cách Mạng Tháng 8, Quận 3, TP.HCM',
    '320 Lý Thường Kiệt, Quận 10, TP.HCM',
    '200 Nguyễn Lương Bằng, Quận 7, TP.HCM',
    '102 Điện Biên Phủ, Bình Thạnh, TP.HCM',
    '56 Hoàng Văn Thụ, Phú Nhuận, TP.HCM',
    '78 Võ Thị Sáu, Quận 3, TP.HCM',
    '33 Nguyễn Trãi, Quận 5, TP.HCM',
    '145 Lê Văn Lương, Quận 7, TP.HCM',
    '9 Đinh Tiên Hoàng, Quận 1, TP.HCM',
    '789 Phạm Văn Đồng, Thủ Đức, TP.HCM',
    '100 Kha Vạn Cân, Thủ Đức, TP.HCM',
    '500 Võ Văn Ngân, Thủ Đức, TP.HCM',
    '200 Đại lộ Bình Dương, Bình Dương',
    '88 Nguyễn Văn Linh, Đà Nẵng',
    '45 Phạm Ngọc Thạch, Quận 3, TP.HCM',
    '34 Bùi Viện, Quận 1, TP.HCM',
    '77 Pasteur, Quận 1, TP.HCM'
  ];
  n           int;
  i           int;
  gender      text;
  fullname    text;
  last_name   text;
  given_name  text;
  birth_year  int;
  birth_month int;
  birth_day   int;
  days_ago    int;
  em          text;
  nm_em       text;
  ph          text;
  user_uuid   uuid;
BEGIN
  FOR n IN 11..230 LOOP
    i := n - 11;
    gender      := CASE WHEN i % 2 = 0 THEN 'Male' ELSE 'Female' END;
    last_name   := last_names[(i % 25) + 1];
    IF gender = 'Male' THEN
      given_name := male_names[((i / 2) % 22) + 1];
    ELSE
      given_name := female_names[((i / 2) % 22) + 1];
    END IF;
    fullname    := last_name || ' ' || given_name;
    birth_year  := 1985 + (i % 17);
    birth_month := (i * 3 % 12) + 1;
    birth_day   := (i * 7 % 28) + 1;
    days_ago    := GREATEST(2, 350 - i);
    em          := 'm' || lpad(n::text, 3, '0') || '@gmail.com';
    nm_em       := upper(em);
    ph          := '091234' || lpad(n::text, 4, '0');
    user_uuid   := ('00000000-0004-0000-0000-' || lpad(n::text, 12, '0'))::uuid;

    INSERT INTO "AspNetUsers"
        ("Id","UserName","NormalizedUserName","Email","NormalizedEmail",
         "EmailConfirmed","PasswordHash","SecurityStamp","ConcurrencyStamp",
         "PhoneNumber","PhoneNumberConfirmed","TwoFactorEnabled",
         "LockoutEnabled","AccessFailedCount",
         "FullName","Gender","Birthday","Address","AvatarUrl",
         "Status","CreatedAt","UpdatedAt","LastLoginAt","InitialBranchId","LanguagePreference")
    VALUES (
        user_uuid, em, nm_em, em, nm_em, true,
        'AQAAAAIAAYagAAAAEEZHuz/Qg2ZmcmuHRexDLjBEPacgsZCXoFgmiUx09yjegLgFdVKOH8bzC6sjRRTxmg==',
        gen_random_uuid()::text, gen_random_uuid()::text,
        ph, false, false, true, 0,
        fullname, gender,
        make_date(birth_year, birth_month, birth_day),
        addresses[(i % 20) + 1], null,
        'Active',
        NOW() - (days_ago || ' days')::interval,
        null, null, null, 'vi'
    );
  END LOOP;
END $$;

-- =====================================================
-- USER - ROLE ASSIGNMENTS
-- SuperAdmin, GymOwner
-- =====================================================
INSERT INTO "AspNetUserRoles" ("UserId", "RoleId")
VALUES
    ('00000000-0001-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001'),
    ('00000000-0002-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002');

-- Staff roles (001-036)
INSERT INTO "AspNetUserRoles" ("UserId", "RoleId")
SELECT ('00000000-0003-0000-0000-' || lpad(n::text, 12, '0'))::uuid,
       '11111111-0000-0000-0000-000000000003'
FROM generate_series(1, 36) n;

-- Member roles (001-230)
INSERT INTO "AspNetUserRoles" ("UserId", "RoleId")
SELECT ('00000000-0004-0000-0000-' || lpad(n::text, 12, '0'))::uuid,
       '11111111-0000-0000-0000-000000000004'
FROM generate_series(1, 230) n;
