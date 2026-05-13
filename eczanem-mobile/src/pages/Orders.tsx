import React, { useState, useContext, useCallback } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonButtons, IonBackButton, IonList, IonItem, IonThumbnail, 
  IonLabel, IonIcon, IonSpinner, IonFooter, IonButton,
  useIonViewWillEnter // 🔥 İŞTE SAYFAYI OTOMATİK YENİLEYECEK SİHİR!
} from '@ionic/react';
import { trashOutline, medkitOutline, cart, addOutline, removeOutline } from 'ionicons/icons';
import axios from 'axios';
import { StoreContext } from '../context/StoreContext';

// 🔥 TİP TANIMLAMALARI
interface Product {
  name: string;
  price: number;
  imageUrl: string | null;
}

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
}

const Orders: React.FC = () => {
  const { refreshCart, addToCart } = useContext(StoreContext);
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUserStr = localStorage.getItem('currentUser');
  const userId = currentUserStr ? JSON.parse(currentUserStr).id : 0;

  // 🛒 1. SEPETİ VERİTABANINDAN ÇEK
  const fetchCart = useCallback(async () => {
    if (userId === 0) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`https://localhost:7203/api/Cart/${userId}`);
      setCartItems(response.data);
    } catch (error) {
      console.error("Sepet yüklenemedi", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // 🔥 IONIC'İN ÖZEL KANCASI: Bu sekmeye HER tıklandığında sepeti yeniler!
  useIonViewWillEnter(() => {
    fetchCart();
  });

  // 🗑️ 2. SEPETTEN ÜRÜN SİL
  const removeItem = async (cartItemId: number) => {
    try {
      await axios.delete(`https://localhost:7203/api/Cart/${cartItemId}`);
      fetchCart();   // Sepet listesini ekranda yenile
      refreshCart(); // Alt menüdeki kırmızı rozet sayısını yenile
    } catch (error) {
      console.error("Ürün silinemedi:", error);
    }
  };

  // ➕ 3. ADET ARTIRMA
  const handleIncrease = async (productId: number) => {
    await addToCart(productId, 1); // 1 adet ekle
    fetchCart(); // Listeyi güncelle
  };

  // ➖ 4. ADET AZALTMA
  const handleDecrease = async (item: CartItem) => {
    if (item.quantity === 1) {
      // Sadece 1 tane varsa eksiye basınca tamamen sil
      await removeItem(item.id);
    } else {
      // 1'den fazlaysa 1 adet eksilt (Backend'e -1 gönderiyoruz)
      await addToCart(item.productId, -1);
      fetchCart(); // Listeyi güncelle
    }
  };

  // 💰 5. TOPLAM TUTARI HESAPLA
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/home" text="" />
          </IonButtons>
          <IonTitle>Sepetim</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#f8f9fa' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <IonSpinner name="crescent" color="primary" />
          </div>
        ) : cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '80px', color: '#888' }}>
            <IonIcon icon={cart} style={{ fontSize: '80px', color: '#cbd5e1', marginBottom: '15px' }} />
            <h3 style={{ fontWeight: 'bold', color: '#555' }}>Sepetiniz Boş</h3>
            <p>İhtiyacınız olan ürünleri hemen sepete ekleyin.</p>
            <IonButton routerLink="/app/categories" fill="clear" color="primary" style={{ marginTop: '10px', fontWeight: 'bold' }}>
              Alışverişe Başla
            </IonButton>
          </div>
        ) : (
          <IonList lines="full" style={{ padding: '10px', background: 'transparent' }}>
            {cartItems.map((item) => (
              <IonItem key={item.id} style={{ '--border-radius': '16px', marginBottom: '12px', '--background': '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                
                {/* Ürün Görseli */}
                <IonThumbnail slot="start" style={{ background: '#f4f5f8', borderRadius: '10px', padding: '5px', width: '70px', height: '70px' }}>
                  {item.product?.imageUrl ? (
                    <img src={`https://localhost:7203${item.product.imageUrl}`} alt={item.product.name} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
                  ) : (
                    <IonIcon icon={medkitOutline} style={{ fontSize: '35px', color: '#ccc', margin: 'auto', display: 'block', marginTop: '15px' }} />
                  )}
                </IonThumbnail>
                
                {/* Ürün Bilgileri ve Artır/Azalt Butonları */}
                <IonLabel>
                  <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', whiteSpace: 'normal', marginBottom: '8px' }}>
                    {item.product?.name}
                  </h2>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontWeight: '800', color: 'var(--ion-color-primary)', fontSize: '16px', margin: 0 }}>
                      {item.product?.price} ₺
                    </p>
                    
                    {/* 🔥 YENİ: MİKTAR KONTROL (STEPPER) BUTONLARI */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
                      <div 
                        onClick={() => handleDecrease(item)}
                        style={{ width: '28px', height: '28px', backgroundColor: '#fff', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                      >
                        <IonIcon icon={removeOutline} style={{ fontSize: '18px', color: '#475569' }} />
                      </div>
                      
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', minWidth: '15px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      
                      <div 
                        onClick={() => handleIncrease(item.productId)}
                        style={{ width: '28px', height: '28px', backgroundColor: '#fff', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                      >
                        <IonIcon icon={addOutline} style={{ fontSize: '18px', color: '#475569' }} />
                      </div>
                    </div>
                    {/* YENİ BUTONLAR BİTİŞ */}

                  </div>
                </IonLabel>
                
                {/* Çöp Kutusu */}
                <IonButtons slot="end" style={{ alignSelf: 'flex-start', marginTop: '10px', marginLeft: '5px' }}>
                  <div 
                    onClick={() => removeItem(item.id)} 
                    style={{ padding: '8px', cursor: 'pointer', backgroundColor: '#fee2e2', borderRadius: '8px' }}
                  >
                    <IonIcon icon={trashOutline} style={{ color: '#ef4444', fontSize: '20px' }} />
                  </div>
                </IonButtons>

              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>

      {/* ALT KISIM - TOPLAM TUTAR VE ONAY BUTONU */}
      {cartItems.length > 0 && (
        <IonFooter className="ion-no-border" style={{ backgroundColor: '#fff', borderTop: '1px solid #eee', padding: '15px', paddingBottom: '25px', boxShadow: '0 -4px 15px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ fontSize: '16px', color: '#64748b', fontWeight: '600' }}>Toplam Tutar:</span>
            <span style={{ fontSize: '22px', fontWeight: '900', color: '#111' }}>
              {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(calculateTotal())} ₺
            </span>
          </div>
          <IonButton 
           routerLink="/app/checkout" // 🔥 BU SATIRI EKLEDİK
           expand="block" 
           color="primary" 
           style={{ height: '50px', '--border-radius': '14px', fontWeight: 'bold', fontSize: '16px' }}
         >
           Alışverişi Tamamla
         </IonButton>
        </IonFooter>
      )}
    </IonPage>
  );
};

export default Orders;