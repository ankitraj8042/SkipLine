import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">📋</span>
          QueueUp
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/scan-qr" className="nav-link">📱 Scan QR</Link>
          </li>
          <li className="nav-item">
            <Link to="/queues" className="nav-link">Find Queues</Link>
          </li>
          <li className="nav-item">
            <Link to="/my-queue" className="nav-link">My Queue</Link>
          </li>
          <li className="nav-item">
            <Link to="/admin" className="nav-link">Admin</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
