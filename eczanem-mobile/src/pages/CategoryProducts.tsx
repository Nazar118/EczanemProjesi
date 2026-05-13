import React, { useState, useEffect, useContext } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButtons, IonBackButton, IonSpinner, IonIcon
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { medkitOutline, cartOutline, heartOutline, heart } from 'ionicons/icons';
import { getProducts, getCategories } from '../services/productService';
import { StoreContext } from '../context/StoreContext';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
}

const CategoryProducts: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState<string>('Ürünler');
  const [loading, setLoading] = useState(true);
  
  // 🔥 CONTEXT'TEN SİHİRLİ GÜÇLERİMİZİ ÇEKİYORUZ
  const { addToCart, toggleFavorite, isFavorite } = useContext(StoreContext);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        const categoryId = parseInt(id);
        const [allProducts, allCategories] = await Promise.all([
          getProducts(),
          getCategories()
        ]);

        if (allCategories) {
          const category = allCategories.find((c: Category) => c.id === categoryId);
          if (category) setCategoryName(category.name);
        }

        if (allProducts) {
          const filteredProducts = allProducts.filter((p: Product) => p.categoryId === categoryId);
          setProducts(filteredProducts);
        }

      } catch (error) {
        console.error("Veriler çekilemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [id]);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/categories" text="" />
          </IonButtons>
          <IonTitle>{categoryName}</IonTitle> 
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#f8f9fa' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <IonSpinner name="crescent" color="primary" />
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>
            <IonIcon icon={medkitOutline} style={{ fontSize: '48px', color: '#ccc', marginBottom: '10px' }} />
            <p>Bu kategoride henüz ürün bulunmuyor.</p>
          </div>
        ) : (
          <div style={{ padding: '15px', display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
            {products.map((product) => (
              <div key={product.id} style={{ 
                width: 'calc(50% - 7.5px)', 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                padding: '12px', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}>
                
                {/* ❤️ DİNAMİK FAVORİ KALBİ */}
                <div 
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                  style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, cursor: 'pointer', padding: '5px' }}
                >
                  <IonIcon 
                    icon={isFavorite(product.id) ? heart : heartOutline} 
                    style={{ fontSize: '24px', color: isFavorite(product.id) ? '#ef4444' : '#ccc' }} 
                  />
                </div>
                
                <div style={{ height: '120px', backgroundColor: '#f8f9fa', borderRadius: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5px' }}>
                  {product.imageUrl ? (
                    <img src={`https://localhost:7203${product.imageUrl}`} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                  ) : (
                    <IonIcon icon={medkitOutline} style={{ fontSize: '40px', color: '#cbd5e1' }} />
                  )}
                </div>

                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#333', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.3' }}>
                  {product.name}
                </h4>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontWeight: '800', color: 'var(--ion-color-primary)', fontSize: '16px' }}>
                    {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(product.price > 5000 ? product.price / 100 : product.price)} ₺
                  </span>
                  
                  {/* 🛒 DİNAMİK SEPETE EKLE BUTONU */}
                  <div 
                    onClick={(e) => { e.stopPropagation(); addToCart(product.id, 1); }}
                    style={{ backgroundColor: 'var(--ion-color-primary)', borderRadius: '10px', width: '32px', height: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', cursor: 'pointer' }}
                  >
                    <IonIcon icon={cartOutline} style={{ fontSize: '18px' }} />
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

export default CategoryProducts;