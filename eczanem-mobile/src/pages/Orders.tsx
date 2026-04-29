import React, { useState, useEffect } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonButtons, IonBackButton, 
  IonSkeletonText, IonCard, IonCardHeader, IonCardContent 
} from '@ionic/react';
import { getPatientMedicines } from '../services/orderService';
import MedicineCard from '../components/MedicineCard';

interface OrderData {
  id: number;
  startDate: string;
  estimatedEndDate: string;
  isActive: boolean;
  status: string;
  medicine: {
    name: string;
  };
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    const fetchOrders = async () => {
      try {
        // 1. GERÇEK KULLANICIYI HAFIZADAN ÇEK
        const savedUserStr = localStorage.getItem('currentUser');
        if (!savedUserStr) {
            setLoading(false);
            return;
        }

        const savedUser = JSON.parse(savedUserStr);

        // 2. SABİT 1 YERİNE, savedUser.id KULLANARAK VERİYİ ÇEK
        const response = await getPatientMedicines(savedUser.id); 
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Hata:", error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatShortDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" text="Geri" />
          </IonButtons>
          <IonTitle>Siparişlerim</IonTitle>
        </IonToolbar>
      </IonHeader>

<IonContent className="ion-padding">
          {loading ? (
          <div style={{ paddingBottom: '20px' }}>
            {[1, 2, 3].map((i) => (
              <IonCard key={i} style={{ borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '15px' }}>
                <IonCardHeader style={{ paddingBottom: '0', display: 'flex', justifyContent: 'space-between' }}>
                  <IonSkeletonText animated style={{ width: '50%', height: '22px', borderRadius: '4px' }} />
                  {/* Sipariş durumu rozeti için iskelet */}
                  <IonSkeletonText animated style={{ width: '25%', height: '22px', borderRadius: '10px' }} /> 
                </IonCardHeader>
                <IonCardContent>
                  <IonSkeletonText animated style={{ width: '40%', height: '14px', borderRadius: '4px', marginTop: '8px' }} />
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px', color: 'gray' }}>
            <h2>Henüz siparişiniz yok 🛒</h2>
            <p>Talep ettiğiniz ilaçlar burada listelenecektir.</p>
          </div>
        ) : (
          <div style={{ paddingBottom: '20px' }}>
            {orders.map((order) => (
              // BİLEŞENİMİZ BURADA SAHNEDE!
              <MedicineCard 
                key={order.id}
                name={order.medicine?.name || 'Bilinmeyen İlaç'}
                // 4.2 Bilgi azaltma: Uzun uzun "Sipariş Tarihi" yazmak yerine doğrudan kısa tarihi veriyoruz
                date={`${formatShortDate(order.startDate)} - ${formatShortDate(order.estimatedEndDate)}`}
                // C#'tan gelen durumu doğrudan rozet olarak gönderiyoruz
                status={!order.isActive ? 'İptal Edildi' : (order.status || 'Belirsiz')}
                onClick={() => {
                  // İleride detay sayfasına gitmek istersen burayı doldurabiliriz
                  console.log(`Sipariş detayı: ${order.id}`);
                }}
              />
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Orders;