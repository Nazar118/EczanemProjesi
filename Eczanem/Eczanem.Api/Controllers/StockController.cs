using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Eczanem.Api.Data;
using Eczanem.Api.Models;

namespace Eczanem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StockController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StockController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. KRİTİK STOKLARI GETİR (Stoğu 20'den az olanlar)
        [HttpGet("critical")]
        public async Task<IActionResult> GetCriticalStock()
        {
            var criticals = await _context.Medicines
                                    .Include(m => m.Category)
                                    .Include(m => m.Supplier)
                                    .Where(m => m.Stock < 20) // Eşik değerimiz 20 olsun
                                    .ToListAsync();
            return Ok(criticals);
        }

        // 2. STOK HAREKET GEÇMİŞİNİ GETİR (Giriş/Çıkış Listesi)
        [HttpGet("history")]
        public async Task<IActionResult> GetHistory()
        {
            var history = await _context.StockMovements
                                  .Include(m => m.Medicine) // İlaç adını görmek için
                                  .OrderByDescending(x => x.Date) // En yeniden eskiye
                                  .ToListAsync();
            return Ok(history);
        }

        // 3. STOK EKLEME / ÇIKARMA İŞLEMİ 
        // Frontend'den bize { medicineId: 1, quantity: 5, type: "Giriş", description: "Depodan alım" } gelecek
        [HttpPost("movement")]
        public async Task<IActionResult> AddMovement([FromBody] StockMovement movement)
        {
            // 1. İlacı Bul
            var medicine = await _context.Medicines.FindAsync(movement.MedicineId);
            if (medicine == null) return NotFound("İlaç bulunamadı");

            // 2. İlacın Ana Stoğunu Güncelle
            if (movement.Type == "Giriş")
            {
                medicine.Stock += movement.Quantity;
            }
            else if (movement.Type == "Çıkış")
            {
                if (medicine.Stock < movement.Quantity)
                    return BadRequest("Yetersiz Stok!");

                medicine.Stock -= movement.Quantity;
            }

            // 3. Hareketi Kaydet (Logla)
            movement.Date = DateTime.Now; // Saati şimdi olarak ayarla
            _context.StockMovements.Add(movement);

            // 4. Hepsini Tek Seferde Kaydet
            await _context.SaveChangesAsync();

            return Ok(new { message = "Stok işlemi başarılı", currentStock = medicine.Stock });
        }
    }
}