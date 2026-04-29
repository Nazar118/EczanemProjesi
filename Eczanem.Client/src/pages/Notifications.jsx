import { useEffect, useState, useCallback } from 'react';
import { getNotifications } from '../services/patientMedicineService';
import { toast } from 'react-toastify';

export default function Notifications() {
  const [alerts, setAlerts] = useState([]);
  // Başlangıçta zaten TRUE yapıyoruz, o yüzden fonksiyon içinde tekrar true yapmaya gerek yok.
  const [loading, setLoading] = useState(true);

  // --- DÜZELTME: setLoading(true) SATIRINI KALDIRDIK ---
  const loadNotifications = useCallback(() => {
    // Burada setLoading(true) vardı, SİLDİK. Hatanın kaynağı oydu.
    
    getNotifications()
      .then(data => {
        setAlerts(data);
        setLoading(false); // İşimiz bitince false yapıyoruz, bu sorun yaratmaz.
      })
      .catch(err => {
        console.error(err);
        toast.error("Bildirimler alınamadı.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // --- BİLDİRİM GÖNDERME SİMÜLASYONU ---
  const handleSendSMS = (patientName, medicineName) => {
    toast.success(`📨 ${patientName} isimli hastaya "${medicineName} ilacınız bitmek üzere" SMS'i gönderildi!`);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🔔 Bildirim Merkezi</h2>

      {/* Bilgi Kartı */}
      <div className="alert alert-warning border-0 shadow-sm d-flex align-items-center">
        <span className="fs-3 me-3">⚠️</span>
        <div>
            <strong>Kritik Uyarılar:</strong> Aşağıdaki hastaların ilaçları <u>önümüzdeki 3 gün içinde</u> bitecektir.
            Lütfen hastalarla iletişime geçiniz.
        </div>
      </div>

      {loading ? <p className="text-center">Yükleniyor...</p> : (
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                    <tr>
                        <th>Hasta Adı</th>
                        <th>İletişim</th>
                        <th>Bitecek İlaç</th>
                        <th>Bitiş Tarihi</th>
                        <th>Durum</th>
                        <th>Aksiyon</th>
                    </tr>
                </thead>
                <tbody>
                    {alerts.map((item) => {
                        // Kalan gün hesabı
                        const daysLeft = Math.ceil((new Date(item.estimatedEndDate) - new Date()) / (1000 * 60 * 60 * 24));
                        
                        return (
                            <tr key={item.id}>
                                <td className="fw-bold">{item.patient?.firstName} {item.patient?.lastName}</td>
                                
                                <td>
                                    {item.patient?.phoneNumber ? (
                                        <a href={`tel:${item.patient.phoneNumber}`} className="text-decoration-none">
                                            📞 {item.patient.phoneNumber}
                                        </a>
                                    ) : <span className="text-muted">-</span>}
                                </td>

                                <td className="text-primary fw-bold">{item.medicine?.name}</td>

                                <td>
                                    <span className="text-danger fw-bold">
                                        {new Date(item.estimatedEndDate).toLocaleDateString()}
                                    </span>
                                    <br />
                                    <small className="text-muted fw-bold">
                                        {daysLeft <= 0 ? "Bugün Bitiyor!" : `${daysLeft} gün kaldı`}
                                    </small>
                                </td>

                                <td>
                                    <span className="badge bg-warning text-dark">⏳ Yaklaşıyor</span>
                                </td>

                                <td>
                                    <button 
                                        className="btn btn-sm btn-success text-white"
                                        onClick={() => handleSendSMS(`${item.patient?.firstName} ${item.patient?.lastName}`, item.medicine?.name)}
                                    >
                                        📨 SMS Gönder
                                    </button>
                                </td>
                            </tr>
                        );
                    })}

                    {alerts.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center py-5">
                                <div className="text-success fs-1">✅</div>
                                <p className="text-muted mt-2">Şu an acil bir bildirim bulunmuyor. Her şey yolunda!</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}