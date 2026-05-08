using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using backend.Models;

namespace backend.Data;

public class ApplicationDbContext
    : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // ================= USERS =================

    public DbSet<Member> Members => Set<Member>();
    public DbSet<Staff> Staffs => Set<Staff>();
    public DbSet<PTProfile> PTProfiles => Set<PTProfile>();

    // ================= CORE =================

    public DbSet<Branch> Branches => Set<Branch>();
    public DbSet<BranchImage> BranchImages => Set<BranchImage>();

    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<RoomImage> RoomImages => Set<RoomImage>();

    public DbSet<Class> Classes => Set<Class>();
    public DbSet<ClassBooking> ClassBookings => Set<ClassBooking>();

    public DbSet<AccessCard> AccessCards => Set<AccessCard>();
    public DbSet<Attendance> Attendances => Set<Attendance>();

    // ================= SALES =================

    public DbSet<Lead> Leads => Set<Lead>();
    public DbSet<LeadSource> LeadSources => Set<LeadSource>();

    // ================= CONTRACT =================


    public DbSet<Package> Packages => Set<Package>();
    public DbSet<PackagePolicy> PackagePolicies => Set<PackagePolicy>();
    public DbSet<PackageFeature> PackageFeatures => Set<PackageFeature>();
    public DbSet<PackagePricing> PackagePricings => Set<PackagePricing>();
    public DbSet<Contract> Contracts => Set<Contract>();
    public DbSet<ContractAdjust> ContractAdjusts => Set<ContractAdjust>();

    public DbSet<Promotion> Promotions => Set<Promotion>();
    public DbSet<ContractPromotion> ContractPromotions => Set<ContractPromotion>();
    public DbSet<ContractDraft> ContractDrafts => Set<ContractDraft>();

    // ================= BILLING =================

    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Commission> Commissions => Set<Commission>();

    // ================= SYSTEM =================

    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<OtpCode> OtpCodes => Set<OtpCode>();
    public DbSet<LoginHistory> LoginHistories => Set<LoginHistory>();
    public DbSet<Request> Requests => Set<Request>();

    // ================= AI =================

    public DbSet<ChatHistory> ChatHistories => Set<ChatHistory>();
    public DbSet<AIRecommendation> AIRecommendations => Set<AIRecommendation>();
    public DbSet<AIContextCache> AIContextCaches => Set<AIContextCache>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // ================= USER 1-1 MEMBER =================

        builder.Entity<Member>()
            .HasKey(m => m.UserId);

        builder.Entity<Member>()
            .HasOne(m => m.User)
            .WithOne(u => u.Member)
            .HasForeignKey<Member>(m => m.UserId);

        // ================= USER 1-1 STAFF =================

        builder.Entity<Staff>()
            .HasKey(s => s.UserId);

        builder.Entity<Staff>()
            .HasOne(s => s.User)
            .WithOne(u => u.Staff)
            .HasForeignKey<Staff>(s => s.UserId);

        builder.Entity<User>()
            .HasOne(u => u.InitialBranch)
            .WithMany()
            .HasForeignKey(u => u.InitialBranchId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<OtpCode>()
            .HasOne(x => x.User)
            .WithMany(x => x.OtpCodes)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<LoginHistory>()
            .HasOne(x => x.User)
            .WithMany(x => x.LoginHistories)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<PTProfile>()
            .HasKey(x => x.StaffUserId);

        builder.Entity<PTProfile>()
            .HasOne(x => x.Staff)
            .WithOne(x => x.PTProfile)
            .HasForeignKey<PTProfile>(x => x.StaffUserId);

        // ================= CLASS BOOKING (N-N) =================

        builder.Entity<Room>()
            .HasIndex(r => new { r.BranchId, r.RoomNumber })
            .IsUnique();

        builder.Entity<ClassBooking>()
            .HasKey(cb => new { cb.MemberUserId, cb.ClassId });

        builder.Entity<ClassBooking>()
            .HasOne(cb => cb.Member)
            .WithMany(m => m.ClassBookings)
            .HasForeignKey(cb => cb.MemberUserId);

        builder.Entity<ClassBooking>()
            .HasOne(cb => cb.Class)
            .WithMany(c => c.Bookings)
            .HasForeignKey(cb => cb.ClassId);

        // ================= CONTRACT PROMOTION (N-N) =================

        builder.Entity<ContractPromotion>()
            .HasKey(cp => new { cp.ContractId, cp.PromotionId });

        builder.Entity<ContractPromotion>()
            .HasOne(cp => cp.Contract)
            .WithMany(c => c.ContractPromotions)
            .HasForeignKey(cp => cp.ContractId);

        builder.Entity<ContractPromotion>()
            .HasOne(cp => cp.Promotion)
            .WithMany()
            .HasForeignKey(cp => cp.PromotionId);

        // ================= PACKAGE 1-1 PACKAGE POLICY =================

        builder.Entity<PackagePolicy>()
            .HasKey(p => p.PackageId);

        builder.Entity<PackagePolicy>()
            .HasOne(p => p.Package)
            .WithOne(p => p.PackagePolicy)
            .HasForeignKey<PackagePolicy>(p => p.PackageId);

        builder.Entity<PackageFeature>()
            .HasOne(f => f.Package)
            .WithMany(p => p.Features)
            .HasForeignKey(f => f.PackageId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<PackagePricing>()
            .HasOne(p => p.Package)
            .WithMany(p => p.Pricings)
            .HasForeignKey(p => p.PackageId)
            .OnDelete(DeleteBehavior.Cascade);

        // ================= CONTRACT 1-1 INVOICE =================

        builder.Entity<Contract>()
            .HasOne(c => c.Invoice)
            .WithOne(i => i.Contract)
            .HasForeignKey<Invoice>(i => i.ContractId);

        // ================= CONTRACT DRAFT =================

        builder.Entity<ContractDraft>()
            .HasKey(d => d.DraftId);

        builder.Entity<ContractDraft>()
            .HasOne(d => d.CreatedByStaff)
            .WithMany()
            .HasForeignKey(d => d.CreatedByStaffId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<ContractDraft>()
            .HasOne(d => d.Member)
            .WithMany()
            .HasForeignKey(d => d.MemberUserId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Entity<ContractDraft>()
            .HasOne(d => d.Package)
            .WithMany()
            .HasForeignKey(d => d.PackageId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<ContractDraft>()
            .HasOne(d => d.Pricing)
            .WithMany()
            .HasForeignKey(d => d.PricingId)
            .OnDelete(DeleteBehavior.Restrict);

        // ================= INVOICE 1-1 PAYMENT =================

        builder.Entity<Invoice>()
            .HasOne(i => i.Payment)
            .WithOne(p => p.Invoice)
            .HasForeignKey<Payment>(p => p.InvoiceId);

        // ================= LEAD 1-1 MEMBER (Convert) =================

        builder.Entity<Lead>()
            .HasOne(l => l.ConvertedMember)
            .WithOne(m => m.Lead)
            .HasForeignKey<Lead>(l => l.ConvertedMemberUserId)
            .IsRequired(false);

        // ================= STAFF TEACHES CLASS =================

        builder.Entity<Class>()
            .HasOne(c => c.Trainer)
            .WithMany(s => s.TeachingClasses)
            .HasForeignKey(c => c.TrainerStaffId)
            .OnDelete(DeleteBehavior.Restrict);

        // ==== REQUEST =======
        builder.Entity<Request>()
            .HasOne(r => r.User)
            .WithMany(u => u.Requests)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Request>()
            .HasOne(r => r.HandledByUser)
            .WithMany(u => u.HandledRequests)
            .HasForeignKey(r => r.HandledByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // ================= AI CHAT =================

        builder.Entity<ChatHistory>()
            .HasOne(ch => ch.Member)
            .WithMany(m => m.ChatHistories)
            .HasForeignKey(ch => ch.MemberId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<AIRecommendation>()
            .HasOne(r => r.Member)
            .WithMany(m => m.AIRecommendations)
            .HasForeignKey(r => r.MemberId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<AIContextCache>()
            .HasKey(c => c.MemberId);

        builder.Entity<AIContextCache>()
            .HasOne(c => c.Member)
            .WithOne(m => m.AIContextCache)
            .HasForeignKey<AIContextCache>(c => c.MemberId)
            .OnDelete(DeleteBehavior.Cascade);

        // convert all enums to string
        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                var clrType = property.ClrType;

                if (clrType.IsEnum)
                {
                    var converterType = typeof(EnumToStringConverter<>).MakeGenericType(clrType);
                    var converter = (ValueConverter)Activator.CreateInstance(converterType)!;

                    property.SetValueConverter(converter);
                }

                // handle nullable enum
                if (Nullable.GetUnderlyingType(clrType)?.IsEnum == true)
                {
                    var enumType = Nullable.GetUnderlyingType(clrType)!;
                    var converterType = typeof(EnumToStringConverter<>).MakeGenericType(enumType);
                    var converter = (ValueConverter)Activator.CreateInstance(converterType)!;

                    property.SetValueConverter(converter);
                }
            }
        }
    }
}