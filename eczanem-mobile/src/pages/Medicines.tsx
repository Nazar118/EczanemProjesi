import React, { useState, useEffect } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonButtons, IonBackButton, IonSearchbar,
  IonSkeletonText, IonCard, IonCardHeader, IonCardContent 
} from '@ionic/react';
import { getMedicines } from '../services/medicineService';
import { useIonRouter } from '@ionic/react';

// İŞTE YARATTIĞIMIZ EFSANE KARTI BURAYA ÇAĞIRIYORUZ
import MedicineCard from '../components/MedicineCard'; 

interface Medicine {
  id: number;
  name: string;
  category?: {
    name: string;
  };
}

const Medicines: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const router = useIonRouter();

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await getMedicines(); 
        setMedicines(response.data); 
        setLoading(false); 
      } catch (error) {
        console.error("Hata:", error);
        setLoading(false);
      }
    };
    fetchMedicines(); 
  }, []);

  const filteredMedicines = medicines.filter(med => 
    med.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        {/* 1. Üstteki Ana Kırmızı Çubuk */}
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" text="Geri" />
          </IonButtons>
          <IonTitle>İlaç Listesi</IonTitle>
        </IonToolbar>

        <IonToolbar style={{ '--background': 'var(--ion-background-color)', padding: '0 5px' }}>
          <IonSearchbar 
            value={searchText} 
            onIonInput={(e) => setSearchText(e.detail.value!)} 
            placeholder="İlaç ara..."
            animated={true}
            style={{ 
              paddingTop: '10px',
              paddingBottom: '10px', 
              '--box-shadow': 'none',
              '--background': '#ffffff', // Arama kutusunun içi bembeyaz ve ferah
              '--border-radius': '12px'  // Modern yuvarlak köşeler
            }}
          />
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        
        {loading ? (
          <div style={{ paddingBottom: '20px' }}>
            {[1, 2, 3, 4].map((i) => (
              <IonCard key={i} style={{ borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '15px' }}>
                <IonCardHeader style={{ paddingBottom: '0' }}>
                  <IonSkeletonText animated style={{ width: '70%', height: '24px', borderRadius: '4px' }} />
                </IonCardHeader>
                <IonCardContent>
                  <IonSkeletonText animated style={{ width: '40%', height: '16px', borderRadius: '4px', marginTop: '8px' }} />
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px', color: 'gray' }}>
            <h2>Sonuç Bulunamadı 🔍</h2>
          </div>
        ) : (
          <div style={{ paddingBottom: '20px' }}>
            {Object.entries(
              filteredMedicines.reduce((gruplar, ilac) => {
                const kategori = ilac.category?.name || 'Diğer İlaçlar';
                if (!gruplar[kategori]) gruplar[kategori] = [];
                gruplar[kategori].push(ilac);
                return gruplar;
              }, {} as Record<string, Medicine[]>)
            ).map(([kategoriAdi, ilaclar]) => (
              
              <div key={kategoriAdi} style={{ marginBottom: '24px' }}>
                
                <h3 style={{ 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  color: 'var(--ion-color-primary)', 
                  marginLeft: '8px',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {kategoriAdi}
                </h3>

                {ilaclar.map((med) => (
                  <MedicineCard 
                    key={med.id}
                    name={med.name}
                    date="Detayları ve stok durumunu gör"
                    onClick={() => router.push(`/medicine-detail/${med.id}`)}
                  />
                ))}
                
              </div>

            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Medicines;