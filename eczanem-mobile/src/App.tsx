import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { 
  IonApp, IonRouterOutlet, setupIonicReact,
  IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { homeOutline, gridOutline, heartOutline, cartOutline, personOutline } from 'ionicons/icons';

/* Sayfalarımız */
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Medicines from './pages/Medicines';
import MedicineDetail from './pages/MedicineDetail';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';

/* Core CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';

setupIonicReact();

// 🎯 E-TİCARET DÜNYAMIZ (Alt Menülü Kısım)
const MainTabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        
        {/* 🎯 ÇÖZÜM: render={() => ...} formatına geçtik */}
        <Route exact path="/app/home" render={() => <Dashboard />} /> 
        <Route exact path="/app/categories" render={() => <Medicines />} /> 
        <Route exact path="/app/favorites" render={() => <Favorites />} />
        <Route exact path="/app/cart" render={() => <Orders />} /> 
        <Route exact path="/app/profile" render={() => <Profile />} />
        <Route exact path="/app/medicine-detail/:id" render={() => <MedicineDetail />} />

        {/* /app dizinine girilirse direkt anasayfaya at */}
        <Route exact path="/app" render={() => <Redirect to="/app/home" />} />

      </IonRouterOutlet>

      <IonTabBar slot="bottom" style={{ '--background': '#ffffff', borderTop: '1px solid #f0f0f0', paddingBottom: '4px', paddingTop: '4px' }}>
        <IonTabButton tab="home" href="/app/home">
          <IonIcon icon={homeOutline} />
          <IonLabel style={{ fontWeight: '500' }}>Anasayfa</IonLabel>
        </IonTabButton>

        <IonTabButton tab="categories" href="/app/categories">
          <IonIcon icon={gridOutline} />
          <IonLabel style={{ fontWeight: '500' }}>Kategoriler</IonLabel>
        </IonTabButton>

        <IonTabButton tab="favorites" href="/app/favorites">
          <IonIcon icon={heartOutline} />
          <IonLabel style={{ fontWeight: '500' }}>Favoriler</IonLabel>
        </IonTabButton>

        <IonTabButton tab="cart" href="/app/cart">
          <IonIcon icon={cartOutline} />
          <IonLabel style={{ fontWeight: '500' }}>Sepet</IonLabel>
        </IonTabButton>

        <IonTabButton tab="profile" href="/app/profile">
          <IonIcon icon={personOutline} />
          <IonLabel style={{ fontWeight: '500' }}>Hesabım</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        
        {/* KİMLİK DÜNYASI */}
        <Route exact path="/login" render={() => <Login />} />
        <Route exact path="/register" render={() => <Register />} />

        {/* E-TİCARET DÜNYASI */}
        <Route path="/app" render={() => <MainTabs />} />

        {/* UYGULAMA İLK AÇILDIĞINDA */}
        <Route exact path="/" render={() => <Redirect to="/login" />} />

      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;