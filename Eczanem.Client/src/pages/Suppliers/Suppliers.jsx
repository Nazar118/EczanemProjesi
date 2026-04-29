import { useEffect, useState } from 'react';
import { getAllSuppliers, addSupplier, updateSupplier, deleteSupplier } from '../../services/supplierService';
import { toast } from 'react-toastify';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal ve Düzenleme State'leri
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form Verileri
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phoneNumber: "",
    address: ""
  });

  // Verileri Yükle
  const loadData = async () => {
    try {
      const data = await getAllSuppliers();
      setSuppliers(data);
    } catch (err) {
      console.error(err);  
      toast.error("Veriler yüklenemedi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // KAYDET
  const handleSave = async () => {
    if (!formData.name) {
      toast.warning("⚠️ Lütfen Firma Adını giriniz.");
      return;
    }

    try {
      if (isEditing) {
        await updateSupplier(currentId, { ...formData, id: currentId });
        toast.success("✅ Tedarikçi güncellendi!");
      } else {
        await addSupplier(formData);
        toast.success("✅ Yeni tedarikçi eklendi!");
      }
      setShowModal(false);
      loadData();
    } catch (error) {
        console.error(error);
      toast.error("❌ İşlem başarısız.");
    }
  };

  // SİL
  const handleDelete = async (id) => {
    if (window.confirm("Bu tedarikçiyi silmek istediğinize emin misiniz?")) {
      try {
        await deleteSupplier(id);
        toast.info("🗑️ Tedarikçi silindi.");
        loadData();
      } catch (error) {
        console.error(error);
        toast.error("❌ Silinemedi.");
      }
    }
  };

  const openEditModal = (sup) => {
    setFormData({ 
        name: sup.name, 
        contactPerson: sup.contactPerson, 
        email: sup.email,
        phoneNumber: sup.phoneNumber,
        address: sup.address
    });
    setCurrentId(sup.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const openAddModal = () => {
    setFormData({ name: "", contactPerson: "", email: "", phoneNumber: "", address: "" });
    setIsEditing(false);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🚛 Tedarikçi Yönetimi</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Yeni Tedarikçi
        </button>
      </div>

      {loading ? <p>Yükleniyor...</p> : (
        <div className="card shadow-sm border-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th>Firma Adı</th>
                <th>Yetkili Kişi</th>
                <th>İletişim</th>
                <th>Adres</th>
                <th style={{width: "150px"}}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(sup => (
                <tr key={sup.id}>
                  <td className="fw-bold text-primary">{sup.name}</td>
                  <td>{sup.contactPerson || "-"}</td>
                  <td>
                    <div className="small">
                        {sup.phoneNumber && <div>📞 {sup.phoneNumber}</div>}
                        {sup.email && <div>📧 {sup.email}</div>}
                    </div>
                  </td>
                  <td className="small text-muted" style={{maxWidth: "200px"}}>{sup.address || "-"}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(sup)}>✏️</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(sup.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
              {suppliers.length === 0 && (
                <tr><td colSpan="5" className="text-center py-4 text-muted">Henüz tedarikçi eklenmemiş.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <>
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{isEditing ? "Tedarikçiyi Düzenle" : "Yeni Tedarikçi Ekle"}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                        <label className="form-label">Firma Adı <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} placeholder="Örn: Hedef Ecza Deposu" />
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Yetkili Kişi</label>
                            <input type="text" className="form-control" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} placeholder="Ahmet Bey" />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Telefon</label>
                            <input type="text" className="form-control" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="0555..." />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">E-Posta</label>
                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Adres</label>
                        <textarea className="form-control" name="address" value={formData.address} onChange={handleInputChange} rows="2"></textarea>
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
        </>
      )}
    </div>
  );
}