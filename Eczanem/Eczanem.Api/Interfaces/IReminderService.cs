// Interfaces/IReminderService.cs
using Eczanem.Api.Models;

namespace Eczanem.Api.Interfaces
{
    public interface IReminderService
    {
        // İlacı bitmek üzere olan hastaların listesini getiren metot
        // (Basitlik için: 30 gün önce ilaç almış kişileri getireceğiz)
        Task<IEnumerable<Sale>> GetSalesNeedingReminderAsync();
    }
}