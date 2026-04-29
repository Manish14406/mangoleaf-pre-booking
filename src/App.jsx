import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import TableReservation from './pages/table/TableReservation';
import TablePayment from './pages/table/TablePayment';
import PartySelection from './pages/party/PartySelection';
import PartyGuestDetails from './pages/party/PartyGuestDetails';
import PartyMenuSelection from './pages/party/PartyMenuSelection';
import LiquorMenu from './pages/party/LiquorMenu';
import NonLiquorMenu from './pages/party/NonLiquorMenu';
import PartyPayment from './pages/party/PartyPayment';
import Confirmation from './pages/Confirmation';
import './index.css';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        
        {/* Table Reservation Flow */}
        <Route path="/table" element={<TableReservation />} />
        <Route path="/table/payment" element={<TablePayment />} />
        
        {/* Party Hall Booking Flow */}
        <Route path="/party" element={<PartySelection />} />
        <Route path="/party/details" element={<PartyGuestDetails />} />
        <Route path="/party/menu-type" element={<PartyMenuSelection />} />
        <Route path="/party/menu/liquor" element={<LiquorMenu />} />
        <Route path="/party/menu/non-liquor" element={<NonLiquorMenu />} />
        <Route path="/party/payment" element={<PartyPayment />} />
        
        {/* Shared Confirmation */}
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <h1 className="text-gradient">Mango Leaf PUB & Restaurant</h1>
          <p>Premium Event & Table Reservations</p>
        </header>
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
