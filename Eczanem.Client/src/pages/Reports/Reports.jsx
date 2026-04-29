import { useEffect, useState } from 'react';
import { getSaleStats } from '../../services/saleService';
import { toast } from 'react-toastify';

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Varsayılan olarak bu ayın başından bugüne kadar olsun
  const [startDate, setStartDate] = useState(new Date().getFullYear() + "-" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "-01");
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Verileri çekme fonksiyonu
  const loadStats = () => {
    setLoading(true);
    getSaleStats(startDate, endDate)
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error("Rapor verileri alınamadı.");
        setLoading(false);
      });
  };

  // Sayfa ilk açıldığında ve tarihler değiştiğinde çalışır
  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // İlk açılışta çalışsın

  // Filtrele butonu için
  const handleFilter = () => {
    loadStats();
    toast.info("📅 Rapor güncellendi!");
  };

  // Filtreyi Temizle (Tüm Zamanlar)
  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    // State güncellenmesi asenkron olduğu için doğrudan null göndererek çağırıyoruz
    setLoading(true);
    getSaleStats(null, null).then(data => {
        setStats(data);
        setLoading(false);
        toast.info("🌍 Tüm zamanların verileri gösteriliyor.");
    });
  };

  if (loading && !stats) return <p className="text-center mt-5">Veriler analiz ediliyor... 📊</p>;

  // Grafik hesaplaması için maksimum değeri bul
  const maxSales = stats && stats.topSelling.length > 0 ? stats.topSelling[0].totalQuantity : 1;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2>📈 Performans Raporları</h2>
        
        {/* TARİH FİLTRE ALANI */}
        <div className="card p-2 shadow-sm border-0 bg-light">
            <div className="d-flex align-items-center gap-2">
                <div>
                    <small className="text-muted d-block">Başlangıç</small>
                    <input 
                        type="date" 
                        className="form-control form-control-sm" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                    />
                </div>
                <span className="mt-3">➡️</span>
                <div>
                    <small className="text-muted d-block">Bitiş</small>
                    <input 
                        type="date" 
                        className="form-control form-control-sm" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                    />
                </div>
                <div className="mt-3">
                    <button className="btn btn-sm btn-primary me-1" onClick={handleFilter}>🔍 Filtrele</button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={handleClear}>Tümü</button>
                </div>
            </div>
        </div>
      </div>

      {stats && (
        <>
            {/* --- ÜST KARTLAR (ÖZET) --- */}
            <div className="row mb-4">
                <div className="col-md-6">
                <div className="card text-white bg-primary shadow-sm h-100">
                    <div className="card-body text-center">
                    <h5 className="card-title opacity-75">Ciro ({startDate ? 'Seçilen Dönem' : 'Tüm Zamanlar'})</h5>
                    <h1 className="display-4 fw-bold">{stats.totalRevenue} ₺</h1>
                    </div>
                </div>
                </div>
                <div className="col-md-6">
                <div className="card text-white bg-success shadow-sm h-100">
                    <div className="card-body text-center">
                    <h5 className="card-title opacity-75">Toplam Satış İşlemi</h5>
                    <h1 className="display-4 fw-bold">{stats.totalSalesCount} Adet</h1>
                    </div>
                </div>
                </div>
            </div>

            {/* --- EN ÇOK SATANLAR LİSTESİ --- */}
            <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3">
                <h5 className="mb-0 text-dark">🏆 En Çok Satan 5 İlaç</h5>
                </div>
                <div className="card-body">
                {stats.topSelling.length === 0 ? (
                    <p className="text-muted text-center py-4">Bu tarih aralığında satış verisi bulunamadı.</p>
                ) : (
                    stats.topSelling.map((item, index) => (
                    <div key={item.medicineId} className="mb-4">
                        <div className="d-flex justify-content-between mb-1">
                        <span className="fw-bold text-primary">
                            {index + 1}. {item.medicineName}
                        </span>
                        <span className="fw-bold">
                            {item.totalQuantity} Adet <span className="text-muted fw-normal">({item.totalRevenue} ₺)</span>
                        </span>
                        </div>
                        
                        {/* Görsel Çubuk */}
                        <div className="progress" style={{ height: "10px" }}>
                        <div 
                            className="progress-bar bg-info" 
                            role="progressbar" 
                            style={{ width: `${(item.totalQuantity / maxSales) * 100}%` }} 
                        ></div>
                        </div>
                    </div>
                    ))
                )}
                </div>
            </div>
        </>
      )}
    </div>
  );
}