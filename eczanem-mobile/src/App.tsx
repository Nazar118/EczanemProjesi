import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { 
  IonApp, IonRouterOutlet, setupIonicReact,
  IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { homeOutline, gridOutline, heartOutline, cartOutline, personOutline } from 'ionicons/icons';

// 🔥 1. YENİ OLUŞTURDUĞUMUZ CONTEXT'İ İÇERİ ALIYORUZ
import { StoreProvider, StoreContext } from './context/StoreContext';

/* Sayfalarımız */
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories'; 
import MedicineDetail from './pages/MedicineDetail';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import CategoryProducts from './pages/CategoryProducts';
import Checkout from './pages/Checkout';
import ShowcaseProducts from './pages/ShowcaseProducts';

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
  // 🔥 2. CONTEXT'TEN SEPET VE FAVORİ SAYISINI ÇEK
  const { cartCount, favCount } = useContext(StoreContext);

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/app/home" render={() => <Dashboard />} /> 
        <Route exact path="/app/categories" render={() => <Categories />} /> 
        <Route exact path="/app/favorites" render={() => <Favorites />} />
        <Route exact path="/app/cart" render={() => <Orders />} /> 
        <Route exact path="/app/profile" render={() => <Profile />} />
        <Route exact path="/app/medicine-detail/:id" render={() => <MedicineDetail />} />
        <Route exact path="/app/category-products/:id" render={() => <CategoryProducts />} />
        <Route exact path="/app/checkout" render={() => <Checkout />} />
        <Route exact path="/app/showcase/:type" render={() => <ShowcaseProducts />} />
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

        {/* 🔥 FAVORİLER BUTONU VE ROZETİ */}
        <IonTabButton tab="favorites" href="/app/favorites">
          <IonIcon icon={heartOutline} />
          <IonLabel style={{ fontWeight: '500' }}>Favoriler</IonLabel>
          {favCount > 0 && <IonBadge color="danger" style={{ position: 'absolute', top: '2px', right: 'calc(50% - 25px)', fontSize: '10px' }}>{favCount}</IonBadge>}
        </IonTabButton>

        {/* 🔥 SEPET BUTONU VE ROZETİ */}
        <IonTabButton tab="cart" href="/app/cart">
          <IonIcon icon={cartOutline} />
          <IonLabel style={{ fontWeight: '500' }}>Sepet</IonLabel>
          {cartCount > 0 && <IonBadge color="danger" style={{ position: 'absolute', top: '2px', right: 'calc(50% - 20px)', fontSize: '10px' }}>{cartCount}</IonBadge>}
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
    {/* 🔥 3. TÜM UYGULAMAYI STORE PROVIDER İLE SARDIK */}
    <StoreProvider>
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
    </StoreProvider>
  </IonApp>
);

export default App;