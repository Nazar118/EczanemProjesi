import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddVitrinProduct = () => {
  const [loading, setLoading] = useState(false);
  
  // Form verilerini tutacağımız state (Virgül hatası düzeltildi)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '2', 
    stock: '',
    description: '', // <-- Virgül eklendi
    isBestSeller: false, 
    isRecommended: false
  });
  
  const [imageFile, setImageFile] = useState(null);

  // Metin kutuları için
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // CHECKBOX'LAR İÇİN EKLENEN YENİ METOT (Buraya yerleştirdik)
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  // Resim seçimi için
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !imageFile) {
      toast.warning("Lütfen ürün adı, fiyatı ve resmini boş bırakmayın!");
      return;
    }

    setLoading(true);

    const submitData = new FormData();
    submitData.append('Name', formData.name);
    submitData.append('Price', formData.price);
    submitData.append('CategoryId', formData.categoryId);
    submitData.append('Stock', formData.stock);
    submitData.append('Description', formData.description);
    submitData.append('ImageFile', imageFile); 
    // Checkbox verilerini gönderiyoruz
    submitData.append('IsBestSeller', formData.isBestSeller);
    submitData.append('IsRecommended', formData.isRecommended);

    try {
      await axios.post('https://localhost:7203/api/Products/upload', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success("Vitrin ürünü başarıyla eklendi! 🎉");      
      
      // Formu temizle (Checkbox'ları da sıfırlıyoruz)
      setFormData({ name: '', price: '', categoryId: '2', stock: '', description: '', isBestSeller: false, isRecommended: false });
      setImageFile(null);
      e.target.reset(); 
      
    } catch (error) {
      console.error("Hata:", error);
      toast.error("Ürün eklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">🛍️ Yeni Vitrin Ürünü Ekle (Mobil Uygulama İçin)</h4>
        </div>
        <div className="card-body">
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
                <select className="form-select" name="categoryId" value={formData.categoryId} onChange={handleInputChange}>
                  <option value="1">Reçeteli İlaç (Mobilde Görünmez)</option>
                  <option value="2">Vitamin & Takviye</option>
                  <option value="3">Dermokozmetik</option>
                  <option value="4">Anne & Bebek</option>
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
                  <label className="form-check-label fw-bold">⭐ "Sizin İçin Seçtiklerimiz" Vitrinine Ekle</label>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold text-danger">📸 Ürün Görseli Seç</label>
              <input type="file" className="form-control form-control-lg" accept="image/*" onChange={handleImageChange} required />
              <small className="text-muted">Lütfen kare formatta (jpg, png) görseller tercih edin.</small>
            </div>

            <button type="submit" className="btn btn-success btn-lg w-100" disabled={loading}>
              {loading ? 'Yükleniyor...' : 'Ürünü Vitrine Kaydet'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVitrinProduct;