using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Eczanem.Api.Data;
using Eczanem.Api.Models;

namespace Eczanem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoritesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FavoritesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Kullanıcının favori ürünlerini getir
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<FavoriteProduct>>> GetFavorites(int userId)
        {
            return await _context.FavoriteProducts
                .Include(f => f.Product)
                .Where(f => f.UserId == userId)
                .ToListAsync();
        }

        // Kalp ikonuna tıklandığında (Aç/Kapat Mantığı)
        [HttpPost("toggle")]
        public async Task<IActionResult> ToggleFavorite(FavoriteAddDto dto)
        {
            var existingFav = await _context.FavoriteProducts
                .FirstOrDefaultAsync(f => f.UserId == dto.UserId && f.ProductId == dto.ProductId);

            if (existingFav != null)
            {
                // Eğer zaten favorilerdeyse ÇIKAR (Un-favorite)
                _context.FavoriteProducts.Remove(existingFav);
                await _context.SaveChangesAsync();
                return Ok(new { isFavorite = false, message = "Ürün favorilerden çıkarıldı." });
            }
            else
            {
                // Eğer favorilerde yoksa EKLE (Favorite)
                var newFav = new FavoriteProduct
                {
                    UserId = dto.UserId,
                    ProductId = dto.ProductId
                };
                _context.FavoriteProducts.Add(newFav);
                await _context.SaveChangesAsync();
                return Ok(new { isFavorite = true, message = "Ürün favorilere eklendi." });
            }
        }
    }
}