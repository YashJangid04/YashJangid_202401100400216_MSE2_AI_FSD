import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="auth-card"
    >
      <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Register</h2>
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Create your student account</p>
      {error && <div style={{ color: '#ef4444', marginBottom: '16px', fontSize: '13px', fontWeight: '500' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            required 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="John Doe"
          />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            required 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="name@example.com"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            required 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            placeholder="••••••••"
          />
        </div>
        <button type="submit" className="primary" style={{ width: '100%', marginTop: '1rem' }}>
          Register
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8', fontSize: '14px' }}>
        Already have an account? <Link to="/login" style={{ color: '#818cf8', textDecoration: 'none' }}>Login</Link>
      </p>
    </motion.div>
  );
};

export default Register;
