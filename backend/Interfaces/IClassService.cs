using backend.DTOs.Class;
using backend.Enums;

namespace backend.Interfaces;

public interface IClassService
{
    Task<List<ClassDto>> GetClassesAsync();

    Task<ClassDto?> GetClassAsync(Guid id);

    Task<Guid> CreateClassAsync(CreateClassDto dto, Guid userId);

    Task<bool> UpdateClassAsync(Guid id, UpdateClassDto dto, Guid userId);

    Task<bool> UpdateClassStatusAsync(Guid id, ClassStatus status, Guid userId);

    Task<bool> DeleteClassAsync(Guid id, Guid userId);

    // Booking methods
    Task<bool> BookClassAsync(Guid classId, Guid memberUserId);

    Task<bool> CancelBookingAsync(Guid classId, Guid memberUserId, string cancelReason);

    Task<List<ClassBookingDto>> GetMyBookingsAsync(Guid memberUserId);
}