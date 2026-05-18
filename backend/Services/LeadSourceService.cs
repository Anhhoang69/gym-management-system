using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs.Lead;
using backend.Models;
using backend.Interfaces;
using AutoMapper;

namespace backend.Services;

public class LeadSourceService : ILeadSourceService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public LeadSourceService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<LeadSourceDto>> GetSourcesAsync()
    {
        var sources = await _context.LeadSources
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .ToListAsync();

        return _mapper.Map<List<LeadSourceDto>>(sources);
    }

    public async Task<LeadSourceDto> CreateSourceAsync(LeadSourceUpsertDto dto)
    {
        var entity = _mapper.Map<LeadSource>(dto);
        entity.Id = Guid.NewGuid();

        _context.LeadSources.Add(entity);
        await _context.SaveChangesAsync();

        return _mapper.Map<LeadSourceDto>(entity);
    }

    public async Task<LeadSourceDto?> UpdateSourceAsync(Guid id, LeadSourceUpsertDto dto)
    {
        var existing = await _context.LeadSources.FindAsync(id);
        if (existing == null) return null;

        existing.Name = dto.Name;
        existing.Score = dto.Score;
        existing.IsActive = dto.IsActive;

        _context.LeadSources.Update(existing);
        await _context.SaveChangesAsync();

        return _mapper.Map<LeadSourceDto>(existing);
    }
}
