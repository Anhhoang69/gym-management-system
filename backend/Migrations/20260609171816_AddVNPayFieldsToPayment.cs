using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddVNPayFieldsToPayment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Staffs_ProcessedByStaffId",
                table: "Payments");

            migrationBuilder.AlterColumn<Guid>(
                name: "ProcessedByStaffId",
                table: "Payments",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpiredAt",
                table: "Payments",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GatewayBankCode",
                table: "Payments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "GatewayPayDate",
                table: "Payments",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GatewayRawData",
                table: "Payments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GatewayResponseCode",
                table: "Payments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GatewayTransactionNo",
                table: "Payments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GatewayTxnRef",
                table: "Payments",
                type: "text",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Staffs_ProcessedByStaffId",
                table: "Payments",
                column: "ProcessedByStaffId",
                principalTable: "Staffs",
                principalColumn: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Staffs_ProcessedByStaffId",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "ExpiredAt",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "GatewayBankCode",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "GatewayPayDate",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "GatewayRawData",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "GatewayResponseCode",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "GatewayTransactionNo",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "GatewayTxnRef",
                table: "Payments");

            migrationBuilder.AlterColumn<Guid>(
                name: "ProcessedByStaffId",
                table: "Payments",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Staffs_ProcessedByStaffId",
                table: "Payments",
                column: "ProcessedByStaffId",
                principalTable: "Staffs",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
