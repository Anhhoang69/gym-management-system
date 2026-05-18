-- =====================================================
-- 10_PAYMENTS.SQL
-- Seed thanh toán – liên kết hóa đơn đã PAID
-- =====================================================

-- =====================================================
-- PAYMENTS
-- PaymentMethod: Cash, BankTransfer, Card, EWallet, QRCode
-- PaymentStatus: Pending, Completed, Failed, Refunded
-- =====================================================
INSERT INTO "Payments"
    ("PaymentId","InvoiceId","Method","RefNo","Amount",
     "Status","ProcessedBy","ProcessedByStaffId",
     "CreatedAt","UpdatedAt")
VALUES

-- Payment 1: Contract 1 (Member An - Basic 3T) - BankTransfer
(
    gen_random_uuid(),
    'aaaaaaab-0001-0000-0000-000000000001',
    'BankTransfer',
    'TXN202504150001',
    1259100,
    'Completed',
    '00000000-0003-0000-0000-000000000006',
    '00000000-0003-0000-0000-000000000006',
    NOW() - interval '30 days', NOW() - interval '30 days'
),

-- Payment 2: Contract 2 (Member Bích - Premium 1T) - EWallet (MoMo)
(
    gen_random_uuid(),
    'aaaaaaab-0001-0000-0000-000000000002',
    'EWallet',
    'MOMO2025041500002',
    899000,
    'Completed',
    '00000000-0003-0000-0000-000000000006',
    '00000000-0003-0000-0000-000000000006',
    NOW() - interval '15 days', NOW() - interval '15 days'
),

-- Payment 3: Contract 3 (Member Cường - Elite 6T) - Card
(
    gen_random_uuid(),
    'aaaaaaab-0001-0000-0000-000000000003',
    'Card',
    'CARD4532****1234',
    7999000,
    'Completed',
    '00000000-0003-0000-0000-000000000008',
    '00000000-0003-0000-0000-000000000008',
    NOW() - interval '60 days', NOW() - interval '60 days'
),

-- Payment 4: Contract 4 (Member Dung - Basic 1T) - Cash
(
    gen_random_uuid(),
    'aaaaaaab-0001-0000-0000-000000000004',
    'Cash',
    null,
    499000,
    'Completed',
    '00000000-0003-0000-0000-000000000008',
    '00000000-0003-0000-0000-000000000008',
    NOW() - interval '10 days', NOW() - interval '10 days'
),

-- Payment 5: Contract 5 (Member Em - Premium 3T) - QRCode
(
    gen_random_uuid(),
    'aaaaaaab-0001-0000-0000-000000000005',
    'QRCode',
    'QR20250430T0005',
    2249100,
    'Completed',
    '00000000-0003-0000-0000-000000000007',
    '00000000-0003-0000-0000-000000000007',
    NOW() - interval '20 days', NOW() - interval '20 days'
),

-- Payment 6: Contract 6 (Member Phương - Elite 12T) - BankTransfer
(
    gen_random_uuid(),
    'aaaaaaab-0001-0000-0000-000000000006',
    'BankTransfer',
    'TXN202503200006',
    13499100,
    'Completed',
    '00000000-0003-0000-0000-000000000007',
    '00000000-0003-0000-0000-000000000007',
    NOW() - interval '45 days', NOW() - interval '45 days'
),

-- Payment 7: Contract 7 (Member Giang - Trial - free)
(
    gen_random_uuid(),
    'aaaaaaab-0001-0000-0000-000000000007',
    'Cash',
    null,
    0,
    'Completed',
    '00000000-0003-0000-0000-000000000006',
    '00000000-0003-0000-0000-000000000006',
    NOW() - interval '3 days', NOW() - interval '3 days'
),

-- Payment 9: Contract 9 (Member Ký - cũ đã hết hạn) - Cash
(
    gen_random_uuid(),
    'aaaaaaab-0001-0000-0000-000000000009',
    'Cash',
    null,
    2599000,
    'Completed',
    '00000000-0003-0000-0000-000000000006',
    '00000000-0003-0000-0000-000000000006',
    NOW() - interval '400 days', NOW() - interval '400 days'
),

-- Payment 10: Contract 10 (Member Ký - gia hạn) - EWallet
(
    gen_random_uuid(),
    'aaaaaaab-0001-0000-0000-000000000010',
    'EWallet',
    'MOMO2025041500010',
    1399000,
    'Completed',
    '00000000-0003-0000-0000-000000000006',
    '00000000-0003-0000-0000-000000000006',
    NOW() - interval '30 days', NOW() - interval '30 days'
);

-- NOTE: Invoice 8 (Pending) và Invoice 11 (Cancelled) không có Payment
