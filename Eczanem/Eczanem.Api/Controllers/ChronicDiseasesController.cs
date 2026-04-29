using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Eczanem.Api.Data;
using Eczanem.Api.Models;

namespace Eczanem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChronicDiseasesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ChronicDiseasesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // LİSTELE
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChronicDisease>>> GetAll()
        {
            return await _context.ChronicDiseases.ToListAsync();
        }

        // EKLE
        [HttpPost]
        public async Task<ActionResult<ChronicDisease>> Create(ChronicDisease disease)
        {
            _context.ChronicDiseases.Add(disease);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAll), new { id = disease.Id }, disease);
        }

        // GÜNCELLE
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ChronicDisease disease)
        {
            if (id != disease.Id) return BadRequest();
            _context.Entry(disease).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // SİL
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var disease = await _context.ChronicDiseases.FindAsync(id);
            if (disease == null) return NotFound();

            _context.ChronicDiseases.Remove(disease);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}