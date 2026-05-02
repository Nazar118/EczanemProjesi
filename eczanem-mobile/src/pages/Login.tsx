import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonInput, IonButton, IonToast, IonSpinner 
} from '@ionic/react';
// 🎯 NOT: IonItem'ı import listesinden sildik ki ESLint kızmasın!
import { loginUser } from '../services/authService';

const Login: React.FC = () => {
  const [tcNo, setTcNo] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false); // Butona basıldığında dönecek ikon için ekledik

  const handleLogin = async () => {
    if (!tcNo || !password) {
      setToastMessage('Lütfen TC ve Şifre alanlarını doldurun.');
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      // 1. authService üzerinden C#'a gidiyoruz
      const response = await loginUser(tcNo, password);
      console.log("Sunucudan gelen cevap:", response);
      
      localStorage.setItem('currentUser', JSON.stringify(response.data)); 
      
      setToastMessage('Giriş Başarılı! Yönlendiriliyorsunuz... 🎉');
      setShowToast(true);
      
      // Başarılı girişten sonra biraz bekletip yönlendiriyoruz
      setTimeout(() => {
        window.location.href = '/app/home';
      }, 1000);

    } catch (error) {
      console.error(error); 
      setToastMessage('Giriş Başarısız: TC veya Şifre hatalı. ❌');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        {/* 🎯 Header arka planını ferah temaya eşitledik */}
        <IonToolbar style={{ '--background': 'var(--ion-background-color)' }}>
          <IonTitle style={{ fontWeight: 'bold', color: 'var(--ion-color-primary)' }}>
            Eczanem
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        
        {/* 🎯 YENİ: Şık Karşılama Metni */}
        <div style={{ marginTop: '20px', marginBottom: '30px' }}>
          <h2 style={{ fontWeight: 'bold', color: '#111', fontSize: '28px', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
            Hoş Geldiniz 👋
          </h2>
          <p style={{ color: '#666', margin: 0, fontSize: '15px' }}>
            Sağlık yolculuğunuza devam etmek için lütfen giriş yapın.
          </p>
        </div>

        {/* 🎯 HAYALET KUTULAR GİTTİ, BEMBEYAZ MODERN FORM GELDİ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <IonInput 
            label="TC Kimlik No" 
            labelPlacement="floating" 
            fill="outline"
            type="number"
            value={tcNo} 
            onIonInput={e => setTcNo(e.detail.value || '')} 
            style={{ '--background': '#ffffff', '--border-radius': '12px', '--border-color': '#e0e0e0', '--color': '#111' }}
          />

          <IonInput 
            label="Şifre" 
            labelPlacement="floating" 
            fill="outline"
            type="password" 
            value={password} 
            onIonInput={e => setPassword(e.detail.value || '')} 
            style={{ '--background': '#ffffff', '--border-radius': '12px', '--border-color': '#e0e0e0', '--color': '#111' }}
          />

          {/* 🎯 GİRİŞ YAP BUTONU: Yeni gölgeli, modern tasarım */}
          <IonButton 
            expand="block" 
            onClick={handleLogin}
            disabled={loading}
            style={{ 
              marginTop: '20px', 
              '--border-radius': '12px', 
              height: '52px', 
              fontWeight: 'bold',
              '--box-shadow': '0 4px 12px rgba(229, 66, 66, 0.3)' 
            }}
          >
            {loading ? <IonSpinner name="crescent" color="light" /> : 'Giriş Yap'}
          </IonButton>

          {/* 🎯 KAYIT OL LİNKİ: Bağıran kırmızı buton yerine şık bir yönlendirme metni */}
          <IonButton 
            expand="block" 
            fill="clear" 
            color="medium" 
            routerLink="/register"
            style={{ marginTop: '10px', textTransform: 'none', fontSize: '15px' }}
          >
            Hesabınız yok mu? 
            <span style={{ color: 'var(--ion-color-primary)', fontWeight: 'bold', marginLeft: '6px' }}>
              Kayıt Olun
            </span>
          </IonButton>

        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2500}
          color="dark"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;