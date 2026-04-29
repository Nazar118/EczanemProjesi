// Adresimiz UsersController olduğu için api/Users
const API_URL = "https://localhost:7203/api/Users"; 

// 1. GİRİŞ YAPMA FONKSİYONU (Bunu geri getirdik!)
export const loginUser = async (username, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    // Hata durumunda (401 Unauthorized vb.)
    const errorText = await response.text();
    throw new Error(errorText || "Giriş başarısız.");
  }

  return await response.json();
};

// 2. KAYIT OLMA FONKSİYONU (Lazım olursa diye dursun)
export const registerUser = async (userData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) throw new Error("Kayıt işlemi başarısız.");
  return await response.json();
};

// 3. ŞİFRE DEĞİŞTİRME FONKSİYONU (Yeni eklediğimiz)
export const changePassword = async (userId, currentPassword, newPassword) => {
  const response = await fetch(`${API_URL}/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, currentPassword, newPassword }),
  });

  if (!response.ok) {
    const errorData = await response.text(); 
    // Gelen hatayı temizleyip fırlatıyoruz
    throw new Error(errorData.replace(/"/g, '') || "Şifre değiştirilemedi.");
  }

  return await response.json();
};

// 4. PROFİL GÜNCELLEME (Ad ve Email)
export const updateUserProfile = async (id, name, email) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });

  if (!response.ok) throw new Error("Profil güncellenemedi.");
  return await response.json();
};