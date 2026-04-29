import { useEffect, useState } from 'react';
import { getStockHistory } from '../../services/stockService';
import { toast } from 'react-toastify';

export default function StockHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- YENİ: TARİH FİLTRESİ İÇİN STATE ---
  const [filterDate, setFilterDate] = useState(""); // Varsayılan: Hepsi (Boş)

  useEffect(() => {
    getStockHistory()
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error("Geçmiş verileri yüklenemedi.");
        setLoading(false);
      });
  }, []);

  // --- FİLTRELEME MANTIĞI ---
  const filteredHistory = filterDate
    ? history.filter(item => new Date(item.date).toISOString().split('T')[0] === filterDate)
    : history;

  // --- GÜNLÜK ÖZET HESAPLAMA (Seçilen gün için) ---
  const dailyInput = filteredHistory.filter(h => h.type === "Giriş").reduce((acc, curr) => acc + curr.quantity, 0);
  const dailyOutput = filteredHistory.filter(h => h.type === "Çıkış").reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="container mt-4">
      
      {/* BAŞLIK VE FİLTRE ALANI */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2>🔄 Stok Hareket Geçmişi</h2>
        
        <div className="d-flex align-items-center gap-2 bg-light p-2 rounded shadow-sm">
            <span className="fw-bold text-muted small">Tarih Seç:</span>
            <input 
                type="date" 
                className="form-control form-control-sm" 
                style={{width: "150px"}}
                value={filterDate} 
                onChange={(e) => setFilterDate(e.target.value)} 
            />
            {filterDate && (
                <button 
                    className="btn btn-sm btn-outline-danger" 
                    onClick={() => setFilterDate("")}
                    title="Filtreyi Temizle"
                >
                    ❌ Temizle
                </button>
            )}
        </div>
      </div>

      <div className="alert alert-info d-flex align-items-center justify-content-between" role="alert">
        <div>
            ℹ️ <span className="ms-2">Burada yapılan tüm stok giriş ve çıkış işlemleri kayıt altına alınır.</span>
        </div>
        {/* FİLTRE VARSA ÖZET GÖSTER */}
        {filterDate && (
            <div className="fw-bold">
                <span className="text-success me-3">📥 Giriş: {dailyInput} Adet</span>
                <span className="text-danger">📤 Çıkış: {dailyOutput} Adet</span>
            </div>
        )}
      </div>

      {loading ? <p className="text-center">Yükleniyor...</p> : (
        <div className="card shadow-sm border-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th>Tarih / Saat</th>
                <th>İlaç Adı</th>
                <th>İşlem Türü</th>
                <th>Miktar</th>
                <th>Açıklama</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => (
                <tr key={item.id}>
                  {/* Tarih Formatı: 16.12.2025 14:30 */}
                  <td className="text-muted small">
                    <div className="fw-bold text-dark">{new Date(item.date).toLocaleDateString()}</div>
                    <div>{new Date(item.date).toLocaleTimeString()}</div>
                  </td>
                  
                  <td className="fw-bold text-primary">
                    {item.medicine?.name || "Silinmiş İlaç"}
                  </td>
                  
                  <td>
                    {/* Giriş ise Yeşil, Çıkış ise Kırmızı Etiket */}
                    <span className={`badge ${item.type === 'Giriş' ? 'bg-success' : 'bg-danger'}`}>
                        {item.type === 'Giriş' ? '📥 Giriş' : '📤 Çıkış'}
                    </span>
                  </td>
                  
                  <td className="fw-bold">
                    {item.quantity} Adet
                  </td>
                  
                  <td className="text-muted small fst-italic">
                    {item.description || "-"}
                  </td>
                </tr>
              ))}
              
              {filteredHistory.length === 0 && (
                <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                        {filterDate ? "Bu tarihe ait stok hareketi bulunamadı." : "Henüz hiç stok hareketi yapılmamış."}
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}