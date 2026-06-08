-- =====================================================
-- 10_PAYMENTS.SQL
-- Seed thanh toán cho tất cả Paid invoices
-- PaymentMethod: Cash, BankTransfer, Card, EWallet, QRCode
-- PaymentStatus: Pending, Completed, Failed, Refunded
-- =====================================================

-- =====================================================
-- PAYMENTS cho 10 invoices cũ đã PAID
-- =====================================================
INSERT INTO "Payments"
    ("PaymentId","InvoiceId","Method","RefNo","Amount",
     "Status","ProcessedBy","ProcessedByStaffId",
     "CreatedAt","UpdatedAt")
VALUES
-- P01: Member An Basic 3T
(gen_random_uuid(),'aaaaaaab-0001-0000-0000-000000000001','BankTransfer','TXN202504150001',1259100,'Completed','00000000-0003-0000-0000-000000000006','00000000-0003-0000-0000-000000000006',NOW()-interval '28 days',NOW()-interval '28 days'),
-- P02: Member Bích Premium 1T
(gen_random_uuid(),'aaaaaaab-0001-0000-0000-000000000002','EWallet','MOMO202504150002',899000,'Completed','00000000-0003-0000-0000-000000000006','00000000-0003-0000-0000-000000000006',NOW()-interval '14 days',NOW()-interval '14 days'),
-- P03: Member Cường Elite 6T
(gen_random_uuid(),'aaaaaaab-0001-0000-0000-000000000003','BankTransfer','TXN202503150003',7999000,'Completed','00000000-0003-0000-0000-000000000006','00000000-0003-0000-0000-000000000006',NOW()-interval '58 days',NOW()-interval '58 days'),
-- P04: Member Dung Basic 1T
(gen_random_uuid(),'aaaaaaab-0001-0000-0000-000000000004','Cash',null,499000,'Completed','00000000-0003-0000-0000-000000000008','00000000-0003-0000-0000-000000000008',NOW()-interval '9 days',NOW()-interval '9 days'),
-- P05: Member Em Premium 3T
(gen_random_uuid(),'aaaaaaab-0001-0000-0000-000000000005','QRCode','QR202504200005',2249100,'Completed','00000000-0003-0000-0000-000000000007','00000000-0003-0000-0000-000000000007',NOW()-interval '18 days',NOW()-interval '18 days'),
-- P06: Member Phương Elite 12T
(gen_random_uuid(),'aaaaaaab-0001-0000-0000-000000000006','BankTransfer','TXN202503100006',13499100,'Completed','00000000-0003-0000-0000-000000000007','00000000-0003-0000-0000-000000000007',NOW()-interval '43 days',NOW()-interval '43 days'),
-- P07: Member Giang Trial
(gen_random_uuid(),'aaaaaaab-0001-0000-0000-000000000007','Cash',null,0,'Completed','00000000-0003-0000-0000-000000000008','00000000-0003-0000-0000-000000000008',NOW()-interval '3 days',NOW()-interval '3 days'),
-- P09: Member Ký cũ Basic 6T
(gen_random_uuid(),'aaaaaaab-0001-0000-0000-000000000009','Cash',null,2599000,'Completed','00000000-0003-0000-0000-000000000008','00000000-0003-0000-0000-000000000008',NOW()-interval '398 days',NOW()-interval '398 days'),
-- P10: Member Ký mới Basic 3T
(gen_random_uuid(),'aaaaaaab-0001-0000-0000-000000000010','EWallet','MOMO202504150010',1399000,'Completed','00000000-0003-0000-0000-000000000006','00000000-0003-0000-0000-000000000006',NOW()-interval '29 days',NOW()-interval '29 days');

-- =====================================================
-- PAYMENTS BULK — tương ứng với Paid invoices bulk
-- Tạo payment record cho mỗi Paid invoice từ bulk insert
-- =====================================================
DO $$
DECLARE
  methods   text[] := ARRAY['Cash','BankTransfer','Card','EWallet','QRCode','BankTransfer','EWallet','QRCode'];
  staff_ids uuid[] := ARRAY[
    '00000000-0003-0000-0000-000000000008'::uuid,
    '00000000-0003-0000-0000-000000000014'::uuid,
    '00000000-0003-0000-0000-000000000021'::uuid,
    '00000000-0003-0000-0000-000000000026'::uuid,
    '00000000-0003-0000-0000-000000000031'::uuid,
    '00000000-0003-0000-0000-000000000036'::uuid
  ];

  inv       record;
  n         int := 0;
  method    text;
  staff_id  uuid;
  ref_no    text;
BEGIN
  FOR inv IN
    SELECT "InvoiceId", "TotalAmount", "UpdatedAt", "CreatedAt"
    FROM "Invoices"
    WHERE "Status" = 'Paid'
      AND "InvoiceId" NOT IN (
        'aaaaaaab-0001-0000-0000-000000000001'::uuid,
        'aaaaaaab-0001-0000-0000-000000000002'::uuid,
        'aaaaaaab-0001-0000-0000-000000000003'::uuid,
        'aaaaaaab-0001-0000-0000-000000000004'::uuid,
        'aaaaaaab-0001-0000-0000-000000000005'::uuid,
        'aaaaaaab-0001-0000-0000-000000000006'::uuid,
        'aaaaaaab-0001-0000-0000-000000000007'::uuid,
        'aaaaaaab-0001-0000-0000-000000000008'::uuid,
        'aaaaaaab-0001-0000-0000-000000000009'::uuid,
        'aaaaaaab-0001-0000-0000-000000000010'::uuid,
        'aaaaaaab-0001-0000-0000-000000000011'::uuid
      )
      AND "UpdatedAt" IS NOT NULL
    ORDER BY "UpdatedAt"
  LOOP
    n := n + 1;
    method   := methods[(n % 8) + 1];
    staff_id := staff_ids[(n % 6) + 1];

    ref_no := CASE method
      WHEN 'BankTransfer' THEN 'TXN' || to_char(inv."UpdatedAt", 'YYYYMMDD') || lpad(n::text, 4, '0')
      WHEN 'EWallet'      THEN 'MOMO' || to_char(inv."UpdatedAt", 'YYYYMMDD') || lpad(n::text, 4, '0')
      WHEN 'Card'         THEN 'CARD' || to_char(inv."UpdatedAt", 'YYYYMMDD') || lpad(n::text, 4, '0')
      WHEN 'QRCode'       THEN 'QR' || to_char(inv."UpdatedAt", 'YYYYMMDD') || lpad(n::text, 4, '0')
      ELSE null  -- Cash: no ref
    END;

    INSERT INTO "Payments"
        ("PaymentId","InvoiceId","Method","RefNo","Amount",
         "Status","ProcessedBy","ProcessedByStaffId",
         "CreatedAt","UpdatedAt")
    VALUES (
        gen_random_uuid(),
        inv."InvoiceId",
        method,
        ref_no,
        inv."TotalAmount",
        'Completed',
        staff_id,
        staff_id,
        COALESCE(inv."UpdatedAt", inv."CreatedAt"),
        COALESCE(inv."UpdatedAt", inv."CreatedAt")
    );
  END LOOP;
END $$;
