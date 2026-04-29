import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonButtons, IonBackButton, IonInput, IonButton, 
  useIonViewWillEnter, useIonRouter, IonIcon
} from '@ionic/react';
import { personCircleOutline, logOutOutline, saveOutline } from 'ionicons/icons';

const Profile: React.FC = () => {
  const router = useIonRouter();
  
  // Hastanın bilgilerini tutacağımız State'ler
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
 const [address, setAddress] = useState(''); 

  // Sayfaya her girildiğinde hafızadaki (Login olan) kullanıcıyı çek!
  useIonViewWillEnter(() => {
    const savedUserStr = localStorage.getItem('currentUser');
    if (savedUserStr) {
      const user = JSON.parse(savedUserStr);
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhone(user.phoneNumber || user.phoneNum || user.PhoneNumber || '');
    }
  });

  // 🚪 ÇIKIŞ YAP FONKSİYONU
  const handleLogout = () => {
    // 1. Hafızadaki kullanıcıyı sil
    localStorage.removeItem('currentUser');
    
    // 2. Login sayfasına geri dön (replace ile geri tuşunu iptal et)
    router.push('/login', 'forward', 'replace');
  };

 return (
    <IonPage>
      <IonHeader className="ion-no-border">
        {/* Header'ın arkasını da Narecza ferahlığına uyarladık */}
        <IonToolbar style={{ '--background': 'var(--ion-background-color)' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" text="Geri" color="primary" />
          </IonButtons>
          <IonTitle style={{ fontWeight: 'bold', color: 'var(--ion-color-primary)' }}>Profilim</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* 🎯 DÜZELTME 1: Sabit gri arka plan komutunu sildik, ferah tema devrede! */}
      <IonContent className="ion-padding">
        
        {/* ÜST KISIM: PROFİL FOTOSU VE İSİM */}
        <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '30px' }}>
          {/* İkonu da yeni temamızın rengine uyarladık (mavi yerine primary) */}
          <IonIcon icon={personCircleOutline} style={{ fontSize: '80px', color: 'var(--ion-color-primary)' }} />
          <h2 style={{ fontWeight: 'bold', margin: '10px 0 5px 0', color: '#111' }}>
            {firstName} {lastName}
          </h2>
          <p style={{ color: '#666', margin: 0 }}>Kayıtlı Hasta</p>
        </div>

        {/* FORM KISMI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* 🎯 DÜZELTME 2: fill="solid" yerine "outline" yaptık. Bembeyaz, yuvarlak köşeli modern kutular eklendi */}
          <IonInput 
            label="Ad Soyad" 
            labelPlacement="floating" 
            fill="outline" 
            readonly 
            value={`${firstName} ${lastName}`} 
            style={{ '--background': '#ffffff', '--border-radius': '12px', '--border-color': '#e0e0e0', '--color': '#111' }}
          />

          <IonInput 
            label="Telefon Numarası" 
            labelPlacement="floating" 
            fill="outline" 
            type="tel"
            value={phone} 
            onIonInput={e => setPhone(e.detail.value || '')}
            style={{ '--background': '#ffffff', '--border-radius': '12px', '--border-color': '#e0e0e0', '--color': '#111' }}
          />

          <IonInput 
            label="Teslimat Adresi" 
            labelPlacement="floating" 
            fill="outline" 
            value={address} 
            onIonInput={e => setAddress(e.detail.value || '')}
            style={{ '--background': '#ffffff', '--border-radius': '12px', '--border-color': '#e0e0e0', '--color': '#111' }}
          />

        </div>

        {/* BUTONLAR */}
        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* 🎯 DÜZELTME 3: Kaydet butonuna Kayıt Ol sayfasındaki gibi tatlı gölge ve kalınlık verdik */}
          <IonButton 
            expand="block" 
            color="primary"
            style={{ 
              '--border-radius': '12px', 
              height: '52px', 
              fontWeight: 'bold',
              '--box-shadow': '0 4px 12px rgba(229, 66, 66, 0.3)' 
            }}
          >
            <IonIcon slot="start" icon={saveOutline} />
            BİLGİLERİ KAYDET
          </IonButton>

          {/* ÇIKIŞ YAP BUTONU (Çizgili kırmızı tasarımı çok şık duruyor, sadece köşelerini yuvarlattık) */}
          <IonButton 
            expand="block" 
            color="danger" 
            fill="outline" 
            onClick={handleLogout}
            style={{ 
              '--border-radius': '12px', 
              height: '52px', 
              fontWeight: 'bold'
            }}
          >
            <IonIcon slot="start" icon={logOutOutline} />
            ÇIKIŞ YAP
          </IonButton>

        </div>

      </IonContent>
    </IonPage>
  );
};

export default Profile;