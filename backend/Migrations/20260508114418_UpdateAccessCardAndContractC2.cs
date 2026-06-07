using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAccessCardAndContractC2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "CommissionRate",
                table: "Staffs",
                type: "numeric",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "ExpireDate",
                table: "AccessCards",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.CreateTable(
                name: "ContractDrafts",
                columns: table => new
                {
                    DraftId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedByStaffId = table.Column<Guid>(type: "uuid", nullable: false),
                    MemberUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    PackageId = table.Column<Guid>(type: "uuid", nullable: false),
                    PricingId = table.Column<Guid>(type: "uuid", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Note = table.Column<string>(type: "text", nullable: true),
                    OriginalPrice = table.Column<decimal>(type: "numeric", nullable: false),
                    DiscountAmount = table.Column<decimal>(type: "numeric", nullable: false),
                    DealPrice = table.Column<decimal>(type: "numeric", nullable: false),
                    PromotionIdsJson = table.Column<string>(type: "text", nullable: false),
                    IsUsed = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContractDrafts", x => x.DraftId);
                    table.ForeignKey(
                        name: "FK_ContractDrafts_Members_MemberUserId",
                        column: x => x.MemberUserId,
                        principalTable: "Members",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ContractDrafts_PackagePricings_PricingId",
                        column: x => x.PricingId,
                        principalTable: "PackagePricings",
                        principalColumn: "PackagePricingId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ContractDrafts_Packages_PackageId",
                        column: x => x.PackageId,
                        principalTable: "Packages",
                        principalColumn: "PackageId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ContractDrafts_Staffs_CreatedByStaffId",
                        column: x => x.CreatedByStaffId,
                        principalTable: "Staffs",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContractDrafts_CreatedByStaffId",
                table: "ContractDrafts",
                column: "CreatedByStaffId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractDrafts_MemberUserId",
                table: "ContractDrafts",
                column: "MemberUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractDrafts_PackageId",
                table: "ContractDrafts",
                column: "PackageId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractDrafts_PricingId",
                table: "ContractDrafts",
                column: "PricingId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContractDrafts");

            migrationBuilder.DropColumn(
                name: "CommissionRate",
                table: "Staffs");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ExpireDate",
                table: "AccessCards",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);
        }
    }
}
