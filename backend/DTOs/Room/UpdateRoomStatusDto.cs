namespace backend.DTOs.Room;

using System.ComponentModel.DataAnnotations;
using backend.Enums;

public class UpdateRoomStatusDto
{
    [Required(ErrorMessage = "Status is required")]
    [EnumDataType(typeof(RoomStatus), ErrorMessage = "Status is invalid")]
    public RoomStatus Status { get; set; }
}