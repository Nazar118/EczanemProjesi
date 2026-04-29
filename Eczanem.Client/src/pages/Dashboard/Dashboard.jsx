import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllMedicines } from '../../services/medicineService';
import { getTodayTotal } from '../../services/saleService';

export default function Dashboard() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayTotal, setTodayTotal] = useState(0);

  // İstatistikleri hesapla
  const totalMedicines = medicines.length;
  // Stoğu 10'dan az olanları kritik say
  const criticalStockCount = medicines.filter(m => m.stock < 10).length;

  useEffect(() => {
    // 1. İlaçları çek
    getAllMedicines()
      .then(data => {
        setMedicines(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    // 2. Günlük Ciroyu çek
    getTodayTotal()
      .then(total => setTodayTotal(total))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📊 Genel Durum Paneli</h2>

      {/* --- ÜST KARTLAR (İSTATİSTİKLER) --- */}
      <div className="row mb-4">
        {/* Toplam İlaç */}
        <div className="col-md-4">
          <div className="card text-white bg-primary shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">💊 Toplam İlaç</h5>
              <p className="card-text display-4 fw-bold">
                {loading ? "-" : totalMedicines}
              </p>
              <small>Sistemde kayıtlı ilaç adedi</small>
            </div>
          </div>
        </div>

        {/* Kritik Stok */}
        <div className="col-md-4">
          <div className="card text-white bg-danger shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">⚠️ Kritik Stok</h5>
              <p className="card-text display-4 fw-bold">
                {loading ? "-" : criticalStockCount}
              </p>
              <small>Stoku 10'dan az olan ilaçlar</small>
            </div>
          </div>
        </div>

        {/* Günlük Satış */}
        <div className="col-md-4">
          <div className="card text-white bg-success shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">💰 Bugün Satılan</h5>
              <p className="card-text display-4 fw-bold">₺{todayTotal}</p>
              <small>Günlük ciro</small>
            </div>
          </div>
        </div>
      </div>

      {/* --- ALT BÖLÜM (LİSTE VE MENÜ) --- */}
      <div className="row">
        
        {/* SOL TARAFTA: Son Eklenen İlaçlar Tablosu */}
        <div className="col-lg-8">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0">📋 Son Eklenen İlaçlar</h5>
            </div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>İlaç Adı</th>
                    <th>Stok Durumu</th>
                    <th>Firma</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.length === 0 ? (
                    <tr><td colSpan="3" className="text-center p-3">Kayıt yok.</td></tr>
                  ) : (
                    // Son 5 ilacı göster
                    [...medicines].reverse().slice(0, 5).map(med => (
                      <tr key={med.id}>
                        <td className="fw-bold">{med.name}</td>
                        <td>
                          <span className={`badge ${med.stock < 10 ? 'bg-danger' : 'bg-success'}`}>
                            {med.stock} Adet
                          </span>
                        </td>
                        <td>{med.manufacturer}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SAĞ TARAFTA: Hızlı İşlemler Menüsü */}
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0">⚡ Hızlı İşlemler</h5>
            </div>
            <div className="card-body d-grid gap-3">
              <Link to="/medicines" className="btn btn-outline-primary text-start p-3">
                💊 <strong>İlaç Yönetimi</strong> <br/>
                <small>Yeni ilaç ekle veya düzenle</small>
              </Link>
              
              <Link to="/stocks" className="btn btn-outline-success text-start p-3">
                📦 <strong>Stok Takibi</strong> <br/>
                <small>Stokları artır veya azalt</small>
              </Link>

              {/* --- GÜNCELLENEN KISIM BURASI (Artık Link oldu) --- */}
              <Link to="/sales" className="btn btn-outline-warning text-start p-3">
                💰 <strong>Satış Yap</strong> <br/>
                <small>Hızlı satış ekranına git</small>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}