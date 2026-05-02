import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getNotifications } from '../services/patientMedicineService';

export default function Sidebar() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  const [openMenu, setOpenMenu] = useState("");
  const [notificationCount, setNotificationCount] = useState(0); 

  useEffect(() => {
    if (user) {
        getNotifications()
            .then(data => {
                setNotificationCount(data.length);
            })
            .catch(err => console.error("Bildirim alınamadı", err));
    }
  }, [user]);

  const handleLogout = () => {
    if(window.confirm("Çıkış yapmak istiyor musunuz?")) {
        localStorage.removeItem("user");
        toast.info("Güle güle! 👋");
        navigate("/login");
        window.location.reload();
    }
  };

  const toggleMenu = (menuName) => {
    setOpenMenu(prev => prev === menuName ? "" : menuName);
  };

  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const isEczaci = user.role === 'eczaci';

  return (
    <div className="bg-dark text-white d-flex flex-column justify-content-between" style={{ width: "260px", minHeight: "100vh", position: "sticky", top: 0 }}>
      
      <div className="p-3">
        <h3 className="mb-4 text-warning fw-bold ps-2">💊 Eczanem Pro</h3>
        
        <div className="p-3 mb-4 bg-secondary bg-opacity-25 rounded border border-secondary d-flex align-items-center gap-3">
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: "40px", height: "40px", fontSize: "1.2rem"}}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{lineHeight: "1.2"}}>
            <small className="text-light opacity-75" style={{fontSize: "0.8rem"}}>Hoşgeldin,</small><br/>
            <strong>{user.name}</strong>
            <span className="badge bg-info d-block mt-1" style={{fontSize: "0.65rem"}}>{user.role.toUpperCase()}</span>
          </div>
        </div>

        <ul className="nav flex-column gap-1">
          
          {isAdmin && (
            <li className="nav-item">
              <Link to="/" className="nav-link text-white d-flex align-items-center gap-2">
                📊 <span>Dashboard</span>
              </Link>
            </li>
          )}

          <li className="nav-item">
            <div 
                className={`nav-link text-white d-flex justify-content-between align-items-center cursor-pointer ${openMenu === 'medicines' ? 'bg-secondary bg-opacity-50 rounded' : ''}`}
                onClick={() => toggleMenu('medicines')} 
            >
                <div className="d-flex align-items-center gap-2">💊 <span>İlaç Yönetimi</span></div>
                <small>{openMenu === 'medicines' ? '▼' : '▶'}</small>
            </div>
            
            {openMenu === 'medicines' && (
                <ul className="list-unstyled ms-4 mt-1 border-start border-secondary ps-2">
                    <li><Link to="/medicines" className="nav-link text-white-50 py-1 small">💊 İlaç Listesi</Link></li>
                    <li><Link to="/categories" className="nav-link text-white-50 py-1 small">📂 Kategoriler</Link></li>
                    <li><Link to="/suppliers" className="nav-link text-white-50 py-1 small">🚛 Tedarikçiler</Link></li>
                    <li><Link to="/expiry" className="nav-link text-white-50 py-1 small">⏳ SKT Takibi</Link></li>
                </ul>
            )}
          </li>

          {(isAdmin || isEczaci) && (
            <li className="nav-item">
                <div 
                    className={`nav-link text-white d-flex justify-content-between align-items-center cursor-pointer ${openMenu === 'stocks' ? 'bg-secondary bg-opacity-50 rounded' : ''}`}
                    onClick={() => toggleMenu('stocks')}
                >
                    <div className="d-flex align-items-center gap-2">📦 <span>Stok Takibi</span></div>
                    <small>{openMenu === 'stocks' ? '▼' : '▶'}</small>
                </div>
                {openMenu === 'stocks' && (
                    <ul className="list-unstyled ms-4 mt-1 border-start border-secondary ps-2">
                        <li><Link to="/stocks" className="nav-link text-white-50 py-1 small">📦 Stok Listesi</Link></li>
                        <li><Link to="/stocks/critical" className="nav-link text-white-50 py-1 small">⚠️ Kritik Stoklar</Link></li>
                        <li><Link to="/stocks/history" className="nav-link text-white-50 py-1 small">🔄 Giriş/Çıkış</Link></li>
                    </ul>
                )}
            </li>
          )}

          {isAdmin && (
            <li className="nav-item">
                <div 
                    className={`nav-link text-white d-flex justify-content-between align-items-center cursor-pointer ${openMenu === 'vitrin' ? 'bg-secondary bg-opacity-50 rounded' : ''}`}
                    onClick={() => toggleMenu('vitrin')}
                >
                    <div className="d-flex align-items-center gap-2">🛍️ <span>Vitrin Yönetimi</span></div>
                    <small>{openMenu === 'vitrin' ? '▼' : '▶'}</small>
                </div>
                {openMenu === 'vitrin' && (
                    <ul className="list-unstyled ms-4 mt-1 border-start border-secondary ps-2">
                        <li>
                            <Link to="/vitrin-kategorileri" className="nav-link text-white-50 py-1 small">
                                🛍️ Kategorileri Yönet
                            </Link>
                        </li>
                        <li>
                            <Link to="/vitrin/add" className="nav-link text-warning py-1 small fw-bold">
                                ➕ Yeni Ürün Ekle
                            </Link>
                        </li>
                        <li>
                            <Link to="/online-orders" className="nav-link text-white-50 py-1 small">
                                📦 Online Siparişler
                            </Link>
                        </li>
                    </ul>
                )}
            </li>
          )}

          {isAdmin && (
            <li className="nav-item">
                <div 
                    className={`nav-link text-white d-flex justify-content-between align-items-center cursor-pointer ${openMenu === 'sales' ? 'bg-secondary bg-opacity-50 rounded' : ''}`}
                    onClick={() => toggleMenu('sales')}
                >
                    <div className="d-flex align-items-center gap-2">💰 <span>Satış İşlemleri</span></div>
                    <small>{openMenu === 'sales' ? '▼' : '▶'}</small>
                </div>
                {openMenu === 'sales' && (
                    <ul className="list-unstyled ms-4 mt-1 border-start border-secondary ps-2">
                        <li><Link to="/sales" className="nav-link text-white-50 py-1 small">💸 Satış Yap</Link></li>
                        <li><Link to="/sales/history" className="nav-link text-white-50 py-1 small">📋 Satış Geçmişi</Link></li>
                        <li><Link to="/reports" className="nav-link text-white-50 py-1 small">📈 Raporlar</Link></li>
                    </ul>
                )}
            </li>
          )}

          <li className="nav-item">
            <div 
                className={`nav-link text-white d-flex justify-content-between align-items-center cursor-pointer ${openMenu === 'patients' ? 'bg-secondary bg-opacity-50 rounded' : ''}`}
                onClick={() => toggleMenu('patients')}
            >
                <div className="d-flex align-items-center gap-2">👥 <span>Hastalar</span></div>
                <small>{openMenu === 'patients' ? '▼' : '▶'}</small>
            </div>
            {openMenu === 'patients' && (
                <ul className="list-unstyled ms-4 mt-1 border-start border-secondary ps-2">
                    <li><Link to="/patients" className="nav-link text-white-50 py-1 small">👥 Hasta Listesi</Link></li>
                    <li><Link to="/patients/chronic" className="nav-link text-white-50 py-1 small">❤️ Kronik Hastalıklar</Link></li>
                </ul>
            )}
          </li>
            
          <li className="nav-item mt-2 pt-2 border-top border-secondary">
             <Link to="/notifications" className="nav-link text-white d-flex align-items-center gap-2">
                🔔 <span>Bildirim Merkezi</span>
                {notificationCount > 0 && (
                    <span className="badge bg-danger rounded-pill ms-auto">
                        {notificationCount}
                    </span>
                )}
             </Link>
          </li>
          
          {isAdmin && (
             <li className="nav-item">
                <Link to="/settings" className="nav-link text-white d-flex align-items-center gap-2">
                    ⚙️ <span>Ayarlar</span>
                </Link>
             </li>
          )}

        </ul>
      </div>

      <div className="p-3">
          <button onClick={handleLogout} className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2">
            🚪 Çıkış Yap
          </button>
      </div>
    </div>
  );
}