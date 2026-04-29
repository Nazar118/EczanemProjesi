import React, { useState, useEffect } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonButtons, IonBackButton, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, IonButton, IonSpinner, 
  IonBadge, IonTextarea, IonItem, IonLabel,IonIcon 
} from '@ionic/react';
import { getMedicineById } from '../services/medicineService';
import { useParams } from 'react-router';
import { useIonRouter, useIonToast } from '@ionic/react';
import { createOrder } from '../services/orderService';
import { heart, heartOutline } from 'ionicons/icons';

interface RouteParams {
  id: string;
}

// TypeScript'e detaylarını çekeceğimiz ilacın kalıbını veriyoruz
interface MedicineData {
  id: number;
  name: string;
  description: string;
  usage: string;
  stock: number;
  price: number;
  isPrescriptionRequired: boolean;
}

const MedicineDetail: React.FC = () => {
  const { id } = useParams<RouteParams>(); 
  
  const [medicine, setMedicine] = useState<MedicineData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [quantity, setQuantity] = useState(1); 
  const [note, setNote] = useState(''); 
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(Number(id)));
  }, [id]);

  // Favoriye ekle/çıkar fonksiyonu
  const toggleFavorite = () => {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const medicineId = Number(id);

    if (favorites.includes(medicineId)) {
      // Zaten favoriyse listeden çıkar
      favorites = favorites.filter((favId: number) => favId !== medicineId);
      presentToast({ message: 'Favorilerden çıkarıldı', duration: 1500, color: 'medium' });
    } else {
      // Favori değilse listeye ekle
      favorites.push(medicineId);
      presentToast({ message: 'Favorilere eklendi ❤️', duration: 1500, color: 'danger' });
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  useEffect(() => {
    const fetchMedicineDetail = async () => {
      try {
        const response = await getMedicineById(id);
        setMedicine(response.data);
        setLoading(false);
      } catch (error) {
        console.error("İlaç detayı çekilirken hata oluştu:", error);
        setLoading(false);
      }
    };

    fetchMedicineDetail(); 
  }, [id]); 

  const router = useIonRouter();
  const [presentToast] = useIonToast();
  const [isOrdering, setIsOrdering] = useState(false);

  const handleOrder = async () => {
    if (!medicine) return;

    // 1. GERÇEK KULLANICIYI HAFIZADAN ÇEK
    const savedUserStr = localStorage.getItem('currentUser');
    if (!savedUserStr) {
      presentToast({ message: 'Lütfen önce giriş yapın.', duration: 2000, color: 'danger' });
      return;
    }
    const user = JSON.parse(savedUserStr);

    setIsOrdering(true);
try {
      await createOrder({
        patientId: user.id,      
        medicineId: medicine.id, 
        dailyUsage: quantity, 
        quantity: quantity,   
        note: note          
      });
      
      presentToast({
        message: 'İlaç başarıyla listenize eklendi!',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });

      router.push('/dashboard', 'forward', 'push');
      
    } catch (error) {
      console.error("İlaç eklenirken hata oluştu:", error);
      presentToast({
        message: 'İlaç listenize eklenemedi.',
        duration: 3000,
        color: 'danger',
        position: 'bottom'
      });
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton text="Geri" defaultHref="/medicines" />
          </IonButtons>
          <IonTitle>İlaç Detayı</IonTitle>
          <IonButtons slot="end">
    <IonButton onClick={toggleFavorite}>
      <IonIcon slot="icon-only" icon={isFavorite ? heart : heartOutline} color="danger" />
    </IonButton>
  </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <IonSpinner name="crescent" />
          </div>
        ) : (
          <>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>{medicine?.name}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p><strong>Açıklama:</strong> {medicine?.description || 'Bu ilaç için açıklama girilmemiş.'}</p>
                <p style={{ marginTop: '10px' }}><strong>Kullanım Bilgisi:</strong> {medicine?.usage || 'Kullanım talimatı bulunmuyor.'}</p>
                
                <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f4f5f8', borderRadius: '8px' }}>
                  <div style={{ marginBottom: '10px' }}>
                    {medicine?.isPrescriptionRequired ? (
                      <IonBadge color="danger">Kırmızı Reçeteli / Reçete Zorunlu</IonBadge>
                    ) : (
                      <IonBadge color="success">Reçetesiz Alınabilir</IonBadge>
                    )}
                  </div>
                  <p><strong>Stok Durumu:</strong> {medicine?.stock} adet mevcut</p>
                  <p style={{ marginTop: '5px', fontSize: '18px', color: 'green', fontWeight: 'bold' }}>
                    Fiyat: {medicine?.price} TL
                  </p>
                </div>
              </IonCardContent>
            </IonCard>

            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              
              {/* Adet Seçici (Stepper) */}
              <IonItem lines="full">
                <IonLabel>Kutu Adedi:</IonLabel>
                <IonButtons slot="end">
                  <IonButton 
                    color="primary" 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                  >
                    <strong>-</strong>
                  </IonButton>
                  
                  <span style={{ padding: '0 15px', fontSize: '18px', fontWeight: 'bold' }}>
                    {quantity}
                  </span>
                  
                  <IonButton 
                    color="primary" 
                    onClick={() => setQuantity(q => q + 1)}
                  >
                    <strong>+</strong>
                  </IonButton>
                </IonButtons>
              </IonItem>

              {/* Not Alanı */}
              <IonItem lines="full">
                <IonLabel position="stacked" style={{ color: 'gray' }}>
                  Eczacıya Not (Opsiyonel)
                </IonLabel>
                <IonTextarea
                  placeholder="Örn: Acil lazım, annem için..."
                  value={note}
                  onIonInput={(e) => setNote(e.detail.value || '')}
                  rows={3}
                  style={{ marginTop: '10px' }}
                />
              </IonItem>
              
            </div>
            {/* FORM SONU */}

            <IonButton 
              expand="block" 
              color="success" 
              style={{ marginTop: '20px' }}
              onClick={handleOrder}
              disabled={isOrdering}
            >
              {isOrdering ? <IonSpinner name="crescent" /> : 'İLAÇ TALEP ET'}
            </IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default MedicineDetail;