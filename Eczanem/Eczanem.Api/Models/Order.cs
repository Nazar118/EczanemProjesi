using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Eczanem.Api.Models
{
    public class Order
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.Now;

        public decimal TotalAmount { get; set; }

        public string Status { get; set; } = "Hazırlanıyor"; // Hazırlanıyor, Kargoya Verildi, Teslim Edildi, İptal Edildi

        [Required]
        public string Address { get; set; }

        public string PaymentMethod { get; set; } // credit_card, cash

        // İlişkiler
        public User? User { get; set; }
        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}