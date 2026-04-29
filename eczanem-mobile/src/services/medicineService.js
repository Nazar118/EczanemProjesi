import api from './api';

// C# backend'indeki ilaç listesini getiren fonksiyon
export const getMedicines = async () => {
  const response = await api.get('/Medicines'); 
  return response;
};

export const getMedicineById = async (id) => {
  // C# tarafındaki api/Medicines/{id} adresine istek atıyoruz
  const response = await api.get(`/Medicines/${id}`);
  return response;
};