// src/services/medicineService.js

// Backend adresin (Swagger portuna göre 7203 veya 5224)
const API_URL = "https://localhost:7203/api/Medicines";

export const getAllMedicines = async () => {
  const response = await fetch(API_URL);
  return await response.json();
};

export const addMedicine = async (medicine) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(medicine),
  });
  return await response.json();
};

// SİLME İŞLEMİ (Bunu eklemezsen hata alırsın)
export const deleteMedicine = async (id) => {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
};

// GÜNCELLEME İŞLEMİ (Bunu eklemezsen hata alırsın)
export const updateMedicine = async (id, medicine) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(medicine),
  });
  return await response.json();
};