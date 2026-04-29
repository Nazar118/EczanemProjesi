const API_URL = "https://localhost:7203/api/Stock"; // Portunu kontrol et

// Kritik seviyedeki ilaçları getir
export const getCriticalStock = async () => {
  const response = await fetch(`${API_URL}/critical`);
  return await response.json();
};

// Stok geçmişini getir
export const getStockHistory = async () => {
  const response = await fetch(`${API_URL}/history`);
  return await response.json();
};

// Stok ekle/çıkar (Hareket işle)
export const addStockMovement = async (movement) => {
  const response = await fetch(`${API_URL}/movement`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movement),
  });
  
  if (!response.ok) {
     // Backend'den gelen hatayı yakala ("Yetersiz Stok" gibi)
     const errorData = await response.json(); 
     throw new Error(errorData.title || "İşlem başarısız");
  }
  
  return await response.json();
};