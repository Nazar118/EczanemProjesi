using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Eczanem.Api.Data;
using Eczanem.Api.Models;

namespace Eczanem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. ADMİN İÇİN: TÜM SİPARİŞLERİ GETİR
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetAllOrders()
        {
            return await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        // 2. MOBİL (PROFİL) İÇİN: KULLANICININ SİPARİŞLERİNİ GETİR
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Order>>> GetUserOrders(int userId)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        // 3. ADMİN İÇİN: SİPARİŞ DURUMUNU GÜNCELLE
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] string status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = status;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Sipariş durumu güncellendi." });
        }

        // 4. MOBİL (CHECKOUT) İÇİN: SEPETTEN SİPARİŞ OLUŞTUR
        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequest request)
        {
            // Kullanıcının sepetini bul
            var cartItems = await _context.CartItems
                .Include(c => c.Product)
                .Where(c => c.UserId == request.UserId)
                .ToListAsync();

            if (!cartItems.Any()) return BadRequest("Sepet boş!");

            // Yeni sipariş oluştur
            var order = new Order
            {
                UserId = request.UserId,
                Address = request.Address,
                PaymentMethod = request.PaymentMethod,
                OrderDate = DateTime.Now,
                TotalAmount = cartItems.Sum(c => c.Quantity * c.Product.Price)
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync(); // OrderId oluşsun diye kaydediyoruz

            // Sepetteki ürünleri sipariş detayına (OrderItems) aktar
            foreach (var item in cartItems)
            {
                _context.OrderItems.Add(new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = item.Product.Price
                });
            }

            // Sepeti tamamen boşalt
            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Sipariş başarıyla oluşturuldu!" });
        }
    }

    // Checkout için DTO
    public class CheckoutRequest
    {
        public int UserId { get; set; }
        public string Address { get; set; }
        public string PaymentMethod { get; set; }
    }
}