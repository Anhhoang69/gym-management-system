using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddLeadSource2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Leads_CreatedByUserId",
                table: "Leads",
                column: "CreatedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Leads_AspNetUsers_CreatedByUserId",
                table: "Leads",
                column: "CreatedByUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Leads_AspNetUsers_CreatedByUserId",
                table: "Leads");

            migrationBuilder.DropIndex(
                name: "IX_Leads_CreatedByUserId",
                table: "Leads");
        }
    }
}
