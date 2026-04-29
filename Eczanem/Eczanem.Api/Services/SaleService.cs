using Eczanem.Api.Interfaces;
using Eczanem.Api.Models;

namespace Eczanem.Api.Services
{
    public class SaleService : ISaleService
    {
        private readonly IRepository<Sale> _saleRepository;
        private readonly IRepository<Medicine> _medicineRepository;
        // Stok Geçmişine kayıt atmak için ekledim
        private readonly IRepository<StockMovement> _stockMovementRepository;

        public SaleService(
            IRepository<Sale> saleRepository,
            IRepository<Medicine> medicineRepository,
            IRepository<StockMovement> stockMovementRepository) // Constructor'a ekledik
        {
            _saleRepository = saleRepository;
            _medicineRepository = medicineRepository;
            _stockMovementRepository = stockMovementRepository;
        }

        public async Task<Sale> CreateSaleAsync(Sale sale)
        {
            // 1. İlacı Bul
            var medicine = await _medicineRepository.GetByIdAsync(sale.MedicineId);
            if (medicine == null) throw new Exception("Satılmak istenen ilaç bulunamadı.");

            // 2. Stok Kontrolü
            if (medicine.Stock < sale.QuantitySold)
            {
                throw new Exception($"Yetersiz stok! Mevcut: {medicine.Stock}, İstenen: {sale.QuantitySold}");
            }

            // 3. Stoktan Düş
            medicine.Stock -= sale.QuantitySold;
            await _medicineRepository.UpdateAsync(medicine);

            // ---  STOK HAREKET KAYDI (GEÇMİŞE İŞLE) ---
            var movement = new StockMovement
            {
                MedicineId = medicine.Id,
                Type = "Çıkış",
                Quantity = sale.QuantitySold,
                Date = DateTime.Now,
                Description = "Satış İşlemi"
            };
            await _stockMovementRepository.AddAsync(movement);

            // 4. Satış Bilgileri
            sale.SaleDate = DateTime.Now;
            sale.TotalPrice = medicine.Price * sale.QuantitySold;

            // 5. Kaydet
            await _saleRepository.AddAsync(sale);
            await _saleRepository.SaveChangesAsync();

            return sale;
        }

        public async Task<IEnumerable<Sale>> GetAllSalesAsync()
        {
            // İlaç ve Hasta bilgilerini de getirmesi için Repository'nin Include yeteneği olması lazım.
            // Eğer senin Repository yapında Include yoksa sadece verileri getirir.
            return await _saleRepository.GetAllAsync();
        }

        public async Task<decimal> GetDailyTurnoverAsync()
        {
            var allSales = await _saleRepository.GetAllAsync();
            var today = DateTime.Today;
            return allSales.Where(s => s.SaleDate >= today).Sum(s => s.TotalPrice);
        }

        public async Task DeleteSaleAsync(int id)
        {
            var sale = await _saleRepository.GetByIdAsync(id);
            if (sale == null) throw new Exception("Satış bulunamadı.");

            var medicine = await _medicineRepository.GetByIdAsync(sale.MedicineId);
            if (medicine != null)
            {
                // 1. Stoğu Geri Yükle
                medicine.Stock += sale.QuantitySold;
                await _medicineRepository.UpdateAsync(medicine);

                // ---  İADE HAREKET KAYDI ---
                var movement = new StockMovement
                {
                    MedicineId = medicine.Id,
                    Type = "Giriş", // İade olduğu için stok artıyor
                    Quantity = sale.QuantitySold,
                    Date = DateTime.Now,
                    Description = "Satış İptali / İade"
                };
                await _stockMovementRepository.AddAsync(movement);
            }

            _saleRepository.Delete(sale);
            await _saleRepository.SaveChangesAsync();
        }
    }
}