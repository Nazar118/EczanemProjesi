import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon,
  useIonViewWillEnter,IonToast
} from '@ionic/react';
import { medkitOutline, heart, cartOutline, personOutline, notificationsOutline } from 'ionicons/icons';
import { getPatientMedicines } from '../services/orderService'; 

let hasShownWelcome = false;
const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState('Misafir');
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);
  const [readyOrdersCount, setReadyOrdersCount] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);

  // Sayfaya her geri dönüldüğünde bu kod çalışır ve verileri günceller!
  useIonViewWillEnter(() => {
    const savedUserStr = localStorage.getItem('currentUser');
    if (!savedUserStr) {
       console.warn("Giriş yapılmamış, veriler çekilmeyecek.");
       return;
    }
    
    const savedUser = JSON.parse(savedUserStr);
    
    if (savedUser.firstName) {
      setUserName(savedUser.firstName);
      
      if (!hasShownWelcome) {
        setShowWelcome(true);
        hasShownWelcome = true; 
      }
    }

    const fetchOrderStats = async () => {
      try {
        // SABİT 1 YERİNE, savedUser.id KULLANIYORUZ
        const response = await getPatientMedicines(savedUser.id);
        const orders = response.data;
        
        const active = orders.filter((o: { isActive: boolean; status: string }) => o.isActive);
        const ready = active.filter((o: { isActive: boolean; status: string }) => o.status === 'Hazır');

        setActiveOrdersCount(active.length);
        setReadyOrdersCount(ready.length);
      } catch (error) {
        console.error("İstatistikler çekilemedi:", error);
      }
    };

    fetchOrderStats();
  });

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': 'var(--ion-background-color)' }}>
          <IonTitle style={{ fontWeight: 'bold', color: 'var(--ion-color-primary)' }}>Ana Sayfa</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

          {activeOrdersCount > 0 && (
            <div style={{ 
              backgroundColor: 'rgba(229, 66, 66, 0.08)', // Çok hafif şeffaf mercan/kırmızı
              borderRadius: '16px', 
              padding: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '15px',
              border: '1px solid rgba(229, 66, 66, 0.2)' // İncecik, zarif bir çerçeve
            }}>
              <div style={{ backgroundColor: 'var(--ion-color-primary)', borderRadius: '50%', padding: '10px', display: 'flex' }}>
                <IonIcon icon={notificationsOutline} style={{ color: 'white', fontSize: '24px' }} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#111' }}>
                  Sipariş Özeti
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>
                  <strong>{activeOrdersCount}</strong> aktif siparişin var. 
                  {readyOrdersCount > 0 ? ` ${readyOrdersCount} tanesi hazır!` : ' Hazırlanıyorlar.'}
                </p>
              </div>
            </div>
          )}          
          <IonCard button routerLink="/medicines" style={{ margin: 0, borderRadius: '15px', background: 'var(--ion-item-background)', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <IonCardHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ padding: '10px', backgroundColor: '#f0f4ff', borderRadius: '10px', display: 'flex' }}>
                  <IonIcon icon={medkitOutline} style={{ fontSize: '24px', color: '#3880ff' }} />
                </div>
                <IonCardTitle style={{ fontSize: '18px', fontWeight: 'bold', color: '#111' }}>İlaçlarım</IonCardTitle>
              </div>
            </IonCardHeader>
            <IonCardContent style={{ paddingTop: '0', color: '#666' }}>
              Sistemdeki ilaçları görüntüle ve yeni talep oluştur.
            </IonCardContent>
          </IonCard>

          <IonCard button routerLink="/orders" style={{ margin: 0, borderRadius: '15px', background: 'var(--ion-item-background)', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <IonCardHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ padding: '10px', backgroundColor: '#ebfbf1', borderRadius: '10px', display: 'flex' }}>
                  <IonIcon icon={cartOutline} style={{ fontSize: '24px', color: '#2dd36f' }} />
                </div>
                <IonCardTitle style={{ fontSize: '18px', fontWeight: 'bold', color: '#111' }}>Siparişlerim</IonCardTitle>
              </div>
            </IonCardHeader>
            <IonCardContent style={{ paddingTop: '0', color: '#666' }}>
              Aktif ve geçmiş ilaç taleplerinin durumunu takip et.
            </IonCardContent>
          </IonCard>

          <IonCard button routerLink="/favorites" style={{ margin: 0, borderRadius: '15px', background: 'var(--ion-item-background)', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <IonCardHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ padding: '10px', backgroundColor: '#fdedf0', borderRadius: '10px', display: 'flex' }}>
                  <IonIcon icon={heart} style={{ fontSize: '24px', color: '#eb445a' }} />
                </div>
                <IonCardTitle style={{ fontSize: '18px', fontWeight: 'bold', color: '#111' }}>Favorilerim</IonCardTitle>
              </div>
            </IonCardHeader>
            <IonCardContent style={{ paddingTop: '0', color: '#666' }}>
              Sık kullandığın ilaçlara hızlıca ulaş.
            </IonCardContent>
          </IonCard>

          <IonCard button routerLink="/profile" style={{ margin: 0, borderRadius: '15px', background: 'var(--ion-item-background)', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <IonCardHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ padding: '10px', backgroundColor: '#fff8e0', borderRadius: '10px', display: 'flex' }}>
                  <IonIcon icon={personOutline} style={{ fontSize: '24px', color: '#ffc409' }} />
                </div>
                <IonCardTitle style={{ fontSize: '18px', fontWeight: 'bold', color: '#111' }}>Profil</IonCardTitle>
              </div>
            </IonCardHeader>
            <IonCardContent style={{ paddingTop: '0', color: '#666' }}>
              Kişisel bilgilerini görüntüle ve adresini güncelle.
            </IonCardContent>
          </IonCard>

        </div>
        <IonToast
          isOpen={showWelcome}
          onDidDismiss={() => setShowWelcome(false)}
          message={`Hoş geldin, ${userName}! 👋`}
          duration={2500} 
          position="top" 
          color="primary" 
          cssClass="welcome-toast"
        />
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;