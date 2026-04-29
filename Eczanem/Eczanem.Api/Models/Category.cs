using System.ComponentModel.DataAnnotations;

namespace Eczanem.Api.Models
{
    public class Category
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty; // Örn: "Ağrı Kesiciler", "Diyabet"

        public string Type { get; set; } = string.Empty; // Örn: "İlaç Türü", "Hastalık Grubu", "Özel Etiket"

        public string Description { get; set; } = string.Empty; // Örn: "Ağrı ve sızı kesici ilaçlar grubu"
    }
}