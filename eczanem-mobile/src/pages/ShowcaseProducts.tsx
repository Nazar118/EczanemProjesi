import React, { useState, useEffect, useContext } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, 
  IonTitle, IonContent, IonIcon, IonSpinner 
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { heartOutline, heart, cartOutline, medkitOutline } from 'ionicons/icons';
import { getProducts } from '../services/productService';
import { StoreContext } from '../context/StoreContext';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  isBestSeller: boolean;
  isRecommended: boolean;
}

const ShowcaseProducts: React.FC = () => {
  const { type } = useParams<{ type: string }>(); // 'bestsellers' veya 'recommended' gelecek
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart, toggleFavorite, isFavorite } = useContext(StoreContext);

  const pageTitle = type === 'bestsellers' ? 'Çok Satan Ürünler' : 'Sizin İçin Seçtiklerimiz';

  useEffect(() => {
    const fetchDatas = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        if (data) {
          // Gelen tipe göre ürünleri filtreliyoruz!
          const filtered = type === 'bestsellers' 
            ? data.filter((p: Product) => p.isBestSeller) 
            : data.filter((p: Product) => p.isRecommended);
          
          setProducts(filtered);
        }
      } catch (error) {
        console.error("Hata", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDatas();
  }, [type]);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/home" text="" />
          </IonButtons>
          <IonTitle>{pageTitle}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f8f9fa' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <IonSpinner name="crescent" color="primary" />
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>
            <p>Bu listeye ait ürün bulunamadı.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {products.map((product) => (
              <div key={product.id} style={{ backgroundColor: 'white', borderRadius: '18px', padding: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
                
                {/* FAVORİ BUTONU */}
                <IonIcon 
                  icon={isFavorite(product.id) ? heart : heartOutline} 
                  style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '22px', color: isFavorite(product.id) ? '#ef4444' : '#cbd5e1', zIndex: 2, cursor: 'pointer' }} 
                  onClick={() => toggleFavorite(product.id)}
                />
                
                {/* ÜRÜN GÖRSELİ */}
                {product.imageUrl ? (
                  <img src={`https://localhost:7203${product.imageUrl}`} alt={product.name} style={{ height: '110px', objectFit: 'contain', marginBottom: '10px' }} />
                ) : (
                  <div style={{ backgroundColor: '#f4f5f8', height: '110px', borderRadius: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <IonIcon icon={medkitOutline} style={{ fontSize: '40px', color: '#cbd5e1' }} />
                  </div>
                )}
                
                {/* ÜRÜN BİLGİSİ */}
                <h4 style={{ margin: '0 0 6px 0', fontSize: '12.5px', fontWeight: '600', color: '#333', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.3' }}>
                  {product.name}
                </h4>
                
                {/* FİYAT VE SEPET */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontWeight: '800', color: 'var(--ion-color-primary)', fontSize: '15px' }}>
                    {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(product.price > 5000 ? product.price / 100 : product.price)} ₺
                  </span>
                  <div 
                    onClick={() => addToCart(product.id, 1)}
                    style={{ backgroundColor: 'var(--ion-color-primary)', borderRadius: '8px', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', cursor: 'pointer' }}
                  >
                    <IonIcon icon={cartOutline} style={{ fontSize: '16px' }} />
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ShowcaseProducts;