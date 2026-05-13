import React, { useContext, useEffect, useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonList, IonItem, IonLabel, IonButtons, IonBackButton, 
  IonIcon, IonThumbnail, IonSpinner 
} from '@ionic/react';
import { heart, trashOutline, medkitOutline } from 'ionicons/icons';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';

// 🔥 TYPE (TİP) HATASINI ÇÖZMEK İÇİN EKLENEN ŞABLONLAR 🔥
interface Product {
  name: string;
  price: number;
  imageUrl: string | null;
}

interface FavoriteItem {
  id: number;
  productId: number;
  product: Product;
}

const Favorites: React.FC = () => {
  const { favCount, toggleFavorite } = useContext(StoreContext);
  
  // 🔥 'any' YAZAN YERİ SİLDİK, YERİNE KENDİ ŞABLONUMUZU KOYDUK
  const [favProducts, setFavProducts] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUserStr = localStorage.getItem('currentUser');
  const userId = currentUserStr ? JSON.parse(currentUserStr).id : 0;

  useEffect(() => {
    const fetchFavs = async () => {
      if (userId === 0) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`https://localhost:7203/api/Favorites/${userId}`);
        setFavProducts(response.data);
      } catch (error) {
        console.error("Favoriler yüklenemedi", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavs();
  }, [favCount, userId]);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="danger">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/home" text="" />
          </IonButtons>
          <IonTitle>Favorilerim</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent style={{ '--background': '#f8f9fa' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <IonSpinner name="crescent" color="danger" />
          </div>
        ) : favProducts.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '80px', color: '#888' }}>
            <IonIcon icon={heart} style={{ fontSize: '80px', color: '#fca5a5', opacity: 0.5, marginBottom: '15px' }} />
            <h3 style={{ fontWeight: 'bold', color: '#555' }}>Favori Listeniz Boş</h3>
            <p>Beğendiğiniz ürünleri kalp ikonuna dokunarak buraya ekleyebilirsiniz.</p>
          </div>
        ) : (
          <IonList lines="full" style={{ padding: '10px', background: 'transparent' }}>
            {favProducts.map((fav) => (
              <IonItem key={fav.id} style={{ '--border-radius': '12px', marginBottom: '10px', '--background': '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <IonThumbnail slot="start" style={{ background: '#f4f5f8', borderRadius: '8px', padding: '5px' }}>
                  {fav.product?.imageUrl ? (
                    <img src={`https://localhost:7203${fav.product.imageUrl}`} alt={fav.product.name} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
                  ) : (
                    <IonIcon icon={medkitOutline} style={{ fontSize: '30px', color: '#ccc', margin: 'auto', display: 'block', marginTop: '10px' }} />
                  )}
                </IonThumbnail>
                
                <IonLabel>
                  <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', whiteSpace: 'normal' }}>{fav.product?.name}</h2>
                  <p style={{ fontWeight: '800', color: 'var(--ion-color-primary)', fontSize: '15px', marginTop: '5px' }}>
                    {fav.product?.price} ₺
                  </p>
                </IonLabel>
                
                <IonButtons slot="end">
                  <div 
                    onClick={() => toggleFavorite(fav.productId)} 
                    style={{ width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fee2e2', borderRadius: '10px', cursor: 'pointer' }}
                  >
                    <IonIcon icon={trashOutline} style={{ color: '#ef4444', fontSize: '20px' }} />
                  </div>
                </IonButtons>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Favorites;