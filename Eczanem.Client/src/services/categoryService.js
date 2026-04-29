const API_URL = "https://localhost:7203/api/Categories"; // Portunu kontrol et (7203, 7158 vb.)

export const getAllCategories = async () => {
  const response = await fetch(API_URL);
  return await response.json();
};

export const addCategory = async (category) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category),
  });
  if (!response.ok) throw new Error("Ekleme başarısız");
  return await response.json();
};

export const updateCategory = async (id, category) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category),
  });
  if (!response.ok) throw new Error("Güncelleme başarısız");
  return true;
};

export const deleteCategory = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Silme başarısız");
  return true;
};