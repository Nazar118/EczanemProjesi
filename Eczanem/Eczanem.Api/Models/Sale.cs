using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eczanem.Api.Models
{
    public class Sale
    {
        public int Id { get; set; }

        public DateTime SaleDate { get; set; } = DateTime.Now;

        [Required]
        public int QuantitySold { get; set; } // Kaç kutu satıldı?

        // (İlacın fiyatı değişse bile geçmiş satışın tutarı sabit kalsın diye buraya kaydediyoruz)
        public decimal TotalPrice { get; set; }

        // --- İLİŞKİLER (GÜNCELLENDİ) ---

        public int MedicineId { get; set; }
        [ForeignKey("MedicineId")]
        public Medicine? Medicine { get; set; }

        // Hasta seçmek zorunlu olmasın (Hızlı satış için 'int?' yaptık)
        public int? PatientId { get; set; }
        [ForeignKey("PatientId")]
        public Patient? Patient { get; set; }

        // Eczane seçmek zorunlu olmasın (Şimdilik tek eczane var)
        public int? PharmacyId { get; set; }
        [ForeignKey("PharmacyId")]
        public Pharmacy? Pharmacy { get; set; }
    }
}