using backend.DTOs.Class;
using backend.Enums;
using backend.Helpers;

namespace backend.Interfaces;

public interface IClassService
{
    Task<List<ClassScheduleDto>> GetScheduleAsync(
        DateOnly? startDate, DateOnly? endDate, DateOnly? date,
        Guid? roomId, Guid? trainerId, ClassType? classType, ClassStatus? status, Guid? branchId, Guid callerUserId);

    Task<PagedResult<ClassScheduleDto>> GetPagedScheduleAsync(
        DateOnly? startDate, DateOnly? endDate, DateOnly? date,
        Guid? roomId, Guid? trainerId, ClassType? classType, ClassStatus? status, Guid? branchId, Guid callerUserId,
        int page, int pageSize);

    Task<ClassDto?> GetClassAsync(Guid id);

    Task<Guid> CreateClassAsync(CreateClassDto dto, Guid userId);

    Task<bool> UpdateClassAsync(Guid id, UpdateClassDto dto, Guid userId);

    Task<bool> UpdateClassStatusAsync(Guid id, ClassStatus status, Guid userId);

    Task<bool> DeleteClassAsync(Guid id, Guid userId);

    // Booking methods
    Task<bool> BookClassAsync(Guid classId, Guid memberUserId);

    Task<bool> CancelBookingAsync(Guid classId, Guid memberUserId, string cancelReason);

    Task<List<ClassBookingDto>> GetMyBookingsAsync(Guid memberUserId);

    // PT / Staff methods
    Task<List<ClassMemberDto>> GetClassMembersAsync(Guid classId, Guid callerUserId);

    Task<bool> UpdateSessionNoteAsync(Guid classId, Guid memberUserId, string note, Guid callerUserId);

    Task<bool> ClassCheckInAsync(Guid classId, Guid memberUserId, Guid callerUserId);

    Task<List<ClassBookingHistoryDto>> GetMemberTrainingHistoryAsync(Guid memberUserId, Guid callerUserId);
}