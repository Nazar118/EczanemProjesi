// Interfaces/IStockService.cs
using Eczanem.Api.Models;

namespace Eczanem.Api.Interfaces
{
    public interface IStockService
    {
        Task<IEnumerable<Stock>> GetAllStocksAsync();
        Task<Stock> AddStockAsync(Stock stock);
        // Belirli bir eczanenin stoklarını getirmek için:
    }
}