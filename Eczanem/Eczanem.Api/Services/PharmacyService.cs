// Services/PharmacyService.cs
using Eczanem.Api.Interfaces;
using Eczanem.Api.Models;

namespace Eczanem.Api.Services
{
    public class PharmacyService : IPharmacyService
    {
        // Veri erişimi için Repository'yi kullanıyoruz
        private readonly IRepository<Pharmacy> _pharmacyRepository;

        // Repository'yi Dependency Injection ile alıyoruz
        public PharmacyService(IRepository<Pharmacy> pharmacyRepository)
        {
            _pharmacyRepository = pharmacyRepository;
        }

        public async Task<Pharmacy> CreatePharmacyAsync(Pharmacy pharmacy)
        {
            // İŞ MANTIĞI BURADA BAŞLAR
            // Örn: Eklemeden önce eczane adını büyük harfe çevir
            pharmacy.Name = pharmacy.Name.ToUpper();

            await _pharmacyRepository.AddAsync(pharmacy);
            await _pharmacyRepository.SaveChangesAsync();
            return pharmacy;
        }

        public async Task<IEnumerable<Pharmacy>> GetAllPharmaciesAsync()
        {
            return await _pharmacyRepository.GetAllAsync();
        }

        public async Task<Pharmacy?> GetPharmacyByIdAsync(int id)
        {
            return await _pharmacyRepository.GetByIdAsync(id);
        }
    }
}