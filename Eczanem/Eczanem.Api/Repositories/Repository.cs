// Repositories/Repository.cs
using Eczanem.Api.Data;
using Eczanem.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Eczanem.Api.Repositories
{
    // IRepository sözleşmesini uyguluyoruz
    public class Repository<T> : IRepository<T> where T : class
    {
        // Veri tabanı köprümüz (DbContext)
        protected readonly ApplicationDbContext _context;
        private readonly DbSet<T> _dbSet;

        // DbContext'i Dependency Injection ile alıyoruz
        public Repository(ApplicationDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>(); // 'T' modeline ait tabloyu seçer (örn: Pharmacies)
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public void Delete(T entity)
        {
            _dbSet.Remove(entity);
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<T?> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<bool> SaveChangesAsync()
        {
            // Değişiklikler başarıyla kaydedilirse (0'dan fazla satır etkilenirse) true döner
            return (await _context.SaveChangesAsync() > 0);
        }

        public void Update(T entity)
        {
            _dbSet.Update(entity);
        }
        public async Task UpdateAsync(T entity)
        { 
          _dbSet.Update(entity);
          await _context.SaveChangesAsync(); // Güncelleme sonrası değişiklikleri kaydet
        }
    }
}