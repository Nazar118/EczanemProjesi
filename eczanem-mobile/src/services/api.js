import axios from 'axios';

// Backend'in çalıştığı bilgisayarın IP adresi (En son bulduğumuz adres buydu)
const API_URL = 'http://localhost:5224/api';

const api = axios.create({
  baseURL: API_URL,
});

// Her istekten önce Token kontrolü yap
api.interceptors.request.use((config) => {
  // Ionic/Web için localStorage kullanıyoruz
  const token = localStorage.getItem('userToken'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;