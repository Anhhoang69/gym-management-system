using AutoMapper;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs.Lead;
using backend.Models;
using backend.Interfaces;
using backend.Enums;
using backend.Helpers;
using AutoMapper.QueryableExtensions;
using Microsoft.VisualBasic.FileIO;
using System.Text.RegularExpressions;

namespace backend.Services;

public class LeadService : ILeadService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IAuditLogService _auditLogService;
    private readonly Microsoft.AspNetCore.Identity.UserManager<User> _userManager;
    private const int DEFAULT_SCORE = 10;
    private static readonly Regex PhoneRegex = new(@"^\d{9,11}$", RegexOptions.Compiled);
    private static readonly Regex EmailRegex = new(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.Compiled);

    public LeadService(ApplicationDbContext context, IMapper mapper, IAuditLogService auditLogService, Microsoft.AspNetCore.Identity.UserManager<User> userManager)
    {
        _context = context;
        _mapper = mapper;
        _auditLogService = auditLogService;
        _userManager = userManager;
    }

    public async Task<LeadDto> CreateLeadAsync(CreateLeadDto dto, Guid currentUserId)
    {
        ValidateLeadPayload(dto);
        await EnsureLeadWritePermissionAsync(currentUserId);

        var sourceCache = new Dictionary<Guid, LeadSource?>();
        var salesCache = new Dictionary<Guid, bool>();
        var source = await GetActiveLeadSourceAsync(dto.SourceId, sourceCache);
        var assignedToStaffId = await ResolveAssignedStaffIdAsync(dto.AssignedToStaffId, currentUserId, salesCache);

        var lead = BuildLeadEntity(dto, assignedToStaffId, currentUserId, source.Score);

        _context.Leads.Add(lead);

        var auditLog = _auditLogService.CreateLog(
            currentUserId,
            "Lead",
            lead.LeadId,
            "Create",
            newValue: $"{{Name: {lead.Name}, Phone: {lead.Phone}, Email: {lead.Email}}}");

        _auditLogService.Add(auditLog);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            if (ex.InnerException?.Message.Contains("IX_Lead") == true)
                throw new Exception("Lead already exists with the same phone number or email");

            throw new Exception("An error occurred while saving data");
        }

        var dtoResult = await _context.Leads
            .Where(l => l.LeadId == lead.LeadId)
            .ProjectTo<LeadDto>(_mapper.ConfigurationProvider)
            .FirstAsync();

        dtoResult.SourceName = source.Name;
        return dtoResult;
    }

    public async Task<ImportLeadsResultDto> ImportLeadsAsync(ImportLeadsRequestDto request, Guid currentUserId)
    {
        if (request.File == null || request.File.Length == 0)
            throw new Exception("CSV file is required");

        if (!request.File.FileName.EndsWith(".csv", StringComparison.OrdinalIgnoreCase))
            throw new Exception("Only CSV files are supported");

        await EnsureLeadWritePermissionAsync(currentUserId);

        var rows = ParseImportRows(request.File);
        var result = new ImportLeadsResultDto
        {
            TotalRows = rows.Count
        };

        if (rows.Count == 0)
            return result;

        var sourceCache = new Dictionary<Guid, LeadSource?>();
        var salesCache = new Dictionary<Guid, bool>();

        var phoneKeys = rows
            .Select(r => NormalizePhone(r.Phone))
            .Where(v => !string.IsNullOrWhiteSpace(v))
            .Distinct()
            .ToList();

        var emailKeys = rows
            .Select(r => NormalizeEmail(r.Email))
            .Where(v => !string.IsNullOrWhiteSpace(v))
            .Distinct()
            .ToList();

        var existingLeads = await _context.Leads
            .Where(l => phoneKeys.Contains(l.Phone) || (!string.IsNullOrEmpty(l.Email) && emailKeys.Contains(l.Email.ToLower())))
            .ToListAsync();

        var leadByPhone = existingLeads
            .Where(l => !string.IsNullOrWhiteSpace(l.Phone))
            .GroupBy(l => NormalizePhone(l.Phone))
            .ToDictionary(g => g.Key, g => g.First());

        var leadByEmail = existingLeads
            .Where(l => !string.IsNullOrWhiteSpace(l.Email))
            .GroupBy(l => NormalizeEmail(l.Email))
            .ToDictionary(g => g.Key, g => g.First());

        var pendingLeads = new List<Lead>();
        var auditLogs = new List<AuditLog>();

        foreach (var row in rows)
        {
            try
            {
                var createDto = BuildCreateLeadDto(row);
                ValidateLeadPayload(createDto);

                var source = await GetActiveLeadSourceAsync(createDto.SourceId, sourceCache);
                var assignedToStaffId = await ResolveAssignedStaffIdAsync(createDto.AssignedToStaffId, currentUserId, salesCache);
                var duplicateLead = FindMatchingLead(row, leadByPhone, leadByEmail);

                if (duplicateLead != null)
                {
                    if (request.DuplicateStrategy == LeadImportDuplicateStrategy.Skip)
                    {
                        result.SkippedCount++;
                        continue;
                    }

                    var previousPhone = NormalizePhone(duplicateLead.Phone);
                    var previousEmail = NormalizeEmail(duplicateLead.Email);

                    ApplyImportedLeadValues(duplicateLead, createDto, assignedToStaffId, source.Score);
                    duplicateLead.UpdatedAt = DateTime.UtcNow;
                    RefreshLeadLookup(leadByPhone, leadByEmail, duplicateLead, previousPhone, previousEmail);

                    auditLogs.Add(_auditLogService.CreateLog(
                        currentUserId,
                        "Lead",
                        duplicateLead.LeadId,
                        "ImportUpdate",
                        newValue: $"{{Name: {duplicateLead.Name}, Phone: {duplicateLead.Phone}, Email: {duplicateLead.Email}}}"));
                    result.UpdatedCount++;
                    continue;
                }

                var lead = BuildLeadEntity(createDto, assignedToStaffId, currentUserId, source.Score);

                pendingLeads.Add(lead);
                RefreshLeadLookup(leadByPhone, leadByEmail, lead, null, null);
                auditLogs.Add(_auditLogService.CreateLog(
                    currentUserId,
                    "Lead",
                    lead.LeadId,
                    "ImportCreate",
                    newValue: $"{{Name: {lead.Name}, Phone: {lead.Phone}, Email: {lead.Email}}}"));
                result.CreatedCount++;
            }
            catch (Exception ex)
            {
                result.FailedCount++;
                result.Errors.Add(new LeadImportRowErrorDto
                {
                    RowNumber = row.RowNumber,
                    Message = ex.Message
                });
            }
        }

        if (pendingLeads.Count == 0 && auditLogs.Count == 0)
            return result;

        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            if (pendingLeads.Count > 0)
                _context.Leads.AddRange(pendingLeads);

            if (auditLogs.Count > 0)
                _auditLogService.AddRange(auditLogs);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (DbUpdateException ex)
        {
            await transaction.RollbackAsync();

            if (ex.InnerException?.Message.Contains("IX_Lead") == true)
                throw new Exception("The import contains duplicate phone numbers or email addresses that could not be resolved");

            throw new Exception("An error occurred while importing leads");
        }

        return result;
    }

    public async Task<PagedResult<LeadListDto>> GetLeadListAsync(LeadListQueryDto request)
    {
        var page = request.Page < 1 ? 1 : request.Page;
        var pageSize = request.PageSize < 1 ? 10 : request.PageSize;

        var query = _context.Leads
            .Include(l => l.Source)
            .Include(l => l.AssignedToStaff)
                .ThenInclude(s => s.Branch)
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var keyword = $"%{request.Search.Trim()}%";
            query = query.Where(l =>
                EF.Functions.ILike(l.Name, keyword) ||
                EF.Functions.ILike(l.Email ?? "", keyword) ||
                EF.Functions.ILike(l.Phone, keyword)
            );
        }

        if (request.Status.HasValue)
            query = query.Where(l => l.Status == request.Status.Value);

        if (request.SourceId.HasValue)
            query = query.Where(l => l.SourceId == request.SourceId.Value);

        if (request.BranchId.HasValue)
            query = query.Where(l => l.BranchId == request.BranchId.Value);

        if (request.AssignedToStaffId.HasValue)
            query = query.Where(l => l.AssignedToStaffId == request.AssignedToStaffId.Value);

        if (request.MinScore.HasValue)
            query = query.Where(l => l.Score >= request.MinScore.Value);

        if (request.MaxScore.HasValue)
            query = query.Where(l => l.Score <= request.MaxScore.Value);

        if (request.CreatedFrom.HasValue)
        {
            var createdFrom = GetUtcDayStart(request.CreatedFrom.Value);
            query = query.Where(l => l.CreatedAt >= createdFrom);
        }

        if (request.CreatedTo.HasValue)
        {
            var createdToExclusive = GetUtcDayStart(request.CreatedTo.Value).AddDays(1);
            query = query.Where(l => l.CreatedAt < createdToExclusive);
        }

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(l => l.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ProjectTo<LeadListDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return new PagedResult<LeadListDto>(items, total, page, pageSize);
    }

    public async Task<LeadStatsDto> GetLeadStatsAsync()
    {
        var now = DateTime.UtcNow;
        var today = GetUtcDayStart(now);
        var weekStart = today.AddDays(-((int)today.DayOfWeek + 6) % 7);
        var monthStart = GetUtcMonthStart(today);

        var totalLeads = await _context.Leads.CountAsync();

        var statusCounts = await _context.Leads
            .GroupBy(l => l.Status)
            .Select(g => new
            {
                Status = g.Key,
                Count = g.Count()
            })
            .ToListAsync();

        var leadsCreatedToday = await _context.Leads
            .CountAsync(l => l.CreatedAt >= today);

        var leadsCreatedThisWeek = await _context.Leads
            .CountAsync(l => l.CreatedAt >= weekStart);

        var leadsCreatedThisMonth = await _context.Leads
            .CountAsync(l => l.CreatedAt >= monthStart);

        var averageScore = await _context.Leads
            .Select(l => (double?)l.Score)
            .AverageAsync() ?? 0d;

        var topSources = await _context.Leads
            .Where(l => l.Source != null)
            .GroupBy(l => new { l.SourceId, l.Source!.Name })
            .Select(g => new LeadSourceStatsDto
            {
                SourceId = g.Key.SourceId,
                SourceName = g.Key.Name,
                LeadCount = g.Count()
            })
            .OrderByDescending(x => x.LeadCount)
            .ThenBy(x => x.SourceName)
            .Take(5)
            .ToListAsync();

        var contactedLeads = GetStatusCount(statusCounts, LeadStatus.Contacted);
        var convertedLeads = GetStatusCount(statusCounts, LeadStatus.Converted);

        return new LeadStatsDto
        {
            TotalLeads = totalLeads,
            NewLeads = GetStatusCount(statusCounts, LeadStatus.New),
            ContactedLeads = contactedLeads,
            QualifiedLeads = GetStatusCount(statusCounts, LeadStatus.Qualified),
            ConvertedLeads = convertedLeads,
            LostLeads = GetStatusCount(statusCounts, LeadStatus.Lost),
            LeadsCreatedToday = leadsCreatedToday,
            LeadsCreatedThisWeek = leadsCreatedThisWeek,
            LeadsCreatedThisMonth = leadsCreatedThisMonth,
            AverageScore = decimal.Round((decimal)averageScore, 2),
            ContactRate = totalLeads == 0 ? 0 : decimal.Round(contactedLeads * 100m / totalLeads, 2),
            ConversionRate = totalLeads == 0 ? 0 : decimal.Round(convertedLeads * 100m / totalLeads, 2),
            TopSources = topSources
        };
    }

    public async Task<LeadDto> UpdateLeadAsync(Guid id, UpdateLeadDto dto, Guid currentUserId)
    {
        ValidateLeadPayload(dto.Phone, dto.Email);
        await EnsureLeadWritePermissionAsync(currentUserId);

        var lead = await _context.Leads.FirstOrDefaultAsync(l => l.LeadId == id);
        if (lead == null)
            throw new Exception("Lead not found");

        var source = await _context.LeadSources
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == dto.SourceId && s.IsActive);

        if (source == null)
            throw new Exception("Lead source is invalid or inactive");

        var resolvedAssignedToStaffId = dto.AssignedToStaffId ?? lead.AssignedToStaffId;
        var assignedStaffIsSales = await _context.Staffs
            .AsNoTracking()
            .AnyAsync(s => s.UserId == resolvedAssignedToStaffId && s.Position == StaffPosition.Sales);

        if (!assignedStaffIsSales)
            throw new Exception("A lead can only be assigned to a sales staff member");

        var oldValue = $"{{Name: {lead.Name}, Phone: {lead.Phone}, Email: {lead.Email}, Note: {lead.Note}, BranchId: {lead.BranchId}, SourceId: {lead.SourceId}, AssignedToStaffId: {lead.AssignedToStaffId}, Score: {lead.Score}}}";

        _mapper.Map(dto, lead);
        lead.AssignedToStaffId = resolvedAssignedToStaffId;
        lead.Score = CalculateScore(lead.Phone, lead.Email, lead.ContactCount, source.Score);
        lead.UpdatedAt = DateTime.UtcNow;

        _auditLogService.Add(_auditLogService.CreateLog(
            currentUserId,
            "Lead",
            lead.LeadId,
            "Update",
            oldValue: oldValue,
            newValue: $"{{Name: {lead.Name}, Phone: {lead.Phone}, Email: {lead.Email}, Note: {lead.Note}, BranchId: {lead.BranchId}, SourceId: {lead.SourceId}, AssignedToStaffId: {lead.AssignedToStaffId}, Score: {lead.Score}}}"));

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            if (ex.InnerException?.Message.Contains("IX_Lead") == true)
                throw new Exception("Lead already exists with the same phone number or email");

            throw new Exception("An error occurred while updating the lead");
        }

        return await _context.Leads
            .Where(l => l.LeadId == id)
            .ProjectTo<LeadDto>(_mapper.ConfigurationProvider)
            .FirstAsync();
    }

    public async Task<LeadDto> UpdateLeadStatusAsync(Guid id, UpdateLeadStatusDto dto, Guid currentUserId)
    {
        await EnsureLeadWritePermissionAsync(currentUserId);

        var lead = await _context.Leads.FirstOrDefaultAsync(l => l.LeadId == id);
        if (lead == null)
            throw new Exception("Lead not found");

        if (dto.Status == LeadStatus.Lost && string.IsNullOrWhiteSpace(dto.LostReason))
            throw new Exception("Lost reason is required when status is Lost");

        var previousStatus = lead.Status;
        var previousLostReason = lead.LostReason;
        var previousContactCount = lead.ContactCount;
        var previousLastContactedAt = lead.LastContactedAt;
        var previousScore = lead.Score;

        lead.Status = dto.Status;
        lead.LostReason = dto.Status == LeadStatus.Lost ? dto.LostReason?.Trim() : null;

        if (dto.Status == LeadStatus.Contacted)
            await ApplyContactedStateAsync(lead);

        lead.UpdatedAt = DateTime.UtcNow;

        _auditLogService.Add(_auditLogService.CreateLog(
            currentUserId,
            "Lead",
            lead.LeadId,
            "UpdateStatus",
            oldValue: $"{{Status: {previousStatus}, LostReason: {previousLostReason}, ContactCount: {previousContactCount}, LastContactedAt: {previousLastContactedAt}, Score: {previousScore}}}",
            newValue: $"{{Status: {lead.Status}, LostReason: {lead.LostReason}, ContactCount: {lead.ContactCount}, LastContactedAt: {lead.LastContactedAt}, Score: {lead.Score}}}"));

        await _context.SaveChangesAsync();

        return await _context.Leads
            .Where(l => l.LeadId == id)
            .ProjectTo<LeadDto>(_mapper.ConfigurationProvider)
            .FirstAsync();
    }

    public async Task<LeadDto> ContactLeadAsync(Guid id, Guid currentUserId)
    {
        await EnsureLeadWritePermissionAsync(currentUserId);

        var lead = await _context.Leads.FirstOrDefaultAsync(l => l.LeadId == id);
        if (lead == null)
            throw new Exception("Lead not found");

        var previousStatus = lead.Status;
        var previousLostReason = lead.LostReason;
        var previousContactCount = lead.ContactCount;
        var previousLastContactedAt = lead.LastContactedAt;
        var previousScore = lead.Score;

        lead.Status = LeadStatus.Contacted;
        lead.LostReason = null;
        await ApplyContactedStateAsync(lead);
        lead.UpdatedAt = DateTime.UtcNow;

        _auditLogService.Add(_auditLogService.CreateLog(
            currentUserId,
            "Lead",
            lead.LeadId,
            "Contact",
            oldValue: $"{{Status: {previousStatus}, LostReason: {previousLostReason}, ContactCount: {previousContactCount}, LastContactedAt: {previousLastContactedAt}, Score: {previousScore}}}",
            newValue: $"{{Status: {lead.Status}, LostReason: {lead.LostReason}, ContactCount: {lead.ContactCount}, LastContactedAt: {lead.LastContactedAt}, Score: {lead.Score}}}"));

        await _context.SaveChangesAsync();

        return await _context.Leads
            .Where(l => l.LeadId == id)
            .ProjectTo<LeadDto>(_mapper.ConfigurationProvider)
            .FirstAsync();
    }

    public async Task<LeadDto> MergeLeadAsync(Guid leadId, MergeLeadDto request, Guid currentUserId)
    {
        if (leadId == request.DuplicateLeadId)
            throw new Exception("Lead id and duplicate lead id must be different");

        await EnsureLeadWritePermissionAsync(currentUserId);

        var leads = await _context.Leads
            .Where(l => l.LeadId == leadId || l.LeadId == request.DuplicateLeadId)
            .ToListAsync();

        var targetLead = leads.FirstOrDefault(l => l.LeadId == leadId);
        if (targetLead == null)
            throw new Exception("Target lead not found");

        var duplicateLead = leads.FirstOrDefault(l => l.LeadId == request.DuplicateLeadId);
        if (duplicateLead == null)
            throw new Exception("Duplicate lead not found");

        if (targetLead.ConvertedMemberUserId.HasValue && duplicateLead.ConvertedMemberUserId.HasValue &&
            targetLead.ConvertedMemberUserId != duplicateLead.ConvertedMemberUserId)
            throw new Exception("Cannot merge leads that are linked to different members");

        var mergedLead = BuildMergedLeadSnapshot(targetLead, duplicateLead);

        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            _context.Leads.Remove(duplicateLead);
            _auditLogService.Add(_auditLogService.CreateLog(
                currentUserId,
                "Lead",
                duplicateLead.LeadId,
                "MergeDelete",
                newValue: $"Merged into lead {targetLead.LeadId}"));
            await _context.SaveChangesAsync();

            targetLead.Name = mergedLead.Name;
            targetLead.Phone = mergedLead.Phone;
            targetLead.Email = mergedLead.Email;
            targetLead.Note = mergedLead.Note;
            targetLead.LostReason = mergedLead.LostReason;
            targetLead.LastContactedAt = mergedLead.LastContactedAt;
            targetLead.ContactCount = mergedLead.ContactCount;
            targetLead.Score = mergedLead.Score;
            targetLead.Status = mergedLead.Status;
            targetLead.SourceId = mergedLead.SourceId;
            targetLead.AssignedToStaffId = mergedLead.AssignedToStaffId;
            targetLead.BranchId = mergedLead.BranchId;
            targetLead.ConvertedMemberUserId = mergedLead.ConvertedMemberUserId;
            targetLead.CreatedAt = mergedLead.CreatedAt;
            targetLead.CreatedByUserId = mergedLead.CreatedByUserId;
            targetLead.UpdatedAt = DateTime.UtcNow;

            _auditLogService.Add(_auditLogService.CreateLog(
                currentUserId,
                "Lead",
                targetLead.LeadId,
                "MergeUpdate",
                newValue: $"Merged duplicate lead {duplicateLead.LeadId}"));
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (DbUpdateException ex)
        {
            await transaction.RollbackAsync();

            if (ex.InnerException?.Message.Contains("IX_Lead") == true)
                throw new Exception("The merged lead would violate the unique phone number or email constraints");

            throw new Exception("An error occurred while merging leads");
        }

        var dto = await _context.Leads
            .Where(l => l.LeadId == leadId)
            .ProjectTo<LeadDto>(_mapper.ConfigurationProvider)
            .FirstAsync();

        return dto;
    }

    public async Task<ConvertLeadResultDto> ConvertLeadToMemberAsync(Guid leadId, ConvertLeadToMemberDto dto, Guid currentUserId)
    {
        await EnsureLeadWritePermissionAsync(currentUserId);

        var lead = await _context.Leads.FirstOrDefaultAsync(l => l.LeadId == leadId);
        if (lead == null) throw new Exception("Lead not found");

        if (lead.ConvertedMemberUserId.HasValue)
            throw new Exception("Lead is already converted");

        if (lead.Status == LeadStatus.Lost)
            throw new Exception("Cannot convert a lost lead");

        // ── 1. Validate Package / Pricing ──────────────────────────────────────
        var package = await _context.Packages
            .Include(p => p.Pricings)
            .FirstOrDefaultAsync(p => p.PackageId == dto.PackageId && p.Status == PackageStatus.Active)
            ?? throw new Exception("Package not found or inactive");

        var pricing = package.Pricings.FirstOrDefault(pr => pr.PackagePricingId == dto.PricingId)
            ?? throw new Exception("Pricing not found for this package");

        // ── 2. Tính giá & Promotions ───────────────────────────────────────────
        decimal originalPrice = pricing.Price;
        decimal discountAmount = 0;

        if (dto.PromotionIds != null && dto.PromotionIds.Any())
        {
            var promotions = await _context.Promotions
                .Where(p => dto.PromotionIds.Contains(p.PromotionId) && p.Status == PromotionStatus.Active)
                .ToListAsync();

            foreach (var promo in promotions)
            {
                if (promo.StartDate > DateTime.UtcNow || promo.EndDate < DateTime.UtcNow) continue;
                if (promo.ApplicablePackageId.HasValue && promo.ApplicablePackageId != package.PackageId) continue;
                if (promo.CurrentUsage >= promo.MaxUsage) continue;

                if (promo.DiscountType == DiscountType.Percentage)
                    discountAmount += originalPrice * (promo.DiscountValue / 100);
                else if (promo.DiscountType == DiscountType.FixedAmount)
                    discountAmount += promo.DiscountValue;

                promo.CurrentUsage++;
            }
        }
        if (discountAmount > originalPrice) discountAmount = originalPrice;
        decimal dealPrice = originalPrice - discountAmount;

        // ── 3. Validate email/phone trùng lặp ─────────────────────────────────
        var email = string.IsNullOrWhiteSpace(lead.Email) ? $"{lead.Phone}@placeholder.local" : lead.Email;
        var phone = lead.Phone;

        var emailExists = await _userManager.FindByEmailAsync(email) != null;
        if (emailExists)
            throw new Exception($"An account with email '{email}' already exists");

        if (!string.IsNullOrWhiteSpace(phone))
        {
            var phoneExists = await _context.Users.AnyAsync(u => u.PhoneNumber == phone);
            if (phoneExists)
                throw new Exception($"An account with phone '{phone}' already exists");
        }

        // ── 4. Tạo User + Member + AccessCard (Inactive) ──────────────────────
        var tempPassword = RegistrationService.GenerateTempPassword();
        var user = new User
        {
            UserName = email,
            Email = email,
            PhoneNumber = phone,
            FullName = lead.Name,
            CreatedAt = DateTime.UtcNow
        };

        var createResult = await _userManager.CreateAsync(user, tempPassword);
        if (!createResult.Succeeded)
            throw new Exception("Failed to create user: " + string.Join(", ", createResult.Errors.Select(e => e.Description)));

        await _userManager.AddToRoleAsync(user, "Member");

        _context.Members.Add(new Member { UserId = user.Id });

        var cardCode = RegistrationService.GenerateCardCode(user.Id);
        _context.AccessCards.Add(new AccessCard
        {
            AccessCardId = Guid.NewGuid(),
            MemberUserId = user.Id,
            CardCode = cardCode,
            Status = AccessCardStatus.Inactive,   // chưa kích hoạt
            IssueDate = DateTime.UtcNow
        });

        // ── 5. Tạo Contract (Pending) ──────────────────────────────────────────
        var staffRecord = await _context.Staffs.AsNoTracking().FirstOrDefaultAsync(s => s.UserId == currentUserId);
        var isStaffExist = staffRecord != null;
        var staffId = staffRecord?.UserId;

        var startDate = DateTime.SpecifyKind(dto.StartDate, DateTimeKind.Utc);
        var endDate = startDate.AddMonths(pricing.DurationMonths);

        var contract = new Contract
        {
            ContractId = Guid.NewGuid(),
            MemberUserId = user.Id,
            PackageId = package.PackageId,
            StaffId = isStaffExist ? staffId : null,
            OriginalPrice = originalPrice,
            DiscountAmount = discountAmount,
            DealPrice = dealPrice,
            Note = dto.Note,
            Status = ContractStatus.Pending,
            StartDate = startDate,
            EndDate = endDate,
            TotalPrivateSessions = package.PrivatePtLimit,
            TotalGroupSessions = package.GroupPtLimit,
            CreatedAt = DateTime.UtcNow
        };
        _context.Contracts.Add(contract);

        // ── 6. Tạo Invoice (Pending) ───────────────────────────────────────────
        var suffix = Convert.ToHexString(System.Security.Cryptography.RandomNumberGenerator.GetBytes(3));
        var invoice = new Invoice
        {
            InvoiceId = Guid.NewGuid(),
            ContractId = contract.ContractId,
            MemberId = user.Id,
            InvoiceCode = $"INV-{DateTime.UtcNow:yyyyMMdd}-{suffix}",
            Subtotal = originalPrice,
            DiscountAmount = discountAmount,
            TaxAmount = dto.TaxAmount,
            TotalAmount = dealPrice + dto.TaxAmount,
            Status = InvoiceStatus.Pending,   // chưa thu tiền
            CreatedByStaffId = isStaffExist ? staffId : null,
            CreatedAt = DateTime.UtcNow
        };
        _context.Invoices.Add(invoice);

        // ── 7. Cập nhật Lead ───────────────────────────────────────────────────
        lead.ConvertedMemberUserId = user.Id;
        lead.Status = LeadStatus.Converted;
        lead.LostReason = null;
        lead.UpdatedAt = DateTime.UtcNow;

        _auditLogService.Add(_auditLogService.CreateLog(
            currentUserId,
            "Lead",
            lead.LeadId,
            "Convert",
            newValue: $"Converted to Member {user.Id}, Contract {contract.ContractId} (Pending payment)"));

        await _context.SaveChangesAsync();

        return new ConvertLeadResultDto
        {
            MemberUserId = user.Id,
            ContractId = contract.ContractId,
            InvoiceId = invoice.InvoiceId,
            TotalAmountDue = invoice.TotalAmount,
            OriginalPrice = originalPrice,
            DiscountAmount = discountAmount,
            DealPrice = dealPrice,
            ContractStartDate = startDate,
            ContractEndDate = endDate,
            Message = $"Lead converted to Member (Pending). Collect payment at /api/invoices/{invoice.InvoiceId}/payment then activate at /api/contracts/{contract.ContractId}/activate"
        };
    }


    public async Task<LeadDto?> GetLeadAsync(Guid id)
    {
        var lead = await _context.Leads
            .AsNoTracking()
            .FirstOrDefaultAsync(l => l.LeadId == id);

        if (lead == null) return null;

        var dto = await _context.Leads
            .Where(l => l.LeadId == id)
            .ProjectTo<LeadDto>(_mapper.ConfigurationProvider)
            .FirstAsync();

        return dto;
    }

    private async Task EnsureLeadWritePermissionAsync(Guid currentUserId)
    {
        var currentUserHasPermission = await _context.Staffs
            .AsNoTracking()
            .AnyAsync(s => s.UserId == currentUserId &&
                          (s.Position == StaffPosition.Sales ||
                           s.Position == StaffPosition.BranchAdmin));

        if (currentUserHasPermission)
            return;

        var isSuperAdmin = await _context.UserRoles
            .AsNoTracking()
            .AnyAsync(ur => ur.UserId == currentUserId &&
                           _context.Roles.Any(r => r.Id == ur.RoleId && r.Name == "SuperAdmin"));

        if (!isSuperAdmin)
            throw new Exception("You do not have permission to manage leads");
    }

    private async Task<Guid> ResolveAssignedStaffIdAsync(Guid? assignedToStaffId, Guid fallbackUserId, Dictionary<Guid, bool> salesCache)
    {
        var resolvedAssignedToStaffId = assignedToStaffId ?? fallbackUserId;
        var isSalesStaff = await IsSalesStaffAsync(resolvedAssignedToStaffId, salesCache);

        if (!isSalesStaff)
            throw new Exception("A lead can only be assigned to a sales staff member");

        return resolvedAssignedToStaffId;
    }

    private async Task<bool> IsSalesStaffAsync(Guid staffUserId, Dictionary<Guid, bool> salesCache)
    {
        if (salesCache.TryGetValue(staffUserId, out var isSalesStaff))
            return isSalesStaff;

        isSalesStaff = await _context.Staffs
            .AsNoTracking()
            .AnyAsync(s => s.UserId == staffUserId && s.Position == StaffPosition.Sales);

        salesCache[staffUserId] = isSalesStaff;
        return isSalesStaff;
    }

    private async Task<LeadSource> GetActiveLeadSourceAsync(Guid sourceId, Dictionary<Guid, LeadSource?> sourceCache)
    {
        if (!sourceCache.TryGetValue(sourceId, out var source))
        {
            source = await _context.LeadSources
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == sourceId && s.IsActive);

            sourceCache[sourceId] = source;
        }

        if (source == null)
            throw new Exception("Lead source is invalid or inactive");

        return source;
    }

    private static void ValidateLeadPayload(CreateLeadDto dto)
    {
        ValidateLeadPayload(dto.Phone, dto.Email);
    }

    private static void ValidateLeadPayload(string phone, string? email)
    {
        if (!PhoneRegex.IsMatch(phone))
            throw new Exception("Invalid phone number format (9-11 digits)");

        if (!string.IsNullOrWhiteSpace(email) && !EmailRegex.IsMatch(email))
            throw new Exception("Invalid email address");
    }

    private async Task ApplyContactedStateAsync(Lead lead)
    {
        lead.LastContactedAt = DateTime.UtcNow;
        lead.ContactCount += 1;

        var sourceScore = await GetLeadSourceScoreAsync(lead.SourceId);
        lead.Score = CalculateScore(lead.Phone, lead.Email, lead.ContactCount, sourceScore);
    }

    private static List<ImportLeadCsvRow> ParseImportRows(IFormFile file)
    {
        using var stream = file.OpenReadStream();
        using var parser = new TextFieldParser(stream);
        parser.TextFieldType = FieldType.Delimited;
        parser.SetDelimiters(",");
        parser.HasFieldsEnclosedInQuotes = true;
        parser.TrimWhiteSpace = true;

        if (parser.EndOfData)
            throw new Exception("CSV file is empty");

        var headers = parser.ReadFields();
        if (headers == null || headers.Length == 0)
            throw new Exception("CSV header row is required");

        var headerMap = headers
            .Select((header, index) => new { Header = NormalizeHeader(header), Index = index })
            .GroupBy(x => x.Header)
            .ToDictionary(g => g.Key, g => g.First().Index);

        var requiredHeaders = new[] { "name", "phone", "branchid", "sourceid" };
        foreach (var requiredHeader in requiredHeaders)
        {
            if (!headerMap.ContainsKey(requiredHeader))
                throw new Exception($"CSV file must contain the '{requiredHeader}' column");
        }

        var rows = new List<ImportLeadCsvRow>();
        var rowNumber = 1;

        while (!parser.EndOfData)
        {
            rowNumber++;
            var fields = parser.ReadFields() ?? Array.Empty<string>();
            rows.Add(new ImportLeadCsvRow
            {
                RowNumber = rowNumber,
                Name = GetFieldValue(fields, headerMap, "name"),
                Phone = GetFieldValue(fields, headerMap, "phone"),
                Email = GetFieldValue(fields, headerMap, "email"),
                Note = GetFieldValue(fields, headerMap, "note"),
                BranchId = GetFieldValue(fields, headerMap, "branchid"),
                SourceId = GetFieldValue(fields, headerMap, "sourceid"),
                AssignedToStaffId = GetFieldValue(fields, headerMap, "assignedtostaffid")
            });
        }

        return rows;
    }

    private static string GetFieldValue(string[] fields, Dictionary<string, int> headerMap, string header)
    {
        if (!headerMap.TryGetValue(header, out var index) || index >= fields.Length)
            return string.Empty;

        return fields[index].Trim();
    }

    private static CreateLeadDto BuildCreateLeadDto(ImportLeadCsvRow row)
    {
        if (string.IsNullOrWhiteSpace(row.Name))
            throw new Exception("Name is required");

        if (string.IsNullOrWhiteSpace(row.Phone))
            throw new Exception("Phone number is required");

        if (!Guid.TryParse(row.BranchId, out var branchId))
            throw new Exception("BranchId must be a valid GUID");

        if (!Guid.TryParse(row.SourceId, out var sourceId))
            throw new Exception("SourceId must be a valid GUID");

        Guid? assignedToStaffId = null;
        if (!string.IsNullOrWhiteSpace(row.AssignedToStaffId))
        {
            if (!Guid.TryParse(row.AssignedToStaffId, out var parsedAssignedToStaffId))
                throw new Exception("AssignedToStaffId must be a valid GUID");

            assignedToStaffId = parsedAssignedToStaffId;
        }

        return new CreateLeadDto
        {
            Name = row.Name.Trim(),
            Phone = row.Phone.Trim(),
            Email = string.IsNullOrWhiteSpace(row.Email) ? null : row.Email.Trim(),
            Note = string.IsNullOrWhiteSpace(row.Note) ? null : row.Note.Trim(),
            BranchId = branchId,
            SourceId = sourceId,
            AssignedToStaffId = assignedToStaffId
        };
    }

    private async Task<int> GetLeadSourceScoreAsync(Guid sourceId)
    {
        var sourceScore = await _context.LeadSources
            .AsNoTracking()
            .Where(s => s.Id == sourceId)
            .Select(s => (int?)s.Score)
            .FirstOrDefaultAsync();

        return sourceScore ?? DEFAULT_SCORE;
    }

    private static Lead? FindMatchingLead(ImportLeadCsvRow row, Dictionary<string, Lead> leadByPhone, Dictionary<string, Lead> leadByEmail)
    {
        Lead? leadMatchedByPhone = null;
        var phoneKey = NormalizePhone(row.Phone);
        if (!string.IsNullOrWhiteSpace(phoneKey))
            leadByPhone.TryGetValue(phoneKey, out leadMatchedByPhone);

        Lead? leadMatchedByEmail = null;
        var emailKey = NormalizeEmail(row.Email);
        if (!string.IsNullOrWhiteSpace(emailKey))
            leadByEmail.TryGetValue(emailKey, out leadMatchedByEmail);

        if (leadMatchedByPhone != null && leadMatchedByEmail != null && leadMatchedByPhone.LeadId != leadMatchedByEmail.LeadId)
            throw new Exception("The row matches multiple existing leads by phone number and email");

        return leadMatchedByPhone ?? leadMatchedByEmail;
    }

    private Lead BuildLeadEntity(CreateLeadDto dto, Guid assignedToStaffId, Guid currentUserId, int sourceScore)
    {
        var lead = _mapper.Map<Lead>(dto);
        lead.LeadId = Guid.NewGuid();
        lead.AssignedToStaffId = assignedToStaffId;
        lead.Status = LeadStatus.New;
        lead.CreatedAt = DateTime.UtcNow;
        lead.Score = CalculateScore(lead.Phone, lead.Email, lead.ContactCount, sourceScore);
        lead.CreatedByUserId = currentUserId;
        return lead;
    }

    private void ApplyImportedLeadValues(Lead lead, CreateLeadDto dto, Guid assignedToStaffId, int sourceScore)
    {
        _mapper.Map(dto, lead);
        lead.AssignedToStaffId = assignedToStaffId;
        lead.Score = CalculateScore(lead.Phone, lead.Email, lead.ContactCount, sourceScore);
    }

    private static void RefreshLeadLookup(
        Dictionary<string, Lead> leadByPhone,
        Dictionary<string, Lead> leadByEmail,
        Lead lead,
        string? previousPhone,
        string? previousEmail)
    {
        if (!string.IsNullOrWhiteSpace(previousPhone) && leadByPhone.TryGetValue(previousPhone, out var previousPhoneLead) && previousPhoneLead.LeadId == lead.LeadId)
            leadByPhone.Remove(previousPhone);

        if (!string.IsNullOrWhiteSpace(previousEmail) && leadByEmail.TryGetValue(previousEmail, out var previousEmailLead) && previousEmailLead.LeadId == lead.LeadId)
            leadByEmail.Remove(previousEmail);

        var phoneKey = NormalizePhone(lead.Phone);
        if (!string.IsNullOrWhiteSpace(phoneKey))
            leadByPhone[phoneKey] = lead;

        var emailKey = NormalizeEmail(lead.Email);
        if (!string.IsNullOrWhiteSpace(emailKey))
            leadByEmail[emailKey] = lead;
    }

    private static MergedLeadSnapshot BuildMergedLeadSnapshot(Lead targetLead, Lead duplicateLead)
    {
        var targetTimestamp = targetLead.UpdatedAt ?? targetLead.CreatedAt;
        var duplicateTimestamp = duplicateLead.UpdatedAt ?? duplicateLead.CreatedAt;
        var latestLead = duplicateTimestamp >= targetTimestamp ? duplicateLead : targetLead;
        var olderLead = latestLead.LeadId == targetLead.LeadId ? duplicateLead : targetLead;

        return new MergedLeadSnapshot
        {
            Name = PreferLatestValue(latestLead.Name, olderLead.Name) ?? targetLead.Name,
            Phone = PreferLatestValue(latestLead.Phone, olderLead.Phone) ?? targetLead.Phone,
            Email = PreferLatestValue(latestLead.Email, olderLead.Email),
            Note = PreferLatestValue(latestLead.Note, olderLead.Note),
            LostReason = PreferLatestValue(latestLead.LostReason, olderLead.LostReason),
            LastContactedAt = MaxDate(targetLead.LastContactedAt, duplicateLead.LastContactedAt),
            ContactCount = targetLead.ContactCount + duplicateLead.ContactCount,
            Score = Math.Max(targetLead.Score, duplicateLead.Score),
            Status = latestLead.Status,
            SourceId = latestLead.SourceId != Guid.Empty ? latestLead.SourceId : olderLead.SourceId,
            AssignedToStaffId = latestLead.AssignedToStaffId != Guid.Empty ? latestLead.AssignedToStaffId : olderLead.AssignedToStaffId,
            BranchId = latestLead.BranchId ?? olderLead.BranchId,
            ConvertedMemberUserId = targetLead.ConvertedMemberUserId ?? duplicateLead.ConvertedMemberUserId,
            CreatedAt = targetLead.CreatedAt <= duplicateLead.CreatedAt ? targetLead.CreatedAt : duplicateLead.CreatedAt,
            CreatedByUserId = targetLead.CreatedByUserId != Guid.Empty ? targetLead.CreatedByUserId : duplicateLead.CreatedByUserId
        };
    }

    private static DateTime? MaxDate(DateTime? first, DateTime? second)
    {
        if (!first.HasValue)
            return second;

        if (!second.HasValue)
            return first;

        return first >= second ? first : second;
    }

    private static string? PreferLatestValue(string? latestValue, string? olderValue)
    {
        if (!string.IsNullOrWhiteSpace(latestValue))
            return latestValue;

        return string.IsNullOrWhiteSpace(olderValue) ? null : olderValue;
    }

    private static string NormalizeHeader(string value)
    {
        return new string(value
            .Trim()
            .Where(ch => !char.IsWhiteSpace(ch) && ch != '_' && ch != '-')
            .ToArray())
            .ToLowerInvariant();
    }

    private static string NormalizePhone(string? value)
    {
        return value?.Trim() ?? string.Empty;
    }

    private static DateTime GetUtcDayStart(DateTime value)
    {
        return new DateTime(value.Year, value.Month, value.Day, 0, 0, 0, DateTimeKind.Utc);
    }

    private static DateTime GetUtcMonthStart(DateTime value)
    {
        return new DateTime(value.Year, value.Month, 1, 0, 0, 0, DateTimeKind.Utc);
    }

    private static string NormalizeEmail(string? value)
    {
        return value?.Trim().ToLowerInvariant() ?? string.Empty;
    }

    private static int CalculateScore(string phone, string? email, int contactCount, int sourceScore)
    {
        int score = sourceScore;

        // completeness
        if (!string.IsNullOrEmpty(phone)) score += 20;
        if (!string.IsNullOrEmpty(email)) score += 10;

        // behavior (initial = 0)
        score += contactCount * 10;

        return score;
    }
    private static int GetStatusCount(IEnumerable<dynamic> statusCounts, LeadStatus status)
    {
        foreach (var item in statusCounts)
        {
            if (item.Status == status)
                return item.Count;
        }

        return 0;
    }

    private sealed class ImportLeadCsvRow
    {
        public int RowNumber { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Note { get; set; } = string.Empty;

        public string BranchId { get; set; } = string.Empty;

        public string SourceId { get; set; } = string.Empty;

        public string AssignedToStaffId { get; set; } = string.Empty;
    }

    private sealed class MergedLeadSnapshot
    {
        public string Name { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public string? Email { get; set; }

        public string? Note { get; set; }

        public string? LostReason { get; set; }

        public DateTime? LastContactedAt { get; set; }

        public int ContactCount { get; set; }

        public int Score { get; set; }

        public LeadStatus Status { get; set; }

        public Guid SourceId { get; set; }

        public Guid AssignedToStaffId { get; set; }

        public Guid? BranchId { get; set; }

        public Guid? ConvertedMemberUserId { get; set; }

        public DateTime CreatedAt { get; set; }

        public Guid CreatedByUserId { get; set; }
    }
}
