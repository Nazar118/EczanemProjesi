using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Eczanem.Api.Migrations
{
    /// <inheritdoc />
    public partial class HastaHastalikBaglantisi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ChronicDiseaseId",
                table: "Patients",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Patients_ChronicDiseaseId",
                table: "Patients",
                column: "ChronicDiseaseId");

            migrationBuilder.AddForeignKey(
                name: "FK_Patients_ChronicDiseases_ChronicDiseaseId",
                table: "Patients",
                column: "ChronicDiseaseId",
                principalTable: "ChronicDiseases",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Patients_ChronicDiseases_ChronicDiseaseId",
                table: "Patients");

            migrationBuilder.DropIndex(
                name: "IX_Patients_ChronicDiseaseId",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "ChronicDiseaseId",
                table: "Patients");
        }
    }
}
