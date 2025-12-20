import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Skip the Line, Save Your Time
          </h1>
          <p className="hero-subtitle">
            Join queues digitally and track your position in real-time.
            Simply scan a QR code or browse available queues!
          </p>
          <div className="hero-buttons">
            <Link to="/scan-qr" className="btn btn-primary btn-large">
              📱 Scan QR Code
            </Link>
            <Link to="/queues" className="btn btn-secondary btn-large">
              Find a Queue
            </Link>
            <Link to="/admin/create-queue" className="btn btn-secondary btn-large">
              Create Queue
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">Why Choose QueueUp?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>QR Code Scanning</h3>
            <p>Instantly join queues by scanning QR codes</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>Real-Time Updates</h3>
            <p>Track your position and estimated wait time live</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3>Smart Notifications</h3>
            <p>Get alerts when your turn is approaching</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🏥</div>
            <h3>Multiple Use Cases</h3>
            <p>Perfect for clinics, shops, colleges & more</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Easy Management</h3>
            <p>Powerful admin dashboard for organizers</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🚫</div>
            <h3>No Crowding</h3>
            <p>Wait remotely and avoid physical queues</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Fair & Transparent</h3>
            <p>Strict digital order with no line-skipping</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Scan QR Code</h3>
            <p>Use your camera to scan the queue's QR code instantly</p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>Enter Details</h3>
            <p>Fill in your name and contact information</p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>Track Position</h3>
            <p>Monitor your position and estimated wait time</p>
          </div>
          
          <div className="step">
            <div className="step-number">4</div>
            <h3>Get Notified</h3>
            <p>Know exactly when it's your turn</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
