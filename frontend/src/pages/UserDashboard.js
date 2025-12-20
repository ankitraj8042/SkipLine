import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name}!</h1>
          <p>What would you like to do today?</p>
        </div>

        <div className="dashboard-grid">
          <Link to="/user/scan-qr" className="dashboard-card scan-card">
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </div>
            <h2>Scan QR Code</h2>
            <p>Instantly join a queue by scanning its QR code</p>
            <div className="card-arrow">→</div>
          </Link>

          <Link to="/user/my-queue" className="dashboard-card queue-card">
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
            <h2>My Queue Status</h2>
            <p>Track your current position and wait time</p>
            <div className="card-arrow">→</div>
          </Link>
        </div>

        <div className="quick-stats">
          <h3>Quick Tips</h3>
          <div className="tips-list">
            <div className="tip-item">
              <span className="tip-icon">�</span>
              <p>Scan QR codes at locations to instantly join their queues</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">✨</span>
              <p>Your details are automatically used - no need to enter them again</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">⏱️</span>
              <p>Check "My Queue" for real-time position updates and wait times</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
