const API_URL = "https://localhost:7203/api/Suppliers"; 

export const getAllSuppliers = async () => {
  const response = await fetch(API_URL);
  return await response.json();
};

export const addSupplier = async (supplier) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(supplier),
  });
  if (!response.ok) throw new Error("Ekleme başarısız");
  return await response.json();
};

export const updateSupplier = async (id, supplier) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(supplier),
  });
  if (!response.ok) throw new Error("Güncelleme başarısız");
  return true;
};

export const deleteSupplier = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Silme başarısız");
  return true;
};