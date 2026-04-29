import { useEffect, useState } from 'react';
import { getAllMedicines } from '../../services/medicineService';
import { getAllPatients } from '../../services/patientService';
import { createSale, getAllSales, deleteSale } from '../../services/saleService';

// --- 1. TOAST IMPORT ---
import { toast } from 'react-toastify';

export default function Sales() {
  const [medicines, setMedicines] = useState([]);
  const [patients, setPatients] = useState([]); 
  const [sales, setSales] = useState([]); 
  
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  const [selectedMedicineId, setSelectedMedicineId] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(""); 
  const [quantity, setQuantity] = useState(1);
  
  const loadData = () => {
    getAllMedicines().then(data => setMedicines(data));
    getAllPatients().then(data => setPatients(data));
    getAllSales().then(data => setSales(data));
  };

  useEffect(() => { loadData(); }, []); 

  // Hesaplamalar
  const selectedMed = medicines.find(m => m.id === parseInt(selectedMedicineId));
  const totalPricePreviewCalc = selectedMed ? selectedMed.price * quantity : 0;

  const filteredSales = sales.filter(sale => {
    const saleDay = new Date(sale.saleDate).toISOString().split('T')[0];
    return saleDay === filterDate;
  });

  const dailyTotal = filteredSales.reduce((acc, curr) => acc + curr.totalPrice, 0);

  // İsim Bulucular
  const getPatientName = (patientId) => {
    if (!patients || patients.length === 0) return "Yükleniyor...";
    if (!patientId) return <span className="text-muted">Misafir (Kayıtsız)</span>;
    const patient = patients.find(p => p.id === patientId);
    return patient ? <span className="text-primary fw-bold">{patient.firstName} {patient.lastName}</span> : "Bilinmeyen";
  };

  const getMedicineName = (medicineId) => {
    if (!medicines || medicines.length === 0) return "Yükleniyor...";
    const med = medicines.find(m => m.id === medicineId);
    return med ? med.name : `İlaç #${medicineId}`;
  };

  // --- İŞLEMLER (TOAST ) ---
  const handleDeleteSale = async (id) => {
    // Soru sorma işlemi yine "confirm" ile kalmalı (Kullanıcıdan onay almak için)
    if (window.confirm("Bu satışı iptal etmek istediğinize emin misiniz? Stok geri yüklenecek.")) {
      try {
        await deleteSale(id);
        // alert yerine toast:
        toast.info("🗑️ Satış iptal edildi ve stok iade edildi."); 
        loadData();
      } catch (error) {
        console.error(error);
        toast.error("❌ Silinirken bir hata oluştu!");
      }
    }
  };

  const handleSale = async (e) => {
    e.preventDefault();
    if (!selectedMedicineId || quantity <= 0) {
        toast.warning("⚠️ Lütfen ilaç ve geçerli bir adet giriniz.");
        return;
    }

    const saleData = {
      medicineId: parseInt(selectedMedicineId),
      quantitySold: parseInt(quantity),
      pharmacyId: 1,
      patientId: selectedPatientId ? parseInt(selectedPatientId) : null 
    };

    try {
      await createSale(saleData);
      // alert yerine toast:
      toast.success("✅ Satış Başarıyla Tamamlandı! 💸");
      
      setQuantity(1);
      setSelectedMedicineId("");
      setSelectedPatientId(""); 
      loadData(); 
    } catch (error) {
      console.error(error);
      // Backend'den gelen hatayı göster
      toast.error("❌ Hata: " + (error.message || "Satış başarısız oldu."));
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">💰 Satış İşlemleri</h2>

      <div className="row">
        {/* SOL: SATIŞ FORMU */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Yeni Satış Yap</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSale}>
                <div className="mb-3">
                    <label className="form-label">Müşteri / Hasta</label>
                    <select 
                        className="form-select"
                        value={selectedPatientId}
                        onChange={(e) => setSelectedPatientId(e.target.value)}
                    >
                        <option value="">-- Misafir (Kayıtlı Değil) --</option>
                        {patients.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.firstName} {p.lastName} ({p.tcNo})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Satılacak İlaç</label>
                  <select 
                    className="form-select" 
                    value={selectedMedicineId}
                    onChange={(e) => setSelectedMedicineId(e.target.value)}
                  >
                    <option value="">-- İlaç Seçiniz --</option>
                    {medicines.map(med => (
                      <option key={med.id} value={med.id} disabled={med.stock <= 0}>
                        {med.name} (Stok: {med.stock} - {med.price}₺)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Adet</label>
                  <input type="number" className="form-control" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                </div>

                <div className="alert alert-info d-flex justify-content-between">
                  <span>Toplam Tutar:</span>
                  <span className="fw-bold">{totalPricePreviewCalc.toFixed(2)} ₺</span>
                </div>

                <button type="submit" className="btn btn-success w-100">Satışı Tamamla 💸</button>
              </form>
            </div>
          </div>
        </div>

        {/* SAĞ: SATIŞ GEÇMİŞİ */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-body d-flex justify-content-between align-items-center bg-light rounded">
                <div>
                    <label className="form-label fw-bold mb-0 me-2">📅 Tarih Seçiniz:</label>
                    <input 
                        type="date" 
                        className="form-control d-inline-block w-auto"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    />
                </div>
                <div className="text-end">
                    <small className="text-muted d-block">Seçilen Günün Toplamı</small>
                    <span className="fs-3 fw-bold text-success">{dailyTotal} ₺</span>
                </div>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-header bg-white">
              <h5 className="mb-0">📋 Satış Listesi ({filterDate})</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Hasta</th>
                    <th>İlaç</th>
                    <th>Adet</th>
                    <th>Tutar</th>
                    <th>Saat</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.length === 0 ? (
                    <tr><td colSpan="6" className="text-center p-3 text-muted">
                        Bu tarihte yapılan satış bulunamadı.
                    </td></tr>
                  ) : (
                    filteredSales.map(sale => (
                      <tr key={sale.id}>
                        <td>
                            {sale.patient ? 
                                <span className="text-primary fw-bold">{sale.patient.firstName} {sale.patient.lastName}</span> 
                                : getPatientName(sale.patientId)
                            }
                        </td>
                        <td className="fw-bold">
                           {sale.medicine ? sale.medicine.name : getMedicineName(sale.medicineId)}
                        </td>
                        <td>{sale.quantitySold}</td>
                        <td className="text-success fw-bold">{sale.totalPrice} ₺</td>
                        <td>{new Date(sale.saleDate).toLocaleTimeString()}</td>
                        <td>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteSale(sale.id)}>
                                İptal
                            </button>
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
    </div>
  );
}