import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonButtons, IonBackButton, IonInput, IonButton, 
  useIonViewWillEnter, useIonRouter, IonIcon,
  IonSegment, IonSegmentButton, IonLabel, IonSpinner
} from '@ionic/react';
import { 
  personCircleOutline, logOutOutline, saveOutline, 
  cubeOutline, checkmarkDoneCircleOutline, timeOutline, closeCircleOutline
} from 'ionicons/icons';
import axios from 'axios';

// 🔥 HATA 2 İÇİN ÇÖZÜM: Siparişin neye benzediğini anlatan şablon (Interface)
interface OrderData {
  id: number;
  status: string;
  totalAmount: number;
  orderDate: string;
}

const Profile: React.FC = () => {
  const router = useIonRouter();
  
  const [activeTab, setActiveTab] = useState<'info' | 'orders'>('info');
  const [loading, setLoading] = useState(false);
  
  // 🔥 'any' YERİNE KENDİ ŞABLONUMUZU KOYDUK
  const [orders, setOrders] = useState<OrderData[]>([]); 

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState(''); 
  // 🔥 HATA 3 İÇİN ÇÖZÜM: Kullanılmayan 'userId' state'ini tamamen sildik.

  // Sayfaya girildiğinde hem kullanıcı bilgilerini hem siparişleri çek
  useIonViewWillEnter(() => {
    const savedUserStr = localStorage.getItem('currentUser');
    if (savedUserStr) {
      const user = JSON.parse(savedUserStr);
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhone(user.phoneNumber || user.phoneNum || user.PhoneNumber || '');
      
      // Siparişleri yükle
      fetchOrders(user.id);
    }
  });

  const fetchOrders = async (id: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://localhost:7203/api/Orders/user/${id}`);
      
      // 🔥 SİPARİŞLERİN GÖRÜNMESİ İÇİN GÜVENLİK ÖNLEMİ (C# $values içine sarmış olabilir)
      const data = response.data?.$values || response.data;
      setOrders(data || []);
      
    } catch (error) {
      console.error("Siparişler çekilemedi", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/login', 'forward', 'replace');
  };

  // Sipariş durumuna göre renk ve ikon belirleyen yardımcı fonksiyon
  const getStatusStyle = (status: string) => {
    if (status === 'Hazır') return { icon: checkmarkDoneCircleOutline, color: 'success' };
    if (status === 'İptal Edildi') return { icon: closeCircleOutline, color: 'danger' };
    return { icon: timeOutline, color: 'warning' };
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': 'var(--ion-background-color)' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/home" text="" color="primary" />
          </IonButtons>
          <IonTitle style={{ fontWeight: 'bold', color: 'var(--ion-color-primary)' }}>Hesabım</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#f8f9fa' }}>
        
        {/* ÜST KISIM: PROFİL FOTOSU */}
        <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '15px' }}>
          <IonIcon icon={personCircleOutline} style={{ fontSize: '80px', color: 'var(--ion-color-primary)' }} />
          <h2 style={{ fontWeight: 'bold', margin: '10px 0 5px 0', color: '#111' }}>
            {firstName} {lastName}
          </h2>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Kayıtlı Hasta</p>
        </div>

        {/* 🎛️ SEKMELER (TABS) */}
        <div style={{ padding: '0 15px' }}>
          <IonSegment 
            value={activeTab} 
            onIonChange={e => setActiveTab(e.detail.value as 'info' | 'orders')} 
            style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '4px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}
          >
            <IonSegmentButton value="info" style={{ '--border-radius': '8px' }}>
              <IonLabel style={{ fontWeight: 'bold', textTransform: 'none' }}>Bilgilerim</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="orders" style={{ '--border-radius': '8px' }}>
              <IonLabel style={{ fontWeight: 'bold', textTransform: 'none' }}>Siparişlerim</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        {/* BİLGİLERİM SEKMESİ */}
        {activeTab === 'info' && (
          <div style={{ padding: '20px 15px', animation: 'fadeIn 0.3s ease-in-out' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <IonInput label="Ad Soyad" labelPlacement="floating" fill="outline" readonly value={`${firstName} ${lastName}`} style={{ '--background': '#ffffff', '--border-radius': '12px', '--border-color': '#e0e0e0', '--color': '#111' }} />
              <IonInput label="Telefon Numarası" labelPlacement="floating" fill="outline" type="tel" value={phone} onIonInput={e => setPhone(e.detail.value || '')} style={{ '--background': '#ffffff', '--border-radius': '12px', '--border-color': '#e0e0e0', '--color': '#111' }} />
              <IonInput label="Teslimat Adresi" labelPlacement="floating" fill="outline" value={address} onIonInput={e => setAddress(e.detail.value || '')} style={{ '--background': '#ffffff', '--border-radius': '12px', '--border-color': '#e0e0e0', '--color': '#111' }} />
            </div>

            <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <IonButton expand="block" color="primary" style={{ '--border-radius': '12px', height: '52px', fontWeight: 'bold', '--box-shadow': '0 4px 12px rgba(45, 211, 111, 0.3)' }}>
                <IonIcon slot="start" icon={saveOutline} />
                BİLGİLERİ KAYDET
              </IonButton>
              <IonButton expand="block" color="danger" fill="outline" onClick={handleLogout} style={{ '--border-radius': '12px', height: '52px', fontWeight: 'bold' }}>
                <IonIcon slot="start" icon={logOutOutline} />
                ÇIKIŞ YAP
              </IonButton>
            </div>
          </div>
        )}

        {/* SİPARİŞLERİM SEKMESİ (GERÇEK VERİLER) */}
        {activeTab === 'orders' && (
          <div style={{ padding: '20px 15px', animation: 'fadeIn 0.3s ease-in-out' }}>
            {loading ? (
               <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}><IonSpinner name="crescent" color="primary" /></div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', marginTop: '40px', color: '#888' }}>
                <IonIcon icon={cubeOutline} style={{ fontSize: '64px', color: '#ccc', marginBottom: '10px' }} />
                <p>Henüz geçmiş bir siparişiniz bulunmuyor.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {orders.map((order) => {
                  const statusStyle = getStatusStyle(order.status);
                  return (
                    <div key={order.id} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 'bold', color: '#333' }}>Sipariş No: SP-{order.id}</span>
                        <span style={{ color: '#888', fontSize: '13px' }}>
                          {new Date(order.orderDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <IonIcon icon={statusStyle.icon} color={statusStyle.color} style={{ fontSize: '20px' }} />
                          <span style={{ fontWeight: '600', color: `var(--ion-color-${statusStyle.color})`, fontSize: '14px' }}>
                            {order.status}
                          </span>
                        </div>
                        <span style={{ fontWeight: '900', fontSize: '18px', color: '#111' }}>
                          {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(order.totalAmount)} ₺
                        </span>
                      </div>

                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

      </IonContent>
    </IonPage>
  );
};

export default Profile;