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
        await SeedBranch(context);
        await SeedSystemUsers(userManager);
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

    // ================= SYSTEM USERS =================

    private static async Task SeedSystemUsers(UserManager<User> userManager)
    {
        await EnsureUserAsync(
            userManager,
            email: "superadmin@gym.com",
            fullName: "System Super Admin",
            phoneNumber: "0900000000",
            password: "Admin@123",
            roleName: "SuperAdmin");

        await EnsureUserAsync(
            userManager,
            email: "gymowner@gym.com",
            fullName: "System Gym Owner",
            phoneNumber: "0900000009",
            password: "Owner@123",
            roleName: "GymOwner");
    }

    private static async Task<User> EnsureUserAsync(
        UserManager<User> userManager,
        string email,
        string fullName,
        string phoneNumber,
        string password,
        string roleName)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        var normalizedPhone = new string(phoneNumber.Where(char.IsDigit).ToArray());

        var user = await userManager.FindByEmailAsync(normalizedEmail);
        if (user == null)
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                Email = normalizedEmail,
                UserName = normalizedEmail,
                FullName = fullName,
                PhoneNumber = normalizedPhone,
                TwoFactorEnabled = false,
                CreatedAt = DateTime.UtcNow
            };

            var createResult = await userManager.CreateAsync(user, password);
            if (!createResult.Succeeded)
                throw new InvalidOperationException(string.Join("; ", createResult.Errors.Select(x => x.Description)));
        }
        else
        {
            user.FullName = fullName;
            user.PhoneNumber = normalizedPhone;
            user.UserName = normalizedEmail;
            user.TwoFactorEnabled = false;
            user.UpdatedAt = DateTime.UtcNow;
            await userManager.UpdateAsync(user);
        }

        if (!await userManager.IsInRoleAsync(user, roleName))
            await userManager.AddToRoleAsync(user, roleName);

        return user;
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
            FullName = "Sales Staff",
            PhoneNumber = "0900000011"
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
            FullName = "Trainer PT",
            PhoneNumber = "0900000012"
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
            FullName = "Demo Member",
            PhoneNumber = "0900000013"
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