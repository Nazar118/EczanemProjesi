using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; 

namespace Eczanem.Api.Models
{
    public class Medicine
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Barcode { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? Manufacturer { get; set; }

        public int Stock { get; set; } = 0;
        public int PackageSize { get; set; } = 30;
        public decimal Price { get; set; } = 0;
        public string Description { get; set; } = string.Empty; // İlaç Açıklaması
        public string Usage { get; set; } = string.Empty;       // Kullanım Bilgisi


        // Hangi kategoriye ait? (int? yaptık ki kategori seçmek zorunlu olmasın)
        public int? CategoryId { get; set; }

        // Bağlantı köprüsü (Bu sayede ilacın kategorisinin ADINI çekebileceğiz)
        [ForeignKey("CategoryId")]
        public Category? Category { get; set; }
        // Hangi tedarikçiden alınıyor?
        public int? SupplierId { get; set; }

        // Bağlantı köprüsü
        [ForeignKey("SupplierId")]
        public Supplier? Supplier { get; set; }
        // Son Kullanma Tarihi (Opsiyonel olabilir ama biz varsayılan olarak 1 yıl sonrasını atayalım)
        public DateTime ExpirationDate { get; set; } = DateTime.Now.AddYears(1);
        // İlacın reçeteli olup olmadığını tutan alan (True: Reçeteli, False: Reçetesiz)
        public bool IsPrescriptionRequired { get; set; } = false;
    }
}