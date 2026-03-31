using backend.DTOs.Room;
using backend.Enums;

namespace backend.Interfaces;

public interface IRoomService
{
    Task<List<RoomDto>> GetRoomsAsync(
        Guid? branchId,
        string? search,
        RoomStatus? status);

    Task<RoomDto?> GetRoomAsync(Guid id);

    Task<bool> CreateRoomAsync(
        Guid branchId,
        CreateRoomDto dto,
        Guid adminId);

    Task<bool> UpdateRoomAsync(
        Guid id,
        UpdateRoomDto dto,
        Guid adminId);

    Task<bool> UpdateRoomStatusAsync(Guid id, RoomStatus status, Guid adminId);

    Task<bool> DeleteRoomAsync(
        Guid id,
        Guid adminId);
}