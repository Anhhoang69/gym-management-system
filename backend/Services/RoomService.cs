using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs.Room;
using backend.Enums;
using backend.Interfaces;
using backend.Models;

namespace backend.Services;

public class RoomService : IRoomService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IAuditLogService _auditLogService;

    public RoomService(ApplicationDbContext context, IMapper mapper, IAuditLogService auditLogService)
    {
        _context = context;
        _mapper = mapper;
        _auditLogService = auditLogService;
    }

    // ================= LIST =================

    public async Task<List<RoomDto>> GetRoomsAsync(
        Guid? branchId,
        string? search,
        RoomStatus? status)
    {
        var query = _context.Rooms
            .Include(x => x.Branch)
            .Include(x => x.Images)
            .Include(x => x.Classes)
            .AsNoTracking()
            .AsQueryable();

        if (branchId.HasValue)
            query = query.Where(x => x.BranchId == branchId);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var keyword = $"%{search}%";

            query = query.Where(x =>
                EF.Functions.ILike(x.Name, keyword));
        }

        if (status.HasValue)
            query = query.Where(x => x.Status == status.Value);

        return await query
            .OrderBy(x => x.Name)
            .ProjectTo<RoomDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }

    // ================= DETAIL =================

    public async Task<RoomDto?> GetRoomAsync(Guid id)
    {
        return await _context.Rooms
            .Include(x => x.Branch)
            .Include(x => x.Images)
            .Include(x => x.Classes)
            .Where(x => x.RoomId == id)
            .ProjectTo<RoomDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();
    }

    // ================= CREATE =================

    public async Task<bool> CreateRoomAsync(
        Guid branchId,
        CreateRoomDto dto,
        Guid adminId)
    {
        var room = _mapper.Map<Room>(dto);

        room.RoomId = Guid.NewGuid();
        room.BranchId = branchId;

        _context.Rooms.Add(room);

        if (dto.Images != null)
        {
            foreach (var url in dto.Images)
            {
                _context.RoomImages.Add(new RoomImage
                {
                    RoomImageId = Guid.NewGuid(),
                    RoomId = room.RoomId,
                    ImageUrl = url
                });
            }
        }

        _auditLogService.Add(_auditLogService.CreateLog(
            adminId,
            "Room",
            room.RoomId,
            "CreateRoom"));

        await _context.SaveChangesAsync();

        return true;
    }

    // ================= UPDATE =================

    public async Task<bool> UpdateRoomAsync(
        Guid id,
        UpdateRoomDto dto,
        Guid adminId)
    {
        var room = await _context.Rooms
            .Include(x => x.Images)
            .FirstOrDefaultAsync(x => x.RoomId == id);

        if (room == null)
            return false;

        _mapper.Map(dto, room);

        if (dto.Images != null)
        {
            var oldImages = await _context.RoomImages
                .Where(x => x.RoomId == id)
                .ToListAsync();

            _context.RoomImages.RemoveRange(oldImages);

            foreach (var url in dto.Images)
            {
                _context.RoomImages.Add(new RoomImage
                {
                    RoomImageId = Guid.NewGuid(),
                    RoomId = id,
                    ImageUrl = url
                });
            }
        }

        _auditLogService.Add(_auditLogService.CreateLog(
            adminId,
            "Room",
            id,
            "UpdateRoom"));

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UpdateRoomStatusAsync(Guid id, RoomStatus status, Guid adminId)
    {
        var room = await _context.Rooms.FindAsync(id);

        if (room == null)
            return false;

        room.Status = status;

        _auditLogService.Add(_auditLogService.CreateLog(
            adminId,
            "Room",
            id,
            $"UpdateRoomStatus:{status}"));

        await _context.SaveChangesAsync();

        return true;
    }

    // ================= DELETE =================

    public async Task<bool> DeleteRoomAsync(
        Guid id,
        Guid adminId)
    {
        var room = await _context.Rooms
            .Include(x => x.Classes)
            .FirstOrDefaultAsync(x => x.RoomId == id);

        if (room == null)
            return false;

        if (room.Classes.Any())
            throw new Exception("Room has classes scheduled");

        _context.Rooms.Remove(room);

        _auditLogService.Add(_auditLogService.CreateLog(
            adminId,
            "Room",
            id,
            "DeleteRoom"));

        await _context.SaveChangesAsync();

        return true;
    }
}