import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonInput, IonButton, IonToast, IonButtons, IonBackButton, IonSpinner
} from '@ionic/react';
import { useIonRouter } from '@ionic/react';
import { registerUser } from '../services/authService';

const Register: React.FC = () => {
  const router = useIonRouter();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form verileri (State'ler)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    tcNo: '',
    phoneNumber: '',
    password: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleRegister = async () => {
    // Basit bir boşluk kontrolü
    if (!formData.firstName || !formData.tcNo || !formData.password) {
      setToastMessage('Lütfen ad, TC ve şifre alanlarını doldurun.');
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      // authService üzerinden C#'a yeni kullanıcıyı gönder
      await registerUser(formData);
      
      setToastMessage('Kayıt Başarılı! Şimdi giriş yapabilirsiniz. 🎉');
      setShowToast(true);
      
      // 🎯 EKSİK OLAN SİHİRLİ KOD BURASI:
      // Kullanıcı başarılı mesajını 1.5 saniye görsün, sonra Login'e uçsun!
     // 🎯 SADELEŞTİRİLMİŞ KESİN YÖNLENDİRME
      setTimeout(() => {
        router.push('/login'); 
      }, 1500);

    } catch (error) {
      console.error("🚨 DETAYLI HATA:", error);
      
      // 🎯 İŞTE SİHİR BURADA: 'any' yerine C#'tan gelecek hatanın şemasını çiziyoruz
      type BackendError = {
        response?: {
          data?: string | { title?: string; errors?: Record<string, string[]> };
        };
      };
      
      const err = error as BackendError; // 'any' GİTTİ, 'BackendError' GELDİ!
      let errorMsg = 'Kayıt başarısız oldu. Lütfen bilgilerinizi kontrol edin.';

      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data; 
        } else if (typeof err.response.data === 'object') {
          if (err.response.data.errors) {
            const firstErrorKey = Object.keys(err.response.data.errors)[0];
            errorMsg = err.response.data.errors[firstErrorKey][0];
          } else if (err.response.data.title) {
            errorMsg = err.response.data.title;
          }
        }
      }
      
      setToastMessage(errorMsg);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': 'var(--ion-background-color)' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" text="Geri" color="primary" />
          </IonButtons>
          <IonTitle style={{ fontWeight: 'bold', color: 'var(--ion-color-primary)' }}>
            Yeni Hesap Oluştur
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        
        {/* Üstte küçük bir karşılama metni ekleyelim, çok şık durur */}
        <div style={{ marginBottom: '30px', marginTop: '10px' }}>
          <h2 style={{ fontWeight: 'bold', color: '#111', fontSize: '24px', margin: '0 0 8px 0' }}>
            Aramıza Katılın 🚀
          </h2>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
            İlaçlarınızı kolayca takip etmek için bilgilerinizi girin.
          </p>
        </div>

        {/* 🎯 HAYALET KUTULAR GİTTİ, FERAH TASARIM GELDİ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <IonInput 
            label="Adınız" labelPlacement="floating" fill="outline"
            value={formData.firstName} 
            onIonInput={e => handleInputChange('firstName', e.detail.value || '')} 
            style={{ '--background': '#ffffff', '--border-radius': '12px', '--border-color': '#e0e0e0', '--color': '#111' }}
          />

          <IonInput 
            label="Soyadınız" labelPlacement="floating" fill="outline"
            value={formData.lastName} 
            onIonInput={e => handleInputChange('lastName', e.detail.value || '')} 
            style={{ '--background': '#ffffff', '--border-radius': '12px', '--border-color': '#e0e0e0', '--color': '#111' }}
          />

          <IonInput 
            label="TC Kimlik No" labelPlacement="floating" fill="outline" type="number"
            value={formData.tcNo} 
            onIonInput={e => handleInputChange('tcNo', e.detail.value || '')} 
            style={{ '--background': '#ffffff', '--border-radius': '12px', '--border-color': '#e0e0e0', '--color': '#111' }}
          />

          <IonInput 
            label="Telefon Numarası" labelPlacement="floating" fill="outline" type="tel"
            value={formData.phoneNumber} 
            onIonInput={e => handleInputChange('phoneNumber', e.detail.value || '')} 
            style={{ '--background': '#ffffff', '--border-radius': '12px', '--border-color': '#e0e0e0', '--color': '#111' }}
          />

          <IonInput 
            label="Şifre" labelPlacement="floating" fill="outline" type="password"
            value={formData.password} 
            onIonInput={e => handleInputChange('password', e.detail.value || '')} 
            style={{ '--background': '#ffffff', '--border-radius': '12px', '--border-color': '#e0e0e0', '--color': '#111' }}
          />

          <IonButton 
            expand="block" 
            onClick={handleRegister} 
            disabled={loading}
            style={{ 
              marginTop: '20px', 
              '--border-radius': '12px', 
              height: '52px', 
              fontWeight: 'bold',
              '--box-shadow': '0 4px 12px rgba(229, 66, 66, 0.3)' // Butona tatlı bir mercan gölgesi verdik
            }} 
          >
            {loading ? <IonSpinner name="crescent" color="light" /> : 'Kayıt Ol'}
          </IonButton>

        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color="dark"
        />
      </IonContent>
    </IonPage>
  );
};

export default Register;