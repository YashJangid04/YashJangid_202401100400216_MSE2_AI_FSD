import React from 'react';
import { LogOut, User } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #e2e8f0',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem'
    }}>
      <div style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.025em' }}>
        Grievance Portal<span style={{ color: '#facc15' }}>.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
          <User size={16} />
          <span>{user.name}</span>
        </div>
        <button onClick={onLogout} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '13px',
          padding: '6px 12px',
          background: '#f8fafc'
        }}>
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
