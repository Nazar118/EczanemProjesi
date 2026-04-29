// Interfaces/IPharmacyService.cs
using Eczanem.Api.Models;

namespace Eczanem.Api.Interfaces
{
    // Bu, Eczane (Pharmacy) ile ilgili İŞ MANTIĞI sözleşmesidir.
    public interface IPharmacyService
    {
        Task<IEnumerable<Pharmacy>> GetAllPharmaciesAsync();
        Task<Pharmacy?> GetPharmacyByIdAsync(int id);
        Task<Pharmacy> CreatePharmacyAsync(Pharmacy pharmacy);
    }
}