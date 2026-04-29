// Models/Patient.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eczanem.Api.Models
{
    public class Patient
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [MaxLength(11)] // TC Kimlik No gibi düşünülebilir
        public string TcNo { get; set; } = string.Empty;

        [Phone]
        public string? PhoneNumber{ get; set; }
        public string Password { get; set; } = "123456";

        // Kronik Hastalık Bağlantısı (Opsiyonel)
        public int? ChronicDiseaseId { get; set; }

        [ForeignKey("ChronicDiseaseId")]
        public ChronicDisease? ChronicDisease { get; set; }
    }
} 