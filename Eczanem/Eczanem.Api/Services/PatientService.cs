using Microsoft.EntityFrameworkCore; // Include için gerekli
using Eczanem.Api.Data; // DbContext için gerekli
using Eczanem.Api.Interfaces;
using Eczanem.Api.Models;

namespace Eczanem.Api.Services
{
    public class PatientService : IPatientService
    {
        private readonly IRepository<Patient> _patientRepository;
        private readonly ApplicationDbContext _context;

        public PatientService(IRepository<Patient> patientRepository, ApplicationDbContext context)
        {
            _patientRepository = patientRepository;
            _context = context;
        }

        // 1. TÜM HASTALARI GETİR (Hastalık İsimleriyle Beraber)
        public async Task<IEnumerable<Patient>> GetAllPatientsAsync()
        {
            // Repository yerine Context kullanıyoruz çünkü "Include" yapmamız lazım
            return await _context.Patients
                                 .Include(p => p.ChronicDisease) 
                                 .ToListAsync();
        }

        // 2. TEK HASTA GETİR (Hastalık İsmiyle Beraber)
        public async Task<Patient?> GetPatientByIdAsync(int id)
        {
            return await _context.Patients
                                 .Include(p => p.ChronicDisease) 
                                 .FirstOrDefaultAsync(p => p.Id == id);
        }

        // --- Diğerleri Aynen Kalıyor (Repository Kullanmaya Devam) ---

        public async Task<Patient> CreatePatientAsync(Patient patient)
        {
            await _patientRepository.AddAsync(patient);
            await _patientRepository.SaveChangesAsync();
            return patient;
        }

        public async Task UpdatePatientAsync(Patient patient)
        {
            _patientRepository.Update(patient);
            await _patientRepository.SaveChangesAsync();
        }

        public async Task DeletePatientAsync(int id)
        {
            var patient = await _patientRepository.GetByIdAsync(id);
            if (patient != null)
            {
                _patientRepository.Delete(patient);
                await _patientRepository.SaveChangesAsync();
            }
        }
        public async Task<Patient?> LoginAsync(string tcNo, string password)
        {
            var patient = await _context.Patients
                                        .FirstOrDefaultAsync(p => p.TcNo == tcNo && p.Password == password);

            return patient; 
        }
    }
}