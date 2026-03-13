using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs.Package;
using backend.Enums;
using backend.Models;
using backend.Interfaces;

namespace backend.Services;

public class PackageService : IPackageService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public PackageService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // ================= LIST =================

    public async Task<List<PackageDto>> GetPackagesAsync(
        string? search,
        string? status,
        string? tier)
    {
        var query = _context.Packages
            .Include(x => x.PackagePolicy)
            .Include(x => x.Features)
            .Include(x => x.Pricings)
            .Include(x => x.Contracts)
            .AsQueryable();

        if (!string.IsNullOrEmpty(search))
            query = query.Where(x => x.Name.Contains(search));

        if (!string.IsNullOrEmpty(status))
            query = query.Where(x => x.Status.ToString() == status);

        if (!string.IsNullOrEmpty(tier))
            query = query.Where(x => x.Tier.ToString() == tier);

        return await query
            .ProjectTo<PackageDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }

    // ================= DETAIL =================

    public async Task<PackageDto?> GetPackageAsync(Guid id)
    {
        return await _context.Packages
            .Include(x => x.PackagePolicy)
            .Include(x => x.Features)
            .Include(x => x.Pricings)
            .Include(x => x.Contracts)
            .Where(x => x.PackageId == id)
            .ProjectTo<PackageDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();
    }

    // ================= UPDATE =================

    public async Task<bool> UpdatePackageAsync(Guid id, UpdatePackageDto dto, Guid userId)
    {
        var package = await _context.Packages
            .Include(x => x.Features)
            .Include(x => x.Pricings)
            .Include(x => x.PackagePolicy)
            .FirstOrDefaultAsync(x => x.PackageId == id);

        if (package == null)
            return false;

        _mapper.Map(dto, package);

        package.UpdatedAt = DateTime.UtcNow;

        _context.AuditLogs.Add(new AuditLog
        {
            AuditLogId = Guid.NewGuid(),
            UserId = userId,
            EntityType = "Package",
            EntityId = id,
            Action = "UpdatePackage",
            CreatedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();

        return true;
    }

    // ================= DEACTIVATE =================

    public async Task<bool> DeactivatePackageAsync(Guid id, Guid userId)
    {
        var package = await _context.Packages.FindAsync(id);

        if (package == null)
            return false;

        package.Status = PackageStatus.Inactive;

        _context.AuditLogs.Add(new AuditLog
        {
            AuditLogId = Guid.NewGuid(),
            UserId = userId,
            EntityType = "Package",
            EntityId = id,
            Action = "DeactivatePackage",
            CreatedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();

        return true;
    }

    // ================= DELETE =================

    public async Task<bool> DeletePackageAsync(Guid id, Guid userId)
    {
        var package = await _context.Packages.FindAsync(id);

        if (package == null)
            return false;

        var used = await _context.Contracts
            .AnyAsync(x => x.PackageId == id);

        if (used)
            throw new Exception("Cannot delete package already used");

        _context.Packages.Remove(package);

        _context.AuditLogs.Add(new AuditLog
        {
            AuditLogId = Guid.NewGuid(),
            UserId = userId,
            EntityType = "Package",
            EntityId = id,
            Action = "DeletePackage",
            CreatedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();

        return true;
    }

    // ================= STATS =================

    public async Task<PackageStatsDto> GetPackageStatsAsync()
    {
        return new PackageStatsDto
        {
            TotalPackages = await _context.Packages.CountAsync(),

            ActivePackages = await _context.Packages
                .CountAsync(x => x.Status == PackageStatus.Active),

            InactivePackages = await _context.Packages
                .CountAsync(x => x.Status == PackageStatus.Inactive),

            TotalSubscribers = await _context.Contracts.CountAsync()
        };
    }
}