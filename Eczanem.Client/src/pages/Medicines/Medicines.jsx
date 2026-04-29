import { useEffect, useState, useCallback } from 'react';
import { getAllMedicines, addMedicine, deleteMedicine, updateMedicine } from '../../services/medicineService';
import { getAllCategories } from '../../services/categoryService'; 
import { getAllSuppliers } from '../../services/supplierService'; 
import { toast } from 'react-toastify';

export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [suppliers, setSuppliers] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [newMedicine, setNewMedicine] = useState({
    name: "",
    barcode: "",
    manufacturer: "",
    price: 0,
    stock: 0,
    categoryId: "",
    supplierId: "",
    expirationDate: new Date().toISOString().split('T')[0],
    packageSize: 30 // <-- 1. DEĞİŞİKLİK: Varsayılan Kutu İçi Adet
  });

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [medsData, catsData, supsData] = await Promise.all([
          getAllMedicines(), 
          getAllCategories(),
          getAllSuppliers()
      ]);
      setMedicines(medsData);
      setCategories(catsData);
      setSuppliers(supsData);
    } catch (err) {
      console.error(err);
      toast.error("Veriler yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // 2. DEĞİŞİKLİK: packageSize alanını da sayı olarak işle
    if (name === "price" || name === "stock" || name === "categoryId" || name === "supplierId" || name === "packageSize") {
        setNewMedicine({ ...newMedicine, [name]: value ? Number(value) : "" });
    } else {
        setNewMedicine({ ...newMedicine, [name]: value });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu ilacı silmek istediğinize emin misiniz?")) {
      try {
        await deleteMedicine(id);
        toast.info("🗑️ İlaç başarıyla silindi.");
        fetchAllData();
      } catch (error) {
        console.error(error);
        toast.error("❌ Silinirken hata oluştu!");
      }
    }
  };

  const handleEdit = (medicine) => {
    setNewMedicine({ 
      name: medicine.name, 
      barcode: medicine.barcode, 
      manufacturer: medicine.manufacturer,
      price: medicine.price,
      stock: medicine.stock,
      categoryId: medicine.categoryId || "",
      supplierId: medicine.supplierId || "",
      expirationDate: medicine.expirationDate ? medicine.expirationDate.split('T')[0] : "",
      packageSize: medicine.packageSize || 30 // <-- 3. DEĞİŞİKLİK: Düzenlerken veriyi çek
    });
    setCurrentId(medicine.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setNewMedicine({ 
        name: "", barcode: "", manufacturer: "", price: 0, stock: 0, categoryId: "", supplierId: "", 
        expirationDate: new Date().toISOString().split('T')[0],
        packageSize: 30 // <-- 4. DEĞİŞİKLİK: Yeni eklerken 30'a eşitle
     });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleSave = async () => {
    if(!newMedicine.name || !newMedicine.barcode) {
      toast.warning("⚠️ Lütfen İlaç Adı ve Barkod alanlarını doldurun!");
      return;
    }

    try {
      if (isEditing) {
        await updateMedicine(currentId, newMedicine);
        toast.success("✅ İlaç güncellendi!");
      } else {
        await addMedicine(newMedicine);
        toast.success("✅ Yeni ilaç eklendi!");
      }
      setShowModal(false);
      fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error("❌ İşlem başarısız.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>💊 İlaç Listesi</h2>
        <button className="btn btn-success" onClick={handleAddNew}>
          + Yeni İlaç Ekle
        </button>
      </div>

      {loading ? (
        <p className="text-center">Yükleniyor...</p>
      ) : (
        <div className="card shadow-sm">
          <table className="table table-hover table-striped mb-0 align-middle">
            <thead className="bg-light">
              <tr>
                <th>İlaç Adı</th>
                <th>Kategori</th>
                <th>Tedarikçi</th> 
                <th>Kutu İçi</th> {/* <-- 5. DEĞİŞİKLİK: Tabloya başlık ekledim */}
                <th>Stok</th>
                <th>Fiyat</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((medicine) => (
                <tr key={medicine.id}>
                  <td className="fw-bold">{medicine.name}</td>
                  
                  <td>
                    {medicine.category ? (
                        <span className="badge bg-info text-dark">{medicine.category.name}</span>
                    ) : <span className="text-muted small">-</span>}
                  </td>

                  <td>
                    {medicine.supplier ? (
                        <span className="text-primary fw-bold small">🚛 {medicine.supplier.name}</span>
                    ) : <span className="text-muted small">-</span>}
                  </td>

                  {/* Kutu İçi Adet Gösterimi */}
                  <td><span className="badge bg-secondary">{medicine.packageSize || 30} Tb.</span></td>

                  <td>
                    <span className={`badge ${medicine.stock < 10 ? 'bg-danger' : 'bg-success'}`}>
                        {medicine.stock} Kutu
                    </span>
                  </td>
                  <td className="fw-bold text-success">{medicine.price} ₺</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(medicine)}>✏️</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(medicine.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
              {medicines.length === 0 && <tr><td colSpan="7" className="text-center py-3">Kayıtlı ilaç yok.</td></tr>}
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
                  <h5 className="modal-title">{isEditing ? "İlacı Düzenle" : "Yeni İlaç Ekle"}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">İlaç Adı</label>
                      <input type="text" className="form-control" name="name" value={newMedicine.name} onChange={handleInputChange} />
                    </div>
                    
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Kategori</label>
                            <select className="form-select" name="categoryId" value={newMedicine.categoryId} onChange={handleInputChange}>
                                <option value="">-- Seçiniz --</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Tedarikçi Firması</label>
                            <select className="form-select" name="supplierId" value={newMedicine.supplierId} onChange={handleInputChange}>
                                <option value="">-- Seçiniz --</option>
                                {suppliers.map(sup => (
                                    <option key={sup.id} value={sup.id}>{sup.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Barkod</label>
                      <input type="text" className="form-control" name="barcode" value={newMedicine.barcode} onChange={handleInputChange} />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Üretici / Marka (Opsiyonel)</label>
                      <input type="text" className="form-control" name="manufacturer" value={newMedicine.manufacturer} onChange={handleInputChange} />
                    </div>

                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Satış Fiyatı (₺)</label>
                            <input type="number" className="form-control" name="price" value={newMedicine.price} onChange={handleInputChange} />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Stok (Kutu)</label>
                            <input type="number" className="form-control" name="stock" value={newMedicine.stock} onChange={handleInputChange} />
                        </div>
                        
                        {/* --- 6. DEĞİŞİKLİK: YENİ INPUT BURADA --- */}
                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold text-primary">Kutu İçi Adet</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                name="packageSize" 
                                value={newMedicine.packageSize} 
                                onChange={handleInputChange} 
                                placeholder="30"
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                       <label className="form-label">Son Kullanma Tarihi (SKT)</label>
                       <input 
                           type="date" 
                           className="form-control" 
                           name="expirationDate" 
                           value={newMedicine.expirationDate} 
                           onChange={handleInputChange} 
                       />
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