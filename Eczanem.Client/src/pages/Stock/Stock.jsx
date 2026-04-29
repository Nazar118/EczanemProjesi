import { useEffect, useState } from 'react';
import { getAllMedicines } from '../../services/medicineService';
import { addStockMovement } from '../../services/stockService'; // <-- BU SERVİS ÇOK ÖNEMLİ
import { toast } from 'react-toastify';

export default function Stock() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal (Pop-up) State'leri
  const [showModal, setShowModal] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);
  const [movementType, setMovementType] = useState("Giriş"); 
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");

  const loadStocks = () => {
    getAllMedicines()
      .then(data => {
        setMedicines(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadStocks(); }, []);

  // Modal Açma Fonksiyonu
  const openModal = (med, type) => {
    setSelectedMed(med);
    setMovementType(type);
    setQuantity(1);
    setDescription(""); 
    setShowModal(true);
  };

  // --- KRİTİK NOKTA: KAYDETME İŞLEMİ ---
  const handleSave = async () => {
    if (!selectedMed || quantity <= 0) return;

    // Backend'e gidecek paket (Hem stoğu günceller hem geçmişe yazar)
    const movement = {
      medicineId: selectedMed.id,
      type: movementType, // "Giriş" veya "Çıkış"
      quantity: Number(quantity),
      description: description || (movementType === "Giriş" ? "Stok Ekleme" : "Manuel Çıkış")
    };

    try {
      // StockService üzerinden gönderiyoruz! (Böylece geçmişe de kayıt atılacak)
      await addStockMovement(movement);
      
      toast.success(`${movementType} işlemi başarılı!`);
      setShowModal(false);
      loadStocks(); // Listeyi yenile ki güncel rakamı görelim
    } catch (error) {
      console.error(error);
      toast.error("İşlem başarısız! (Backend hatası olabilir)");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📦 Stok Takibi</h2>

      {loading ? (
        <p className="text-center">Stok bilgileri yükleniyor...</p>
      ) : (
        <div className="card shadow-sm border-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th>İlaç Adı</th>
                <th>Barkod</th>
                <th className="text-center">Mevcut Stok</th>
                <th className="text-center">Fiyat (₺)</th>
                <th className="text-center">Hızlı İşlem</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med) => (
                <tr key={med.id}>
                  <td className="fw-bold">{med.name}</td>
                  <td><span className="badge bg-secondary">{med.barcode}</span></td>
                  
                  {/* Renkli Stok Göstergesi */}
                  <td className="text-center">
                    <span className={`badge fs-6 ${med.stock < 10 ? 'bg-danger' : 'bg-success'}`}>
                        {med.stock} Adet
                    </span>
                  </td>

                  <td className="text-center text-muted">{med.price} ₺</td>

                  {/* Butonlar: Artık Modalı Tetikliyor */}
                  <td className="text-center">
                    <button 
                        className="btn btn-sm btn-outline-success me-2" 
                        onClick={() => openModal(med, "Giriş")}
                    >
                        ➕ Ekle
                    </button>
                    <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={() => openModal(med, "Çıkış")}
                    >
                        ➖ Düş
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- POP-UP PENCERE (MODAL) --- */}
      {showModal && selectedMed && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className={`modal-header text-white ${movementType === "Giriş" ? "bg-success" : "bg-danger"}`}>
                  <h5 className="modal-title">
                    {movementType === "Giriş" ? "📥 Stok Girişi" : "📤 Stok Çıkışı"}
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p className="fw-bold fs-5">{selectedMed.name}</p>
                  <p className="text-muted">Şu anki Stok: <strong>{selectedMed.stock}</strong></p>
                  
                  <div className="mb-3">
                    <label className="form-label">İşlem Miktarı</label>
                    <input 
                        type="number" 
                        className="form-control form-control-lg text-center fw-bold" 
                        value={quantity} 
                        onChange={(e) => setQuantity(e.target.value)}
                        min="1"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Açıklama (Opsiyonel)</label>
                    <input 
                        type="text"
                        className="form-control" 
                        placeholder={movementType === "Giriş" ? "Örn: Depodan geldi" : "Örn: Kırıldı / Zayi"}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>İptal</button>
                  <button className={`btn ${movementType === "Giriş" ? "btn-success" : "btn-danger"}`} onClick={handleSave}>
                    Onayla
                  </button>
                </div>
              </div>
            </div>
        </div>
      )}
    </div>
  );
}