using System.ComponentModel.DataAnnotations;

namespace Eczanem.Api.Models
{
    public class ChronicDisease
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty; // Örn: Diyabet (Tip 2)

        public string Description { get; set; } = string.Empty; // Örn: İnsülin direnci...
    }
}