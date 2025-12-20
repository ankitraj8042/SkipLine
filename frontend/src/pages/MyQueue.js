import React, { useState, useEffect } from 'react';
import { queueAPI } from '../services/api';
import '../styles/MyQueue.css';

function MyQueue() {
  const [queueStatus, setQueueStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [phone, setPhone] = useState('');
  const [queueId, setQueueId] = useState('');

  useEffect(() => {
    // Check if user has a saved queue entry
    const savedEntry = localStorage.getItem('currentQueueEntry');
    if (savedEntry) {
      const entry = JSON.parse(savedEntry);
      setPhone(entry.phone);
      setQueueId(entry.queueId);
      fetchQueueStatus(entry.queueId, entry.phone);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchQueueStatus = async (qId, ph) => {
    try {
      setLoading(true);
      const data = await queueAPI.getPosition(qId, ph);
      setQueueStatus(data);
      setError('');
    } catch (err) {
      setError('Could not find your position in queue.');
      localStorage.removeItem('currentQueueEntry');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (queueId && phone) {
      fetchQueueStatus(queueId, phone);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your queue entry?')) {
      return;
    }

    try {
      const savedEntry = JSON.parse(localStorage.getItem('currentQueueEntry'));
      await queueAPI.cancelEntry(savedEntry.queueId, savedEntry.entryId);
      localStorage.removeItem('currentQueueEntry');
      setQueueStatus(null);
      alert('Queue entry cancelled successfully');
    } catch (err) {
      alert('Failed to cancel entry. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading your queue status...</div>;
  }

  if (!queueStatus && !localStorage.getItem('currentQueueEntry')) {
    return (
      <div className="my-queue-container">
        <div className="search-section">
          <h1>Track Your Queue Position</h1>
          <p>Enter your details to check your position in the queue</p>
          
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-group">
              <label>Queue ID</label>
              <input
                type="text"
                value={queueId}
                onChange={(e) => setQueueId(e.target.value)}
                placeholder="Enter queue ID"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary">
              Check Status
            </button>
          </form>

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-queue-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const { entry, peopleAhead, queue } = queueStatus;

  return (
    <div className="my-queue-container">
      <div className="status-card">
        <h1>Your Queue Status</h1>
        
        <div className="queue-info-display">
          <h2>{queue.name}</h2>
          <div className="status-badge-large">{entry.status}</div>
        </div>

        <div className="position-display">
          <div className="position-number">
            <span className="label">Your Position</span>
            <span className="number">#{entry.position}</span>
          </div>
          
          <div className="position-number">
            <span className="label">Currently Serving</span>
            <span className="number">#{queue.currentServingPosition}</span>
          </div>
        </div>

        <div className="wait-info">
          <div className="wait-item">
            <span className="wait-label">People Ahead:</span>
            <span className="wait-value">{peopleAhead}</span>
          </div>
          
          <div className="wait-item">
            <span className="wait-label">Estimated Wait:</span>
            <span className="wait-value">~{entry.estimatedWaitTime} minutes</span>
          </div>
        </div>

        <div className="user-details">
          <p><strong>Name:</strong> {entry.userName}</p>
          <p><strong>Phone:</strong> {entry.userPhone}</p>
          {entry.userEmail && <p><strong>Email:</strong> {entry.userEmail}</p>}
          {entry.notes && <p><strong>Notes:</strong> {entry.notes}</p>}
        </div>

        {entry.status === 'waiting' && (
          <div className="action-buttons">
            <button 
              onClick={() => fetchQueueStatus(queueId, phone)} 
              className="btn btn-secondary"
            >
              Refresh Status
            </button>
            <button 
              onClick={handleCancel} 
              className="btn btn-danger"
            >
              Cancel Entry
            </button>
          </div>
        )}

        {entry.status === 'called' && (
          <div className="alert alert-success">
            <strong>It's your turn!</strong> Please proceed to the service point.
          </div>
        )}
      </div>
    </div>
  );
}

export default MyQueue;
