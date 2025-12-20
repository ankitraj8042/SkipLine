import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Landing.css';

function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isUser } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin()) {
        navigate('/admin/dashboard');
      } else if (isUser()) {
        navigate('/user/dashboard');
      }
    }
  }, [isAuthenticated, isAdmin, isUser, navigate]);

  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-header">
          <h1 className="brand-title">
            <span className="brand-skip">Skip</span>
            <span className="brand-line">Line</span>
          </h1>
          <p className="brand-tagline">Smart Queue Management for Modern Times</p>
        </div>

        <div className="landing-cards">
          <div className="role-card user-card">
            <div className="role-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h2>I'm a User</h2>
            <p>Join queues, track your position, and save time</p>
            <div className="role-features">
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Scan QR codes</span>
              </div>
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Real-time updates</span>
              </div>
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Track wait times</span>
              </div>
            </div>
            <div className="role-actions">
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/login/user')}
              >
                Login
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => navigate('/register/user')}
              >
                Sign Up
              </button>
            </div>
          </div>

          <div className="role-card admin-card">
            <div className="role-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h2>I'm an Organizer</h2>
            <p>Create and manage queues with powerful admin tools</p>
            <div className="role-features">
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Create queues</span>
              </div>
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Manage participants</span>
              </div>
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>View analytics</span>
              </div>
            </div>
            <div className="role-actions">
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/login/admin')}
              >
                Login
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => navigate('/register/admin')}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

        <div className="landing-footer">
          <p>Trusted by clinics, shops, colleges, and more</p>
        </div>
      </div>
    </div>
  );
}

export default Landing;
