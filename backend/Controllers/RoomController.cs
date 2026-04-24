using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Room;
using backend.Enums;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers;

[ApiController]
[Route("api/rooms")]
[Authorize]
public class RoomController : ControllerBase
{
    private readonly IRoomService _service;

    public RoomController(IRoomService service)
    {
        _service = service;
    }

    // ================= LIST =================

    [HttpGet]
    public async Task<ApiResponse<List<RoomDto>>> GetRooms(
        Guid? branchId,
        string? search,
        RoomStatus? status)
    {
        var result = await _service.GetRoomsAsync(
            branchId,
            search,
            status);

        return new ApiResponse<List<RoomDto>>(result);
    }

    // ================= DETAIL =================

    [HttpGet("{id}")]
    public async Task<ApiResponse<RoomDto?>> GetRoom(Guid id)
    {
        var result = await _service.GetRoomAsync(id);

        if (result == null)
            return new ApiResponse<RoomDto?>("Room not found");

        return new ApiResponse<RoomDto?>(result);
    }

    // ================= CREATE =================

    [HttpPost("{branchId}")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)]
    [SwaggerOperation(
        Summary = "Tạo mới phòng",
        Description = "Tạo phòng mới trong chi nhánh chỉ định. Ghi audit log. Chỉ dành cho admin/staff."
    )]
    public async Task<ApiResponse<bool>> CreateRoom(
        Guid branchId,
        CreateRoomDto dto)
    {
        var adminId = User.GetRequiredUserId();

        var result = await _service.CreateRoomAsync(
            branchId,
            dto,
            adminId);

        return new ApiResponse<bool>(result);
    }

    // ================= UPDATE =================

    [HttpPut("{id}")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)]
    [SwaggerOperation(
        Summary = "Cập nhật thông tin phòng",
        Description = "Cập nhật thông tin phòng theo ID. Ghi audit log. Chỉ dành cho admin/staff."
    )]
    public async Task<ApiResponse<bool>> UpdateRoom(
        Guid id,
        UpdateRoomDto dto)
    {
        var adminId = User.GetRequiredUserId();

        var result = await _service.UpdateRoomAsync(
            id,
            dto,
            adminId);

        return new ApiResponse<bool>(result);
    }

    // ================= DEACTIVATE =================

    [HttpPatch("{id}/status")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)]
    [SwaggerOperation(
        Summary = "Cập nhật trạng thái phòng",
        Description = "Thay đổi trạng thái của phòng (Active, Inactive). Ghi audit log. Chỉ dành cho admin/staff."
    )]
    public async Task<ApiResponse<bool>> UpdateRoomStatus(
    Guid id,
    UpdateRoomStatusDto dto)
    {
        var adminId = User.GetRequiredUserId();

        var result = await _service.UpdateRoomStatusAsync(
            id,
            dto.Status,
            adminId);

        if (!result)
            return new ApiResponse<bool>("Room not found");

        return new ApiResponse<bool>(true, "Room status updated");
    }

    // ================= DELETE =================

    [HttpDelete("{id}")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)]
    [SwaggerOperation(
        Summary = "Xóa phòng",
        Description = "Xóa phòng theo ID. Không cho phép xóa phòng có classes. Ghi audit log. Chỉ dành cho admin/staff."
    )]
    public async Task<ApiResponse<bool>> DeleteRoom(Guid id)
    {
        var adminId = User.GetRequiredUserId();

        var result = await _service.DeleteRoomAsync(
            id,
            adminId);

        return new ApiResponse<bool>(result);
    }
}