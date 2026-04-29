using Eczanem.Api.Models;

namespace Eczanem.Api.Interfaces
{
    public interface ISaleService
    {
        Task<IEnumerable<Sale>> GetAllSalesAsync();
        Task<Sale> CreateSaleAsync(Sale sale);
        Task<decimal> GetDailyTurnoverAsync(); 
        Task DeleteSaleAsync(int id);
    }
}