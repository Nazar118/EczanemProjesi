// Data/ApplicationDbContext.cs
using Eczanem.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Eczanem.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Pharmacy> Pharmacies { get; set; }
        public DbSet<Medicine> Medicines { get; set; }

        public DbSet<Patient> Patients { get; set; } // Hastalar Tablosu
        public DbSet<Stock> Stocks { get; set; }     // Stoklar Tablosu
        public DbSet<Sale> Sales { get; set; }       // Satışlar Tablosu
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<StockMovement> StockMovements { get; set; }
        public DbSet<ChronicDisease> ChronicDiseases { get; set; } // Kronik Hastalıklar Tablosu
        public DbSet<PatientMedicine> PatientMedicines { get; set; }
    }
}