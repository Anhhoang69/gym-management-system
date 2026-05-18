namespace backend.Helpers;

public static class AuthorizationRoles
{
    public const string SuperAdmin = "SuperAdmin";
    public const string GymOwner = "GymOwner";
    public const string Staff = "Staff";
    public const string Member = "Member";

    public const string SuperAdminOnly = SuperAdmin;
    public const string GymOwnerOnly = GymOwner;
    public const string MemberOnly = Member;
    public const string StaffRoles = Staff;

    public const string AdminRoles = SuperAdmin + "," + GymOwner + "," + Staff;
    public const string StaffOrSuperAdmin = SuperAdmin + "," + Staff;
    public const string LeadManagementRoles = StaffOrSuperAdmin;
    public const string AuditLogRoles = SuperAdmin + "," + GymOwner + "," + Staff;

    /// <summary>Dành cho quick-register: chỉ Receptionist + BranchAdmin + SuperAdmin (không phải Sales/PT)</summary>
    public const string QuickRegisterRoles = SuperAdmin + "," + GymOwner + "," + Staff;
}