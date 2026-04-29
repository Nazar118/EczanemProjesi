using Microsoft.AspNetCore.Mvc;
using Eczanem.Api.Data;
using Eczanem.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Eczanem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User loginRequest)
        {
            try
            {
                // Gelen veriyi kontrol et (Boş geliyorsa hata döner)
                if (loginRequest == null || string.IsNullOrEmpty(loginRequest.TcNo))
                {
                    return BadRequest("Veri boş geldi.");
                }

                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.TcNo == loginRequest.TcNo && u.Password == loginRequest.Password);

                if (user == null)
                {
                    return Unauthorized(new { message = "Kullanıcı adı veya şifre hatalı!" });
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                // Hata olduğunda nedenini bize söylesin
                return StatusCode(500, new { message = "Veritabanı hatası!", detail = ex.Message });
            }
        }

        // 2. KULLANICI EKLE
        [HttpPost]
        public async Task<IActionResult> Register(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(user);
        }

        // 3. ŞİFRE DEĞİŞTİRME
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest model)
        {
            var user = await _context.Users.FindAsync(model.UserId);
            if (user == null) return NotFound("Kullanıcı bulunamadı.");

            if (user.Password != model.CurrentPassword)
            {
                return BadRequest("Mevcut şifreniz hatalı!");
            }

            user.Password = model.NewPassword;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Şifre başarıyla güncellendi!" });
        }

        // 4. PROFİL GÜNCELLEME (Ad ve Email) - (Sınıfın içine aldık!)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] User updatedInfo)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound("Kullanıcı bulunamadı.");

            // Sadece İsim ve Maili değiştiriyoruz
            user.Name = updatedInfo.Name;
            user.Email = updatedInfo.Email;

            await _context.SaveChangesAsync();

            return Ok(user);
        }

    } // <-- UsersController sınıfı burada bitiyor

    public class ChangePasswordRequest
    {
        public int UserId { get; set; }
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}