using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs.Branch;
using backend.Interfaces;
using backend.Models;

namespace backend.Services;

public class BranchService : IBranchService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public BranchService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<BranchListDto>> GetBranchesAsync(string? search, string? status)
    {
        var query = _context.Branches
            .Include(b => b.Images)
            .Include(b => b.Rooms)
            .Include(b => b.Staffs)
            .Include(b => b.Attendances)
            .AsQueryable();

        if (!string.IsNullOrEmpty(search))
            query = query.Where(x => x.Name.Contains(search));

        if (!string.IsNullOrEmpty(status))
            query = query.Where(x => x.Status.ToString() == status);

        return await query
            .ProjectTo<BranchListDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<BranchListDto?> GetBranchAsync(Guid id)
    {
        var branch = await _context.Branches
            .Include(b => b.Images)
            .Include(b => b.Rooms)
            .Include(b => b.Staffs)
            .Include(b => b.Attendances)
            .FirstOrDefaultAsync(x => x.BranchId == id);

        if (branch == null) return null;

        return _mapper.Map<BranchListDto>(branch);
    }

    public async Task<BranchListDto> CreateBranchAsync(CreateBranchDto dto, Guid userId)
    {
        var branch = _mapper.Map<Branch>(dto);

        branch.BranchId = Guid.NewGuid();

        _context.Branches.Add(branch);

        if (dto.Images != null)
        {
            foreach (var url in dto.Images)
            {
                _context.BranchImages.Add(new BranchImage
                {
                    BranchImageId = Guid.NewGuid(),
                    BranchId = branch.BranchId,
                    ImageUrl = url
                });
            }
        }

        await _context.SaveChangesAsync();

        // audit log
        _context.AuditLogs.Add(new AuditLog
        {
            AuditLogId = Guid.NewGuid(),
            UserId = userId,
            EntityType = "Branch",
            EntityId = branch.BranchId,
            Action = "CreateBranch"
        });

        await _context.SaveChangesAsync();

        return _mapper.Map<BranchListDto>(branch);
    }

    public async Task<bool> UpdateBranchAsync(Guid id, UpdateBranchDto dto, Guid userId)
    {
        var branch = await _context.Branches.FindAsync(id);

        if (branch == null) return false;

        _mapper.Map(dto, branch);

        _context.AuditLogs.Add(new AuditLog
        {
            AuditLogId = Guid.NewGuid(),
            UserId = userId,
            EntityType = "Branch",
            EntityId = id,
            Action = "UpdateBranch"
        });

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeactivateBranchAsync(Guid id, Guid userId)
    {
        var branch = await _context.Branches.FindAsync(id);

        if (branch == null) return false;

        branch.Status = backend.Enums.BranchStatus.Deactivated;

        _context.AuditLogs.Add(new AuditLog
        {
            AuditLogId = Guid.NewGuid(),
            UserId = userId,
            EntityType = "Branch",
            EntityId = id,
            Action = "DeactivateBranch"
        });

        await _context.SaveChangesAsync();

        return true;
    }
}