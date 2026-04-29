import api from './api';

export const createOrder = async (orderData: { 
  patientId: number; 
  medicineId: number; 
  dailyUsage: number; 
  quantity: number; // YENİ: Adet
  note: string;     // YENİ: Not
}) => {
  const response = await api.post('/PatientMedicines', orderData);
  return response;
};

export const getPatientMedicines = async (patientId: number) => {
  const response = await api.get(`/PatientMedicines/patient/${patientId}`);
  return response;
};