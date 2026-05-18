using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class Phase1_StaffPayrollAndSchedule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "BaseSalary",
                table: "Staffs",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "AllowMultiBranch",
                table: "PackagePolicies",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "PayrollFormulas",
                columns: table => new
                {
                    FormulaId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    DefaultBaseSalary = table.Column<decimal>(type: "numeric", nullable: false),
                    CommissionPerSession = table.Column<decimal>(type: "numeric", nullable: false),
                    KpiSessionThreshold = table.Column<int>(type: "integer", nullable: false),
                    KpiBonus = table.Column<decimal>(type: "numeric", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedByUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PayrollFormulas", x => x.FormulaId);
                    table.ForeignKey(
                        name: "FK_PayrollFormulas_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PayrollRecords",
                columns: table => new
                {
                    PayrollId = table.Column<Guid>(type: "uuid", nullable: false),
                    StaffId = table.Column<Guid>(type: "uuid", nullable: false),
                    FormulaId = table.Column<Guid>(type: "uuid", nullable: false),
                    PeriodMonth = table.Column<int>(type: "integer", nullable: false),
                    PeriodYear = table.Column<int>(type: "integer", nullable: false),
                    BaseSalary = table.Column<decimal>(type: "numeric", nullable: false),
                    SessionCount = table.Column<int>(type: "integer", nullable: false),
                    SessionCommission = table.Column<decimal>(type: "numeric", nullable: false),
                    KpiBonus = table.Column<decimal>(type: "numeric", nullable: false),
                    SalesCommission = table.Column<decimal>(type: "numeric", nullable: false),
                    TotalSalary = table.Column<decimal>(type: "numeric", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    Note = table.Column<string>(type: "text", nullable: true),
                    CalculatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ApprovedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ApprovedByUserId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PayrollRecords", x => x.PayrollId);
                    table.ForeignKey(
                        name: "FK_PayrollRecords_AspNetUsers_ApprovedByUserId",
                        column: x => x.ApprovedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PayrollRecords_PayrollFormulas_FormulaId",
                        column: x => x.FormulaId,
                        principalTable: "PayrollFormulas",
                        principalColumn: "FormulaId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PayrollRecords_Staffs_StaffId",
                        column: x => x.StaffId,
                        principalTable: "Staffs",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PayrollFormulas_CreatedByUserId",
                table: "PayrollFormulas",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PayrollRecords_ApprovedByUserId",
                table: "PayrollRecords",
                column: "ApprovedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PayrollRecords_FormulaId",
                table: "PayrollRecords",
                column: "FormulaId");

            migrationBuilder.CreateIndex(
                name: "IX_PayrollRecords_StaffId_PeriodMonth_PeriodYear",
                table: "PayrollRecords",
                columns: new[] { "StaffId", "PeriodMonth", "PeriodYear" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PayrollRecords");

            migrationBuilder.DropTable(
                name: "PayrollFormulas");

            migrationBuilder.DropColumn(
                name: "BaseSalary",
                table: "Staffs");

            migrationBuilder.DropColumn(
                name: "AllowMultiBranch",
                table: "PackagePolicies");
        }
    }
}
