using System.ComponentModel.DataAnnotations.Schema;
namespace Eczanem.Api.Models
{
    public class User
    {
        public int Id { get; set; }
        [Column("TcNo")]
        public string TcNo { get; set; } = string.Empty; public string Email { get; set; } = string.Empty; 
        public string Password { get; set; } = string.Empty; // Şifre
        public string Name { get; set; } = string.Empty;     // Görünecek İsim 
        public string Role { get; set; } = string.Empty;     // Rolü 
    }
}