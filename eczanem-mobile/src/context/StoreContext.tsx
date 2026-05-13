import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';

// --- TİP TANIMLAMALARI (TypeScript'i mutlu etmek için) ---
interface StoreContextType {
  cartCount: number;
  favCount: number;
  refreshCart: () => void;
  refreshFavs: () => void;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  toggleFavorite: (productId: number) => Promise<void>;
  isFavorite: (productId: number) => boolean;
  clearCart: () => Promise<void>; // 🔥 YENİ EKLENDİ
}

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}

interface FavItem {
  id: number;
  productId: number;
}

// eslint-disable-next-line react-refresh/only-export-components
export const StoreContext = createContext<StoreContextType>({
  cartCount: 0,
  favCount: 0,
  refreshCart: () => {},
  refreshFavs: () => {},
  addToCart: async () => {},
  toggleFavorite: async () => {},
  isFavorite: () => false,
  clearCart: async () => {}, // 🔥 YENİ EKLENDİ
});

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [favCount, setFavCount] = useState(0);
  const [favoritesList, setFavoritesList] = useState<FavItem[]>([]); 
  
  const currentUserStr = localStorage.getItem('currentUser');
  const userId = currentUserStr ? JSON.parse(currentUserStr).id : 0;

  // 🛒 1. Sepet Bilgilerini Çek 
  const refreshCart = useCallback(async () => {
    if (userId === 0) return;
    try {
      const response = await axios.get(`https://localhost:7203/api/Cart/${userId}`);
      const totalItems = response.data.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
      setCartCount(totalItems);
    } catch (error) {
      console.error("Sepet çekilemedi", error);
    }
  }, [userId]);

  // ❤️ 2. Favori Bilgilerini Çek
  const refreshFavs = useCallback(async () => {
    if (userId === 0) return;
    try {
      const response = await axios.get(`https://localhost:7203/api/Favorites/${userId}`);
      setFavCount(response.data.length);
      setFavoritesList(response.data); 
    } catch (error) {
      console.error("Favoriler çekilemedi", error);
    }
  }, [userId]);

  useEffect(() => {
    refreshCart();
    refreshFavs();
  }, [refreshCart, refreshFavs]);

  // ➕ 3. Sepete Ürün Ekle
  const addToCart = async (productId: number, quantity: number = 1) => {
    if (userId === 0) return alert("Lütfen önce giriş yapın!");
    try {
      await axios.post('https://localhost:7203/api/Cart', {
        userId,
        productId,
        quantity
      });
      refreshCart(); 
    } catch (error) {
      console.error("Sepete eklenirken hata:", error);
    }
  };

  // 🔄 4. Favoriye Ekle/Çıkar 
  const toggleFavorite = async (productId: number) => {
    if (userId === 0) return alert("Lütfen önce giriş yapın!");
    try {
      await axios.post('https://localhost:7203/api/Favorites/toggle', {
        userId,
        productId
      });
      refreshFavs(); 
    } catch (error) {
      console.error("Favori işlemi başarısız:", error);
    }
  };

  // 🔍 5. Bir ürün favorilerde var mı kontrol et
  const isFavorite = (productId: number) => {
    return favoritesList.some(fav => fav.productId === productId);
  };

  // 🧹 6. SEPETİ TAMAMEN BOŞALT (🔥 YENİ EKLENDİ)
  const clearCart = async () => {
    if (userId === 0) return;
    try {
      await axios.delete(`https://localhost:7203/api/Cart/clear/${userId}`);
      refreshCart(); // Sepet sayısını (ikondaki rozeti) sıfırla
    } catch (error) {
      console.error("Sepet boşaltılamadı:", error);
    }
  };

  return (
    <StoreContext.Provider value={{ cartCount, favCount, refreshCart, refreshFavs, addToCart, toggleFavorite, isFavorite, clearCart }}>
      {children}
    </StoreContext.Provider>
  );
};