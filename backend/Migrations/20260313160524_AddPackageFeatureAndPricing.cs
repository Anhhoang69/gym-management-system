using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddPackageFeatureAndPricing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BasePrice",
                table: "Packages");

            migrationBuilder.RenameColumn(
                name: "Duration",
                table: "Packages",
                newName: "MaxCheckinsPerWeek");

            migrationBuilder.AddColumn<string>(
                name: "BadgeLabel",
                table: "Packages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Packages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DisplayOrder",
                table: "Packages",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Tier",
                table: "Packages",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "PackageFeatures",
                columns: table => new
                {
                    PackageFeatureId = table.Column<Guid>(type: "uuid", nullable: false),
                    PackageId = table.Column<Guid>(type: "uuid", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PackageFeatures", x => x.PackageFeatureId);
                    table.ForeignKey(
                        name: "FK_PackageFeatures_Packages_PackageId",
                        column: x => x.PackageId,
                        principalTable: "Packages",
                        principalColumn: "PackageId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PackagePricings",
                columns: table => new
                {
                    PackagePricingId = table.Column<Guid>(type: "uuid", nullable: false),
                    PackageId = table.Column<Guid>(type: "uuid", nullable: false),
                    DurationMonths = table.Column<int>(type: "integer", nullable: false),
                    Price = table.Column<decimal>(type: "numeric", nullable: false),
                    OriginalPrice = table.Column<decimal>(type: "numeric", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PackagePricings", x => x.PackagePricingId);
                    table.ForeignKey(
                        name: "FK_PackagePricings_Packages_PackageId",
                        column: x => x.PackageId,
                        principalTable: "Packages",
                        principalColumn: "PackageId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PackageFeatures_PackageId",
                table: "PackageFeatures",
                column: "PackageId");

            migrationBuilder.CreateIndex(
                name: "IX_PackagePricings_PackageId",
                table: "PackagePricings",
                column: "PackageId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PackageFeatures");

            migrationBuilder.DropTable(
                name: "PackagePricings");

            migrationBuilder.DropColumn(
                name: "BadgeLabel",
                table: "Packages");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Packages");

            migrationBuilder.DropColumn(
                name: "DisplayOrder",
                table: "Packages");

            migrationBuilder.DropColumn(
                name: "Tier",
                table: "Packages");

            migrationBuilder.RenameColumn(
                name: "MaxCheckinsPerWeek",
                table: "Packages",
                newName: "Duration");

            migrationBuilder.AddColumn<decimal>(
                name: "BasePrice",
                table: "Packages",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
