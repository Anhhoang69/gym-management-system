using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using backend.Data;
using backend.Models;
using backend.Data.Seed;
using System.Text.Json.Serialization;
using AutoMapper;
using backend.Mappers;
using backend.Interfaces;
using backend.Services;
using backend.Extensions;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;


var builder = WebApplication.CreateBuilder(args);

// Load local secrets if the file exists
builder.Configuration.AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters
            .Add(new JsonStringEnumConverter());
    });

// ================= ADD CORS =================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});
// ============================================

//builder.Services.AddOpenApi();

// AutoMapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// ================= DATABASE =================

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// ================= IDENTITY =================

builder.Services
    .AddIdentity<User, IdentityRole<Guid>>(options =>
    {
        options.User.RequireUniqueEmail = true;
    })
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        var jwtKey = builder.Configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("JWT key is missing");

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };

        options.Events = new JwtBearerEvents
        {
            OnChallenge = async context =>
            {
                context.HandleResponse();
                context.Response.StatusCode = 401;
                context.Response.ContentType = "text/plain";
                await context.Response.WriteAsync("Unauthorized");
            },
            OnForbidden = async context =>
            {
                context.Response.StatusCode = 403;
                context.Response.ContentType = "text/plain";
                await context.Response.WriteAsync("Forbidden");
            }
        };
    });

builder.Services.AddAuthorization();

// ================= SERVICES =================

builder.Services.AddScoped<IBranchService, BranchService>();
builder.Services.AddScoped<IPromotionService, PromotionService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPackageService, PackageService>();
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<IAuditLogService, AuditLogService>();
builder.Services.AddScoped<IClassService, ClassService>();
builder.Services.AddScoped<ILeadService, LeadService>();
builder.Services.AddScoped<ILeadSourceService, LeadSourceService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// ================= MODULE 4.3.2: ACCOUNT & ACCESS MANAGEMENT =================
builder.Services.AddScoped<IEmailService, SmtpEmailService>();
builder.Services.AddScoped<ISmsService, MockSmsService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<IRegistrationService, RegistrationService>();

// ================= MODULE 4.3.4.b: CONTRACT & INVOICE =================
builder.Services.AddScoped<IContractService, ContractService>();
builder.Services.AddScoped<ICommissionService, CommissionService>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();
builder.Services.AddScoped<IMemberService, MemberService>();
builder.Services.AddScoped<IAttendanceService, AttendanceService>();
builder.Services.AddScoped<IPayrollService, PayrollService>();
builder.Services.AddScoped<IVietQrService, VietQrService>();
builder.Services.AddScoped<IReportsService, ReportsService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();

// ================= VNPAY =================
builder.Services.Configure<backend.Options.VNPayOptions>(builder.Configuration.GetSection("VNPay"));
builder.Services.AddScoped<IVNPayService, VNPayService>();
// ================= CLOUDINARY =================
builder.Services.AddScoped<ICloudinaryService, CloudinaryService>();

// ================= MODULE 4.3.3.b: BRANCH MANAGEMENT =================
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IRequestService, RequestService>();

builder.Services.AddHttpContextAccessor();


// ================= AI: SEMANTIC KERNEL =================

// SK Kernel Factory — creates a configured Kernel (OpenAI/Ollama) per request
builder.Services.AddScoped<backend.AI.Kernel.KernelFactory>();

// SK Function Invocation Filter — audits every tool call to AIToolExecutionLog
builder.Services.AddScoped<backend.AI.Kernel.ToolInvocationFilter>();

// AI Tool Registry — RBAC filtering (Role + StaffPosition)
builder.Services.AddScoped<backend.AI.AIToolRegistry>();
builder.Services.AddScoped<GymDataService>();

// ── Member Tools ──────────────────────────────────────────────────────
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Membership.GetMembershipTool>();
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Membership.GetAvailablePackagesTool>();
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Booking.GetMyScheduleTool>();
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Booking.BookClassTool>();
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Booking.CancelBookingTool>();
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Attendance.GetAttendanceSummaryTool>();
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Training.GenerateFitnessPlanTool>();
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Training.AskFitnessCoachTool>();

// ── Staff Booking Tools ───────────────────────────────────────────────
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Booking.ClassRosterTool>();
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Booking.BookingLookupTool>();
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Booking.MyTeachingScheduleTool>();

// ── Attendance Tools ──────────────────────────────────────────────────
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Attendance.CheckinLookupTool>();
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Attendance.CheckInReportTool>();

// ── Training Tools ────────────────────────────────────────────────────
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Training.MemberTrainingOverviewTool>();

// ── Lead/Sales Tools ─────────────────────────────────────────────────
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Lead.GetLeadSummaryTool>();
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Lead.GetLeadPipelineTool>();
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Lead.SalesFunnelTool>();

// ── Analytics Tools ───────────────────────────────────────────────────
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Analytics.PTPerformanceTool>();
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Analytics.MemberLookupTool>();

// ── Revenue Tools ─────────────────────────────────────────────────────
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Revenue.BranchRevenueTool>();
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Revenue.GlobalRevenueTool>();
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Revenue.SystemDashboardTool>();

// ── Payroll Tools ─────────────────────────────────────────────────────
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Payroll.BranchPayrollTool>();
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Payroll.PayrollOverviewTool>();
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Payroll.PersonalPayrollTool>();

// ── Contract Tools ────────────────────────────────────────────────────
builder.Services.AddScoped<backend.AI.Core.IAITool, backend.AI.Tools.Contract.ContractLookupTool>();

// AI Service (orchestrator)
builder.Services.AddScoped<IAIService, AIService>();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.EnableAnnotations();
    options.UseInlineDefinitionsForEnums();

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter JWT token only. Swagger will add the Bearer prefix automatically."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
var app = builder.Build();

app.UseGlobalException();

app.UseSwagger();
app.UseSwaggerUI();

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.All
});

//app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

if (Environment.GetEnvironmentVariable("RUN_MIGRATIONS") == "true" || app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;

        var context = services.GetRequiredService<ApplicationDbContext>();
        var userManager = services.GetRequiredService<UserManager<User>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();

        await DbSeeder.SeedAsync(context, userManager, roleManager);
    }
}

app.Run();