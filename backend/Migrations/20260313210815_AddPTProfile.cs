using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddPTProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PTProfiles",
                columns: table => new
                {
                    StaffUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ExperienceYears = table.Column<int>(type: "integer", nullable: false),
                    BioDescription = table.Column<string>(type: "text", nullable: true),
                    Specialization = table.Column<string>(type: "text", nullable: true),
                    Certificate = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PTProfiles", x => x.StaffUserId);
                    table.ForeignKey(
                        name: "FK_PTProfiles_Staffs_StaffUserId",
                        column: x => x.StaffUserId,
                        principalTable: "Staffs",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PTProfiles");
        }
    }
}
