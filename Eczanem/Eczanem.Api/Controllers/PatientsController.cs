using Eczanem.Api.Interfaces;
using Eczanem.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Eczanem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly IPatientService _patientService;

        public PatientsController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var patients = await _patientService.GetAllPatientsAsync();
            return Ok(patients);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var patient = await _patientService.GetPatientByIdAsync(id);
            if (patient == null) return NotFound();
            return Ok(patient);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Patient patient)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var createdPatient = await _patientService.CreatePatientAsync(patient);
            return CreatedAtAction(nameof(GetById), new { id = createdPatient.Id }, createdPatient);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            // Servise TC ve Şifreyi gönderiyoruz
            var patient = await _patientService.LoginAsync(req.TcNo, req.Password);

            if (patient == null)
            {
                return Unauthorized("TC Kimlik Numaranız veya Şifreniz hatalı.");
            }

            return Ok(patient);
        }

        // Login metodunun kullanacağı model (Şifre alanını ekledik)
        public class LoginRequest
        {
            public string TcNo { get; set; }
            public string Password { get; set; }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Patient patient)
        {
            if (id != patient.Id) return BadRequest("ID uyuşmazlığı");

            await _patientService.UpdatePatientAsync(patient);
            return Ok(patient);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _patientService.DeletePatientAsync(id);
            return Ok();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            // 1. Önce bu TC Kimlik no ile kayıtlı biri var mı diye kontrol et (Çift kayıt olmasın)
            var existingPatients = await _patientService.GetAllPatientsAsync();
            var isExist = existingPatients.Any(p => p.TcNo == req.TcNo);

            if (isExist)
            {
                return BadRequest("Bu TC Kimlik Numarası zaten sisteme kayıtlı.");
            }

            // 2. Yeni hasta nesnesini oluştur
            var newPatient = new Patient
            {
                TcNo = req.TcNo,
                Password = req.Password,
                FirstName = req.FirstName,
                LastName = req.LastName,
                PhoneNumber = req.PhoneNumber,
                ChronicDiseaseId = null
            };

            // 3. Servis aracılığıyla veritabanına kaydet
            var createdPatient = await _patientService.CreatePatientAsync(newPatient);

            return Ok(createdPatient);
        }

        // Kayıt metodunun kullanacağı veri modeli
        public class RegisterRequest
        {
            public string TcNo { get; set; }
            public string Password { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string PhoneNumber { get; set; }
        }
    }
}