// Services/StockService.cs
using Eczanem.Api.Interfaces;
using Eczanem.Api.Models;

namespace Eczanem.Api.Services
{
    public class StockService : IStockService
    {
        private readonly IRepository<Stock> _stockRepository;

        public StockService(IRepository<Stock> stockRepository)
        {
            _stockRepository = stockRepository;
        }

        public async Task<Stock> AddStockAsync(Stock stock)
        {
            // Burada ileride "Bu ilaçtan zaten var mı?" kontrolü yapabiliriz.
            await _stockRepository.AddAsync(stock);
            await _stockRepository.SaveChangesAsync();
            return stock;
        }

        public async Task<IEnumerable<Stock>> GetAllStocksAsync()
        {
            return await _stockRepository.GetAllAsync();
        }
    }
}