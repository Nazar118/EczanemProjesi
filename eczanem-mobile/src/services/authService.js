import api from './api';

export const loginUser = async (tcNo, password) => {
  const response = await api.post('/Patients/login', {
    tcNo: tcNo, 
    password: password
  });
  return response;
};

export const registerUser = async (userData) => {
  const response = await api.post('/Patients/register', userData);
  return response;
};