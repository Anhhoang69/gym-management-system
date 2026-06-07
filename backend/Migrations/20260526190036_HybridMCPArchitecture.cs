using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class HybridMCPArchitecture : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatHistories_Members_MemberId",
                table: "ChatHistories");

            migrationBuilder.AlterColumn<Guid>(
                name: "MemberId",
                table: "ChatHistories",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "ChatHistories",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "UserRole",
                table: "ChatHistories",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "AIToolExecutionLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserRole = table.Column<string>(type: "text", nullable: false),
                    StaffPosition = table.Column<string>(type: "text", nullable: true),
                    ToolName = table.Column<string>(type: "text", nullable: false),
                    ArgumentsJson = table.Column<string>(type: "text", nullable: true),
                    Success = table.Column<bool>(type: "boolean", nullable: false),
                    DurationMs = table.Column<long>(type: "bigint", nullable: false),
                    ErrorMessage = table.Column<string>(type: "text", nullable: true),
                    ExecutedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AIToolExecutionLogs", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChatHistories_UserId",
                table: "ChatHistories",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AIToolExecutionLogs_ExecutedAt",
                table: "AIToolExecutionLogs",
                column: "ExecutedAt");

            migrationBuilder.CreateIndex(
                name: "IX_AIToolExecutionLogs_UserId",
                table: "AIToolExecutionLogs",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatHistories_Members_MemberId",
                table: "ChatHistories",
                column: "MemberId",
                principalTable: "Members",
                principalColumn: "UserId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatHistories_Members_MemberId",
                table: "ChatHistories");

            migrationBuilder.DropTable(
                name: "AIToolExecutionLogs");

            migrationBuilder.DropIndex(
                name: "IX_ChatHistories_UserId",
                table: "ChatHistories");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "ChatHistories");

            migrationBuilder.DropColumn(
                name: "UserRole",
                table: "ChatHistories");

            migrationBuilder.AlterColumn<Guid>(
                name: "MemberId",
                table: "ChatHistories",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ChatHistories_Members_MemberId",
                table: "ChatHistories",
                column: "MemberId",
                principalTable: "Members",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
