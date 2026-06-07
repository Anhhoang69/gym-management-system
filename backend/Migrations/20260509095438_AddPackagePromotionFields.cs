using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddPackagePromotionFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApplicationRule",
                table: "Promotions",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "MinContractValue",
                table: "Promotions",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Priority",
                table: "Promotions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "SalesChannel",
                table: "Promotions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EarlyRenewAllowed",
                table: "PackagePolicies",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "MaxFreezeCount",
                table: "PackagePolicies",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "TransferAllowed",
                table: "PackagePolicies",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApplicationRule",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "MinContractValue",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "Priority",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "SalesChannel",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "EarlyRenewAllowed",
                table: "PackagePolicies");

            migrationBuilder.DropColumn(
                name: "MaxFreezeCount",
                table: "PackagePolicies");

            migrationBuilder.DropColumn(
                name: "TransferAllowed",
                table: "PackagePolicies");
        }
    }
}
