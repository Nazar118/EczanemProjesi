import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Medicines from './pages/Medicines';
import MedicineDetail from './pages/MedicineDetail';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import Register from './pages/Register';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/home">
          <Home />
        </Route>
        
        {/* Login rotamızı ekledik */}
        <Route exact path="/login">
          <Login />
        </Route>

        {/* Uygulama ilk açıldığında otomatik /login'e gitsin */}
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>
        <Route exact path="/medicines">
          <Medicines />
        </Route>
        <Route exact path="/medicine-detail/:id">
          <MedicineDetail />
        </Route>
        <Route exact path="/orders">
          <Orders />
       </Route>
       <Route exact path="/profile">
        <Profile />
      </Route>
      <Route exact path="/favorites">
       <Favorites />
      </Route>
      <Route exact path="/register">
       <Register />
       </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;