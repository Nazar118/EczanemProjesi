import { useEffect, useState } from 'react';
import { getAllDiseases, addDisease, updateDisease, deleteDisease } from '../../services/chronicDiseaseService';
import { toast } from 'react-toastify';

export default function ChronicDiseases() {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal ve Düzenleme State'leri
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form Verileri
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const loadData = () => {
    getAllDiseases()
      .then(data => {
        setDiseases(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error("Veriler yüklenemedi!");
        setLoading(false);
      });
  };

  useEffect(() => { loadData(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- KAYDETME İŞLEMİ ---
  const handleSave = async () => {
    if (!formData.name) {
      toast.warning("⚠️ Lütfen hastalık adını giriniz.");
      return;
    }

    try {
      if (isEditing) {
        await updateDisease(currentId, { ...formData, id: currentId });
        toast.success("✅ Hastalık güncellendi!");
      } else {
        await addDisease(formData);
        toast.success("✅ Yeni hastalık eklendi!");
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error(error);  
      toast.error("❌ İşlem başarısız.");
    }
  };

  // --- SİLME İŞLEMİ ---
  const handleDelete = async (id) => {
    if (window.confirm("Bu hastalığı silmek istediğinize emin misiniz?")) {
      try {
        await deleteDisease(id);
        toast.info("🗑️ Hastalık silindi.");
        loadData();
      } catch (error) {
        console.error(error);
        toast.error("❌ Silinemedi.");
      }
    }
  };

  // --- MODAL AÇ ---
  const openEditModal = (disease) => {
    setFormData({ name: disease.name, description: disease.description });
    setCurrentId(disease.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const openAddModal = () => {
    setFormData({ name: "", description: "" });
    setIsEditing(false);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🩺 Kronik Hastalık Tanımları</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Yeni Hastalık Ekle
        </button>
      </div>

      {loading ? <p>Yükleniyor...</p> : (
        <div className="card shadow-sm border-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th>Hastalık Adı</th>
                <th>Açıklama</th>
                <th style={{width: "150px"}}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {diseases.map(dis => (
                <tr key={dis.id}>
                  <td className="fw-bold text-danger">{dis.name}</td>
                  <td className="text-muted small">{dis.description || "-"}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(dis)}>✏️</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(dis.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
              {diseases.length === 0 && (
                <tr><td colSpan="3" className="text-center py-4 text-muted">Henüz hastalık tanımı yapılmamış.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MODAL --- */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{isEditing ? "Hastalığı Düzenle" : "Yeni Hastalık Tanımla"}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                        <label className="form-label">Hastalık Adı</label>
                        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} placeholder="Örn: Diyabet (Tip 2)" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Açıklama</label>
                        <textarea className="form-control" name="description" value={formData.description} onChange={handleInputChange} rows="2"></textarea>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>İptal</button>
                  <button className="btn btn-success" onClick={handleSave}>{isEditing ? "Güncelle" : "Kaydet"}</button>
                </div>
              </div>
            </div>
        </div>
      )}
    </div>
  );
}