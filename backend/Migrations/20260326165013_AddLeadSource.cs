using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddLeadSource : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Source",
                table: "Leads");

            migrationBuilder.AddColumn<Guid>(
                name: "SourceId",
                table: "Leads",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "LeadSources",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Score = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeadSources", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Leads_SourceId",
                table: "Leads",
                column: "SourceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Leads_LeadSources_SourceId",
                table: "Leads",
                column: "SourceId",
                principalTable: "LeadSources",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Leads_LeadSources_SourceId",
                table: "Leads");

            migrationBuilder.DropTable(
                name: "LeadSources");

            migrationBuilder.DropIndex(
                name: "IX_Leads_SourceId",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "SourceId",
                table: "Leads");

            migrationBuilder.AddColumn<string>(
                name: "Source",
                table: "Leads",
                type: "text",
                nullable: true);
        }
    }
}
