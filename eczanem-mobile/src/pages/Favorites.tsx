import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButtons, IonBackButton, IonIcon } from '@ionic/react';
import { getMedicines } from '../services/medicineService';
import { heart } from 'ionicons/icons';

interface Medicine {
  id: number;
  name: string;
}

const Favorites: React.FC = () => {
  const [favMedicines, setFavMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    const fetchFavs = async () => {
      const favIds = JSON.parse(localStorage.getItem('favorites') || '[]');
      const response = await getMedicines(); 
      
      const filtered = response.data.filter((m: Medicine) => favIds.includes(m.id));
      setFavMedicines(filtered);
    };
    fetchFavs();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger">
          <IonButtons slot="start"><IonBackButton defaultHref="/dashboard" /></IonButtons>
          <IonTitle>Favori İlaçlarım</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {favMedicines.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px', color: 'gray' }}>
            <IonIcon icon={heart} style={{ fontSize: '64px', opacity: 0.3 }} />
            <p>Henüz favori ilacın yok.</p>
          </div>
        ) : (
          <IonList>
            {favMedicines.map(m => (
              <IonItem key={m.id} routerLink={`/medicine-detail/${m.id}`}>
                <IonLabel><h2>{m.name}</h2></IonLabel>
                <IonIcon icon={heart} slot="end" color="danger" />
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Favorites;