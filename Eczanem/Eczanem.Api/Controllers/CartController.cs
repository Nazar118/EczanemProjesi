using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Eczanem.Api.Data;
using Eczanem.Api.Models;

namespace Eczanem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CartController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Kullanıcının sepetini getir
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<CartItem>>> GetCart(int userId)
        {
            return await _context.CartItems
                .Include(c => c.Product) // Ürün detaylarını (isim, fiyat, resim) da getir
                .Where(c => c.UserId == userId)
                .ToListAsync();
        }

        // Sepete ürün ekle
        [HttpPost]
        public async Task<IActionResult> AddToCart(CartAddDto dto)
        {
            // Bu ürün kullanıcının sepetinde zaten var mı kontrol et
            var existingItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == dto.UserId && c.ProductId == dto.ProductId);

            if (existingItem != null)
            {
                // Varsa miktarını artır
                existingItem.Quantity += dto.Quantity;
            }
            else
            {
                // Yoksa yeni olarak ekle
                var cartItem = new CartItem
                {
                    UserId = dto.UserId,
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity
                };
                _context.CartItems.Add(cartItem);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Ürün sepete eklendi/güncellendi." });
        }

        // Sepetten ürün sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var cartItem = await _context.CartItems.FindAsync(id);
            if (cartItem == null) return NotFound("Sepet ürünü bulunamadı.");

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Ürün sepetten silindi." });
        }
        // Sepeti tamamen boşalt (Sipariş onaylanınca çalışır)
        [HttpDelete("clear/{userId}")]
        public async Task<IActionResult> ClearCart(int userId)
        {
            var userCart = await _context.CartItems.Where(c => c.UserId == userId).ToListAsync();

            if (userCart.Any())
            {
                _context.CartItems.RemoveRange(userCart);
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "Sepet başarıyla boşaltıldı." });
        }
    }
}