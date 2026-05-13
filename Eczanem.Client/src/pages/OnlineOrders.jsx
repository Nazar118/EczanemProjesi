import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function OnlineOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🎛️ FİLTRE VE SAYFALAMA STATE'LERİ
  const [filterStatus, setFilterStatus] = useState('All'); 
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5; // Her sayfada 5 sipariş görünsün

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://localhost:7203/api/Orders');
      const data = response.data?.$values || response.data || [];
      setOrders(data);
    } catch (error) {
      console.error("API Bağlantı Hatası:", error);
      toast.error("HATA: Siparişler API'sine ulaşılamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`https://localhost:7203/api/Orders/${id}/status`, `"${newStatus}"`, {
        headers: { 'Content-Type': 'application/json' }
      });
      toast.success(`✅ Sipariş durumu "${newStatus}" olarak güncellendi!`);
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error(error);
      toast.error("❌ İşlem başarısız oldu.");
    }
  };

  // 🔍 Müşteri Adını Akıllıca Bulma Fonksiyonu
  const getCustomerName = (user) => {
    if (!user) return "Misafir / Silinmiş Müşteri";
    const name = user.firstName || user.FirstName || user.name || user.Name;
    const surname = user.lastName || user.LastName || user.surname || user.Surname;
    
    if (name) return `${name} ${surname || ''}`.trim();
    if (user.email) return user.email.split('@')[0]; // İsim yoksa email'in başını göster
    return `Müşteri (#${user.id})`;
  };

  const formatPayment = (method) => {
    if (method === 'credit_card') return <span className="text-primary fw-bold">💳 Kredi Kartı</span>;
    if (method === 'cash') return <span className="text-success fw-bold">💵 Kapıda Ödeme</span>;
    return method;
  };

  // ✂️ FİLTRELEME VE SAYFALAMA İŞLEMLERİ (MATEMATİK)
  const filteredOrders = orders.filter(order => filterStatus === 'All' || order.status === filterStatus);
  
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Filtre değiştiğinde 1. sayfaya dön
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📦 Online Siparişler</h2>
        <button className="btn btn-primary fw-bold" onClick={loadOrders}>
          🔄 Listeyi Yenile
        </button>
      </div>

      {/* 🎛️ FİLTRELEME BUTONLARI */}
      <div className="d-flex gap-2 mb-3">
        <button className={`btn ${filterStatus === 'All' ? 'btn-dark' : 'btn-outline-dark'} fw-bold`} onClick={() => handleFilterChange('All')}>
          Tümü ({orders.length})
        </button>
        <button className={`btn ${filterStatus === 'Hazırlanıyor' ? 'btn-warning text-dark' : 'btn-outline-warning'} fw-bold`} onClick={() => handleFilterChange('Hazırlanıyor')}>
          ⏳ Bekleyenler ({orders.filter(o => o.status === 'Hazırlanıyor').length})
        </button>
        <button className={`btn ${filterStatus === 'Hazır' ? 'btn-success' : 'btn-outline-success'} fw-bold`} onClick={() => handleFilterChange('Hazır')}>
          ✅ Hazırlananlar ({orders.filter(o => o.status === 'Hazır').length})
        </button>
        <button className={`btn ${filterStatus === 'İptal Edildi' ? 'btn-danger' : 'btn-outline-danger'} fw-bold`} onClick={() => handleFilterChange('İptal Edildi')}>
          ✖️ İptaller ({orders.filter(o => o.status === 'İptal Edildi').length})
        </button>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-3">Sipariş No & Tarih</th>
                  <th>Müşteri Bilgisi</th>
                  <th>Sipariş İçeriği</th>
                  <th>Adres & Ödeme</th>
                  <th>Toplam Tutar</th>
                  <th>Durum</th>
                  <th className="text-center" style={{width: '160px'}}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center p-4">Yükleniyor...</td></tr>
                ) : currentOrders.length === 0 ? (
                  <tr><td colSpan="7" className="text-center p-5 text-muted">Bu filtreye uygun sipariş bulunamadı.</td></tr>
                ) : (
                  currentOrders.map(order => {
                    const items = order.orderItems?.$values || order.orderItems || [];
                    const customerName = getCustomerName(order.user);

                    return (
                      <tr key={order.id}>
                        {/* 00001 FORMATINDA ŞIK SİPARİŞ NO */}
                        <td className="ps-3">
                          <div className="fw-bold text-dark fs-6">#SP-{order.id.toString().padStart(5, '0')}</div>
                          <div className="small text-muted mt-1">
                            {new Date(order.orderDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' })}
                          </div>
                        </td>

                        {/* MÜŞTERİ BİLGİSİ */}
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex justify-content-center align-items-center fw-bold" style={{width: '35px', height: '35px', fontSize: '16px'}}>
                              {customerName.charAt(0).toUpperCase()}
                            </div>
                            <div className="fw-bold text-dark" style={{fontSize: '14px'}}>
                              {customerName}
                            </div>
                          </div>
                        </td>
                        
                        {/* DAHA KOMPAKT SİPARİŞ İÇERİĞİ */}
                        <td style={{ maxWidth: '300px' }}>
                          <div className="d-flex flex-column gap-1 my-1">
                            {items.map(item => (
                              <div key={item.id} className="d-flex align-items-center gap-2 border-bottom pb-1 mb-1">
                                <div style={{ width: '30px', height: '30px', backgroundColor: '#f8f9fa', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px', flexShrink: 0 }}>
                                  {item.product?.imageUrl ? (
                                    <img src={`https://localhost:7203${item.product.imageUrl}`} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                  ) : <span style={{ fontSize: '8px' }}>Yok</span>}
                                </div>
                                <div className="text-truncate" style={{ fontSize: '13px' }}>
                                  <span className="fw-bold text-dark">{item.product?.name}</span>
                                  <span className="text-danger fw-bold ms-1">x{item.quantity}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                        
                        {/* ADRES VE ÖDEME TİPİ */}
                        <td>
                          <div className="small text-truncate mb-1" style={{maxWidth: '180px'}} title={order.address}>
                            📍 {order.address}
                          </div>
                          <div className="small">
                            {formatPayment(order.paymentMethod)}
                          </div>
                        </td>

                        {/* TOPLAM TUTAR */}
                        <td className="fw-bold text-success fs-6">
                          {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(order.totalAmount)} ₺
                        </td>
                        
                        {/* DURUM ROZETİ */}
                        <td>
                          <span className={`badge ${order.status === 'Hazırlanıyor' ? 'bg-warning text-dark' : order.status === 'Hazır' ? 'bg-success' : 'bg-danger'}`}>
                            {order.status}
                          </span>
                        </td>
                        
                        {/* İŞLEM BUTONLARI */}
                        <td className="text-center">
                          {order.status === 'Hazırlanıyor' ? (
                            <div className="d-flex justify-content-center gap-1">
                              <button className="btn btn-sm btn-success fw-bold" onClick={() => updateStatus(order.id, 'Hazır')} title="Siparişi Hazırla">
                                Onayla
                              </button>
                              <button className="btn btn-sm btn-outline-danger fw-bold" onClick={() => { if(window.confirm('İptal edilsin mi?')) updateStatus(order.id, 'İptal Edildi') }}>
                                İptal
                              </button>
                            </div>
                          ) : order.status === 'Hazır' ? (
                            <span className="text-success fw-bold small">Hazırlandı ✔️</span>
                          ) : (
                            <span className="text-danger fw-bold small">İptal Edildi ✖️</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* 📄 SAYFALAMA (PAGINATION) ALANI */}
        {!loading && filteredOrders.length > ordersPerPage && (
          <div className="card-footer bg-white d-flex justify-content-between align-items-center">
            <span className="text-muted small">
              Toplam {filteredOrders.length} siparişten {indexOfFirstOrder + 1} - {Math.min(indexOfLastOrder, filteredOrders.length)} arası gösteriliyor.
            </span>
            <div className="btn-group">
              <button 
                className="btn btn-sm btn-outline-primary fw-bold" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                &laquo; Önceki
              </button>
              <span className="btn btn-sm btn-primary disabled fw-bold px-3">
                Sayfa {currentPage} / {totalPages}
              </span>
              <button 
                className="btn btn-sm btn-outline-primary fw-bold" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Sonraki &raquo;
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}