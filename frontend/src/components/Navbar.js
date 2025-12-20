import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

function Navbar() {
  const { user, isAuthenticated, isAdmin, isUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowMobileMenu(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="brand-skip">Skip</span>
          <span className="brand-line">Line</span>
        </Link>
        
        <button 
          className="mobile-menu-toggle"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-menu ${showMobileMenu ? 'active' : ''}`}>
          {!isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={() => setShowMobileMenu(false)}>
                  Home
                </Link>
              </li>
            </>
          ) : isUser() ? (
            <>
              <li className="nav-item">
                <Link to="/user/dashboard" className="nav-link" onClick={() => setShowMobileMenu(false)}>
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/user/scan-qr" className="nav-link" onClick={() => setShowMobileMenu(false)}>
                  Scan QR
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/user/my-queue" className="nav-link" onClick={() => setShowMobileMenu(false)}>
                  My Queue
                </Link>
              </li>
            </>
          ) : isAdmin() ? (
            <>
              <li className="nav-item">
                <Link to="/admin/dashboard" className="nav-link" onClick={() => setShowMobileMenu(false)}>
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/create-queue" className="nav-link" onClick={() => setShowMobileMenu(false)}>
                  Create Queue
                </Link>
              </li>
            </>
          ) : null}

          {isAuthenticated && (
            <li className="nav-item nav-user">
              <div className="user-menu">
                <span className="user-name">{user?.name}</span>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </div>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

