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

    public async Task<List<ClassScheduleDto>> GetScheduleAsync(
        DateOnly? startDate, DateOnly? endDate, DateOnly? date,
        Guid? roomId, Guid? trainerId, ClassType? classType, ClassStatus? status, Guid? branchId, Guid callerUserId)
    {
        var query = _context.Classes
            .Include(c => c.Trainer).ThenInclude(t => t.User)
            .Include(c => c.Room).ThenInclude(r => r.Branch)
            .Include(c => c.Bookings)
            .AsNoTracking()
            .AsQueryable();

        if (date.HasValue) query = query.Where(c => c.Date == date.Value);
        if (startDate.HasValue) query = query.Where(c => c.Date >= startDate.Value);
        if (endDate.HasValue) query = query.Where(c => c.Date <= endDate.Value);
        if (roomId.HasValue) query = query.Where(c => c.RoomId == roomId.Value);
        if (classType.HasValue) query = query.Where(c => c.ClassType == classType.Value);
        if (status.HasValue) query = query.Where(c => c.Status == status.Value);
        if (branchId.HasValue) query = query.Where(c => c.Room.BranchId == branchId.Value);

        bool isMember = await _context.UserRoles.AnyAsync(ur => ur.UserId == callerUserId && _context.Roles.Any(r => r.Id == ur.RoleId && r.Name == backend.Helpers.AuthorizationRoles.Member));
        bool isStaff = await _context.UserRoles.AnyAsync(ur => ur.UserId == callerUserId && _context.Roles.Any(r => r.Id == ur.RoleId && r.Name == backend.Helpers.AuthorizationRoles.Staff));
        
        var staff = isStaff ? await _context.Staffs.AsNoTracking().FirstOrDefaultAsync(s => s.UserId == callerUserId) : null;

        if (isStaff && staff?.Position == StaffPosition.PT)
        {
            query = query.Where(c => c.TrainerStaffId == callerUserId);
        }
        else if (trainerId.HasValue)
        {
            query = query.Where(c => c.TrainerStaffId == trainerId.Value);
        }

        if (isMember)
        {
            query = query.Where(c => c.Status == ClassStatus.Scheduled || c.Bookings.Any(b => b.MemberUserId == callerUserId));
        }

        var classes = await query.OrderBy(c => c.Date).ThenBy(c => c.StartTime).ToListAsync();

        return classes.Select(c => 
        {
            var dto = new ClassScheduleDto
            {
                ClassId = c.ClassId,
                Title = c.Title,
                Description = c.Description,
                Date = c.Date,
                StartTime = c.StartTime,
                EndTime = c.EndTime,
                ClassType = c.ClassType,
                Status = c.Status,
                Capacity = c.Capacity,
                MinCapacity = c.MinCapacity,
                TrainerStaffId = c.TrainerStaffId,
                TrainerName = c.Trainer.User.FullName ?? "",
                RoomId = c.RoomId,
                RoomName = c.Room.Name,
                RoomNumber = c.Room.RoomNumber,
                BranchId = c.Room.BranchId,
                BranchName = c.Room.Branch.Name,
                BookedCount = c.Bookings.Count(b => b.Status == BookingStatus.Booked || b.Status == BookingStatus.Attended),
            };
            dto.IsFull = dto.BookedCount >= dto.Capacity;

            if (isMember)
            {
                var myBooking = c.Bookings.FirstOrDefault(b => b.MemberUserId == callerUserId);
                dto.IsBooked = myBooking != null && myBooking.Status != BookingStatus.Cancelled;
                dto.MyBookingStatus = myBooking?.Status;
                dto.MySessionNote = myBooking?.SessionNote;
            }

            return dto;
        }).ToList();
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

        var activeContract = await _context.Contracts
            .Where(c => c.MemberUserId == memberUserId
                     && c.Status == ContractStatus.Active
                     && c.EndDate >= DateTime.UtcNow)
            .FirstOrDefaultAsync();

        if (activeContract == null)
            throw new Exception("No active membership found. Please renew your package.");

        if (activeContract.UsedGroupSessions >= activeContract.TotalGroupSessions)
            throw new Exception("Group session quota exceeded for your current package.");

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

    // ================= PT / STAFF =================

    public async Task<List<ClassMemberDto>> GetClassMembersAsync(Guid classId, Guid callerUserId)
    {
        var @class = await _context.Classes.FindAsync(classId);
        if (@class == null) throw new Exception("Class not found");

        var isStaff = await _context.UserRoles.AnyAsync(ur => ur.UserId == callerUserId && _context.Roles.Any(r => r.Id == ur.RoleId && r.Name == backend.Helpers.AuthorizationRoles.Staff));
        var staff = isStaff ? await _context.Staffs.AsNoTracking().FirstOrDefaultAsync(s => s.UserId == callerUserId) : null;

        if (staff != null && staff.Position == StaffPosition.PT && @class.TrainerStaffId != callerUserId)
            throw new UnauthorizedAccessException("You are not the trainer of this class");

        return await _context.ClassBookings
            .Include(b => b.Member).ThenInclude(m => m.User)
            .Where(b => b.ClassId == classId)
            .ProjectTo<ClassMemberDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<bool> UpdateSessionNoteAsync(Guid classId, Guid memberUserId, string note, Guid callerUserId)
    {
        var booking = await _context.ClassBookings.Include(b => b.Class).FirstOrDefaultAsync(b => b.ClassId == classId && b.MemberUserId == memberUserId);
        if (booking == null) throw new Exception("Booking not found");

        var isStaff = await _context.UserRoles.AnyAsync(ur => ur.UserId == callerUserId && _context.Roles.Any(r => r.Id == ur.RoleId && r.Name == backend.Helpers.AuthorizationRoles.Staff));
        var staff = isStaff ? await _context.Staffs.AsNoTracking().FirstOrDefaultAsync(s => s.UserId == callerUserId) : null;

        if (staff != null && staff.Position == StaffPosition.PT && booking.Class.TrainerStaffId != callerUserId)
            throw new UnauthorizedAccessException("You are not the trainer of this class");

        booking.SessionNote = note;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ClassCheckInAsync(Guid classId, Guid memberUserId, Guid callerUserId)
    {
        var booking = await _context.ClassBookings.Include(b => b.Class).FirstOrDefaultAsync(b => b.ClassId == classId && b.MemberUserId == memberUserId);
        if (booking == null) throw new Exception("Booking not found");

        if (booking.Status == BookingStatus.Cancelled)
            throw new Exception("Booking was cancelled");

        if (booking.Status == BookingStatus.Attended)
            return true; // Idempotent

        booking.Status = BookingStatus.Attended;
        booking.CheckedInAt = DateTime.UtcNow;

        var contract = await _context.Contracts.FirstOrDefaultAsync(c => c.MemberUserId == memberUserId && c.Status == ContractStatus.Active);
        if (contract != null)
        {
            contract.UsedGroupSessions++;
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<ClassBookingHistoryDto>> GetMemberTrainingHistoryAsync(Guid memberUserId, Guid callerUserId)
    {
        var isStaff = await _context.UserRoles.AnyAsync(ur => ur.UserId == callerUserId && _context.Roles.Any(r => r.Id == ur.RoleId && r.Name == backend.Helpers.AuthorizationRoles.Staff));
        var staff = isStaff ? await _context.Staffs.AsNoTracking().FirstOrDefaultAsync(s => s.UserId == callerUserId) : null;

        if (staff != null && staff.Position == StaffPosition.PT)
        {
            // Kiểm tra xem PT này có class chung nào với member không
            var hasSharedClass = await _context.ClassBookings
                .Include(b => b.Class)
                .AnyAsync(b => b.MemberUserId == memberUserId && b.Class.TrainerStaffId == callerUserId);

            if (!hasSharedClass)
                throw new UnauthorizedAccessException("You are not authorized to view this member's training history.");
        }

        return await _context.ClassBookings
            .Include(b => b.Class).ThenInclude(c => c.Trainer).ThenInclude(t => t.User)
            .Include(b => b.Class).ThenInclude(c => c.Room)
            .Where(b => b.MemberUserId == memberUserId)
            .OrderByDescending(b => b.Class.Date).ThenByDescending(b => b.Class.StartTime)
            .ProjectTo<ClassBookingHistoryDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }
}