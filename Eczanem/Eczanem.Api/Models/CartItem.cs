using System.ComponentModel.DataAnnotations;

namespace Eczanem.Api.Models
{
    public class CartItem
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; } // Hangi kullanıcının sepeti?

        [Required]
        public int ProductId { get; set; } // Sepetteki ürün hangisi?

        public int Quantity { get; set; } = 1; // Kaç adet ekledi?

        // Navigation Properties (İlişkiler)
        public User? User { get; set; }
        public Product? Product { get; set; }
    }
}