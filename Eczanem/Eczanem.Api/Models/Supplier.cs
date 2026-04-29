using System.ComponentModel.DataAnnotations;

namespace Eczanem.Api.Models
{
    public class Supplier
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty; // Firma Adı 

        public string ContactPerson { get; set; } = string.Empty; // İletişim Kurulacak Kişi 

        public string? Email { get; set; } // E-posta

        public string? PhoneNumber { get; set; } // Telefon

        public string? Address { get; set; } // Adres
    }
}