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

    public PromotionService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // ================= LIST =================

    public async Task<List<PromotionDto>> GetPromotionsAsync(
        string? search,
        string? status,
        string? type)
    {
        var query = _context.Promotions
            .Include(x => x.ApplicablePackage)
            .Include(x => x.ApplicableBranch)
            .Include(x => x.CreatedByUser)
            .AsQueryable();

        if (!string.IsNullOrEmpty(search))
            query = query.Where(x =>
                x.Name.Contains(search) ||
                x.Code.Contains(search));

        if (!string.IsNullOrEmpty(status))
            query = query.Where(x => x.Status.ToString() == status);

        if (!string.IsNullOrEmpty(type))
            query = query.Where(x => x.DiscountType.ToString() == type);

        return await query
            .ProjectTo<PromotionDto>(_mapper.ConfigurationProvider)
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

    // ================= UPDATE =================

    public async Task<bool> UpdatePromotionAsync(Guid id, UpdatePromotionDto dto, Guid userId)
    {
        var promo = await _context.Promotions.FindAsync(id);

        if (promo == null)
            return false;

        _mapper.Map(dto, promo);

        promo.UpdatedAt = DateTime.UtcNow;

        _context.AuditLogs.Add(new AuditLog
        {
            AuditLogId = Guid.NewGuid(),
            UserId = userId,
            EntityType = "Promotion",
            EntityId = id,
            Action = "UpdatePromotion",
            CreatedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();

        return true;
    }

    // ================= DEACTIVATE =================

    public async Task<bool> DeactivatePromotionAsync(Guid id, Guid userId)
    {
        var promo = await _context.Promotions.FindAsync(id);

        if (promo == null)
            return false;

        promo.Status = PromotionStatus.Inactive;

        _context.AuditLogs.Add(new AuditLog
        {
            AuditLogId = Guid.NewGuid(),
            UserId = userId,
            EntityType = "Promotion",
            EntityId = id,
            Action = "DeactivatePromotion",
            CreatedAt = DateTime.UtcNow
        });

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

        _context.AuditLogs.Add(new AuditLog
        {
            AuditLogId = Guid.NewGuid(),
            UserId = userId,
            EntityType = "Promotion",
            EntityId = id,
            Action = "DeletePromotion",
            CreatedAt = DateTime.UtcNow
        });

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