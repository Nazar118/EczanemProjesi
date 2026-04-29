// Models/Pharmacy.cs
using System.ComponentModel.DataAnnotations;

namespace Eczanem.Api.Models
{
    public class Pharmacy
    {
        public int Id { get; set; } // Birincil Anahtar (Primary Key)

        [Required] // Bu alanın boş geçilemez (NOT NULL) olmasını sağlar
        [MaxLength(100)] // Veri tabanında nvarchar(100) olarak ayarlar
        public string Name { get; set; } = string.Empty;

        [MaxLength(250)]
        public string? Address { get; set; } // '?' bu alanın boş (NULL) olabileceğini belirtir

        [MaxLength(20)]
        public string? Phone { get; set; }
    }
}