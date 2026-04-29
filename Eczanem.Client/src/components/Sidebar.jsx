import { useState, useEffect } from 'react'; // useEffect'i kullanıyoruz
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getNotifications } from '../services/patientMedicineService'; // <-- 1. Servisi İmport Ettik

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  
  const [openMenu, setOpenMenu] = useState("");
  const [notificationCount, setNotificationCount] = useState(0); // <-- 2. Sayı için State

  // --- 3. Bildirim Sayısını Çek ---
  useEffect(() => {
    if (user) {
        getNotifications()
            .then(data => {
                // Gelen liste uzunluğu bizim bildirim sayımızdır
                setNotificationCount(data.length);
            })
            .catch(err => console.error("Bildirim sayısı alınamadı", err));
    }
  }, [user]); // user varsa çalışsın

  const handleLogout = () => {
    if(window.confirm("Çıkış yapmak istiyor musunuz?")) {
        localStorage.removeItem("user");
        toast.info("Güle güle! 👋");
        navigate("/login");
        window.location.reload();
    }
  };

  const toggleMenu = (menuName) => {
    if (openMenu === menuName) {
        setOpenMenu(""); 
    } else {
        setOpenMenu(menuName); 
    }
  };

  if (!user) return null;

  // --- ROL KONTROLLERİ ---
  const isAdmin = user.role === 'admin';
  const isEczaci = user.role === 'eczaci';

  return (
    <div className="bg-dark text-white d-flex flex-column justify-content-between" 
         style={{ width: "260px", minHeight: "100vh", position: "sticky", top: 0 }}>
      
      <div className="p-3">
        <h3 className="mb-4 text-warning fw-bold ps-2">💊 Eczanem Pro</h3>
        
        {/* PROFİL KARTI */}
        <div className="p-3 mb-4 bg-secondary bg-opacity-25 rounded border border-secondary d-flex align-items-center gap-3">
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: "40px", height: "40px", fontSize: "1.2rem"}}>
            {user.name.charAt(0)}
          </div>
          <div style={{lineHeight: "1.2"}}>
            <small className="text-light opacity-75" style={{fontSize: "0.8rem"}}>Hoşgeldin,</small><br/>
            <strong>{user.name}</strong>
            <span className="badge bg-info d-block mt-1" style={{fontSize: "0.65rem"}}>{user.role.toUpperCase()}</span>
          </div>
        </div>

        <ul className="nav flex-column gap-1">
          
          {/* 1. DASHBOARD (Admin) */}
          {isAdmin && (
            <li className="nav-item">
              <Link to="/" className="nav-link text-white d-flex align-items-center gap-2">
                📊 <span>Dashboard</span>
              </Link>
            </li>
          )}

          {/* 2. İLAÇ YÖNETİMİ (Herkes) */}
          <li className="nav-item">
            <div 
                className={`nav-link text-white d-flex justify-content-between align-items-center cursor-pointer ${openMenu === 'medicines' ? 'bg-secondary bg-opacity-50 rounded' : ''}`}
                onClick={() => toggleMenu('medicines')} 
                style={{cursor: 'pointer'}}
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

          {/* 3. STOK TAKİBİ (Admin + Eczacı) */}
          {(isAdmin || isEczaci) && (
            <li className="nav-item">
                <div 
                    className={`nav-link text-white d-flex justify-content-between align-items-center cursor-pointer ${openMenu === 'stocks' ? 'bg-secondary bg-opacity-50 rounded' : ''}`}
                    onClick={() => toggleMenu('stocks')}
                    style={{cursor: 'pointer'}}
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

          {/* 4. SATIŞ İŞLEMLERİ (Sadece Admin) */}
          {isAdmin && (
            <li className="nav-item">
                <div 
                    className={`nav-link text-white d-flex justify-content-between align-items-center cursor-pointer ${openMenu === 'sales' ? 'bg-secondary bg-opacity-50 rounded' : ''}`}
                    onClick={() => toggleMenu('sales')}
                    style={{cursor: 'pointer'}}
                >
                    <div className="d-flex align-items-center gap-2">💰 <span>Satış İşlemleri</span></div>
                    <small>{openMenu === 'sales' ? '▼' : '▶'}</small>
                </div>
                {openMenu === 'sales' && (
                    <ul className="list-unstyled ms-4 mt-1 border-start border-secondary ps-2">
                        <li><Link to="/sales" className="nav-link text-white-50 py-1 small">💸 Satış Yap</Link></li>
                        <li><Link to="/sales/history" className="nav-link text-white-50 py-1 small">📋 Satış Geçmişi</Link></li>
                        <li><Link to="/reports" className="nav-link text-white-50 py-1 small">📈 Raporlar</Link></li>
                        
                        {/* 👇 İŞTE YENİ EKLEDİĞİMİZ KISIM BURASI 👇 */}
                        <li className="mt-2">
                            <Link to="/online-orders" className="nav-link py-1 small text-warning fw-bold">
                                📦 Online Siparişler
                            </Link>
                        </li>
                        {/* 👆 YENİ KISIM SONU 👆 */}
                        
                    </ul>
                )}
            </li>
          )}

          {/* 5. HASTALAR (Herkes) */}
          <li className="nav-item">
            <div 
                className={`nav-link text-white d-flex justify-content-between align-items-center cursor-pointer ${openMenu === 'patients' ? 'bg-secondary bg-opacity-50 rounded' : ''}`}
                onClick={() => toggleMenu('patients')}
                style={{cursor: 'pointer'}}
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
            
          {/* 6. DİĞERLERİ */}
          <li className="nav-item mt-2 pt-2 border-top border-secondary">
             <Link to="/notifications" className="nav-link text-white d-flex align-items-center gap-2">
                🔔 <span>Bildirim Merkezi</span>
                
                {/* --- 4. DEĞİŞEN KISIM: DİNAMİK ROZET --- */}
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