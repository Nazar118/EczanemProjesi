using System.ComponentModel.DataAnnotations;
namespace Eczanem.Api.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public decimal Price { get; set; }

        public string ImageUrl { get; set; } 

        public int CategoryId { get; set; }

        public int Stock { get; set; }

        public string Description { get; set; }
        public bool IsBestSeller { get; set; } = false; // Çok Satanlar mı?
        public bool IsRecommended { get; set; } = false; // Seçtiklerimiz mi?
    }
}
