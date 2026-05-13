import React, { useState, useContext } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButtons, IonBackButton, IonList, IonItem, IonLabel, 
  IonRadioGroup, IonRadio, IonInput, IonButton, IonIcon, 
  useIonToast, IonTextarea
} from '@ionic/react';
import { cardOutline, cashOutline, locationOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../context/StoreContext';

const Checkout: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<string>('credit_card');
  const [address, setAddress] = useState<string>(''); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [presentToast] = useIonToast();
  const history = useHistory();
  const { refreshCart } = useContext(StoreContext);

  // ❌ BURADAKİ userId TANIMINI SİLİYORUZ (Çünkü stale/bayat kalabiliyor)
  // const userId = currentUserStr ? JSON.parse(currentUserStr).id : 0;

  const handleCheckout = async () => {
    // ✅ userId bilgisini TAM ŞU AN (tıklama anında) localStorage'dan alıyoruz
    const currentUserStr = localStorage.getItem('currentUser');
    const currentUserId = currentUserStr ? JSON.parse(currentUserStr).id : 0;

    if (currentUserId === 0) {
      return presentToast({ message: '⚠️ Oturum bilginiz bulunamadı, lütfen tekrar giriş yapın.', duration: 3000, color: 'danger' });
    }

    if (!address || address.trim().length < 10) {
      return presentToast({ message: '⚠️ Lütfen geçerli ve açık bir teslimat adresi giriniz.', duration: 3000, color: 'warning' });
    }

    setIsSubmitting(true);

    try {
      await axios.post('https://localhost:7203/api/Orders/checkout', {
        userId: currentUserId, // Artık her zaman o anki kullanıcının ID'si gidecek!
        address: address,
        paymentMethod: paymentMethod
      });

      refreshCart();

      presentToast({
        message: '✅ Siparişiniz başarıyla alındı! Teşekkür ederiz.',
        duration: 3000,
        position: 'top',
        color: 'success'
      });
      
      setTimeout(() => {
        history.push('/app/home');
      }, 1500);

    } catch (error) {
      console.error("Sipariş Hatası:", error);
      presentToast({ message: '❌ Sipariş oluşturulamadı.', duration: 3000, color: 'danger' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/cart" text="" />
          </IonButtons>
          <IonTitle>Ödeme Yap</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#f8f9fa' }} className="ion-padding">
        
        {/* 📍 TESLİMAT ADRESİ */}
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginTop: '10px' }}>
          <IonIcon icon={locationOutline} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
          Teslimat Adresi
        </h3>
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', marginBottom: '20px' }}>
          <IonTextarea 
            placeholder="Açık adresinizi giriniz (Mahalle, Sokak, Bina No...)" 
            rows={3} 
            value={address}
            onIonInput={e => setAddress(e.detail.value!)}
            style={{ '--padding-start': '0', borderBottom: '1px solid #eee' }}
          ></IonTextarea>
        </div>

        {/* 💳 ÖDEME YÖNTEMİ SEÇİMİ */}
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>Ödeme Yöntemi</h3>
        <IonList style={{ background: 'transparent', marginBottom: '20px' }}>
          <IonRadioGroup value={paymentMethod} onIonChange={e => setPaymentMethod(e.detail.value)}>
            
            <IonItem lines="none" style={{ '--background': '#fff', '--border-radius': '12px', marginBottom: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <IonIcon icon={cardOutline} slot="start" color="primary" />
              <IonLabel style={{ fontWeight: '600' }}>Kredi / Banka Kartı</IonLabel>
              <IonRadio slot="end" value="credit_card" />
            </IonItem>

            <IonItem lines="none" style={{ '--background': '#fff', '--border-radius': '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <IonIcon icon={cashOutline} slot="start" color="success" />
              <IonLabel style={{ fontWeight: '600' }}>Kapıda Ödeme</IonLabel>
              <IonRadio slot="end" value="cash" />
            </IonItem>

          </IonRadioGroup>
        </IonList>

        {/* 🔢 KREDİ KARTI BİLGİLERİ */}
        {paymentMethod === 'credit_card' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', marginBottom: '20px', animation: 'fadeIn 0.3s ease-in-out' }}>
            <IonItem lines="full" style={{ '--padding-start': '0' }}>
              <IonLabel position="stacked" style={{ color: '#888' }}>Kart Üzerindeki İsim</IonLabel>
              <IonInput type="text" placeholder="Örn: Nazar Berk"></IonInput>
            </IonItem>
            
            <IonItem lines="full" style={{ '--padding-start': '0' }}>
              <IonLabel position="stacked" style={{ color: '#888' }}>Kart Numarası</IonLabel>
              <IonInput type="number" placeholder="**** **** **** ****"></IonInput>
            </IonItem>

            <div style={{ display: 'flex', gap: '15px' }}>
              <IonItem lines="none" style={{ '--padding-start': '0', flex: 1, borderBottom: '1px solid #eee' }}>
                <IonLabel position="stacked" style={{ color: '#888' }}>Son Kul. Tar.</IonLabel>
                <IonInput type="text" placeholder="AA/YY"></IonInput>
              </IonItem>
              <IonItem lines="none" style={{ '--padding-start': '0', flex: 1, borderBottom: '1px solid #eee' }}>
                <IonLabel position="stacked" style={{ color: '#888' }}>CVV</IonLabel>
                <IonInput type="number" placeholder="***"></IonInput>
              </IonItem>
            </div>
          </div>
        )}

        {/* 🚀 SİPARİŞİ ONAYLA BUTONU */}
        <IonButton 
          expand="block" 
          color="success" 
          onClick={handleCheckout}
          disabled={isSubmitting}
          style={{ height: '55px', '--border-radius': '14px', fontWeight: 'bold', fontSize: '18px', marginTop: '30px', boxShadow: '0 4px 15px rgba(45, 211, 111, 0.3)' }}
        >
          <IonIcon icon={checkmarkCircleOutline} slot="start" />
          {isSubmitting ? 'İşleniyor...' : 'Siparişi Onayla'}
        </IonButton>

      </IonContent>
    </IonPage>
  );
};

export default Checkout;