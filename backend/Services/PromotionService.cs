using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs.Promotion;
using backend.Enums;
using backend.Models;
using backend.Interfaces;

namespace backend.Services;

public class PromotionService : IPromotionService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IAuditLogService _auditLogService;

    public PromotionService(ApplicationDbContext context, IMapper mapper, IAuditLogService auditLogService)
    {
        _context = context;
        _mapper = mapper;
        _auditLogService = auditLogService;
    }

    // ================= LIST =================


    public async Task<List<PromotionListDto>> GetPromotionListAsync(
        string? search,
        PromotionStatus? status,
        string? type)
    {
        var query = _context.Promotions
            .Include(x => x.ApplicableBranch)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrEmpty(search))
            query = query.Where(x =>
                x.Name.Contains(search) ||
                x.Code.Contains(search));

        if (status.HasValue)
            query = query.Where(x => x.Status == status.Value);

        if (!string.IsNullOrEmpty(type))
            query = query.Where(x => x.DiscountType.ToString() == type);

        return await query
            .ProjectTo<PromotionListDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }

    // ================= DETAIL =================

    public async Task<PromotionDto?> GetPromotionAsync(Guid id)
    {
        return await _context.Promotions
            .Include(x => x.ApplicablePackage)
            .Include(x => x.ApplicableBranch)
            .Include(x => x.CreatedByUser)
            .Where(x => x.PromotionId == id)
            .ProjectTo<PromotionDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();
    }

    // ================= CREATE & VALIDATE =================

    public async Task<ValidatePromotionResultDto> ValidatePromotionConditionsAsync(ValidatePromotionDto dto)
    {
        var result = new ValidatePromotionResultDto { IsValid = true };

        // 1. Valid date range
        if (dto.StartDate >= dto.EndDate)
        {
            result.IsValid = false;
            result.Errors.Add("StartDate must be before EndDate.");
        }

        // 2. Duplicate Code
        var duplicateCodeQuery = _context.Promotions.Where(p => p.Code == dto.Code);
        if (dto.ExcludePromotionId.HasValue)
        {
            duplicateCodeQuery = duplicateCodeQuery.Where(p => p.PromotionId != dto.ExcludePromotionId.Value);
        }
        
        if (await duplicateCodeQuery.AnyAsync())
        {
            result.IsValid = false;
            result.Errors.Add($"Promotion code '{dto.Code}' already exists.");
        }

        // 3. Invalid discount
        if (dto.DiscountValue <= 0)
        {
            result.IsValid = false;
            result.Errors.Add("Discount value must be greater than 0.");
        }
        if (dto.DiscountType == DiscountType.Percentage && dto.DiscountValue > 100)
        {
            result.IsValid = false;
            result.Errors.Add("Percentage discount cannot exceed 100%.");
        }

        // 4. Overlap Warning (Soft warning)
        var overlapQuery = _context.Promotions
            .Where(p => p.StartDate <= dto.EndDate && p.EndDate >= dto.StartDate)
            .Where(p => p.ApplicablePackageId == dto.ApplicablePackageId &&
                        p.ApplicableBranchId == dto.ApplicableBranchId &&
                        p.SalesChannel == dto.SalesChannel &&
                        p.Status == PromotionStatus.Active);

        if (dto.ExcludePromotionId.HasValue)
        {
            overlapQuery = overlapQuery.Where(p => p.PromotionId != dto.ExcludePromotionId.Value);
        }

        if (await overlapQuery.AnyAsync())
        {
            result.Warnings.Add("Another active promotion overlaps with the same conditions (Package, Branch, SalesChannel) during this period.");
        }

        return result;
    }

    public async Task<Guid> CreatePromotionAsync(CreatePromotionDto dto, Guid userId)
    {
        var validationDto = new ValidatePromotionDto
        {
            Code = dto.Code,
            DiscountType = dto.DiscountType,
            DiscountValue = dto.DiscountValue,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            ApplicablePackageId = dto.ApplicablePackageId,
            ApplicableBranchId = dto.ApplicableBranchId,
            SalesChannel = dto.SalesChannel
        };

        var validationResult = await ValidatePromotionConditionsAsync(validationDto);
        if (!validationResult.IsValid)
        {
            throw new Exception("Promotion validation failed: " + string.Join("; ", validationResult.Errors));
        }

        var promo = _mapper.Map<Promotion>(dto);
        promo.PromotionId = Guid.NewGuid();
        promo.Status = PromotionStatus.Active;
        promo.CreatedByUserId = userId;
        promo.CreatedAt = DateTime.UtcNow;

        _context.Promotions.Add(promo);

        _auditLogService.Add(_auditLogService.CreateLog(
            userId,
            "Promotion",
            promo.PromotionId,
            "CreatePromotion"));

        await _context.SaveChangesAsync();

        return promo.PromotionId;
    }

    // ================= UPDATE =================

    public async Task<bool> UpdatePromotionAsync(Guid id, UpdatePromotionDto dto, Guid userId)
    {
        var promo = await _context.Promotions.FindAsync(id);

        if (promo == null)
            return false;

        _mapper.Map(dto, promo);

        promo.UpdatedAt = DateTime.UtcNow;

        _auditLogService.Add(_auditLogService.CreateLog(
            userId,
            "Promotion",
            id,
            "UpdatePromotion"));

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UpdatePromotionStatusAsync(Guid id, PromotionStatus status, Guid userId)
    {
        var promo = await _context.Promotions.FindAsync(id);

        if (promo == null)
            return false;

        promo.Status = status;
        promo.UpdatedAt = DateTime.UtcNow;

        _auditLogService.Add(_auditLogService.CreateLog(
            userId,
            "Promotion",
            id,
            $"UpdatePromotionStatus:{status}"));

        await _context.SaveChangesAsync();

        return true;
    }

    // ================= DELETE =================

    public async Task<bool> DeletePromotionAsync(Guid id, Guid userId)
    {
        var promo = await _context.Promotions.FindAsync(id);

        if (promo == null)
            return false;

        var used = await _context.ContractPromotions
            .AnyAsync(x => x.PromotionId == id);

        if (used)
            throw new Exception("Cannot delete promotion already used");

        _context.Promotions.Remove(promo);

        _auditLogService.Add(_auditLogService.CreateLog(
            userId,
            "Promotion",
            id,
            "DeletePromotion"));

        await _context.SaveChangesAsync();

        return true;
    }

    // ================= STATS =================

    public async Task<PromotionStatsDto> GetPromotionStatsAsync()
    {
        var now = DateTime.UtcNow;

        return new PromotionStatsDto
        {
            Total = await _context.Promotions.CountAsync(),

            Active = await _context.Promotions
                .CountAsync(x => x.StartDate <= now && x.EndDate >= now),

            Scheduled = await _context.Promotions
                .CountAsync(x => x.StartDate > now),

            Expired = await _context.Promotions
                .CountAsync(x => x.EndDate < now)
        };
    }
}