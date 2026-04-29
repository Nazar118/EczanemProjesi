import { useEffect, useState, useCallback } from 'react';
import { getAllPatients, addPatient, updatePatient, deletePatient } from '../../services/patientService';
import { getAllDiseases } from '../../services/chronicDiseaseService';
import { getPatientMedicines, addPatientMedicine, removePatientMedicine } from '../../services/patientMedicineService'; // <-- YENİ
import { getAllMedicines } from '../../services/medicineService'; // <-- YENİ (İlaç seçimi için)
import { toast } from 'react-toastify';

export default function Patients() {
  // --- TEMEL STATE'LER ---
  const [patients, setPatients] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- HASTA EKLEME/DÜZENLEME MODALI STATE'LERİ ---
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", tcNo: "", phoneNumber: "", chronicDiseaseId: "" });

  // --- YENİ: REÇETE (İLAÇ YÖNETİMİ) MODALI STATE'LERİ ---
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientMedicines, setPatientMedicines] = useState([]); // Hastanın mevcut ilaçları
  const [allMedicines, setAllMedicines] = useState([]); // Seçim listesi için tüm ilaçlar
  
  // Yeni Reçete Formu
  const [prescriptionForm, setPrescriptionForm] = useState({
      medicineId: "",
      dailyUsage: 1
  });

  // --- VERİLERİ YÜKLE ---
  const loadData = useCallback(async () => {
    try {
      const [patientsData, diseasesData] = await Promise.all([
        getAllPatients(),
        getAllDiseases()
      ]);
      setPatients(patientsData);
      setDiseases(diseasesData);
    } catch (error) {
      console.error(error);
      toast.error("Veriler yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // --- HASTA İŞLEMLERİ ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "chronicDiseaseId") {
        setFormData({ ...formData, [name]: value ? Number(value) : "" });
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName) {
      toast.warning("⚠️ Ad ve Soyad zorunludur.");
      return;
    }
    try {
      if (isEditing) {
        await updatePatient(currentId, { ...formData, id: currentId });
        toast.success("✅ Hasta güncellendi!");
      } else {
        await addPatient(formData);
        toast.success("✅ Yeni hasta eklendi!");
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("❌ İşlem başarısız.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu hastayı silmek istediğinize emin misiniz?")) {
      try {
        await deletePatient(id);
        toast.info("🗑️ Hasta silindi.");
        loadData();
      } catch (error) {
        console.error(error);
        toast.error("❌ Silinemedi.");
      }
    }
  };

  const openEditModal = (p) => {
    setFormData({
        firstName: p.firstName,
        lastName: p.lastName,
        tcNo: p.tcNo,
        phoneNumber: p.phoneNumber || "",
        chronicDiseaseId: p.chronicDiseaseId || ""
    });
    setCurrentId(p.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const openAddModal = () => {
    setFormData({ firstName: "", lastName: "", tcNo: "", phoneNumber: "", chronicDiseaseId: "" });
    setIsEditing(false);
    setShowModal(true);
  };


  const openPrescriptionModal = async (patient) => {
    setSelectedPatient(patient);
    setShowPrescriptionModal(true);
    
    // 1. Hastanın mevcut ilaçlarını çek
    try {
        const pMeds = await getPatientMedicines(patient.id);
        setPatientMedicines(pMeds);
        
        // 2. Tüm ilaç listesini çek (Dropdown için) - Eğer daha önce çekilmediyse
        if (allMedicines.length === 0) {
            const meds = await getAllMedicines();
            setAllMedicines(meds);
        }
    } catch (error) {
      console.error(error);
        toast.error("İlaç bilgileri alınamadı.");
    }
  };

  const handleAddMedicine = async () => {
    if (!prescriptionForm.medicineId || prescriptionForm.dailyUsage <= 0) {
        toast.warning("Lütfen ilaç seçin ve kullanım adedini girin.");
        return;
    }

    try {
        await addPatientMedicine({
            patientId: selectedPatient.id,
            medicineId: Number(prescriptionForm.medicineId),
            dailyUsage: Number(prescriptionForm.dailyUsage)
        });
        
        toast.success("💊 İlaç hastaya tanımlandı!");
        
        // Listeyi yenile
        const updatedList = await getPatientMedicines(selectedPatient.id);
        setPatientMedicines(updatedList);
        
        // Formu temizle
        setPrescriptionForm({ medicineId: "", dailyUsage: 1 });

    } catch (error) {
        console.error(error);
        toast.error("Hata: İlaç eklenemedi.");
    }
  };

  const handleRemoveMedicine = async (id) => {
    if (window.confirm("Bu ilacı hastanın listesinden kaldırmak istiyor musunuz?")) {
        try {
            await removePatientMedicine(id);
            toast.info("İlaç listeden çıkarıldı.");
            // Listeyi yenile
            const updatedList = await getPatientMedicines(selectedPatient.id);
            setPatientMedicines(updatedList);
        } catch (error) {
          console.error(error);
            toast.error("Silinemedi.");
        }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>👥 Hasta Listesi</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Yeni Hasta Ekle
        </button>
      </div>

      {loading ? <p>Yükleniyor...</p> : (
        <div className="card shadow-sm border-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th>Ad Soyad</th>
                <th>TC Kimlik No</th>
                <th>Telefon</th>
                <th>Kronik Hastalık</th>
                <th style={{minWidth: "220px"}}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr key={p.id}>
                  <td className="fw-bold">{p.firstName} {p.lastName}</td>
                  <td><span className="badge bg-secondary">{p.tcNo}</span></td>
                  <td>{p.phoneNumber || "-"}</td>
                  
                  <td>
                    {p.chronicDisease ? (
                        <span className="badge bg-danger">🩺 {p.chronicDisease.name}</span>
                    ) : <span className="text-muted small">-</span>}
                  </td>

                  <td>
                    {/* YENİ REÇETE BUTONU */}
                    <button 
                        className="btn btn-sm btn-success me-2" 
                        onClick={() => openPrescriptionModal(p)}
                        title="İlaçları Yönet"
                    >
                        💊 Reçete
                    </button>

                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(p)}>Düzenle</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- HASTA EKLEME/DÜZENLEME MODALI --- */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{isEditing ? "Hastayı Düzenle" : "Yeni Hasta Ekle"}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Ad</label>
                            <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Soyad</label>
                            <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">TC Kimlik No</label>
                        <input type="text" className="form-control" name="tcNo" value={formData.tcNo} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Telefon</label>
                        <input type="text" className="form-control" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold text-danger">Kronik Hastalık Durumu</label>
                        <select className="form-select" name="chronicDiseaseId" value={formData.chronicDiseaseId} onChange={handleInputChange}>
                            <option value="">-- Hastalık Yok / Seçilmedi --</option>
                            {diseases.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>İptal</button>
                  <button className="btn btn-primary" onClick={handleSave}>{isEditing ? "Güncelle" : "Kaydet"}</button>
                </div>
              </div>
            </div>
        </div>
      )}

      {/* --- YENİ: REÇETE YÖNETİMİ MODALI --- */}
      {showPrescriptionModal && selectedPatient && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg"> {/* Geniş Modal */}
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">
                    💊 İlaç Takibi: <span className="fw-bold">{selectedPatient.firstName} {selectedPatient.lastName}</span>
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowPrescriptionModal(false)}></button>
                </div>
                <div className="modal-body">
                  
                  {/* 1. Kısım: Yeni İlaç Ekleme Formu */}
                  <div className="card bg-light border-0 mb-4">
                    <div className="card-body">
                        <h6 className="card-title text-success mb-3">+ Yeni İlaç Tanımla</h6>
                        <div className="row g-3 align-items-end">
                            <div className="col-md-6">
                                <label className="form-label small">İlaç Seçiniz</label>
                                <select 
                                    className="form-select" 
                                    value={prescriptionForm.medicineId}
                                    onChange={(e) => setPrescriptionForm({...prescriptionForm, medicineId: e.target.value})}
                                >
                                    <option value="">-- Listeden Seç --</option>
                                    {allMedicines.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.name} (Kutu: {m.packageSize || 30} tb.)
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small">Günlük Kullanım (Adet)</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    min="1"
                                    value={prescriptionForm.dailyUsage}
                                    onChange={(e) => setPrescriptionForm({...prescriptionForm, dailyUsage: e.target.value})}
                                />
                            </div>
                            <div className="col-md-2">
                                <button className="btn btn-success w-100" onClick={handleAddMedicine}>Ekle</button>
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* 2. Kısım: Mevcut İlaçlar Listesi */}
                  <h6 className="mb-3">📋 Kullanılan İlaçlar ve Bitiş Tarihleri</h6>
                  <table className="table table-bordered align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>İlaç Adı</th>
                            <th>Kullanım</th>
                            <th>Başlangıç</th>
                            <th>Tahmini Bitiş</th>
                            <th>İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patientMedicines.map(pm => (
                            <tr key={pm.id}>
                                <td className="fw-bold">{pm.medicine?.name}</td>
                                <td>Günde {pm.dailyUsage} adet</td>
                                <td className="small text-muted">{new Date(pm.startDate).toLocaleDateString()}</td>
                                
                                {/* Bitiş Tarihi Hesabı */}
                                <td>
                                    <span className="fw-bold text-danger">
                                        {new Date(pm.estimatedEndDate).toLocaleDateString()}
                                    </span>
                                    <br/>
                                    <small className="text-muted">
                                        ({Math.ceil((new Date(pm.estimatedEndDate) - new Date()) / (1000 * 60 * 60 * 24))} gün kaldı)
                                    </small>
                                </td>
                                
                                <td>
                                    <button 
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleRemoveMedicine(pm.id)}
                                    >
                                        Kaldır
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {patientMedicines.length === 0 && (
                            <tr><td colSpan="5" className="text-center text-muted">Bu hastaya henüz ilaç tanımlanmamış.</td></tr>
                        )}
                    </tbody>
                  </table>

                </div>
              </div>
            </div>
        </div>
      )}
    </div>
  );
}