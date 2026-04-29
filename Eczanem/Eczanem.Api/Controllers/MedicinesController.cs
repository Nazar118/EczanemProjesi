using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Eczanem.Api.Data;
using Eczanem.Api.Models;

namespace Eczanem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicinesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MedicinesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. LİSTELEME
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var medicines = await _context.Medicines
                                          .Include(m => m.Category)
                                          .Include(m => m.Supplier)
                                          .ToListAsync();
            return Ok(medicines);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var medicine = await _context.Medicines
                                         .Include(m => m.Category)
                                         .Include(m => m.Supplier)
                                         .FirstOrDefaultAsync(m => m.Id == id);

            if (medicine == null)
            {
                return NotFound(new { message = "İlaç bulunamadı" });
            }

            return Ok(medicine);
        }

        // 2. EKLEME
        [HttpPost]
        public async Task<IActionResult> Add(Medicine medicine)
        {
            // 1. Önce İlacı Kaydet
            _context.Medicines.Add(medicine);
            await _context.SaveChangesAsync(); // Kaydet ki ilacın ID'si oluşsun

            // 2. OTOMATİK STOK HAREKETİ OLUŞTUR (İlk Giriş Kaydı)
            if (medicine.Stock > 0)
            {
                var movement = new StockMovement
                {
                    MedicineId = medicine.Id, // Az önce oluşan ID'yi al
                    Type = "Giriş",
                    Quantity = medicine.Stock,
                    Date = DateTime.Now,
                    Description = "Yeni İlaç Kaydı / Açılış Stoğu"
                };

                _context.StockMovements.Add(movement);
                await _context.SaveChangesAsync();
            }

            return Ok(medicine);
        }

        // 3. SİLME
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var medicine = await _context.Medicines.FindAsync(id);
            if (medicine == null) return NotFound("İlaç bulunamadı");

            _context.Medicines.Remove(medicine);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // 4. GÜNCELLEME
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Medicine updatedMedicine)
        {
            var existingMedicine = await _context.Medicines.FindAsync(id);
            if (existingMedicine == null) return NotFound("İlaç bulunamadı");

            // Tüm alanları güncelle
            existingMedicine.Name = updatedMedicine.Name;
            existingMedicine.Barcode = updatedMedicine.Barcode;
            existingMedicine.Manufacturer = updatedMedicine.Manufacturer;
            existingMedicine.Stock = updatedMedicine.Stock;
            existingMedicine.Price = updatedMedicine.Price;
            existingMedicine.CategoryId = updatedMedicine.CategoryId;
            existingMedicine.SupplierId = updatedMedicine.SupplierId;

            // TARİH GÜNCELLEMESİ 
            existingMedicine.ExpirationDate = updatedMedicine.ExpirationDate;

            await _context.SaveChangesAsync();
            return Ok(existingMedicine);
        }
    }
}