using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Eczanem.Api.Migrations
{
    /// <inheritdoc />
    public partial class TcNoGuncellemesi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Users",
                newName: "TcNo");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TcNo",
                table: "Users",
                newName: "Username");
        }
    }
}
