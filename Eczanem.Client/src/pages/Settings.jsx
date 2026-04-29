import { useState } from 'react'; 
import { toast } from 'react-toastify';
import { changePassword, updateUserProfile } from '../services/authService'; // <-- updateUserProfile eklendi

export default function Settings() {
  // LocalStorage'dan veriyi al
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const [user, setUser] = useState(storedUser);

  // Form State'leri
  const [profileData, setProfileData] = useState({
    name: storedUser.name || "",
    email: storedUser.email || "", // Artık veritabanından gelen gerçek maili kullanacağız
    role: storedUser.role || ""
  });

  const [passData, setPassData] = useState({
    currentPass: "",
    newPass: "",
    confirmPass: ""
  });

  // --- PROFİL GÜNCELLEME (ARTIK GERÇEK!) ---
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    // ID Kontrolü
    const userId = user.id || user.Id;
    if (!userId) {
        toast.error("Kullanıcı ID bulunamadı.");
        return;
    }

    try {
        // 1. Backend'e gönder ve veritabanını güncelle
        const updatedUserFromBackend = await updateUserProfile(userId, profileData.name, profileData.email);

        // 2. Gelen güncel veriyi (rol, token vs. kaybolmasın diye eskisiyle birleştirip) LocalStorage'a kaydet
        // Not: Backend'den şifre null dönebilir, o yüzden mevcut user'ın bazı bilgilerini korumak iyidir.
        const finalUserObject = { ...user, ...updatedUserFromBackend };
        
        localStorage.setItem("user", JSON.stringify(finalUserObject));
        setUser(finalUserObject);

        toast.success("✅ Profil ve E-posta başarıyla güncellendi!");
        
        // Sidebar'ın güncellenmesi için sayfayı yenile
        setTimeout(() => window.location.reload(), 1000);

    } catch (error) {
        console.error(error);
        toast.error("Profil güncellenemedi.");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passData.newPass !== passData.confirmPass) {
        toast.error("❌ Yeni şifreler eşleşmiyor!");
        return;
    }
    if (passData.newPass.length < 6) {
        toast.warning("⚠️ Şifre en az 6 karakter olmalıdır.");
        return;
    }

    const userId = user.id || user.Id; 
    if (!userId) {
        toast.error("Kullanıcı ID hatası.");
        return;
    }

    try {
        await changePassword(userId, passData.currentPass, passData.newPass);
        toast.success("🔒 Şifreniz başarıyla değiştirildi!");
        setPassData({ currentPass: "", newPass: "", confirmPass: "" });
    } catch (error) {
        toast.error(error.message); 
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">⚙️ Ayarlar</h2>

      <div className="row">
        {/* --- 1. PROFİL KARTI --- */}
        <div className="col-md-6 mb-4">
            <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0 text-primary">👤 Profil Bilgileri</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleProfileUpdate}>
                        <div className="mb-3">
                            <label className="form-label">Ad Soyad</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={profileData.name} 
                                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">E-Posta</label>
                            {/* ARTIK readOnly YOK! Düzenlenebilir. */}
                            <input 
                                type="email" 
                                className="form-control" 
                                value={profileData.email} 
                                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                placeholder="ornek@eczane.com"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Rol / Yetki</label>
                            <input 
                                type="text" 
                                className="form-control bg-light" 
                                value={profileData.role ? profileData.role.toUpperCase() : ""} 
                                readOnly 
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Bilgileri Güncelle
                        </button>
                    </form>
                </div>
            </div>
        </div>

        {/* --- 2. ŞİFRE DEĞİŞTİRME KARTI --- */}
        <div className="col-md-6 mb-4">
            <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0 text-danger">🔒 Şifre Değiştir</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handlePasswordUpdate}>
                        <div className="mb-3">
                            <label className="form-label">Mevcut Şifre</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                value={passData.currentPass}
                                onChange={(e) => setPassData({...passData, currentPass: e.target.value})}
                                required
                            />
                        </div>
                        <hr className="my-4"/>
                        <div className="mb-3">
                            <label className="form-label">Yeni Şifre</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                value={passData.newPass}
                                onChange={(e) => setPassData({...passData, newPass: e.target.value})}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Yeni Şifre (Tekrar)</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                value={passData.confirmPass}
                                onChange={(e) => setPassData({...passData, confirmPass: e.target.value})}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-danger w-100">
                            Şifreyi Güncelle
                        </button>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}