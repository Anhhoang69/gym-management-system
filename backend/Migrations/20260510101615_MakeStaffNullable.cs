using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class MakeStaffNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contracts_Staffs_StaffId",
                table: "Contracts");

            migrationBuilder.DropForeignKey(
                name: "FK_Invoices_Staffs_CreatedByStaffId",
                table: "Invoices");

            migrationBuilder.AlterColumn<Guid>(
                name: "CreatedByStaffId",
                table: "Invoices",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<Guid>(
                name: "StaffId",
                table: "Contracts",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<Guid>(
                name: "CreatedByStaffId",
                table: "ContractDrafts",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddForeignKey(
                name: "FK_Contracts_Staffs_StaffId",
                table: "Contracts",
                column: "StaffId",
                principalTable: "Staffs",
                principalColumn: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Invoices_Staffs_CreatedByStaffId",
                table: "Invoices",
                column: "CreatedByStaffId",
                principalTable: "Staffs",
                principalColumn: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contracts_Staffs_StaffId",
                table: "Contracts");

            migrationBuilder.DropForeignKey(
                name: "FK_Invoices_Staffs_CreatedByStaffId",
                table: "Invoices");

            migrationBuilder.AlterColumn<Guid>(
                name: "CreatedByStaffId",
                table: "Invoices",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "StaffId",
                table: "Contracts",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "CreatedByStaffId",
                table: "ContractDrafts",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Contracts_Staffs_StaffId",
                table: "Contracts",
                column: "StaffId",
                principalTable: "Staffs",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Invoices_Staffs_CreatedByStaffId",
                table: "Invoices",
                column: "CreatedByStaffId",
                principalTable: "Staffs",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
