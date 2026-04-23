import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, Edit3, X, Check } from 'lucide-react';

const Dashboard = () => {
  const [grievances, setGrievances] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Academic'
  });

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/grievances', config);
      setGrievances(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:5000/api/grievances/search?title=${search}`, config);
      setGrievances(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/grievances/${editingId}`, formData, config);
      } else {
        await axios.post('http://localhost:5000/api/grievances', formData, config);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ title: '', description: '', category: 'Academic' });
      fetchGrievances();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this grievance?')) {
      try {
        await axios.delete(`http://localhost:5000/api/grievances/${id}`, config);
        fetchGrievances();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEdit = (g) => {
    setEditingId(g._id);
    setFormData({ title: g.title, description: g.description, category: g.category });
    setIsModalOpen(true);
  };

  const toggleStatus = async (g) => {
      try {
          const newStatus = g.status === 'Pending' ? 'Resolved' : 'Pending';
          await axios.put(`http://localhost:5000/api/grievances/${g._id}`, { ...g, status: newStatus }, config);
          fetchGrievances();
      } catch (err) {
          console.error(err);
      }
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>My Grievances</h2>
        <button className="primary" onClick={() => { setEditingId(null); setFormData({ title: '', description: '', category: 'Academic' }); setIsModalOpen(true); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> New Grievance
        </button>
      </div>

      <form onSubmit={handleSearch} className="search-bar">
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            style={{ paddingLeft: '40px' }}
            placeholder="Search grievances by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button type="submit" className="glass" style={{ padding: '0 24px' }}>Search</button>
      </form>

      <div className="grievances-list">
        <AnimatePresence mode='popLayout'>
          {grievances.map((g) => (
            <motion.div 
              key={g._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="grievance-card glass"
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span className={`badge ${g.status.toLowerCase()}`}>{g.status}</span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>{new Date(g.date).toLocaleDateString()}</span>
                  <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>{g.category}</span>
                </div>
                <h3 style={{ marginBottom: '4px' }}>{g.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>{g.description}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => toggleStatus(g)} className="glass" style={{ padding: '8px', color: g.status === 'Resolved' ? '#10b981' : '#94a3b8' }} title="Toggle Status">
                  <Check size={18} />
                </button>
                <button onClick={() => handleEdit(g)} className="glass" style={{ padding: '8px', color: '#818cf8' }} title="Edit">
                  <Edit3 size={18} />
                </button>
                <button onClick={() => handleDelete(g._id)} className="glass" style={{ padding: '8px', color: '#ef4444' }} title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {grievances.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
            No grievances found.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass" 
            style={{ width: '100%', maxWidth: '500px', padding: '32px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>{editingId ? 'Edit Grievance' : 'New Grievance'}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', color: '#94a3b8' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. WiFi not working in Hostel"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Academic">Academic</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Transport">Transport</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  required
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Provide details about your issue..."
                />
              </div>
              <button type="submit" className="primary" style={{ width: '100%' }}>
                {editingId ? 'Update' : 'Submit'} Grievance
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
