import { useEffect, useState } from 'react';
import { getAllMedicines } from '../../services/medicineService';
import { toast } from 'react-toastify';

export default function ExpiryTracker() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllMedicines()
      .then(data => {
        // Tarihe göre sırala (En yakından en uzağa)
        const sorted = data.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));
        setMedicines(sorted);
        setLoading(false);
      })
      .catch(err => 
        console.error(err),
        toast.error("Veriler alınamadı."));
  }, []);

  // Kalan günü hesapla
  const getDaysLeft = (dateString) => {
    const today = new Date();
    const expDate = new Date(dateString);
    const diffTime = expDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  // Duruma göre renk ve mesaj ver
  const getStatus = (days) => {
    if (days < 0) return { color: "bg-danger text-white", text: "SÜRESİ GEÇMİŞ! 💀" };
    if (days <= 30) return { color: "bg-warning text-dark", text: "DİKKAT! Yaklaşıyor ⚠️" };
    if (days <= 90) return { color: "bg-info text-dark", text: "3 Aydan Az Kaldı" };
    return { color: "bg-success text-white", text: "Güvenli ✅" };
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">⏳ SKT Takip Merkezi</h2>
      
      {loading ? <p>Yükleniyor...</p> : (
        <div className="card shadow-sm border-0">
          <table className="table table-hover align-middle">
            <thead className="bg-light">
              <tr>
                <th>İlaç Adı</th>
                <th>SKT Tarihi</th>
                <th>Kalan Gün</th>
                <th>Durum</th>
                <th>Stok</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med) => {
                const days = getDaysLeft(med.expirationDate);
                const status = getStatus(days);

                return (
                  <tr key={med.id}>
                    <td className="fw-bold">{med.name}</td>
                    <td>{new Date(med.expirationDate).toLocaleDateString()}</td>
                    <td className="fw-bold">{days} Gün</td>
                    <td>
                        <span className={`badge ${status.color} p-2`}>
                            {status.text}
                        </span>
                    </td>
                    <td>{med.stock} Adet</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}