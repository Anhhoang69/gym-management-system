using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddLead : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "BranchId",
                table: "Leads",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ContactCount",
                table: "Leads",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastContactedAt",
                table: "Leads",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LostReason",
                table: "Leads",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "Leads",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Score",
                table: "Leads",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BranchId",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "ContactCount",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "LastContactedAt",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "LostReason",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "Note",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "Score",
                table: "Leads");
        }
    }
}
