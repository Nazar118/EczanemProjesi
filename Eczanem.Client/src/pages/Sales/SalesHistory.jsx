import { useEffect, useState, useCallback } from 'react';
import { getAllSales, deleteSale } from '../../services/saleService';
import { getAllMedicines } from '../../services/medicineService';
import { getAllPatients } from '../../services/patientService';
import { toast } from 'react-toastify';

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- YENİ EKLENEN STATE: TARİH FİLTRESİ ---
  // Varsayılan boş olsun (Hepsini göstersin), istersen bugünün tarihini de atayabilirsin.
  const [filterDate, setFilterDate] = useState(""); 

  const loadData = useCallback(async () => {
    try {
      const [salesData, medsData, patientsData] = await Promise.all([
        getAllSales(),
        getAllMedicines(),
        getAllPatients()
      ]);

      const sortedSales = salesData.sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate));
      
      setSales(sortedSales);
      setMedicines(medsData);
      setPatients(patientsData);
    } catch (error) {
      console.error(error);
      toast.error("Veriler yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- FİLTRELEME MANTIĞI ---
  const filteredSales = filterDate 
    ? sales.filter(sale => new Date(sale.saleDate).toISOString().split('T')[0] === filterDate)
    : sales;

  // --- YARDIMCI FONKSİYONLAR ---
  const getMedicineName = (id) => {
    const med = medicines.find(m => m.id === id);
    return med ? med.name : `İlaç #${id}`;
  };

  const getPatientName = (id) => {
    if (!id) return <span className="badge bg-secondary">Misafir</span>;
    const patient = patients.find(p => p.id === id);
    return patient ? `${patient.firstName} ${patient.lastName}` : "Bilinmiyor";
  };

  const handleCancelSale = async (id) => {
    if (window.confirm("Bu satışı iptal etmek istediğinize emin misiniz? Stok iade edilecektir.")) {
      try {
        await deleteSale(id);
        toast.info("✅ Satış iptal edildi, stok geri yüklendi.");
        loadData(); 
      } catch (error) {
        console.error(error);
        toast.error("İptal işlemi başarısız.");
      }
    }
  };

  return (
    <div className="container mt-4">
      {/* BAŞLIK VE FİLTRE ALANI */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📋 Satış Geçmişi</h2>
        
        <div className="d-flex align-items-center gap-2">
            <label className="fw-bold text-muted">Tarihe Göre Süz:</label>
            <input 
                type="date" 
                className="form-control" 
                style={{width: "180px"}}
                value={filterDate} 
                onChange={(e) => setFilterDate(e.target.value)} 
            />
            {filterDate && (
                <button 
                    className="btn btn-outline-secondary" 
                    onClick={() => setFilterDate("")}
                    title="Filtreyi Temizle"
                >
                    ❌ Temizle
                </button>
            )}
        </div>
      </div>

      {loading ? <p className="text-center">Yükleniyor...</p> : (
        <div className="card shadow-sm border-0">
            {/* Toplam Satış Özeti */}
            <div className="card-header bg-light d-flex justify-content-between">
                <span>Listelenen Kayıt: <strong>{filteredSales.length}</strong></span>
                <span>Toplam Ciro: <strong className="text-success">
                    {filteredSales.reduce((acc, curr) => acc + curr.totalPrice, 0)} ₺
                </strong></span>
            </div>

          <table className="table table-hover align-middle mb-0">
            <thead className="bg-white">
              <tr>
                <th>Tarih / Saat</th>
                <th>Hasta</th>
                <th>Satılan İlaç</th>
                <th>Adet</th>
                <th>Toplam Tutar</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id}>
                  <td>
                    <div className="fw-bold">{new Date(sale.saleDate).toLocaleDateString()}</div>
                    <div className="small text-muted">{new Date(sale.saleDate).toLocaleTimeString()}</div>
                  </td>
                  <td>{getPatientName(sale.patientId)}</td>
                  <td className="fw-bold text-primary">{getMedicineName(sale.medicineId)}</td>
                  <td>
                    <span className="badge bg-info text-dark">{sale.quantitySold} Adet</span>
                  </td>
                  <td className="fw-bold text-success fs-5">
                    {sale.totalPrice} ₺
                  </td>
                  <td>
                    <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={() => handleCancelSale(sale.id)}
                        title="İptal Et"
                    >
                        🗑️ İptal / İade
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredSales.length === 0 && (
                <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                        {filterDate ? "Bu tarihe ait satış bulunamadı." : "Henüz hiç satış yapılmamış."}
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