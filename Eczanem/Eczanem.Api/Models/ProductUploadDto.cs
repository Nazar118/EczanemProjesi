using Microsoft.AspNetCore.Http;

namespace Eczanem.Api.Models
{
    public class ProductUploadDto
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int CategoryId { get; set; }
        public int Stock { get; set; }

        public string? Description { get; set; }

        public IFormFile? ImageFile { get; set; }

        public bool IsBestSeller { get; set; }
        public bool IsRecommended { get; set; }
    }
}