import axios from 'axios';

const API_URL = 'https://localhost:7203/api/Products';

export const getProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Ürünler çekilirken hata oluştu:", error);
    throw error;
  }
};
export const getCategories = async () => {
  try {
    const response = await axios.get('https://localhost:7203/api/Categories'); 
    return response.data;
  } catch (error) {
    console.error("Kategoriler getirilirken hata oluştu", error);
    return [];
  }
};