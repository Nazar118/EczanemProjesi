using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Eczanem.Api.Data;
using Eczanem.Api.Models;

namespace Eczanem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }
        [HttpPost("upload")]
        public async Task<IActionResult> UploadProduct([FromForm] ProductUploadDto dto)
        {
            if (dto.ImageFile == null || dto.ImageFile.Length == 0)
            {
                return BadRequest("Lütfen bir resim dosyası seçin.");
            }

            var fileName = Guid.NewGuid().ToString() + "_" + dto.ImageFile.FileName;

            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "products");

            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.ImageFile.CopyToAsync(stream);
            }

            var product = new Product
            {
                Name = dto.Name,
                Price = dto.Price,
                CategoryId = dto.CategoryId,
                Stock = dto.Stock,
                Description = dto.Description,
                ImageUrl = $"/images/products/{fileName}",
                IsBestSeller = dto.IsBestSeller,
                IsRecommended = dto.IsRecommended
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Ürün başarıyla yüklendi!", product });
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound("Silinmek istenen ürün bulunamadı.");
            }
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Ürün başarıyla silindi." });
        }
        // PUT: api/Products/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductUploadDto dto)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound("Güncellenecek ürün bulunamadı.");
            }

            // Metin bilgilerini güncelle
            product.Name = dto.Name;
            product.Price = dto.Price;
            product.CategoryId = dto.CategoryId;
            product.Stock = dto.Stock;
            product.Description = dto.Description;
            product.IsBestSeller = dto.IsBestSeller;
            product.IsRecommended = dto.IsRecommended;

            // EĞER KULLANICI DÜZENLEME EKRANINDA YENİ RESİM SEÇTİYSE:
            if (dto.ImageFile != null && dto.ImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + "_" + dto.ImageFile.FileName;
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "products");

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                var filePath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.ImageFile.CopyToAsync(stream);
                }

                product.ImageUrl = $"/images/products/{fileName}";
            }
            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Products.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { message = "Ürün başarıyla güncellendi!", product });
        }
    }
}