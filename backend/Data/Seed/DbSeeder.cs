using backend.Models;
using backend.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Seed;

public static class DbSeeder
{
    public static async Task SeedAsync(
        ApplicationDbContext context,
        UserManager<User> userManager,
        RoleManager<IdentityRole<Guid>> roleManager)
    {
        await context.Database.MigrateAsync();

        await SeedRoles(roleManager);
        await SeedAdmin(userManager);
        await SeedBranch(context);
        await SeedRooms(context);
        await SeedPackages(context);
        await SeedStaff(context, userManager);
        await SeedMembers(context, userManager);
        await SeedPromotion(context, userManager);
        await SeedLeadSources(context);
    }

    // ================= LEAD SOURCES =================

    private static async Task SeedLeadSources(ApplicationDbContext context)
    {
        if (context.LeadSources.Any()) return;

        context.LeadSources.AddRange(
            new LeadSource { Id = Guid.NewGuid(), Name = "Facebook", Score = 20, IsActive = true },
            new LeadSource { Id = Guid.NewGuid(), Name = "Referral", Score = 30, IsActive = true },
            new LeadSource { Id = Guid.NewGuid(), Name = "Walk-in", Score = 25, IsActive = true }
        );

        await context.SaveChangesAsync();
    }

    // ================= ROLES =================

    private static async Task SeedRoles(RoleManager<IdentityRole<Guid>> roleManager)
    {
        string[] roles =
        {
            "SuperAdmin",
            "GymOwner",
            "Staff",
            "Member"
        };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>
                {
                    Name = role
                });
            }
        }
    }

    // ================= SUPER ADMIN =================

    private static async Task SeedAdmin(UserManager<User> userManager)
    {
        var email = "admin@gym.com";

        var admin = await userManager.FindByEmailAsync(email);

        if (admin != null) return;

        admin = new User
        {
            Id = Guid.NewGuid(),
            Email = email,
            UserName = email,
            FullName = "Super Admin"
        };

        await userManager.CreateAsync(admin, "Admin@123");

        await userManager.AddToRoleAsync(admin, "SuperAdmin");
    }

    // ================= BRANCH =================

    private static async Task SeedBranch(ApplicationDbContext context)
    {
        if (context.Branches.Any()) return;

        context.Branches.AddRange(
            new Branch
            {
                BranchId = Guid.NewGuid(),
                Name = "Gym District 1",
                Address = "Ho Chi Minh City",
                Email = "d1@gym.com",
                Hotline = "0900000001"
            },
            new Branch
            {
                BranchId = Guid.NewGuid(),
                Name = "Gym District 7",
                Address = "Ho Chi Minh City",
                Email = "d7@gym.com",
                Hotline = "0900000002"
            }
        );

        await context.SaveChangesAsync();
    }

    // ================= ROOMS =================

    private static async Task SeedRooms(ApplicationDbContext context)
    {
        if (context.Rooms.Any()) return;

        var branch = await context.Branches.FirstAsync();

        context.Rooms.AddRange(
            new Room
            {
                RoomId = Guid.NewGuid(),
                Name = "Yoga Room",
                Capacity = 20,
                BranchId = branch.BranchId
            },
            new Room
            {
                RoomId = Guid.NewGuid(),
                Name = "Cardio Room",
                Capacity = 30,
                BranchId = branch.BranchId
            }
        );

        await context.SaveChangesAsync();
    }

    // ================= PACKAGE =================

    private static async Task SeedPackages(ApplicationDbContext context)
    {
        if (context.Packages.Any()) return;

        var package = new Package
        {
            PackageId = Guid.NewGuid(),
            Name = "Basic 1 Month",
            // Duration = 30,
            // BasePrice = 500000,
            PrivatePtLimit = 0,
            GroupPtLimit = 5
        };

        context.Packages.Add(package);

        context.PackagePolicies.Add(
            new PackagePolicy
            {
                PackageId = package.PackageId,
                ChangeFeeDefault = 100000,
                UpgradeAllowed = true,
                DowngradeAllowed = false,
                FreezeAllowed = true,
                MaxFreezeDays = 7
            });

        await context.SaveChangesAsync();
    }

    // ================= STAFF =================

    private static async Task SeedStaff(
        ApplicationDbContext context,
        UserManager<User> userManager)
    {
        if (context.Staffs.Any()) return;

        var branch = await context.Branches.FirstAsync();

        // SALES
        var salesUser = new User
        {
            Id = Guid.NewGuid(),
            Email = "sales@gym.com",
            UserName = "sales@gym.com",
            FullName = "Sales Staff"
        };

        await userManager.CreateAsync(salesUser, "User@123");
        await userManager.AddToRoleAsync(salesUser, "Staff");

        context.Staffs.Add(new Staff
        {
            UserId = salesUser.Id,
            BranchId = branch.BranchId,
            Position = StaffPosition.Sales
        });

        // PT
        var ptUser = new User
        {
            Id = Guid.NewGuid(),
            Email = "pt@gym.com",
            UserName = "pt@gym.com",
            FullName = "Trainer PT"
        };

        await userManager.CreateAsync(ptUser, "User@123");
        await userManager.AddToRoleAsync(ptUser, "Staff");

        context.Staffs.Add(new Staff
        {
            UserId = ptUser.Id,
            BranchId = branch.BranchId,
            Position = StaffPosition.PT
        });

        await context.SaveChangesAsync();
    }

    // ================= MEMBER =================

    private static async Task SeedMembers(
        ApplicationDbContext context,
        UserManager<User> userManager)
    {
        if (context.Members.Any()) return;

        var memberUser = new User
        {
            Id = Guid.NewGuid(),
            Email = "member@gym.com",
            UserName = "member@gym.com",
            FullName = "Demo Member"
        };

        await userManager.CreateAsync(memberUser, "User@123");
        await userManager.AddToRoleAsync(memberUser, "Member");

        context.Members.Add(new Member
        {
            UserId = memberUser.Id
        });

        await context.SaveChangesAsync();
    }

    // ================= PROMOTION =================

    private static async Task SeedPromotion(
        ApplicationDbContext context,
        UserManager<User> userManager)
    {
        if (context.Promotions.Any()) return;

        var admin = await userManager.Users.FirstAsync();

        context.Promotions.Add(
            new Promotion
            {
                PromotionId = Guid.NewGuid(),
                Name = "Opening Discount",
                DiscountValue = 10,
                DiscountType = DiscountType.Percentage,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddMonths(3),
                MaxUsage = 100,
                CreatedByUserId = admin.Id
            });

        await context.SaveChangesAsync();
    }
}