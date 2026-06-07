using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using backend.Data;
using backend.DTOs.Auth;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services;

public class AuthService : IAuthService
{
    private const int OtpExpiryMinutes = 5;
    private const int PasswordResetOtpExpiryMinutes = 15;
    private const int TwoFactorSetupOtpExpiryMinutes = 10;
    private const int MaxOtpAttempts = 5;

    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;
    private readonly IConfiguration _configuration;
    private readonly IEmailService _emailService;
    private readonly ISmsService _smsService;

    public AuthService(
        ApplicationDbContext context,
        UserManager<User> userManager,
        IConfiguration configuration,
        IEmailService emailService,
        ISmsService smsService)
    {
        _context = context;
        _userManager = userManager;
        _configuration = configuration;
        _emailService = emailService;
        _smsService = smsService;
    }



    public async Task<AuthResultDto> LoginAsync(LoginDto dto, string? ipAddress)
    {
        var user = await FindUserByIdentifierAsync(dto.EmailOrPhone)
            ?? throw new Exception("Invalid credentials");

        if (await _userManager.IsLockedOutAsync(user))
            throw new Exception("User account is locked");

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!isPasswordValid)
            throw new Exception("Invalid credentials");

        var roles = await _userManager.GetRolesAsync(user);

        if (user.TwoFactorEnabled)
        {
            await InvalidateOtpsByPurposeAsync(user.Id, "2FA");

            var otp = new OtpCode
            {
                OtpCodeId = Guid.NewGuid(),
                UserId = user.Id,
                Code = GenerateOtpCode(),
                Purpose = "2FA",
                ExpiresAt = DateTime.UtcNow.AddMinutes(OtpExpiryMinutes),
                IsUsed = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.OtpCodes.Add(otp);
            await _context.SaveChangesAsync();

            try
            {
                bool isEmail = dto.EmailOrPhone.Contains('@');
                if (isEmail && !string.IsNullOrWhiteSpace(user.Email))
                    await _emailService.SendPasswordResetAsync(user.Email, otp.Code);
                else if (!isEmail && !string.IsNullOrWhiteSpace(user.PhoneNumber))
                    await _smsService.SendPasswordResetAsync(user.PhoneNumber, otp.Code);
                else
                {
                    if (!string.IsNullOrWhiteSpace(user.Email))
                        await _emailService.SendPasswordResetAsync(user.Email, otp.Code);
                    else if (!string.IsNullOrWhiteSpace(user.PhoneNumber))
                        await _smsService.SendPasswordResetAsync(user.PhoneNumber, otp.Code);
                }
            }
            catch { }

            return new AuthResultDto
            {
                UserId = user.Id,
                Email = user.Email ?? string.Empty,
                Roles = roles.ToList(),
                RequiresOtp = true
            };
        }

        return await CompleteLoginAsync(user, roles, ipAddress);
    }

    public async Task<AuthResultDto> VerifyOtpAsync(VerifyOtpDto dto, string? ipAddress)
    {
        var user = await _userManager.FindByIdAsync(dto.UserId.ToString())
            ?? throw new Exception("User not found");

        var otpCode = await _context.OtpCodes
            .Where(x => x.UserId == dto.UserId && x.Code == dto.OtpCode && !x.IsUsed && x.Purpose == "2FA")
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync()
            ?? throw new Exception("OTP is invalid");

        if (otpCode.ExpiresAt < DateTime.UtcNow)
            throw new Exception("OTP has expired");

        otpCode.IsUsed = true;
        otpCode.UsedAt = DateTime.UtcNow;

        var roles = await _userManager.GetRolesAsync(user);
        return await CompleteLoginAsync(user, roles, ipAddress);
    }



    public async Task ForgotPasswordAsync(ForgotPasswordDto dto)
    {
        var user = await FindUserByIdentifierAsync(dto.EmailOrPhone);

        if (user == null) return;

        await InvalidateOtpsByPurposeAsync(user.Id, "PasswordReset");

        var otp = new OtpCode
        {
            OtpCodeId = Guid.NewGuid(),
            UserId = user.Id,
            Code = GenerateOtpCode(),
            Purpose = "PasswordReset",
            ExpiresAt = DateTime.UtcNow.AddMinutes(PasswordResetOtpExpiryMinutes),
            IsUsed = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.OtpCodes.Add(otp);
        await _context.SaveChangesAsync();

        try
        {
            bool isEmail = dto.EmailOrPhone.Contains('@');
            if (isEmail && !string.IsNullOrWhiteSpace(user.Email))
                await _emailService.SendPasswordResetAsync(user.Email, otp.Code);
            else if (!isEmail && !string.IsNullOrWhiteSpace(user.PhoneNumber))
                await _smsService.SendPasswordResetAsync(user.PhoneNumber, otp.Code);
            else
            {
                if (!string.IsNullOrWhiteSpace(user.Email))
                    await _emailService.SendPasswordResetAsync(user.Email, otp.Code);
                else if (!string.IsNullOrWhiteSpace(user.PhoneNumber))
                    await _smsService.SendPasswordResetAsync(user.PhoneNumber, otp.Code);
            }
        }
        catch { }
    }

    public async Task ResetPasswordAsync(ResetPasswordDto dto)
    {
        if (dto.NewPassword != dto.ConfirmPassword)
            throw new Exception("Passwords do not match");

        var user = await FindUserByIdentifierAsync(dto.EmailOrPhone)
            ?? throw new Exception("Invalid request");

        var otpCode = await _context.OtpCodes
            .Where(x => x.UserId == user.Id && !x.IsUsed && x.Purpose == "PasswordReset")
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync()
            ?? throw new Exception("OTP is invalid");

        if (otpCode.ExpiresAt < DateTime.UtcNow)
            throw new Exception("OTP has expired");

        if (otpCode.Code != dto.OtpCode)
        {
            otpCode.AttemptCount++;
            if (otpCode.AttemptCount >= MaxOtpAttempts)
            {
                otpCode.IsUsed = true;
                otpCode.UsedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                throw new Exception("OTP invalidated after too many failed attempts");
            }
            await _context.SaveChangesAsync();
            throw new Exception("OTP is invalid");
        }

        var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
        var result = await _userManager.ResetPasswordAsync(user, resetToken, dto.NewPassword);

        if (!result.Succeeded)
            throw new Exception(string.Join("; ", result.Errors.Select(e => e.Description)));

        otpCode.IsUsed = true;
        otpCode.UsedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    public async Task ChangePasswordAsync(Guid userId, ChangePasswordDto dto)
    {
        if (dto.NewPassword != dto.ConfirmPassword)
            throw new Exception("Passwords do not match");

        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new Exception("User not found");

        var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
        if (!result.Succeeded)
            throw new Exception(string.Join("; ", result.Errors.Select(e => e.Description)));
    }



    public async Task SendTwoFactorSetupOtpAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new Exception("User not found");

        await InvalidateOtpsByPurposeAsync(userId, "2FASetup");

        var otp = new OtpCode
        {
            OtpCodeId = Guid.NewGuid(),
            UserId = userId,
            Code = GenerateOtpCode(),
            Purpose = "2FASetup",
            ExpiresAt = DateTime.UtcNow.AddMinutes(TwoFactorSetupOtpExpiryMinutes),
            IsUsed = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.OtpCodes.Add(otp);
        await _context.SaveChangesAsync();

        try
        {
            if (!string.IsNullOrWhiteSpace(user.Email))
                await _emailService.SendPasswordResetAsync(user.Email, otp.Code);
            else if (!string.IsNullOrWhiteSpace(user.PhoneNumber))
                await _smsService.SendPasswordResetAsync(user.PhoneNumber, otp.Code);
        }
        catch { }
    }

    public async Task EnableTwoFactorAsync(Guid userId, TwoFactorOtpDto dto)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new Exception("User not found");

        await ValidateOtpAsync(userId, dto.OtpCode, "2FASetup");
        await _userManager.SetTwoFactorEnabledAsync(user, true);
    }

    public async Task DisableTwoFactorAsync(Guid userId, TwoFactorOtpDto dto)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new Exception("User not found");

        await ValidateOtpAsync(userId, dto.OtpCode, "2FASetup");
        await _userManager.SetTwoFactorEnabledAsync(user, false);
    }



    private async Task<AuthResultDto> CompleteLoginAsync(User user, IList<string> roles, string? ipAddress)
    {
        var now = DateTime.UtcNow;
        user.LastLoginAt = now;

        _context.LoginHistories.Add(new LoginHistory
        {
            LoginHistoryId = Guid.NewGuid(),
            UserId = user.Id,
            LoginAt = now,
            IpAddress = ipAddress
        });

        var (token, expiresAt) = GenerateJwtToken(user, roles);
        await _context.SaveChangesAsync();

        return new AuthResultDto
        {
            UserId = user.Id,
            Email = user.Email ?? string.Empty,
            Roles = roles.ToList(),
            RequiresOtp = false,
            Token = token,
            ExpiresAt = expiresAt
        };
    }

    private async Task ValidateOtpAsync(Guid userId, string code, string purpose)
    {
        var otpCode = await _context.OtpCodes
            .Where(x => x.UserId == userId && !x.IsUsed && x.Purpose == purpose)
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync()
            ?? throw new Exception("OTP is invalid");

        if (otpCode.ExpiresAt < DateTime.UtcNow)
            throw new Exception("OTP has expired");

        if (otpCode.Code != code)
        {
            otpCode.AttemptCount++;
            if (otpCode.AttemptCount >= MaxOtpAttempts)
            {
                otpCode.IsUsed = true;
                otpCode.UsedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                throw new Exception("OTP invalidated after too many failed attempts");
            }
            await _context.SaveChangesAsync();
            throw new Exception("OTP is invalid");
        }

        otpCode.IsUsed = true;
        otpCode.UsedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    private async Task<User?> FindUserByIdentifierAsync(string emailOrPhone)
    {
        if (string.IsNullOrWhiteSpace(emailOrPhone))
            throw new Exception("Email or phone is required");

        var identifier = emailOrPhone.Trim();
        var normalizedEmail = identifier.ToLowerInvariant();
        var normalizedPhone = NormalizePhone(identifier);

        return await _context.Users
            .FirstOrDefaultAsync(x =>
                x.Email == normalizedEmail ||
                x.NormalizedEmail == normalizedEmail.ToUpperInvariant() ||
                (!string.IsNullOrWhiteSpace(normalizedPhone) && x.PhoneNumber == normalizedPhone));
    }

    private async Task InvalidateOtpsByPurposeAsync(Guid userId, string purpose)
    {
        var now = DateTime.UtcNow;
        var pendingCodes = await _context.OtpCodes
            .Where(x => x.UserId == userId && !x.IsUsed && x.Purpose == purpose)
            .ToListAsync();

        foreach (var code in pendingCodes)
        {
            code.IsUsed = true;
            code.UsedAt = now;
        }
    }

    private (string Token, DateTime ExpiresAt) GenerateJwtToken(User user, IList<string> roles)
    {
        var key = _configuration["Jwt:Key"];
        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];
        var expiryMinutes = int.TryParse(_configuration["Jwt:ExpiryMinutes"], out var parsed) ? parsed : 60;

        if (string.IsNullOrWhiteSpace(key) || string.IsNullOrWhiteSpace(issuer) || string.IsNullOrWhiteSpace(audience))
            throw new Exception("JWT configuration is missing");

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        var expiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
            new(ClaimTypes.Email, user.Email ?? string.Empty)
        };

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials);

        return (new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
    }

    private static string GenerateOtpCode()
        => RandomNumberGenerator.GetInt32(0, 1_000_000).ToString("D6");

    private static string NormalizePhone(string input)
        => new(input.Where(char.IsDigit).ToArray());
}
