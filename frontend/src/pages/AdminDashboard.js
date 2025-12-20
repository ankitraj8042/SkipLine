import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { queueAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

function AdminDashboard() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchQueues();
  }, []);

  const fetchQueues = async () => {
    try {
      const data = await queueAPI.getAllQueues();
      setQueues(data);
    } catch (err) {
      console.error('Failed to fetch queues:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const activeQueues = queues.filter(q => q.isActive);
  const totalServed = queues.reduce((sum, q) => sum + q.totalServed, 0);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Organizer Dashboard</h1>
            <p>Welcome back, {user?.name}!</p>
          </div>
          <Link to="/admin/create-queue" className="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create New Queue
          </Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Queues</p>
              <h2 className="stat-value">{queues.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon active-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Active Queues</p>
              <h2 className="stat-value">{activeQueues.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon served-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Served</p>
              <h2 className="stat-value">{totalServed}</h2>
            </div>
          </div>
        </div>

        <div className="queues-section">
          <h2>Your Queues</h2>
          {queues.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <h3>No queues yet</h3>
              <p>Create your first queue to get started</p>
              <Link to="/admin/create-queue" className="btn btn-primary">
                Create Queue
              </Link>
            </div>
          ) : (
            <div className="queues-grid">
              {queues.map(queue => (
                <div key={queue._id} className="queue-card-admin">
                  <div className="queue-card-header">
                    <h3>{queue.name}</h3>
                    <span className={`status-badge ${queue.isActive ? 'active' : 'inactive'}`}>
                      {queue.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="queue-type">{queue.organizationType}</p>
                  <div className="queue-stats-mini">
                    <div className="mini-stat">
                      <span className="mini-label">Current</span>
                      <span className="mini-value">#{queue.currentServingPosition}</span>
                    </div>
                    <div className="mini-stat">
                      <span className="mini-label">Served</span>
                      <span className="mini-value">{queue.totalServed}</span>
                    </div>
                    <div className="mini-stat">
                      <span className="mini-label">Capacity</span>
                      <span className="mini-value">{queue.maxCapacity}</span>
                    </div>
                  </div>
                  <Link 
                    to={`/admin/manage/${queue._id}`} 
                    className="btn btn-secondary btn-full"
                  >
                    Manage Queue
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

