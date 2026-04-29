// src/services/saleService.js
const API_URL = "https://localhost:7203/api/Sales";

// 1. Tüm Satışları Getir
export const getAllSales = async () => {
  const response = await fetch(API_URL);
  return await response.json();
};

// 2. Yeni Satış Yap
export const createSale = async (saleData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(saleData),
  });

  if (!response.ok) {
    const errorData = await response.text(); 
    throw new Error(errorData || "Satış işlemi başarısız");
  }

  return await response.json();
};

// 3. Günlük Ciroyu Getir
export const getTodayTotal = async () => {
  const response = await fetch(`${API_URL}/today-total`);
  return await response.json();
};

// 4. Satışı İptal Et (Sil)
export const deleteSale = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  
  // Eğer silerken hata olursa (Backend 400 veya 500 dönerse) bunu yakala
  if (!response.ok) {
     const errorText = await response.text();
     throw new Error(errorText || "Silme başarısız");
  }
  return true;
};

// Rapor ve İstatistikleri Getir (Tarihli veya Tarihsiz)
export const getSaleStats = async (startDate, endDate) => {
  // URL'yi oluştur: /api/Sales/stats?startDate=2025-12-01&endDate=2025-12-31
  let url = `${API_URL}/stats`;
  
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  if (params.toString()) {
      url += `?${params.toString()}`;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error("İstatistikler alınamadı");
  return await response.json();
};