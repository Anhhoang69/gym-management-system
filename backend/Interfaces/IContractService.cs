using backend.DTOs.Contract;

namespace backend.Interfaces;

public interface IContractService
{
    Task<ContractDraftPreviewDto> CreateDraftAsync(CreateContractDraftDto dto, Guid staffId);
    Task<ContractDraftPreviewDto> GetDraftAsync(Guid draftId, Guid staffId);
    Task<ContractDto> GenerateContractAsync(GenerateContractDto dto, Guid staffId);
    Task<ContractDto> GetContractAsync(Guid contractId, Guid staffId);
    Task<string> ActivateMembershipAsync(Guid contractId, Guid staffId);
}
