using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eczanem.Api.Models
{
    public class StockMovement
    {
        public int Id { get; set; }

        // Hangi İlaç?
        public int MedicineId { get; set; }
        [ForeignKey("MedicineId")]
        public Medicine? Medicine { get; set; }

        // İşlem Tipi: "Giriş" (Stok Ekleme) veya "Çıkış" (Satış/Zayi)
        public string Type { get; set; } = "Giriş";

        // Adet (Kaç tane geldi/gitti)
        public int Quantity { get; set; }

        // Tarih
        public DateTime Date { get; set; } = DateTime.Now;

        // Açıklama (Örn: "Fatura No: 123 ile giriş", "Satış No: 55")
        public string Description { get; set; } = string.Empty;
    }
}