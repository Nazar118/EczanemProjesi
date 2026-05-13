using System.ComponentModel.DataAnnotations;

namespace Eczanem.Api.Models
{
    public class FavoriteProduct
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; } // Hangi kullanıcının favorisi?

        [Required]
        public int ProductId { get; set; } // Favoriye eklenen ürün hangisi?

        // Navigation Properties (İlişkiler)
        public User? User { get; set; }
        public Product? Product { get; set; }
    }
}