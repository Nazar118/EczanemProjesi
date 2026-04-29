using Eczanem.Api.Interfaces;
using Eczanem.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Eczanem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly ISaleService _saleService;
        //  İlaç isimlerini bulmak için bunu ekliyoruz
        private readonly IRepository<Medicine> _medicineRepository;

        public SalesController(ISaleService saleService, IRepository<Medicine> medicineRepository)
        {
            _saleService = saleService;
            _medicineRepository = medicineRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var sales = await _saleService.GetAllSalesAsync();
            return Ok(sales);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSale([FromBody] Sale sale)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var createdSale = await _saleService.CreateSaleAsync(sale);
                return Ok(createdSale);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("today-total")]
        public async Task<IActionResult> GetTodayTotal()
        {
            var total = await _saleService.GetDailyTurnoverAsync();
            return Ok(total);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSale(int id)
        {
            try
            {
                await _saleService.DeleteSaleAsync(id);
                return Ok("Satış iptal edildi.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats(DateTime? startDate, DateTime? endDate)
        {
            // 1. Tüm Satışları Çek
            var allSales = await _saleService.GetAllSalesAsync();

            // 2. İlaçları Çek
            var allMedicines = await _medicineRepository.GetAllAsync();

            // Eğer Başlangıç Tarihi seçildiyse, ondan öncekileri ele
            if (startDate.HasValue)
            {
                allSales = allSales.Where(s => s.SaleDate >= startDate.Value);
            }

            // Eğer Bitiş Tarihi seçildiyse, ondan sonrakileri ele
            // (Günün sonuna kadar kapsasın diye 23:59:59 mantığı ekliyoruz)
            if (endDate.HasValue)
            {
                allSales = allSales.Where(s => s.SaleDate <= endDate.Value.AddDays(1).AddTicks(-1));
            }

            // 3. Raporu Hazırla (Kalan satışlar üzerinden)
            var topSelling = allSales
                .GroupBy(s => s.MedicineId)
                .Select(g => new
                {
                    MedicineId = g.Key,
                    MedicineName = allMedicines.FirstOrDefault(m => m.Id == g.Key)?.Name ?? "Silinmiş İlaç",
                    TotalQuantity = g.Sum(s => s.QuantitySold),
                    TotalRevenue = g.Sum(s => s.TotalPrice)
                })
                .OrderByDescending(x => x.TotalQuantity)
                .Take(5)
                .ToList();

            var totalRevenue = allSales.Sum(s => s.TotalPrice);
            var totalSalesCount = allSales.Count();

            return Ok(new
            {
                topSelling = topSelling,
                totalRevenue = totalRevenue,
                totalSalesCount = totalSalesCount
            });
        }
    }
}