import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getAllCategories } from '../../services/categoryService';

export default function VitrinProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal ve Düzenleme State'leri
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Verileri
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '', 
    stock: '',
    description: '',
    isBestSeller: false, 
    isRecommended: false
  });
  const [imageFile, setImageFile] = useState(null);

  // Sayfa yüklendiğinde verileri çek
  const loadData = async () => {
    setLoading(true);
    try {
      const allCategories = await getAllCategories();
      const vitrinCategories = allCategories.filter(c => c.type === 'Özel Etiket');
      setCategories(vitrinCategories);

      const productsRes = await axios.get('https://localhost:7203/api/Products');
      setProducts(productsRes.data);
    } catch (error) {
      console.error("Veriler çekilemedi:", error);
      toast.error("Veriler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Input Değişiklikleri
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Yeni Ürün Ekleme Modalını Aç
  const openAddModal = () => {
    setFormData({ 
      name: '', price: '', 
      categoryId: categories.length > 0 ? categories[0].id : '', 
      stock: '', description: '', 
      isBestSeller: false, isRecommended: false 
    });
    setImageFile(null);
    setIsEditing(false);
    setCurrentId(null);
    setShowModal(true);
  };

  // Düzenleme Modalını Aç
  const openEditModal = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      categoryId: product.categoryId,
      stock: product.stock,
      description: product.description || '',
      isBestSeller: product.isBestSeller || false,
      isRecommended: product.isRecommended || false
    });
    setImageFile(null); // Resmi yeniden seçmek isterse diye boş bırakıyoruz
    setIsEditing(true);
    setCurrentId(product.id);
    setShowModal(true);
  };

  // Form Gönderme (Ekleme ve Güncelleme)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Düzenleme modunda değilsek resim zorunludur
    if (!formData.name || !formData.price || !formData.categoryId || (!isEditing && !imageFile)) {
      return toast.warning("⚠️ Lütfen gerekli alanları doldurun ve resim seçin!");
    }

    setIsSubmitting(true);
    
    // FormData oluştur
    const submitData = new FormData();
    submitData.append('Name', formData.name);
    submitData.append('Price', formData.price);
    submitData.append('CategoryId', formData.categoryId);
    submitData.append('Stock', formData.stock);
    submitData.append('Description', formData.description);
    submitData.append('IsBestSeller', formData.isBestSeller);
    submitData.append('IsRecommended', formData.isRecommended);
    
    // Eğer yeni resim seçilmişse onu da ekle (Düzenlemede seçilmeyebilir)
    if (imageFile) {
        submitData.append('ImageFile', imageFile); 
    }

    try {
      if (isEditing) {
        // GÜNCELLEME İŞLEMİ (PUT)
        await axios.put(`https://localhost:7203/api/Products/${currentId}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("✅ Ürün başarıyla güncellendi!");      
      } else {
        // YENİ EKLEME İŞLEMİ (POST)
        await axios.post('https://localhost:7203/api/Products/upload', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("✅ Vitrin ürünü başarıyla eklendi!");      
      }
      
      setShowModal(false); 
      loadData(); 
    } catch (error) {
      console.error("Hata:", error);
      toast.error("❌ İşlem sırasında bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ürün Silme İşlemi
  const handleDelete = async (id) => {
    if(window.confirm("Bu ürünü tamamen silmek istediğinize emin misiniz?")) {
      try {
        await axios.delete(`https://localhost:7203/api/Products/${id}`);
        toast.info("🗑️ Ürün başarıyla silindi.");
        loadData();
      } catch (error) {
        console.error("Silme Hatası:", error);
        toast.error("❌ Ürün silinemedi.");
      }
    }
  };

  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : "Bilinmiyor";
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🛍️ Vitrin Ürünleri</h2>
        <button className="btn btn-warning fw-bold" onClick={openAddModal}>
          + Yeni Ürün Ekle
        </button>
      </div>

      {loading ? <p>Yükleniyor...</p> : (
        <div className="card shadow-sm border-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th>Görsel</th>
                <th>Ürün Adı</th>
                <th>Kategori</th>
                <th>Fiyat & Stok</th>
                <th>Vitrin Durumu</th>
                <th style={{width: "150px"}}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    {product.imageUrl ? (
                      <img src={`https://localhost:7203${product.imageUrl}`} alt="Ürün" style={{width: '50px', height: '50px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #eee', padding: '2px', backgroundColor: '#fff'}} />
                    ) : (
                      <div style={{width: '50px', height: '50px', backgroundColor: '#eee', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize:'10px', color:'#aaa'}}>Görsel Yok</div>
                    )}
                  </td>
                  <td className="fw-bold">{product.name}</td>
                  <td>
                     <span className={`badge ${getCategoryName(product.categoryId) === 'Bilinmiyor' ? 'bg-danger' : 'bg-secondary'}`}>
                        {getCategoryName(product.categoryId)}
                     </span>
                  </td>
                  <td>
                    <div className="text-success fw-bold">{product.price} ₺</div>
                    <small className="text-muted">Stok: {product.stock}</small>
                  </td>
                  <td>
                    <div className="d-flex flex-column gap-1">
                      {product.isBestSeller && <span className="badge bg-danger">🔥 Çok Satan</span>}
                      {product.isRecommended && <span className="badge bg-warning text-dark">⭐ Seçtiklerimiz</span>}
                      {!product.isBestSeller && !product.isRecommended && <span className="text-muted small">-</span>}
                    </div>
                  </td>
                  <td>
                    {/* 🔥 DÜZENLEME BUTONU EKLENDİ 🔥 */}
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(product)}>✏️</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(product.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && <tr><td colSpan="6" className="text-center py-4">Henüz vitrin ürünü eklenmemiş.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MODAL (POP-UP) --- */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)', overflowY: 'auto' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">🛍️ {isEditing ? "Ürünü Düzenle" : "Yeni Vitrin Ürünü Ekle"}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Ürün Adı</label>
                      <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} placeholder="Örn: Solante Güneş Kremi" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Fiyat (₺)</label>
                      <input type="number" step="0.01" className="form-control" name="price" value={formData.price} onChange={handleInputChange} placeholder="Örn: 450.50" required />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Kategori Seçimi</label>
                      <select className="form-select" name="categoryId" value={formData.categoryId} onChange={handleInputChange} required>
                        <option value="">Seçiniz...</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Stok Adedi</label>
                      <input type="number" className="form-control" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="Örn: 50" required />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Ürün Açıklaması</label>
                    <textarea className="form-control" name="description" rows="3" value={formData.description} onChange={handleInputChange} placeholder="Ürün hakkında kısa bilgi..."></textarea>
                  </div>

                  <div className="row mb-4 bg-light p-3 rounded border">
                    <div className="col-md-6">
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" name="isBestSeller" checked={formData.isBestSeller} onChange={handleCheckboxChange} />
                        <label className="form-check-label fw-bold">🔥 "Çok Satanlar" Vitrinine Ekle</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" name="isRecommended" checked={formData.isRecommended} onChange={handleCheckboxChange} />
                        <label className="form-check-label fw-bold">⭐ "Sizin İçin Seçtiklerimiz"</label>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold text-danger">📸 Ürün Görseli Seç {isEditing && "(Opsiyonel)"}</label>
                    <input type="file" className="form-control form-control-lg" accept="image/*" onChange={handleImageChange} required={!isEditing} />
                    {isEditing && <small className="text-muted">Görseli değiştirmek istemiyorsanız boş bırakın.</small>}
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>İptal</button>
                    <button type="submit" className="btn btn-success" disabled={isSubmitting || categories.length === 0}>
                      {isSubmitting ? 'Kaydediliyor...' : (isEditing ? 'Değişiklikleri Kaydet' : 'Ürünü Ekle')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}