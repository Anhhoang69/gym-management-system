using backend.DTOs.Contract;
using backend.Helpers;

namespace backend.Interfaces;

public interface IContractService
{
    Task<ContractDraftPreviewDto> CreateDraftAsync(CreateContractDraftDto dto, Guid staffId);
    Task<ContractDraftPreviewDto> GetDraftAsync(Guid draftId, Guid staffId);
    Task<ContractDto> GenerateContractAsync(GenerateContractDto dto, Guid staffId);
    Task<ContractDto> GetContractAsync(Guid contractId, Guid staffId);
    Task<string> ActivateMembershipAsync(Guid contractId, Guid staffId);
    
    // Draft Management
    Task<PagedResult<ContractDraftPreviewDto>> GetDraftsAsync(ContractDraftQueryDto query, Guid staffId);
    Task<ContractDraftPreviewDto> UpdateDraftAsync(Guid draftId, UpdateContractDraftDto dto, Guid staffId);
    Task<bool> DeleteDraftAsync(Guid draftId, Guid staffId);

    // Contract Management
    Task<PagedResult<ContractDto>> GetContractsAsync(ContractQueryDto query, Guid staffId);
    Task<ContractDto> UpdateContractAsync(Guid contractId, UpdateContractDto dto, Guid staffId);
    Task<bool> CancelContractAsync(Guid contractId, Guid staffId);
}
