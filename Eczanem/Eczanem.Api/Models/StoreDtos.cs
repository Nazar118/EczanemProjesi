namespace Eczanem.Api.Models
{
    // Sepete ürün eklerken React'ten gelecek veri
    public class CartAddDto
    {
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; } = 1;
    }

    // Favorilere ürün eklerken/çıkarırken React'ten gelecek veri
    public class FavoriteAddDto
    {
        public int UserId { get; set; }
        public int ProductId { get; set; }
    }
}