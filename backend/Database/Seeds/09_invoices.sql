-- =====================================================
-- 09_INVOICES.SQL
-- Seed hóa đơn – đa dạng trạng thái
-- =====================================================

-- =====================================================
-- INVOICES
-- InvoiceStatus: Pending, Paid, Cancelled, Overdue
-- =====================================================
INSERT INTO "Invoices"
    ("InvoiceId","ContractId","MemberId","InvoiceCode",
     "Subtotal","DiscountAmount","TaxAmount","TotalAmount",
     "Status","CreatedByStaffId","CreatedAt","UpdatedAt")
VALUES

-- Invoice 1: PAID - Contract 1 (Member An - Basic 3T)
(
    'aaaaaaab-0001-0000-0000-000000000001',
    'ffffffff-0001-0000-0000-000000000001',
    '00000000-0004-0000-0000-000000000001',
    'INV-2025-001',
    1399000, 139900, 0, 1259100,
    'Paid',
    '00000000-0003-0000-0000-000000000006',
    NOW() - interval '30 days', NOW() - interval '30 days'
),

-- Invoice 2: PAID - Contract 2 (Member Bích - Premium 1T)
(
    'aaaaaaab-0001-0000-0000-000000000002',
    'ffffffff-0001-0000-0000-000000000002',
    '00000000-0004-0000-0000-000000000002',
    'INV-2025-002',
    899000, 0, 0, 899000,
    'Paid',
    '00000000-0003-0000-0000-000000000006',
    NOW() - interval '15 days', NOW() - interval '15 days'
),

-- Invoice 3: PAID - Contract 3 (Member Cường - Elite 6T)
(
    'aaaaaaab-0001-0000-0000-000000000003',
    'ffffffff-0001-0000-0000-000000000003',
    '00000000-0004-0000-0000-000000000003',
    'INV-2025-003',
    7999000, 0, 0, 7999000,
    'Paid',
    '00000000-0003-0000-0000-000000000006',
    NOW() - interval '60 days', NOW() - interval '60 days'
),

-- Invoice 4: PAID - Contract 4 (Member Dung - Basic 1T)
(
    'aaaaaaab-0001-0000-0000-000000000004',
    'ffffffff-0001-0000-0000-000000000004',
    '00000000-0004-0000-0000-000000000004',
    'INV-2025-004',
    499000, 0, 0, 499000,
    'Paid',
    '00000000-0003-0000-0000-000000000006',
    NOW() - interval '10 days', NOW() - interval '10 days'
),

-- Invoice 5: PAID - Contract 5 (Member Em - Premium 3T)
(
    'aaaaaaab-0001-0000-0000-000000000005',
    'ffffffff-0001-0000-0000-000000000005',
    '00000000-0004-0000-0000-000000000005',
    'INV-2025-005',
    2499000, 249900, 0, 2249100,
    'Paid',
    '00000000-0003-0000-0000-000000000007',
    NOW() - interval '20 days', NOW() - interval '20 days'
),

-- Invoice 6: PAID - Contract 6 (Member Phương - Elite 12T)
(
    'aaaaaaab-0001-0000-0000-000000000006',
    'ffffffff-0001-0000-0000-000000000006',
    '00000000-0004-0000-0000-000000000006',
    'INV-2025-006',
    14999000, 1499900, 0, 13499100,
    'Paid',
    '00000000-0003-0000-0000-000000000007',
    NOW() - interval '45 days', NOW() - interval '45 days'
),

-- Invoice 7: PAID - Contract 7 (Member Giang - Trial)
(
    'aaaaaaab-0001-0000-0000-000000000007',
    'ffffffff-0001-0000-0000-000000000007',
    '00000000-0004-0000-0000-000000000007',
    'INV-2025-007',
    0, 0, 0, 0,
    'Paid',
    '00000000-0003-0000-0000-000000000006',
    NOW() - interval '3 days', NOW() - interval '3 days'
),

-- Invoice 8: PENDING - Contract 8 (Member Hương - Basic 1T, chưa thanh toán)
(
    'aaaaaaab-0001-0000-0000-000000000008',
    'ffffffff-0001-0000-0000-000000000008',
    '00000000-0004-0000-0000-000000000008',
    'INV-2025-008',
    499000, 0, 0, 499000,
    'Pending',
    '00000000-0003-0000-0000-000000000006',
    NOW(), null
),

-- Invoice 9: PAID - Contract 9 (Member Ký - Basic 6T - đã hết hạn)
(
    'aaaaaaab-0001-0000-0000-000000000009',
    'ffffffff-0001-0000-0000-000000000009',
    '00000000-0004-0000-0000-000000000009',
    'INV-2024-001',
    2599000, 0, 0, 2599000,
    'Paid',
    '00000000-0003-0000-0000-000000000006',
    NOW() - interval '400 days', NOW() - interval '398 days'
),

-- Invoice 10: PAID - Contract 10 (Member Ký - Basic 3T - gia hạn)
(
    'aaaaaaab-0001-0000-0000-000000000010',
    'ffffffff-0001-0000-0000-000000000010',
    '00000000-0004-0000-0000-000000000009',
    'INV-2025-010',
    1399000, 0, 0, 1399000,
    'Paid',
    '00000000-0003-0000-0000-000000000006',
    NOW() - interval '30 days', NOW() - interval '30 days'
),

-- Invoice 11: CANCELLED - Contract 11 (Member Lan - hủy)
(
    'aaaaaaab-0001-0000-0000-000000000011',
    'ffffffff-0001-0000-0000-000000000011',
    '00000000-0004-0000-0000-000000000010',
    'INV-2025-011',
    499000, 0, 0, 499000,
    'Cancelled',
    '00000000-0003-0000-0000-000000000006',
    NOW() - interval '5 days', NOW() - interval '1 day'
);
