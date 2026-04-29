import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// Eğer patientMedicineService dosyan farklı bir klasördeyse yolunu ona göre ayarlamayı unutma!
import { getAllPatientMedicines, updateOrderState } from "../services/patientMedicineService";export default function OnlineOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verileri Backend'den Çekme
  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllPatientMedicines();
      
      // DEDEKTİF BURADA: Gelen veriyi tarayıcının konsoluna yazdırıyoruz
      console.log("C#'tan Gelen Ham Veri:", data); 

      // C# veriyi $values içine sardıysa onu çıkar, normal listeyse normal al
      if (data && data.$values) {
        setOrders(data.$values);
      } else if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.warn("Gelen veri bir liste değil!", data);
        setOrders([]);
      }
      
    } catch (error) {
      console.error("API Bağlantı Hatası:", error);
      toast.error("HATA: C# API'sine ulaşılamadı. (F12 Konsola Bak)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // 🟢 SİPARİŞİ ONAYLA (Durumu 'Hazır' Yap)
  const handleApprove = async (id) => {
    if (window.confirm("Bu siparişi onaylayıp hazırlamak istediğinize emin misiniz?")) {
      try {
        // İŞTE BURASI! (Yorumu kaldırdık ve fonksiyonu kullandık)
        await updateOrderState(id, { status: 'Hazır' }); 
        
        toast.success("✅ Sipariş başarıyla onaylandı ve 'Hazır' durumuna alındı!");
        
        // Ekranda anında yeşile dönmesi için:
        setOrders(orders.map(o => o.id === id ? { ...o, status: 'Hazır' } : o));
      } catch (error) {
        console.error(error);
        toast.error("❌ Onaylama işlemi başarısız oldu.");
      }
    }
  };

  // 🔴 SİPARİŞİ REDDET (Durumu 'İptal Edildi' Yap)
  const handleReject = async (id) => {
    if (window.confirm("Bu siparişi iptal etmek istediğinize emin misiniz?")) {
      try {
        // İŞTE BURASI! (Yorumu kaldırdık ve fonksiyonu kullandık)
        await updateOrderState(id, { status: 'İptal Edildi', isActive: false }); 
        
        toast.info("🗑️ Sipariş iptal edildi.");
        
        // Ekranda anında kırmızıya dönmesi için:
        setOrders(orders.map(o => o.id === id ? { ...o, status: 'İptal Edildi' } : o));
      } catch (error) {
        console.error(error);
        toast.error("❌ İptal işlemi başarısız oldu.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📦 Online Siparişler (Mobil)</h2>
        <button className="btn btn-primary" onClick={loadOrders}>
          🔄 Listeyi Yenile
        </button>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-warning text-dark fw-bold">
          <h5 className="mb-0">⏳ Bekleyen Hasta Talepleri</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-3">Hasta Adı</th>
                  <th>Talep Edilen İlaç</th>
                  <th>Adet</th>
                  <th>Hasta Notu</th>
                  <th>Tarih</th>
                  <th>Durum</th>
                  <th className="text-center">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center p-4">Yükleniyor...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan="7" className="text-center p-4 text-muted">Şu an bekleyen yeni bir sipariş bulunmuyor.</td></tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id}>
                      {/* HASTA ADI */}
                      <td className="ps-3 fw-bold text-primary">
                        {order.patient?.firstName} {order.patient?.lastName}
                      </td>
                      
                      {/* İLAÇ ADI */}
                      <td className="fw-bold">{order.medicine?.name}</td>
                      
                      {/* MİKTAR (Mobilden gelmiyorsa 1 yazsın) */}
                      <td>{order.dailyUsage || 1} Kutu</td>
                      
                      {/* HASTA NOTU (Şu an C#'ta böyle bir alan yok, boş geçiyoruz) */}
                      <td><span className="text-muted">-</span></td>
                      
                      {/* TARİH DÜZELTMESİ: orderDate değil startDate kullanıyoruz! */}
                      <td>
                        {order.startDate 
                          ? new Date(order.startDate).toLocaleDateString('tr-TR', { hour: '2-digit', minute: '2-digit' }) 
                          : 'Tarih Yok'}
                      </td>
                      
                      {/* DURUM ROZETİ */}
                      <td>
                        <span className={`badge ${order.status === 'Hazırlanıyor' ? 'bg-warning text-dark' : order.status === 'Hazır' ? 'bg-success' : 'bg-secondary'}`}>
                          {order.status || 'Belirsiz'}
                        </span>
                      </td>
                      
                      {/* İŞLEM BUTONLARI: 'Bekliyor' yerine 'Hazırlanıyor' veya boş (Belirsiz) olanlara buton çıkarıyoruz */}
                      <td className="text-center">
                        {(order.status === 'Hazırlanıyor' || !order.status || order.status === 'Belirsiz') && (
                          <div className="d-flex justify-content-center gap-2">
                            <button className="btn btn-sm btn-success" onClick={() => handleApprove(order.id)} title="Siparişi Onayla ve Hazırla">
                              ✅ Onayla
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleReject(order.id)} title="Siparişi Reddet">
                              ❌ Reddet
                            </button>
                          </div>
                        )}
                        {order.status === 'Hazır' && (
                          <span className="text-success fw-bold">Hazırlandı ✔️</span>
                        )}
                        {order.status === 'İptal Edildi' && (
                          <span className="text-danger fw-bold">İptal Edildi ✖️</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}