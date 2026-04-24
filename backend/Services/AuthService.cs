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
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services;

public class AuthService : IAuthService
{
	private const int OtpExpiryMinutes = 5;
	private readonly ApplicationDbContext _context;
	private readonly UserManager<User> _userManager;
	private readonly IConfiguration _configuration;

	public AuthService(ApplicationDbContext context, UserManager<User> userManager, IConfiguration configuration)
	{
		_context = context;
		_userManager = userManager;
		_configuration = configuration;
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
			await InvalidateUnusedOtpCodesAsync(user.Id);

			var otp = new OtpCode
			{
				OtpCodeId = Guid.NewGuid(),
				UserId = user.Id,
				Code = GenerateOtpCode(),
				ExpiresAt = DateTime.UtcNow.AddMinutes(OtpExpiryMinutes),
				IsUsed = false,
				CreatedAt = DateTime.UtcNow
			};

			_context.OtpCodes.Add(otp);
			await _context.SaveChangesAsync();

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
			.Where(x => x.UserId == dto.UserId && x.Code == dto.OtpCode && !x.IsUsed)
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

	private async Task InvalidateUnusedOtpCodesAsync(Guid userId)
	{
		var now = DateTime.UtcNow;
		var pendingCodes = await _context.OtpCodes
			.Where(x => x.UserId == userId && !x.IsUsed)
			.ToListAsync();

		foreach (var pendingCode in pendingCodes)
		{
			pendingCode.IsUsed = true;
			pendingCode.UsedAt = now;
		}
	}

	private (string Token, DateTime ExpiresAt) GenerateJwtToken(User user, IList<string> roles)
	{
		var key = _configuration["Jwt:Key"];
		var issuer = _configuration["Jwt:Issuer"];
		var audience = _configuration["Jwt:Audience"];
		var expiryMinutes = int.TryParse(_configuration["Jwt:ExpiryMinutes"], out var parsedExpiryMinutes)
			? parsedExpiryMinutes
			: 60;

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
	{
		return RandomNumberGenerator.GetInt32(0, 1_000_000).ToString("D6");
	}

	private static string NormalizePhone(string input)
	{
		return new string(input.Where(char.IsDigit).ToArray());
	}
}
