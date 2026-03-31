using backend.DTOs.Lead;
using backend.Helpers;

namespace backend.Interfaces;

public interface ILeadService
{
    Task<LeadDto> CreateLeadAsync(CreateLeadDto dto, Guid currentUserId);
    Task<PagedResult<LeadListDto>> GetLeadListAsync(LeadListQueryDto query);
    Task<LeadDto?> GetLeadAsync(Guid id);
    Task<LeadDto> UpdateLeadAsync(Guid id, UpdateLeadDto dto, Guid currentUserId);
    Task<LeadDto> UpdateLeadStatusAsync(Guid id, UpdateLeadStatusDto dto, Guid currentUserId);
    Task<LeadDto> ContactLeadAsync(Guid id, Guid currentUserId);
    Task<ImportLeadsResultDto> ImportLeadsAsync(ImportLeadsRequestDto request, Guid currentUserId);
    Task<LeadDto> MergeLeadAsync(Guid leadId, MergeLeadDto request, Guid currentUserId);
}

public interface ILeadSourceService
{
    Task<List<LeadSourceDto>> GetSourcesAsync();
    Task<LeadSourceDto> CreateSourceAsync(LeadSourceUpsertDto dto);
    Task<LeadSourceDto?> UpdateSourceAsync(Guid id, LeadSourceUpsertDto dto);
}