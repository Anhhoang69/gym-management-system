using backend.DTOs.Attendance;

namespace backend.Interfaces;

public interface IAttendanceService
{
    Task<AttendanceDto> CheckInAsync(CheckInRequestDto dto);
    Task<AttendanceDto> CheckOutAsync(CheckInRequestDto dto);
    Task<AttendanceDto> ManualCheckInAsync(ManualCheckInDto dto, Guid staffUserId);
    Task<List<AttendanceDto>> GetMyAttendanceAsync(Guid memberUserId);
    Task<List<AttendanceDto>> GetBranchAttendanceAsync(Guid branchId, DateOnly? date);
    Task<List<AttendanceDto>> GetMemberAttendanceAsync(Guid memberUserId);
}
