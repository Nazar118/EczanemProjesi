import React, { useState, useEffect } from 'react';
import { 
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, 
  IonSearchbar, IonIcon, IonBadge, IonSpinner, useIonRouter // 🔥 useIonRouter burada
} from '@ionic/react';
import { notificationsOutline, medkitOutline, leafOutline, heartOutline, cartOutline, happyOutline, nutritionOutline, waterOutline, gridOutline } from 'ionicons/icons';
import { getProducts, getCategories } from '../services/productService'; 

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  categoryId: number;
  isBestSeller: boolean; 
  isRecommended: boolean; 
}

interface Category {
  id: number;
  name: string;
}

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 🔥 SAYFA GEÇİŞ MOTORU EKLENDİ
  const router = useIonRouter();

  // 💡 SİHİRLİ FONKSİYON: Kategori ismine göre ikon ve renk bulur
  const getCategoryStyle = (categoryName: string) => {
    if (!categoryName) return { icon: gridOutline, color: '#4b5563', bg: '#f3f4f6' };
    const nameL = categoryName.toLowerCase();
    if (nameL.includes('vitamin') || nameL.includes('takviye')) return { icon: leafOutline, color: '#16a34a', bg: '#dcfce7' };
    if (nameL.includes('dermo') || nameL.includes('kozmetik')) return { icon: heartOutline, color: '#dc2626', bg: '#fee2e2' };
    if (nameL.includes('sağlık') || nameL.includes('medikal') || nameL.includes('ağız')) return { icon: medkitOutline, color: '#0284c7', bg: '#e0f2fe' };
    if (nameL.includes('anne') || nameL.includes('bebek')) return { icon: happyOutline, color: '#d946ef', bg: '#fae8ff' };
    if (nameL.includes('spor') || nameL.includes('protein')) return { icon: nutritionOutline, color: '#ea580c', bg: '#ffedd5' };
    if (nameL.includes('bakım') || nameL.includes('saç')) return { icon: waterOutline, color: '#0891b2', bg: '#cffafe' };
    return { icon: gridOutline, color: '#4b5563', bg: '#f3f4f6' };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories() 
        ]);
        
        setProducts(productsData || []);

        // 🔥 HATA KORUMALI FİLTRE: Eğer kategori varsa ve isimleri boş değilse çalışır
        if (categoriesData && Array.isArray(categoriesData)) {
            const vitrinKategorileri = categoriesData.filter(cat => {
              if(!cat.name) return false; // İsimsiz kategori gelirse patlamasını önler
              const nameL = cat.name.toLowerCase();
              return nameL.includes('vitamin') ||
                     nameL.includes('takviye') ||
                     nameL.includes('ağız') ||
                     nameL.includes('dermo') ||
                     nameL.includes('kozmetik') ||
                     nameL.includes('anne') ||
                     nameL.includes('bebek') ||
                     nameL.includes('bakım');
            });
            setCategories(vitrinKategorileri);
        }

      } catch (error) {
        console.error("Veriler yüklenemedi!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <IonPage>
      {/* 🎯 HEADER */}
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#ffffff', paddingTop: '10px' }}>
          <IonTitle style={{ fontWeight: '800', fontSize: '24px', color: 'var(--ion-color-primary)' }}>
            Eczanem<span style={{ color: '#111' }}>+</span>
          </IonTitle>
          <div slot="end" style={{ marginRight: '15px', position: 'relative' }}>
            <IonIcon icon={notificationsOutline} style={{ fontSize: '24px', color: '#444' }} />
            <IonBadge color="danger" style={{ position: 'absolute', top: '-5px', right: '-5px', fontSize: '10px', borderRadius: '50%' }}>2</IonBadge>
          </div>
        </IonToolbar>
        <IonToolbar style={{ '--background': '#ffffff', paddingBottom: '10px' }}>
          <IonSearchbar placeholder="İlaç, vitamin veya bakım ürünü ara..." style={{ padding: '0 15px', '--border-radius': '12px', '--box-shadow': 'none', '--background': '#f4f5f8' }} />
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f8f9fa' }}>
        
        {/* 🎯 1. BANNER SLIDER */}
        <div style={{ display: 'flex', overflowX: 'auto', gap: '15px', paddingBottom: '15px', scrollSnapType: 'x mandatory', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          <div style={{ minWidth: '90%', background: 'linear-gradient(135deg, var(--ion-color-primary), #0d9488)', borderRadius: '16px', padding: '20px', color: 'white', scrollSnapAlign: 'start', boxShadow: '0 4px 15px rgba(20, 184, 166, 0.3)' }}>
            <h3 style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '20px' }}>Yaz Fırsatları! ☀️</h3>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Güneş kremlerinde %40'a varan indirimleri kaçırmayın.</p>
          </div>
          <div style={{ minWidth: '90%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: '16px', padding: '20px', color: 'white', scrollSnapAlign: 'start', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)' }}>
            <h3 style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '20px' }}>Bağışıklık Güçlendir 💪</h3>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Seçili vitamin takviyelerinde 2 al 1 öde fırsatı.</p>
          </div>
        </div>

        {/* 🎯 2. KATEGORİ KISAYOLLARI */}
        <div style={{ marginTop: '10px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111', marginBottom: '15px' }}>Kategoriler</h2>
          <div style={{ display: 'flex', overflowX: 'auto', gap: '15px', paddingBottom: '10px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {categories.length === 0 && !loading ? (
              <p style={{ color: '#888', fontStyle: 'italic', paddingLeft: '10px', fontSize: '13px' }}>Henüz vitrin kategorisi bulunamadı.</p>
            ) : (
              categories.map((category) => {
                const style = getCategoryStyle(category.name); 
                return (
                  <div 
                    key={`cat-${category.id}`} 
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '70px', cursor: 'pointer' }}
                    onClick={() => router.push('/app/categories')} // 🔥 İŞTE TIKLAMA ÖZELLİĞİNİ BURAYA EKLEDİK
                  >
                    <div style={{ 
                      width: '60px', height: '60px', borderRadius: '16px', 
                      backgroundColor: style.bg, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                    }}>
                      <IonIcon icon={style.icon} style={{ fontSize: '28px', color: style.color }} />
                    </div>
                    <span style={{ fontSize: '12px', color: '#444', fontWeight: '600', textAlign: 'center', lineHeight: '1.1' }}>
                      {category.name.length > 12 ? category.name.substring(0, 10) + '...' : category.name}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* 🎯 3. ÇOK SATANLAR */}
        <div style={{ marginTop: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111', margin: 0 }}>Çok Satanlar</h2>
            <span style={{ fontSize: '13px', color: 'var(--ion-color-primary)', fontWeight: '600' }}>Tümünü Gör</span>
          </div>
          <div style={{ display: 'flex', overflowX: 'auto', gap: '12px', paddingBottom: '8px', msOverflowStyle: 'none', scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '20px' }}><IonSpinner color="primary" /></div>
            ) : products.filter(p => p.isBestSeller === true).length === 0 ? (
              <p style={{ color: '#888', fontStyle: 'italic', paddingLeft: '10px' }}>Henüz vitrine ürün eklenmemiş.</p>
            ) : (
              products.filter(p => p.isBestSeller === true).map((product) => (
                <div key={product.id} style={{ minWidth: '145px', maxWidth: '145px', backgroundColor: 'white', borderRadius: '18px', padding: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column' }}>
                  <IonIcon icon={heartOutline} style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '18px', color: '#ccc', zIndex: 2 }} />
                  {product.imageUrl ? (
                    <img src={`https://localhost:7203${product.imageUrl}`} alt={product.name} style={{ height: '110px', objectFit: 'contain', marginBottom: '10px' }} />
                  ) : (
                    <div style={{ backgroundColor: '#f4f5f8', height: '110px', borderRadius: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><IonIcon icon={medkitOutline} style={{ fontSize: '40px', color: '#cbd5e1' }} /></div>
                  )}
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '12.5px', fontWeight: '600', color: '#333', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.3' }}>{product.name}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={{ fontWeight: '800', color: 'var(--ion-color-primary)', fontSize: '15px' }}>
                      {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(product.price > 5000 ? product.price / 100 : product.price)} ₺
                    </span>
                    <div style={{ backgroundColor: 'var(--ion-color-primary)', borderRadius: '8px', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
                      <IonIcon icon={cartOutline} style={{ fontSize: '16px' }} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 🎯 4. SİZİN İÇİN SEÇTİKLERİMİZ */}
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111', margin: 0 }}>Sizin İçin Seçtiklerimiz</h2>
            <span style={{ fontSize: '13px', color: 'var(--ion-color-primary)', fontWeight: '600' }}>Hepsini Gör</span>
          </div>
          <div style={{ display: 'flex', overflowX: 'auto', gap: '12px', paddingBottom: '5px', msOverflowStyle: 'none', scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}>
            {products.filter(p => p.isRecommended === true).length === 0 && !loading ? (
               <p style={{ color: '#888', fontStyle: 'italic', paddingLeft: '10px' }}>Henüz ürün seçilmemiş.</p>
            ) : (
              products.filter(p => p.isRecommended === true).map((product) => (
                <div key={`seckin-${product.id}`} style={{ 
                  minWidth: '210px', 
                  height: '90px', 
                  backgroundColor: '#ffffff', 
                  borderRadius: '20px', 
                  padding: '10px', 
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)', 
                  scrollSnapAlign: 'start',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  border: '1px solid #f0f0f0' 
                }}>
                  <div style={{ width: '65px', height: '65px', backgroundColor: '#f8f9fa', borderRadius: '14px', flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={`https://localhost:7203${product.imageUrl}`} alt={product.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                    <h4 style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: '#333', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{product.name}</h4>
                    <span style={{ fontWeight: '800', color: 'var(--ion-color-primary)', fontSize: '14px' }}>
                      {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(product.price > 5000 ? product.price / 100 : product.price)} ₺
                    </span>
                    <div style={{ fontSize: '9px', color: '#16a34a', backgroundColor: '#dcfce7', padding: '2px 6px', borderRadius: '6px', width: 'fit-content', fontWeight: 'bold' }}>Hızlı Teslimat</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Dashboard;