using backend.DTOs.Register;

namespace backend.Interfaces;

public interface IRegistrationService
{
    Task<RegisterResultDto> RegisterMemberAsync(RegisterMemberDto dto);
}
