using backend.Data;
using backend.Enums;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class GymDataService
{
    private readonly ApplicationDbContext _context;

    public GymDataService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> GetMembershipInfoAsync(Guid memberId)
    {
        var contract = await _context.Contracts
            .Include(c => c.Package)
            .Where(c => c.MemberUserId == memberId && c.Status == ContractStatus.Active)
            .OrderByDescending(c => c.StartDate)
            .FirstOrDefaultAsync();

        if (contract == null)
            return "Bạn chưa có gói tập đang hoạt động.";

        var remaining = (contract.EndDate - DateTime.UtcNow).Days;
        var privateSessions = contract.TotalPrivateSessions - contract.UsedPrivateSessions;
        var groupSessions = contract.TotalGroupSessions - contract.UsedGroupSessions;

        return $@"📋 Thông tin gói tập của bạn:
- Gói: {contract.Package.Name} ({contract.Package.Tier})
- Thời hạn: {contract.StartDate:dd/MM/yyyy} → {contract.EndDate:dd/MM/yyyy}
- Còn lại: {remaining} ngày
- Buổi tập PT còn lại: {privateSessions}/{contract.TotalPrivateSessions}
- Buổi tập nhóm còn lại: {groupSessions}/{contract.TotalGroupSessions}
- Giá: {contract.DealPrice:N0} VNĐ";
    }

    public async Task<string> GetScheduleInfoAsync(Guid memberId)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var bookings = await _context.ClassBookings
            .Include(cb => cb.Class)
                .ThenInclude(c => c.Room)
            .Include(cb => cb.Class)
                .ThenInclude(c => c.Trainer)
                    .ThenInclude(s => s.User)
            .Where(cb => cb.MemberUserId == memberId
                && cb.Status == BookingStatus.Booked
                && cb.Class.Date >= today)
            .OrderBy(cb => cb.Class.Date)
                .ThenBy(cb => cb.Class.StartTime)
            .Take(5)
            .ToListAsync();

        if (bookings.Count == 0)
            return "Bạn chưa có lịch học sắp tới. Hãy đăng ký lớp học để bắt đầu!";

        var lines = bookings.Select(b =>
            $"- {b.Class.Date:dd/MM} | {b.Class.StartTime:HH:mm}-{b.Class.EndTime:HH:mm} | {b.Class.Title} | PT: {b.Class.Trainer.User.FullName ?? "N/A"} | Phòng: {b.Class.Room.RoomNumber}");

        return $"📅 Lịch học sắp tới:\n{string.Join("\n", lines)}";
    }

    public async Task<string> GetAttendanceInfoAsync(Guid memberId)
    {
        var now = DateTime.UtcNow;
        var startOfWeek = now.AddDays(-(int)now.DayOfWeek);
        var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        var weekCount = await _context.Attendances
            .CountAsync(a => a.MemberUserId == memberId && a.CheckinAt >= startOfWeek);

        var monthCount = await _context.Attendances
            .CountAsync(a => a.MemberUserId == memberId && a.CheckinAt >= startOfMonth);

        var totalCount = await _context.Attendances
            .CountAsync(a => a.MemberUserId == memberId);

        return $@"📊 Thống kê điểm danh:
- Tuần này: {weekCount} lần
- Tháng này: {monthCount} lần
- Tổng cộng: {totalCount} lần";
    }

    public async Task<string> GetPackageInfoAsync()
    {
        var packages = await _context.Packages
            .Include(p => p.Pricings)
            .Include(p => p.Features)
            .Where(p => p.Status == PackageStatus.Active)
            .OrderBy(p => p.DisplayOrder)
            .ToListAsync();

        if (packages.Count == 0)
            return "Hiện tại chưa có gói tập nào.";

        var lines = packages.Select(p =>
        {
            var minPrice = p.Pricings.Any()
                ? p.Pricings.Min(pr => pr.Price).ToString("N0") + " VNĐ"
                : "Liên hệ";
            var features = p.Features.Any()
                ? string.Join(", ", p.Features.Select(f => f.Content))
                : "N/A";
            return $"- {p.Name} ({p.Tier}) | Từ {minPrice} | PT: {(p.IsPtIncluded ? "Có" : "Không")} | Features: {features}";
        });

        return $"💪 Các gói tập hiện có:\n{string.Join("\n", lines)}";
    }

    private static readonly TimeSpan CacheTtl = TimeSpan.FromHours(6);

    public async Task<string> GetCachedOrBuildContextAsync(Guid memberId)
    {
        var cache = await _context.AIContextCaches
            .FirstOrDefaultAsync(c => c.MemberId == memberId);

        // Cache hit: return if still fresh
        if (cache != null && DateTime.UtcNow - cache.UpdatedAt < CacheTtl)
            return cache.CachedContext;

        // Cache miss or stale: rebuild from DB
        var freshContext = await BuildUserContextAsync(memberId);

        if (cache == null)
        {
            // Insert new cache entry
            _context.AIContextCaches.Add(new AIContextCache
            {
                MemberId = memberId,
                CachedContext = freshContext,
                UpdatedAt = DateTime.UtcNow
            });
        }
        else
        {
            // Update existing cache entry
            cache.CachedContext = freshContext;
            cache.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return freshContext;
    }

    public async Task InvalidateCacheAsync(Guid memberId)
    {
        var cache = await _context.AIContextCaches
            .FirstOrDefaultAsync(c => c.MemberId == memberId);

        if (cache != null)
        {
            // Set UpdatedAt far in the past to force rebuild on next chat
            cache.UpdatedAt = DateTime.MinValue;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<string> BuildUserContextAsync(Guid memberId)
    {
        var user = await _context.Users
            .Include(u => u.Member)
            .FirstOrDefaultAsync(u => u.Id == memberId);

        if (user == null)
            return "No user data available.";

        // Age
        var age = user.Birthday.HasValue
            ? (DateTime.UtcNow.Year - user.Birthday.Value.Year).ToString()
            : "Unknown";

        // Gender
        var gender = user.Gender?.ToString() ?? "Unknown";

        // Active contract
        var contract = await _context.Contracts
            .Include(c => c.Package)
            .Where(c => c.MemberUserId == memberId && c.Status == ContractStatus.Active)
            .OrderByDescending(c => c.StartDate)
            .FirstOrDefaultAsync();

        var packageInfo = contract != null
            ? $"{contract.Package.Name} ({contract.Package.Tier}), expires {contract.EndDate:dd/MM/yyyy}"
            : "No active package";

        // Attendance frequency
        var now = DateTime.UtcNow;
        var thirtyDaysAgo = now.AddDays(-30);
        var recentAttendance = await _context.Attendances
            .CountAsync(a => a.MemberUserId == memberId && a.CheckinAt >= thirtyDaysAgo);
        var weeklyAvg = Math.Round(recentAttendance / 4.0, 1);

        // Upcoming classes
        var today = DateOnly.FromDateTime(now);
        var upcomingClasses = await _context.ClassBookings
            .Include(cb => cb.Class)
            .Where(cb => cb.MemberUserId == memberId
                && cb.Status == BookingStatus.Booked
                && cb.Class.Date >= today)
            .CountAsync();

        return $@"User Profile:
- Name: {user.FullName ?? "N/A"}
- Age: {age}
- Gender: {gender}
- Current Package: {packageInfo}
- Check-in last 30 days: {recentAttendance} times (~{weeklyAvg}/week)
- Upcoming booked classes: {upcomingClasses}";
    }
}
