-- =====================================================
-- 01_ROLES.SQL
-- Seed ASP.NET Identity Roles
-- =====================================================

-- =====================================================
-- ROLES (AspNetRoles)
-- =====================================================
INSERT INTO "AspNetRoles" ("Id", "Name", "NormalizedName", "ConcurrencyStamp")
VALUES
    ('11111111-0000-0000-0000-000000000001', 'SuperAdmin',  'SUPERADMIN',  gen_random_uuid()::text),
    ('11111111-0000-0000-0000-000000000002', 'GymOwner',    'GYMOWNER',    gen_random_uuid()::text),
    ('11111111-0000-0000-0000-000000000003', 'Staff',       'STAFF',       gen_random_uuid()::text),
    ('11111111-0000-0000-0000-000000000004', 'Member',      'MEMBER',      gen_random_uuid()::text);
