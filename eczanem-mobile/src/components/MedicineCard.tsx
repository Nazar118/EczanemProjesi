import React from 'react';
import { IonCard, IonLabel, IonBadge, IonIcon } from '@ionic/react';
import { medkit } from 'ionicons/icons';

interface MedicineCardProps {
  name: string;
  status?: string;
  date?: string;
  onClick: () => void;
}

const MedicineCard: React.FC<MedicineCardProps> = ({ name, status, date, onClick }) => {
  
  const getStatusColor = (s?: string) => {
    if (s === 'Hazırlanıyor') return 'warning';
    if (s === 'Hazır') return 'success';
    if (s === 'İptal Edildi') return 'danger';
    return 'medium';
  };

  return (
    <IonCard
      button
      onClick={onClick}
      style={{
        margin: '0 0 16px 0',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)', // Gölgeyi biraz daha belirgin yaptık
        backgroundColor: 'var(--ion-item-background)',
        border: '1px solid rgba(255, 255, 255, 0.05)' // Çok hafif bir kenarlık kartı ortaya çıkarır
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px', width: '100%' }}>
        
        {/* 🎨 İkonun arkasındaki kutuyu temaya uydurduk */}
        <div style={{
          backgroundColor: 'rgba(166, 48, 115, 0.1)', // Magenta rengimizin çok şeffaf hali
          borderRadius: '12px',
          padding: '14px',
          marginRight: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <IonIcon icon={medkit} style={{ color: 'var(--ion-color-primary)', fontSize: '24px' }} />
        </div>

        <div style={{ flex: 1 }}>
          <IonLabel>
            {/* ✍️ Siyah (#111) yerine Beyaz yaptık */}
            <h2 style={{ fontWeight: 'bold', fontSize: '18px', margin: 0, letterSpacing: '-0.3px', color: '#111' }}>
              {name}
            </h2>
            {date && (
              /* ✍️ Koyu gri (#888) yerine açık gri yaptık ki mor üstünde okunsun */
              <p style={{ fontSize: '13px', color: '#b0b0b0', marginTop: '6px', marginBottom: 0 }}>
                {date}
              </p>
            )}
          </IonLabel>
        </div>

        {status && (
          <div style={{ marginLeft: '10px' }}>
            <IonBadge 
              color={getStatusColor(status)} 
              style={{ 
                padding: '6px 12px', 
                borderRadius: '8px', 
                fontWeight: 'bold',
                fontSize: '11px',
                textTransform: 'uppercase' // Daha modern durur
              }}
            >
              {status}
            </IonBadge>
          </div>
        )}

      </div>
    </IonCard>
  );
};

export default MedicineCard;