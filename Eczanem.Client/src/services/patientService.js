// Backend Port numaran (7203) doğru mu kontrol et
const API_URL = "https://localhost:7203/api/Patients";

export const getAllPatients = async () => {
  const response = await fetch(API_URL);
  return await response.json();
};

export const addPatient = async (patient) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patient),
  });
  return await response.json();
};

export const updatePatient = async (id, patient) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patient),
  });
  return await response.json();
};

export const deletePatient = async (id) => {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
};