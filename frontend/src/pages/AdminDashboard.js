import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { queueAPI } from '../services/api';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

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
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <Link to="/admin/create-queue" className="btn btn-primary">
          + Create New Queue
        </Link>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Queues</h3>
          <p className="stat-number">{queues.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Queues</h3>
          <p className="stat-number">{queues.filter(q => q.isActive).length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Served Today</h3>
          <p className="stat-number">
            {queues.reduce((sum, q) => sum + q.totalServed, 0)}
          </p>
        </div>
      </div>

      <div className="queues-table-section">
        <h2>All Queues</h2>
        <div className="table-container">
          <table className="queues-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Current Position</th>
                <th>Total Served</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {queues.map(queue => (
                <tr key={queue._id}>
                  <td>{queue.name}</td>
                  <td>{queue.organizationType}</td>
                  <td>
                    <span className={`badge ${queue.isActive ? 'active' : 'inactive'}`}>
                      {queue.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>#{queue.currentServingPosition}</td>
                  <td>{queue.totalServed}</td>
                  <td>
                    <Link 
                      to={`/admin/manage/${queue._id}`} 
                      className="btn btn-small"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
