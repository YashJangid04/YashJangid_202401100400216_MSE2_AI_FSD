import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import { Loader2 } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [isWakingUp, setIsWakingUp] = useState(true);

  useEffect(() => {
    // Check local storage for user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Ping backend to wake it up
    const wakeServer = async () => {
      try {
        await axios.get('https://yashjangid-202401100400216-mse2-ai-fsd.onrender.com/');
        setIsWakingUp(false);
      } catch (err) {
        console.log('Waiting for server...');
        setTimeout(wakeServer, 3000);
      }
    };
    wakeServer();
  }, []);

  const login = (userData) => {
    setUser(userData.user);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <AnimatePresence>
        {isWakingUp && (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 1000,
              background: '#000',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '12px',
              fontWeight: '500',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          >
            <Loader2 size={14} className="animate-spin" style={{ color: '#facc15' }} />
            Waking up server...
          </motion.div>
        )}
      </AnimatePresence>

      {user && <Navbar user={user} onLogout={logout} />}
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login onLogin={login} /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
