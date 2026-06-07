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
    private readonly IAuditLogService _auditLogService;

    public PackageService(ApplicationDbContext context, IMapper mapper, IAuditLogService auditLogService)
    {
        _context = context;
        _mapper = mapper;
        _auditLogService = auditLogService;
    }

    // ================= LIST =================

    public async Task<List<PackageDto>> GetPackagesAsync(
        string? search,
        PackageStatus? status,
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

        if (status.HasValue)
            query = query.Where(x => x.Status == status.Value);

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

    public async Task<List<PublicPackageDto>> GetPublicPackagesAsync()
    {
        return await _context.Packages
            .Where(p => p.Status == PackageStatus.Active)
            .Include(p => p.Pricings)
            .Include(p => p.Features)
            .AsNoTracking()
            .OrderBy(p => p.DisplayOrder)
            .Select(p => new PublicPackageDto
            {
                PackageId          = p.PackageId,
                Name               = p.Name,
                Description        = p.Description,
                ThumbnailUrl       = p.ThumbnailUrl,
                Tier               = p.Tier.ToString(),
                IsPtIncluded       = p.IsPtIncluded,
                PrivatePtLimit     = p.PrivatePtLimit,
                GroupPtLimit       = p.GroupPtLimit,
                MaxCheckinsPerWeek = p.MaxCheckinsPerWeek,
                BadgeLabel         = p.BadgeLabel,
                Features           = p.Features.OrderBy(f => f.DisplayOrder).Select(f => f.Content).ToList(),
                Pricings           = p.Pricings.Select(pr => new PublicPackagePricingDto
                {
                    PackagePricingId = pr.PackagePricingId,
                    DurationMonths   = pr.DurationMonths,
                    Price            = pr.Price,
                    OriginalPrice    = pr.OriginalPrice
                }).ToList()
            })
            .ToListAsync();
    }

    // ================= CREATE =================

    public async Task<Guid> CreatePackageAsync(CreatePackageDto dto, Guid userId)
    {
        if (dto.Pricings == null || dto.Pricings.Count == 0)
            throw new Exception("Package must have at least one pricing option.");

        var package = _mapper.Map<Package>(dto);
        
        package.PackageId = Guid.NewGuid();
        package.Status = PackageStatus.Active;
        package.CreatedAt = DateTime.UtcNow;

        if (package.PackagePolicy == null)
        {
            package.PackagePolicy = new PackagePolicy
            {
                ChangeFeeDefault = 0,
                ProrationRule = ProrationRuleType.None,
                UpgradeAllowed = false,
                DowngradeAllowed = false,
                FreezeAllowed = false,
                MaxFreezeDays = 0,
                MaxFreezeCount = 0,
                FreezeFee = 0,
                TransferAllowed = false,
                EarlyRenewAllowed = false
            };
        }
        package.PackagePolicy.PackageId = package.PackageId;

        if (package.Features != null)
        {
            foreach (var f in package.Features)
            {
                f.PackageFeatureId = Guid.NewGuid();
                f.PackageId = package.PackageId;
            }
        }

        if (package.Pricings != null)
        {
            foreach (var p in package.Pricings)
            {
                p.PackagePricingId = Guid.NewGuid();
                p.PackageId = package.PackageId;
            }
        }

        _context.Packages.Add(package);

        _auditLogService.Add(_auditLogService.CreateLog(
            userId,
            "Package",
            package.PackageId,
            "CreatePackage"));

        await _context.SaveChangesAsync();

        return package.PackageId;
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

        _auditLogService.Add(_auditLogService.CreateLog(
            userId,
            "Package",
            id,
            "UpdatePackage"));

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UpdatePackageStatusAsync(Guid id, PackageStatus status, Guid userId)
    {
        var package = await _context.Packages.FindAsync(id);

        if (package == null)
            return false;

        package.Status = status;
        package.UpdatedAt = DateTime.UtcNow;

        _auditLogService.Add(_auditLogService.CreateLog(
            userId,
            "Package",
            id,
            $"UpdatePackageStatus:{status}"));

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

        _auditLogService.Add(_auditLogService.CreateLog(
            userId,
            "Package",
            id,
            "DeletePackage"));

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