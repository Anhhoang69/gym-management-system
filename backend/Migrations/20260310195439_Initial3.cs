using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class Initial3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Members_Branches_BranchId",
                table: "Members");

            migrationBuilder.DropIndex(
                name: "IX_Members_BranchId",
                table: "Members");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BranchImages",
                table: "BranchImages");

            migrationBuilder.DropColumn(
                name: "BranchId",
                table: "Members");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "BranchImages");

            migrationBuilder.AddColumn<string>(
                name: "Position",
                table: "Staffs",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "BranchId",
                table: "Attendances",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_BranchImages",
                table: "BranchImages",
                column: "BranchImageId");

            migrationBuilder.CreateIndex(
                name: "IX_Attendances_BranchId",
                table: "Attendances",
                column: "BranchId");

            migrationBuilder.AddForeignKey(
                name: "FK_Attendances_Branches_BranchId",
                table: "Attendances",
                column: "BranchId",
                principalTable: "Branches",
                principalColumn: "BranchId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attendances_Branches_BranchId",
                table: "Attendances");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BranchImages",
                table: "BranchImages");

            migrationBuilder.DropIndex(
                name: "IX_Attendances_BranchId",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "Position",
                table: "Staffs");

            migrationBuilder.DropColumn(
                name: "BranchId",
                table: "Attendances");

            migrationBuilder.AddColumn<Guid>(
                name: "BranchId",
                table: "Members",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "BranchImages",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_BranchImages",
                table: "BranchImages",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Members_BranchId",
                table: "Members",
                column: "BranchId");

            migrationBuilder.AddForeignKey(
                name: "FK_Members_Branches_BranchId",
                table: "Members",
                column: "BranchId",
                principalTable: "Branches",
                principalColumn: "BranchId");
        }
    }
}
