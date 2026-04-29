const API_URL = "https://localhost:7203/api/ChronicDiseases"; // Portunu kontrol et

export const getAllDiseases = async () => {
  const response = await fetch(API_URL);
  return await response.json();
};

export const addDisease = async (disease) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(disease),
  });
  if (!response.ok) throw new Error("Ekleme başarısız");
  return await response.json();
};

export const updateDisease = async (id, disease) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(disease),
  });
  if (!response.ok) throw new Error("Güncelleme başarısız");
  return true;
};

export const deleteDisease = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Silme başarısız");
  return true;
};