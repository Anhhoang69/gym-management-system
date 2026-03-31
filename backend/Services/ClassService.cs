using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs.Class;
using backend.Enums;
using backend.Interfaces;
using backend.Models;

namespace backend.Services;

public class ClassService : IClassService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IAuditLogService _auditLogService;

    public ClassService(ApplicationDbContext context, IMapper mapper, IAuditLogService auditLogService)
    {
        _context = context;
        _mapper = mapper;
        _auditLogService = auditLogService;
    }

    // ================= LIST =================

    public async Task<List<ClassDto>> GetClassesAsync()
    {
        return await _context.Classes
            .Include(x => x.Trainer)
                .ThenInclude(t => t.User)
            .Include(x => x.Room)
                .ThenInclude(r => r.Branch)
            .Include(x => x.Bookings)
            .AsNoTracking()
            .OrderBy(x => x.Date)
            .ThenBy(x => x.StartTime)
            .ProjectTo<ClassDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }

    // ================= DETAIL =================

    public async Task<ClassDto?> GetClassAsync(Guid id)
    {
        return await _context.Classes
            .Include(x => x.Trainer)
                .ThenInclude(t => t.User)
            .Include(x => x.Room)
                .ThenInclude(r => r.Branch)
            .Include(x => x.Bookings)
            .Where(x => x.ClassId == id)
            .ProjectTo<ClassDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();
    }

    // ================= CREATE =================

    public async Task<Guid> CreateClassAsync(
        CreateClassDto dto,
        Guid userId)
    {
        var room = await _context.Rooms.FindAsync(dto.RoomId);

        if (room == null)
            throw new Exception("Room not found");

        if (dto.Capacity > room.Capacity)
            throw new Exception("Class capacity exceeds room capacity");

        // trainer conflict
        var trainerConflict = await _context.Classes.AnyAsync(x =>
            x.TrainerStaffId == dto.TrainerStaffId &&
            x.Date == dto.Date &&
            x.StartTime < dto.EndTime &&
            dto.StartTime < x.EndTime);

        if (trainerConflict)
            throw new Exception("Trainer schedule conflict");

        // room conflict
        var roomConflict = await _context.Classes.AnyAsync(x =>
            x.RoomId == dto.RoomId &&
            x.Date == dto.Date &&
            x.StartTime < dto.EndTime &&
            dto.StartTime < x.EndTime);

        if (roomConflict)
            throw new Exception("Room schedule conflict");

        var entity = _mapper.Map<Class>(dto);

        entity.ClassId = Guid.NewGuid();

        _context.Classes.Add(entity);

        _auditLogService.Add(_auditLogService.CreateLog(
            userId,
            "Class",
            entity.ClassId,
            "CreateClass"));

        await _context.SaveChangesAsync();

        return entity.ClassId;
    }

    // ================= UPDATE =================

    public async Task<bool> UpdateClassAsync(
        Guid id,
        UpdateClassDto dto,
        Guid userId)
    {
        var @class = await _context.Classes.FindAsync(id);

        if (@class == null)
            return false;

        if (@class.Status == ClassStatus.Completed)
            throw new Exception("Cannot update completed class");

        _mapper.Map(dto, @class);

        _auditLogService.Add(_auditLogService.CreateLog(
            userId,
            "Class",
            id,
            "UpdateClass"));

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UpdateClassStatusAsync(Guid id, ClassStatus status, Guid userId)
    {
        var @class = await _context.Classes.FindAsync(id);

        if (@class == null)
            return false;

        @class.Status = status;

        _auditLogService.Add(_auditLogService.CreateLog(
            userId,
            "Class",
            id,
            $"UpdateClassStatus:{status}"));

        await _context.SaveChangesAsync();

        return true;
    }

    // ================= DELETE =================

    public async Task<bool> DeleteClassAsync(Guid id, Guid userId)
    {
        var entity = await _context.Classes
            .FirstOrDefaultAsync(x => x.ClassId == id);

        if (entity == null)
            return false;

        // không cho xóa class đã hoàn thành
        if (entity.Status == ClassStatus.Completed)
            throw new Exception("Cannot delete completed class");

        // check booking
        var hasBookings = await _context.ClassBookings
            .AnyAsync(x => x.ClassId == id);

        if (hasBookings)
            throw new Exception("Class has bookings");

        _context.Classes.Remove(entity);

        _auditLogService.Add(_auditLogService.CreateLog(
            userId,
            "Class",
            id,
            "DeleteClass"));

        await _context.SaveChangesAsync();

        return true;
    }

    // ================= BOOKING =================

    public async Task<bool> BookClassAsync(Guid classId, Guid memberUserId)
    {
        var @class = await _context.Classes
            .FirstOrDefaultAsync(x => x.ClassId == classId);

        if (@class == null)
            throw new Exception("Class not found");

        if (@class.Status != ClassStatus.Scheduled)
            throw new Exception("Class is not available for booking");

        // Check for schedule conflict
        var conflict = await _context.ClassBookings
            .Include(x => x.Class)
            .AnyAsync(x =>
                x.MemberUserId == memberUserId &&
                x.Status == BookingStatus.Booked &&
                x.Class.Date == @class.Date &&
                x.Class.StartTime < @class.EndTime &&
                @class.StartTime < x.Class.EndTime);

        if (conflict)
            throw new Exception("Schedule conflict: You have another booked class at this time");

        // Check existing booking
        var existing = await _context.ClassBookings
            .FirstOrDefaultAsync(x =>
                x.ClassId == classId &&
                x.MemberUserId == memberUserId);

        if (existing != null)
        {
            if (existing.Status == BookingStatus.Cancelled)
            {
                existing.Status = BookingStatus.Booked;
                existing.CancelReason = null;
                existing.CancelledAt = null;
            }
            else
            {
                throw new Exception("You have already booked this class");
            }
        }
        else
        {
            // Check capacity
            var bookedCount = await _context.ClassBookings
                .CountAsync(x =>
                    x.ClassId == classId &&
                    x.Status == BookingStatus.Booked);

            if (bookedCount >= @class.Capacity)
                throw new Exception("Class is full");

            _context.ClassBookings.Add(new ClassBooking
            {
                ClassId = classId,
                MemberUserId = memberUserId,
                BookedAt = DateTime.UtcNow,
                Status = BookingStatus.Booked
            });
        }

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> CancelBookingAsync(Guid classId, Guid memberUserId, string cancelReason)
    {
        var booking = await _context.ClassBookings
            .FirstOrDefaultAsync(b => b.ClassId == classId && b.MemberUserId == memberUserId);

        if (booking == null)
            throw new Exception("Booking not found");

        if (booking.Status != BookingStatus.Booked)
            throw new Exception("Booking is not active");

        booking.Status = BookingStatus.Cancelled;
        booking.CancelReason = cancelReason;
        booking.CancelledAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<List<ClassBookingDto>> GetMyBookingsAsync(Guid memberUserId)
    {
        return await _context.ClassBookings
            .Include(b => b.Class)
                .ThenInclude(c => c.Trainer)
                    .ThenInclude(t => t.User)
            .Include(b => b.Class)
                .ThenInclude(c => c.Room)
            .Where(b => b.MemberUserId == memberUserId)
            .OrderByDescending(b => b.BookedAt)
            .ProjectTo<ClassBookingDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }
}