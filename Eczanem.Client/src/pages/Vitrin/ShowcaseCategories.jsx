import { useEffect, useState } from 'react';
import { getAllCategories, addCategory, updateCategory, deleteCategory } from '../../services/categoryService';
import { toast } from 'react-toastify';

export default function ShowcaseCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "Özel Etiket", // 🔥 Sabitlendi. Eczacı bunu değiştiremez.
    description: "",
    icon: "gridOutline",  
    colorHex: "#f3f4f6"   
  });

  const availableIcons = [
    { value: "gridOutline", label: "Kareler (Varsayılan)" },
    { value: "leafOutline", label: "Yaprak (Vitamin/Doğal)" },
    { value: "heartOutline", label: "Kalp (Dermo/Kozmetik)" },
    { value: "medkitOutline", label: "Çanta (Sağlık/Medikal)" },
    { value: "happyOutline", label: "Gülücük (Anne/Bebek)" },
    { value: "nutritionOutline", label: "Elma (Spor/Beslenme)" },
    { value: "waterOutline", label: "Su Damlası (Bakım)" }
  ];

  const loadData = () => {
    getAllCategories()
      .then(data => {
        // 🔥 SADECE VİTRİN KATEGORİLERİNİ LİSTELE
        const filtered = data.filter(c => c.type === 'Özel Etiket');
        setCategories(filtered);
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

  const handleSave = async () => {
    if (!formData.name) return toast.warning("⚠️ Lütfen kategori adını giriniz.");
    try {
      if (isEditing) {
        await updateCategory(currentId, { ...formData, id: currentId });
        toast.success("✅ Vitrin Kategorisi güncellendi!");
      } else {
        await addCategory(formData); // type zaten form statende 'Özel Etiket' olarak gidecek
        toast.success("✅ Yeni Vitrin Kategorisi eklendi!");
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("❌ İşlem başarısız.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu vitrin kategorisini silmek istediğinize emin misiniz?")) {
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

  const openEditModal = (cat) => {
    setFormData({ 
      name: cat.name, 
      type: "Özel Etiket", 
      description: cat.description,
      icon: cat.icon || "gridOutline",      
      colorHex: cat.colorHex || "#f3f4f6"   
    });
    setCurrentId(cat.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const openAddModal = () => {
    setFormData({ name: "", type: "Özel Etiket", description: "", icon: "gridOutline", colorHex: "#f3f4f6" });
    setIsEditing(false);
    setShowModal(true);
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🛍️ Vitrin Kategori Yönetimi</h2>
        <button className="btn btn-warning fw-bold" onClick={openAddModal}>+ Yeni Vitrin Ekle</button>
      </div>

      {loading ? <p>Yükleniyor...</p> : (
        <div className="card shadow-sm border-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th>Vitrin Adı</th>
                <th>Mobil Görünüm (Renk/İkon)</th>
                <th>Açıklama</th>
                <th style={{width: "150px"}}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td className="fw-bold">{cat.name}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: '24px', height: '24px', backgroundColor: cat.colorHex || '#f3f4f6', borderRadius: '4px', border: '1px solid #ccc' }}></div>
                      <span className="small text-muted">{cat.icon || 'gridOutline'}</span>
                    </div>
                  </td>
                  <td className="text-muted small">{cat.description}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(cat)}>✏️</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(cat.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && <tr><td colSpan="4" className="text-center py-4">Vitrin kategorisi yok.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isEditing ? "Vitrin Düzenle" : "Yeni Vitrin Ekle"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                    <label className="form-label">Vitrin Adı (Kozmetik, Vitamin vb.)</label>
                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} />
                </div>
                <div className="row mb-3">
                  <div className="col-8">
                    <label className="form-label">Mobil Vitrin İkonu</label>
                    <select className="form-select" name="icon" value={formData.icon} onChange={handleInputChange}>
                        {availableIcons.map(icon => <option key={icon.value} value={icon.value}>{icon.label}</option>)}
                    </select>
                  </div>
                  <div className="col-4">
                    <label className="form-label">Arka Plan Rengi</label>
                    <input type="color" className="form-control form-control-color w-100" name="colorHex" value={formData.colorHex} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Açıklama</label>
                    <textarea className="form-control" name="description" value={formData.description} onChange={handleInputChange} rows="2"></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>İptal</button>
                <button className="btn btn-success" onClick={handleSave}>Kaydet</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}