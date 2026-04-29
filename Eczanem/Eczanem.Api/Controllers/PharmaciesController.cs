// Controllers/PharmaciesController.cs
using Eczanem.Api.Interfaces;
using Eczanem.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Eczanem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PharmaciesController : ControllerBase
    {
        private readonly IPharmacyService _pharmacyService;

        public PharmaciesController(IPharmacyService pharmacyService)
        {
            _pharmacyService = pharmacyService;
        }

        // === 1. Uç Nokta: Tüm Eczaneleri Getirme ===
        [HttpGet]
        public async Task<IActionResult> GetAllPharmacies()
        {
            //  Veriyi Repository'den değil, Servis'ten istiyoruz
            var pharmacies = await _pharmacyService.GetAllPharmaciesAsync();
            return Ok(pharmacies);
        }

        // === 2. Uç Nokta: Yeni Eczane Ekleme ===
        [HttpPost]
        public async Task<IActionResult> CreatePharmacy([FromBody] Pharmacy pharmacy)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            // (Servis katmanı 'ToUpper' gibi iş mantığını uygulayacak)
            var createdPharmacy = await _pharmacyService.CreatePharmacyAsync(pharmacy);

            // CreatedAtAction metodunu, yeni oluşturulan eczaneyi döndürecek şekilde güncelledik
            return CreatedAtAction(nameof(GetPharmacyById), new { id = createdPharmacy.Id }, createdPharmacy);
        }

        // (CreatedAtAction'ın düzgün çalışması için bu metoda ihtiyacımız var)
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetPharmacyById(int id)
        {
            var pharmacy = await _pharmacyService.GetPharmacyByIdAsync(id);
            if (pharmacy == null)
            {
                return NotFound(); // Bulunamadı (404)
            }
            return Ok(pharmacy);
        }
    }
}