import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Starfield } from './components/Starfield';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { useState, useEffect } from 'react';
import { useAdminStore } from './lib/store';
import Home from './pages/Home';
import Ranks from './pages/Ranks';
import Keys from './pages/Keys';
import Bundles from './pages/Bundles';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const checkSession = useAdminStore((state) => state.checkSession);
  const isLoggedIn = useAdminStore((state) => state.isLoggedIn);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <BrowserRouter>
      <div className="min-h-screen relative">
        <Starfield />
        <div className="relative z-10">
          <Navbar />
          <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ranks" element={<Ranks />} />
              <Route path="/keys" element={<Keys />} />
              <Route path="/bundles" element={<Bundles />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<Admin />} />
              <Route
                path="/admin/dashboard"
                element={isLoggedIn ? <AdminDashboard /> : <Admin />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;