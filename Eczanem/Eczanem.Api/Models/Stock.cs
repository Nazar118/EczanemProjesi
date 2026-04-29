// Models/Stock.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eczanem.Api.Models
{
    public class Stock
    {
        public int Id { get; set; }

        [Required]
        public int Quantity { get; set; } // Adet

        [Required]
        public DateTime ExpiryDate { get; set; } // Son Kullanma Tarihi (Kritik Alan)

        // İlişkiler (Foreign Keys)

        public int PharmacyId { get; set; } // Hangi Eczane?
        [ForeignKey("PharmacyId")]
        public Pharmacy? Pharmacy { get; set; }

        public int MedicineId { get; set; } // Hangi İlaç?
        [ForeignKey("MedicineId")]
        public Medicine? Medicine { get; set; }
    }
}