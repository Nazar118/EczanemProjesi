const API_URL = "https://localhost:7203/api/PatientMedicines"; // Portunu kontrol et

// 1. Hastanın kullandığı ilaçları getir
export const getPatientMedicines = async (patientId) => {
  const response = await fetch(`${API_URL}/patient/${patientId}`);
  return await response.json();
};

// 2. Hastaya yeni ilaç tanımla (Reçete ekle)
export const addPatientMedicine = async (data) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("İlaç tanımlanamadı");
  return await response.json();
};

// 3. İlacı kullanımdan kaldır (Sil/Pasif yap)
export const removePatientMedicine = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Silme başarısız");
  return true;
};

// 4. Bitişi yaklaşan ilaçları getir (Bildirimler için)
export const getNotifications = async () => {
  const response = await fetch(`${API_URL}/notifications`);
  return await response.json();
};

// 5. TÜM siparişleri/ilaç taleplerini getir (Eczacı Ekranı İçin)
export const getAllPatientMedicines = async () => {
  // Eğer C# tarafında özel bir yol (route) belirtmediysen, genelde sadece API_URL'e GET isteği atmak tüm listeyi getirir.
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Siparişler getirilemedi");
  return await response.json();
};

// 6. Sipariş durumunu güncelle (Onayla / Reddet)
export const updateOrderState = async (id, statusData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT", // Backend'in PATCH destekliyorsa PATCH de yapabilirsin
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(statusData),
  });
  if (!response.ok) throw new Error("Durum güncellenirken hata oluştu");
  
  // Eğer backend güncellenen veriyi döndürüyorsa 'return await response.json();' yapabilirsin
  // Dönmüyorsa sadece true döndürmek yeterlidir.
  return true; 
};