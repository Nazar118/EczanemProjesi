// Interfaces/IRepository.cs
namespace Eczanem.Api.Interfaces
{
    // '<T> where T : class' bu arayüzün sadece sınıflarla (modellerimizle)
    // çalışabileceğini belirten genel (generic) bir tanımdır.
    public interface IRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync(); // Hepsini Getir
        Task<T?> GetByIdAsync(int id); // ID ile Getir
        Task AddAsync(T entity); // Ekle
        void Update(T entity); // Güncelle
        Task UpdateAsync(T entity);
        void Delete(T entity); // Sil
        Task<bool> SaveChangesAsync(); // Değişiklikleri Kaydet
    }
}