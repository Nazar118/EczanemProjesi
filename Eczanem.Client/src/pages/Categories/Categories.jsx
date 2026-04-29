import { useEffect, useState } from 'react';
import { getAllCategories, addCategory, updateCategory, deleteCategory } from '../../services/categoryService';
import { toast } from 'react-toastify';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal ve Düzenleme State'leri
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form Verileri
  const [formData, setFormData] = useState({
    name: "",
    type: "İlaç Türü", // Varsayılan seçim
    description: ""
  });

  // Kategori Türleri (Senin Yönergene Göre)
  const categoryTypes = [
    "İlaç Türü",      // Tablet, Şurup...
    "Hastalık Grubu", // Diyabet, Tansiyon...
    "Özel Etiket"     // Soğuk Zincir, Reçeteli...
  ];

  const loadData = () => {
    getAllCategories()
      .then(data => {
        setCategories(data);
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
      toast.warning("⚠️ Lütfen kategori adını giriniz.");
      return;
    }

    try {
      if (isEditing) {
        await updateCategory(currentId, { ...formData, id: currentId });
        toast.success("✅ Kategori güncellendi!");
      } else {
        await addCategory(formData);
        toast.success("✅ Yeni kategori eklendi!");
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
    if (window.confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) {
      try {
        await deleteCategory(id);
        toast.info("🗑️ Kategori silindi.");
        loadData();
      } catch (error) {
        console.error(error);
        toast.error("❌ Silinemedi.");
      }
    }
  };

  // --- DÜZENLEME MODUNU AÇ ---
  const openEditModal = (cat) => {
    setFormData({ name: cat.name, type: cat.type, description: cat.description });
    setCurrentId(cat.id);
    setIsEditing(true);
    setShowModal(true);
  };

  // --- YENİ EKLEME MODUNU AÇ ---
  const openAddModal = () => {
    setFormData({ name: "", type: "İlaç Türü", description: "" });
    setIsEditing(false);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📂 Kategori Yönetimi</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Yeni Kategori
        </button>
      </div>

      {loading ? <p>Yükleniyor...</p> : (
        <div className="card shadow-sm border-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th>Kategori Adı</th>
                <th>Tür</th>
                <th>Açıklama</th>
                <th style={{width: "150px"}}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td className="fw-bold">{cat.name}</td>
                  <td>
                    {/* Türe göre farklı renk badge */}
                    <span className={`badge ${
                        cat.type === 'Hastalık Grubu' ? 'bg-danger' : 
                        cat.type === 'Özel Etiket' ? 'bg-warning text-dark' : 'bg-info'
                    }`}>
                        {cat.type}
                    </span>
                  </td>
                  <td className="text-muted small">{cat.description}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(cat)}>✏️</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(cat.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan="4" className="text-center py-4 text-muted">Henüz kategori eklenmemiş.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MODAL (POP-UP FORM) --- */}
      {showModal && (
        <>
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{isEditing ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                        <label className="form-label">Kategori Türü</label>
                        <select className="form-select" name="type" value={formData.type} onChange={handleInputChange}>
                            {categoryTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Kategori Adı</label>
                        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} placeholder="Örn: Ağrı Kesiciler" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Açıklama (Opsiyonel)</label>
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
        </>
      )}
    </div>
  );
}