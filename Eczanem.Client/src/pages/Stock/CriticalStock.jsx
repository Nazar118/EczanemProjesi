import { useEffect, useState } from 'react';
import { getCriticalStock } from '../../services/stockService';
import { toast } from 'react-toastify';

export default function CriticalStock() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCriticalStock()
      .then(data => {
        setMedicines(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error("Veriler alınamadı.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-4 gap-2">
        <h2 className="text-danger">⚠️ Kritik Stok Listesi</h2>
        <span className="badge bg-danger rounded-pill fs-6">{medicines.length} Ürün</span>
      </div>
      
      <div className="alert alert-warning border-warning d-flex align-items-center" role="alert">
        ℹ️ <span className="ms-2">Bu listede sadece stoğu <strong>20 adedin altında</strong> olan ilaçlar gösterilmektedir.</span>
      </div>

      {loading ? <p className="text-center">Yükleniyor...</p> : (
        <div className="card shadow-sm border-danger border-opacity-25">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th>İlaç Adı</th>
                <th>Kategori</th>
                <th>Tedarikçi</th>
                <th>Mevcut Stok</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med) => (
                <tr key={med.id}>
                  <td className="fw-bold">{med.name}</td>
                  <td>
                    <span className="badge bg-secondary">{med.category?.name || "-"}</span>
                  </td>
                  <td className="small text-muted">
                    {med.supplier?.name ? `🚛 ${med.supplier.name}` : "-"}
                  </td>
                  <td>
                    <h5 className="m-0">
                        <span className="badge bg-danger">{med.stock} Adet</span>
                    </h5>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => toast.info("Otomatik sipariş özelliği yakında! 🚀")}>
                        🚨 Sipariş Oluştur
                    </button>
                  </td>
                </tr>
              ))}
              {medicines.length === 0 && (
                <tr>
                    <td colSpan="5" className="text-center py-5 text-success">
                        <h4>Harika! 🎉</h4>
                        <p>Kritik seviyede ilaç bulunmuyor. Depolar dolu!</p>
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