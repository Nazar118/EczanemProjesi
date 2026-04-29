using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eczanem.Api.Models
{
    public class PatientMedicine
    {
        public int Id { get; set; }

        // Hangi Hasta?
        public int PatientId { get; set; }
        [ForeignKey("PatientId")]
        public Patient? Patient { get; set; }

        // Hangi İlaç?
        public int MedicineId { get; set; }
        [ForeignKey("MedicineId")]
        public Medicine? Medicine { get; set; }

        // Kullanım Sıklığı (Günde kaç adet?)
        public int DailyUsage { get; set; } = 1;

        public DateTime StartDate { get; set; } = DateTime.Now;

        public DateTime EstimatedEndDate { get; set; }

        // Bildirim Gönderildi mi? (Tekrar tekrar atmamak için)
        public bool IsNotificationSent { get; set; } = false;

        public bool IsActive { get; set; } = true;
        public string Status { get; set; } = "Hazırlanıyor";
        // Hastanın kaç kutu istediği
        public int Quantity { get; set; } = 1;

        public string? Note { get; set; }
    }
}