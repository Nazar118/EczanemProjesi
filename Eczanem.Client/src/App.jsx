import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login/Login';
import ComingSoon from './pages/ComingSoon'; // <-- Yeni oluşturduğumuz sayfa

// Mevcut Sayfalar
import Dashboard from './pages/Dashboard/Dashboard';
import Medicines from './pages/Medicines/Medicines';
import Stock from './pages/Stock/Stock';
import Sales from './pages/Sales/Sales';
import Patients from './pages/Patients/Patients';

import './App.css'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Categories from './pages/Categories/Categories';
import Suppliers from './pages/Suppliers/Suppliers';
import ExpiryTracker from './pages/Expiry/ExpiryTracker';
import CriticalStock from './pages/Stock/CriticalStock';
import StockHistory from './pages/Stock/StockHistory';
import SalesHistory from './pages/Sales/SalesHistory';
import Reports from './pages/Reports/Reports';
import ChronicDiseases from './pages/Diseases/ChronicDiseases';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import OnlineOrders from './pages/OnlineOrders';
import AddVitrinProduct from './pages/Vitrin/AddVitrinProduct';
import ShowcaseCategories from './pages/Vitrin/ShowcaseCategories';
function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Router>
      <div className="d-flex">
        
        {user && <Sidebar />}

        <div className="flex-grow-1 p-4 bg-light" style={{ minHeight: "100vh" }}>
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

            {/* --- DASHBOARD --- */}
            <Route path="/" element={
              user ? (user.role === 'admin' ? <Dashboard /> : <Navigate to="/medicines" />) : <Navigate to="/login" />
            } />

            {/* --- İLAÇ YÖNETİMİ GRUBU --- */}
            {/* Mevcut Sayfa */}
            <Route path="/medicines" element={user ? <Medicines /> : <Navigate to="/login" />} />
            {/* Yeni Sayfalar (Yapım Aşamasında) */}
            <Route path="/categories" element={user ? <Categories /> : <Navigate to="/login" />} />           
            <Route path="/suppliers" element={user ? <Suppliers /> : <Navigate to="/login" />} />            
            <Route path="/expiry" element={user ? <ExpiryTracker /> : <Navigate to="/login" />} />
            {/* --- STOK TAKİBİ GRUBU --- */}
            {/* Mevcut Sayfa */}
            <Route path="/stocks" element={
               user ? ((user.role === 'admin' || user.role === 'eczaci') ? <Stock /> : <Navigate to="/medicines" />) : <Navigate to="/login" />
            } />
            <Route path="/stocks/critical" element={user ? <CriticalStock /> : <Navigate to="/login" />} />            
            <Route path="/stocks/history" element={user ? <StockHistory /> : <Navigate to="/login" />} />
            {/* --- SATIŞ GRUBU --- */}
            {/* Mevcut Sayfa */}
            <Route path="/sales" element={
               user ? (user.role === 'admin' ? <Sales /> : <Navigate to="/medicines" />) : <Navigate to="/login" />
            } />
            <Route path="/sales/history" element={user ? <SalesHistory /> : <Navigate to="/login" />} />            
            <Route path="/reports" element={user ? <Reports /> : <Navigate to="/login" />} />
            {/* --- HASTALAR GRUBU --- */}
            <Route path="/patients" element={user ? <Patients /> : <Navigate to="/login" />} />
            <Route path="/patients/chronic" element={user ? <ChronicDiseases /> : <Navigate to="/login" />} />
            {/* --- DİĞERLERİ --- */}
           <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/login" />} />          
           <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
           <Route path="/online-orders" element={user ? <OnlineOrders /> : <Navigate to="/login" />} />
           <Route path="/vitrin/add" element={user ? <AddVitrinProduct /> : <Navigate to="/login" />} />
           <Route path="/vitrin-kategorileri" element={<ShowcaseCategories />} />
          </Routes>
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </Router>
  );
}

export default App;