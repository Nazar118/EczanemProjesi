using System.ComponentModel.DataAnnotations;

namespace Eczanem.Api.Models
{
    public class OrderItem
    {
        public int Id { get; set; }

        [Required]
        public int OrderId { get; set; }

        [Required]
        public int ProductId { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; } // O anki fiyattan satılsın diye

        // İlişkiler
        public Order? Order { get; set; }
        public Product? Product { get; set; }
    }
}