import React, { useState, useEffect } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonSearchbar, IonList, IonItem, IonLabel, IonIcon, IonSpinner
} from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons'; 
import { getCategories } from '../services/productService'; 

interface Category {
  id: number;
  name: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  // 🔥 useIonRouter uyarısını silerek düzelttik

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responseData = await getCategories(); 
        
        if (responseData && Array.isArray(responseData)) {
            const vitrinKategorileri = responseData.filter(cat => {
              if(!cat.name) return false; 
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
        console.error("Kategoriler yüklenemedi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories(); 
  }, []);

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonTitle>Kategoriler</IonTitle>
        </IonToolbar>

        <IonToolbar style={{ '--background': '#ffffff', padding: '0 5px', borderBottom: '1px solid #f0f0f0' }}>
          <IonSearchbar 
            value={searchText} 
            onIonInput={(e) => setSearchText(e.detail.value!)} 
            placeholder="Kategori ara..."
            animated={true}
            style={{ 
              paddingTop: '8px',
              paddingBottom: '8px', 
              '--box-shadow': 'none',
              '--background': '#f4f5f8', 
              '--border-radius': '8px' 
            }}
          />
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#ffffff' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <IonSpinner name="crescent" color="primary" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>
            <p>Sonuç bulunamadı 🔍</p>
          </div>
        ) : (
          <IonList lines="full" style={{ padding: 0 }}>
            {filteredCategories.map((cat) => (
              <IonItem 
                key={cat.id} 
                button 
                detail={false} 
                onClick={() => {
                  console.log(`${cat.name} kategorisine tıklandı!`);
                }}
                style={{
                  '--padding-start': '20px',
                  '--padding-end': '20px',
                  '--min-height': '60px'
                }}
              >
                <IonLabel 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#333',
                    textTransform: 'uppercase', 
                    letterSpacing: '0.5px'
                  }}
                >
                  {cat.name}
                </IonLabel>
                
                <IonIcon 
                  slot="end" 
                  icon={chevronForwardOutline} 
                  style={{ fontSize: '18px', color: '#888' }} 
                />
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Categories; // 🔥 BURAYI DA CATEGORIES OLARAK GÜNCELLEDİK