// Services/ReminderService.cs
using Eczanem.Api.Interfaces;
using Eczanem.Api.Models;

namespace Eczanem.Api.Services
{
    public class ReminderService : IReminderService
    {
        private readonly IRepository<Sale> _saleRepository;

        public ReminderService(IRepository<Sale> saleRepository)
        {
            _saleRepository = saleRepository;
        }

        public async Task<IEnumerable<Sale>> GetSalesNeedingReminderAsync()
        {
            // 1. Tüm satışları çekelim
            var allSales = await _saleRepository.GetAllAsync();

            // 2. ŞU ANKİ MANTIK:
            // "Bugünden 30 gün önce yapılmış satışları bul."
            // (Gerçek hayatta ilacın kutu sayısına göre hesaplama yapılır)

            var targetDate = DateTime.Now.AddDays(-30); // 30 gün öncesi

            // Sadece tarihi (gün/ay/yıl) karşılaştıralım, saati değil.
            var salesToRemind = allSales.Where(s =>
                s.SaleDate.Date <= targetDate.Date && // 30 gün veya daha önce alınmış
                s.SaleDate.Date > targetDate.AddDays(-5).Date // Ama çok da eski olmasın (son 5 gün içindeki 30. günler)
            ).ToList();

            return salesToRemind;
        }
    }
}