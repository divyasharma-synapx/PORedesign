import { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import TopHeader from './components/Layout/TopHeader';
import Home from './components/pages/Home/Home';
import ViewPO from './components/pages/ViewPO/ViewPO';
import Marketplace from './components/pages/Marketplace/Marketplace';
import Cart from './components/pages/Cart/Cart';
import Checkout from './components/pages/Checkout/Checkout';
import './App.css';

function AppContent() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const toggleSidebar = () => setIsSidebarExpanded(prev => !prev);

  return (
    <div className="app-shell">
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      {isSidebarExpanded && <div className="sidebar-overlay" onClick={toggleSidebar} />}
      <div className={`app-body ${isSidebarExpanded ? 'sidebar-open' : ''}`}>
        <TopHeader />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/po/:id" element={<ViewPO />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
