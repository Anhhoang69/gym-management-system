using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using backend.Data;
using backend.DTOs.Attendance;
using backend.Enums;
using backend.Interfaces;
using backend.Models;

namespace backend.Services;

public class AttendanceService : IAttendanceService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public AttendanceService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }



    public async Task<AttendanceDto> CheckInAsync(CheckInRequestDto dto)
    {
        var card = await _context.AccessCards
            .Include(c => c.Member).ThenInclude(m => m.User)
            .Include(c => c.Member).ThenInclude(m => m.Contracts).ThenInclude(ct => ct.Package).ThenInclude(p => p.PackagePolicy)
            .FirstOrDefaultAsync(c => c.CardCode == dto.CardNumber);

        if (card == null || card.Status != AccessCardStatus.Active)
            throw new Exception("Invalid or inactive card");

        var activeContract = card.Member.Contracts
            .FirstOrDefault(c => c.Status == ContractStatus.Active && c.EndDate >= DateTime.UtcNow);

        if (activeContract == null)
            throw new Exception("No active contract found");

        var homeBranchId = card.Member.User.InitialBranchId;
        if (!activeContract.Package.PackagePolicy.AllowMultiBranch && homeBranchId != dto.BranchId)
        {
            throw new Exception("Your package only allows check-in at your home branch");
        }

        // Check if already checked in and not checked out
        var existing = await _context.Attendances
            .OrderByDescending(a => a.CheckinAt)
            .FirstOrDefaultAsync(a => a.CardId == card.AccessCardId && a.CheckinAt.Date == DateTime.UtcNow.Date);

        if (existing != null && existing.CheckoutAt == null)
            throw new Exception("Already checked in");

        var attendance = new Attendance
        {
            AttendanceId = Guid.NewGuid(),
            MemberUserId = card.MemberUserId,
            CardId = card.AccessCardId,
            BranchId = dto.BranchId,
            CheckinAt = DateTime.UtcNow
        };

        _context.Attendances.Add(attendance);
        await _context.SaveChangesAsync();

        // Load branch for mapping
        await _context.Entry(attendance).Reference(a => a.Branch).LoadAsync();

        return _mapper.Map<AttendanceDto>(attendance);
    }

    public async Task<AttendanceDto> CheckOutAsync(CheckInRequestDto dto)
    {
        var card = await _context.AccessCards.FirstOrDefaultAsync(c => c.CardCode == dto.CardNumber);
        if (card == null) throw new Exception("Card not found");

        var attendance = await _context.Attendances
            .Include(a => a.Member).ThenInclude(m => m.User)
            .Include(a => a.Branch)
            .Where(a => a.CardId == card.AccessCardId && a.BranchId == dto.BranchId && a.CheckoutAt == null)
            .OrderByDescending(a => a.CheckinAt)
            .FirstOrDefaultAsync();

        if (attendance == null)
            throw new Exception("No active check-in found to check out");

        attendance.CheckoutAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return _mapper.Map<AttendanceDto>(attendance);
    }

    public async Task<AttendanceDto> ManualCheckInAsync(ManualCheckInDto dto, Guid staffUserId)
    {
        var member = await _context.Members
            .Include(m => m.User)
            .Include(m => m.Contracts).ThenInclude(ct => ct.Package).ThenInclude(p => p.PackagePolicy)
            .Include(m => m.AccessCard)
            .FirstOrDefaultAsync(m => m.UserId == dto.MemberUserId);

        if (member == null) throw new Exception("Member not found");

        var activeContract = member.Contracts
            .FirstOrDefault(c => c.Status == ContractStatus.Active && c.EndDate >= DateTime.UtcNow);

        if (activeContract == null)
            throw new Exception("No active contract found");

        var homeBranchId = member.User.InitialBranchId;
        if (!activeContract.Package.PackagePolicy.AllowMultiBranch && homeBranchId != dto.BranchId)
        {
            throw new Exception("Package only allows check-in at home branch");
        }

        var cardId = member.AccessCard?.AccessCardId ?? Guid.Empty;

        var attendance = new Attendance
        {
            AttendanceId = Guid.NewGuid(),
            MemberUserId = dto.MemberUserId,
            CardId = cardId != Guid.Empty ? cardId : Guid.NewGuid(), // Fallback if no card
            BranchId = dto.BranchId,
            CheckinAt = DateTime.UtcNow
        };

        _context.Attendances.Add(attendance);
        await _context.SaveChangesAsync();

        await _context.Entry(attendance).Reference(a => a.Branch).LoadAsync();

        return _mapper.Map<AttendanceDto>(attendance);
    }

    public async Task<List<AttendanceDto>> GetMyAttendanceAsync(Guid memberUserId)
    {
        return await _context.Attendances
            .Include(a => a.Member).ThenInclude(m => m.User)
            .Include(a => a.Branch)
            .Where(a => a.MemberUserId == memberUserId)
            .OrderByDescending(a => a.CheckinAt)
            .ProjectTo<AttendanceDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<List<AttendanceDto>> GetBranchAttendanceAsync(Guid branchId, DateOnly? date)
    {
        var query = _context.Attendances
            .Include(a => a.Member).ThenInclude(m => m.User)
            .Include(a => a.Branch)
            .Where(a => a.BranchId == branchId);

        if (date.HasValue)
        {
            var startOfDay = date.Value.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
            var endOfDay = startOfDay.AddDays(1);
            query = query.Where(a => a.CheckinAt >= startOfDay && a.CheckinAt < endOfDay);
        }

        return await query.OrderByDescending(a => a.CheckinAt)
            .ProjectTo<AttendanceDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<List<AttendanceDto>> GetMemberAttendanceAsync(Guid memberUserId)
    {
        return await _context.Attendances
            .Include(a => a.Member).ThenInclude(m => m.User)
            .Include(a => a.Branch)
            .Where(a => a.MemberUserId == memberUserId)
            .OrderByDescending(a => a.CheckinAt)
            .ProjectTo<AttendanceDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }
}
