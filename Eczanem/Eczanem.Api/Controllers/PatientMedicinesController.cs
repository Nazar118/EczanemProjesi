using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Eczanem.Api.Data;
using Eczanem.Api.Models;

namespace Eczanem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientMedicinesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PatientMedicinesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. HASTANIN KULLANDIĞI İLAÇLARI LİSTELE
        [HttpGet("patient/{patientId}")]
        public async Task<IActionResult> GetByPatient(int patientId)
        {
            var list = await _context.PatientMedicines
                                     .Include(x => x.Medicine) // İlaç adını gör
                                     .Where(x => x.PatientId == patientId && x.IsActive)
                                     .OrderBy(x => x.EstimatedEndDate) // Bitiş tarihine göre sırala
                                     .ToListAsync();
            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> Add(PatientMedicine pm)
        {
            var medicine = await _context.Medicines.FindAsync(pm.MedicineId);
            if (medicine == null) return NotFound("İlaç bulunamadı.");

            // Eğer veritabanında kutu adedi 0 veya girilmemişse, varsayılan 30 kabul et.
            int actualPackageSize = medicine.PackageSize > 0 ? medicine.PackageSize : 30;

            int dailyUsage = pm.DailyUsage > 0 ? pm.DailyUsage : 1;

            // Hesapla: (30 / 2 = 15 Gün)
            int daysLasts = actualPackageSize / dailyUsage;

            pm.StartDate = DateTime.Now;
            pm.EstimatedEndDate = pm.StartDate.AddDays(daysLasts);

            pm.IsNotificationSent = false;
            pm.IsActive = true;

            pm.Status = "Hazırlanıyor";

            _context.PatientMedicines.Add(pm);
            await _context.SaveChangesAsync();
            return Ok(pm);
        }
        // Eczanem Pro Web Paneli İçin: Tüm Siparişleri Getirir
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var list = await _context.PatientMedicines
                .Include(x => x.Patient)  // Hastanın adı, soyadı, TC'si vb. gelsin
                .Include(x => x.Medicine) // İlacın adı, fiyatı vb. gelsin
                .OrderByDescending(x => x.StartDate) // En yeni siparişler en üstte çıksın
                .ToListAsync();

            return Ok(list);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrderState(int id, [FromBody] PatientMedicine updatedData)
        {
            var item = await _context.PatientMedicines.FindAsync(id);
            if (item == null) return NotFound("Sipariş bulunamadı.");

            if (!string.IsNullOrEmpty(updatedData.Status))
            {
                item.Status = updatedData.Status;
            }

            if (updatedData.Status == "İptal Edildi")
            {
                item.IsActive = false;
            }

            await _context.SaveChangesAsync();
            return Ok(item);
        }
        // 3. İLACI BIRAKTI / SİL
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.PatientMedicines.FindAsync(id);
            if (item == null) return NotFound();

            // Silmeyelim, pasife çekelim (Geçmişte kullandığı görünsün)
            item.IsActive = false;
            await _context.SaveChangesAsync();
            return Ok();
        }

        // 4. BİLDİRİMLERİ GETİR (Bitişine 3 gün kalanlar)
        [HttpGet("notifications")]
        public async Task<IActionResult> GetNotifications()
        {
            var today = DateTime.Now;
            var threeDaysLater = today.AddDays(3);

            var endingMedicines = await _context.PatientMedicines
                .Include(pm => pm.Patient)
                .Include(pm => pm.Medicine)
                .Where(pm => pm.IsActive
                             && !pm.IsNotificationSent
                             && pm.EstimatedEndDate <= threeDaysLater
                             && pm.EstimatedEndDate >= today) // Geçmiştekileri getirme, sadece yaklaşanları
                .ToListAsync();

            return Ok(endingMedicines);
        }
    }
}