import React, { useState, useEffect, useRef, useCallback } from 'react';
import { queueAPI } from '../services/api';
import { showSuccess, showError, showYourTurn, showTurnApproaching } from '../utils/toast';
import { requestNotificationPermission, showBrowserNotification } from '../utils/pushNotifications';
import '../styles/MyQueue.css';

function MyQueue() {
  const [queueStatus, setQueueStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [phone, setPhone] = useState('');
  const [queueId, setQueueId] = useState('');
  const [lastStatus, setLastStatus] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const audioRef = useRef(null);

  // Request notification permission on mount
  useEffect(() => {
    const setupNotifications = async () => {
      const granted = await requestNotificationPermission();
      setNotificationsEnabled(granted);
    };
    setupNotifications();
  }, []);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, []);

  // Check for status changes and notify
  const checkAndNotify = useCallback((newData) => {
    if (!lastStatus) {
      setLastStatus(newData);
      return;
    }

    const { entry, peopleAhead } = newData;
    const prevEntry = lastStatus.entry;
    
    // Status changed to "called" - IT'S YOUR TURN!
    if (prevEntry.status === 'waiting' && entry.status === 'called') {
      playNotificationSound();
      showYourTurn(newData.queue.name);
      
      // Browser notification
      if (notificationsEnabled) {
        showBrowserNotification('🔔 IT\'S YOUR TURN!', {
          body: `Please proceed to ${newData.queue.name} immediately!`,
          requireInteraction: true,
          tag: 'your-turn'
        });
      }
    }
    
    // People ahead decreased significantly (turn approaching)
    if (prevEntry.status === 'waiting' && entry.status === 'waiting') {
      if (lastStatus.peopleAhead > 3 && peopleAhead <= 3 && peopleAhead > 0) {
        showTurnApproaching(entry.position, peopleAhead);
        
        if (notificationsEnabled) {
          showBrowserNotification('⏰ Your turn is approaching!', {
            body: `${peopleAhead} ${peopleAhead === 1 ? 'person' : 'people'} ahead of you`,
            tag: 'turn-approaching'
          });
        }
      }
    }

    setLastStatus(newData);
  }, [lastStatus, notificationsEnabled, playNotificationSound]);

  const fetchQueueStatus = useCallback(async (qId, ph) => {
    try {
      setLoading(true);
      const data = await queueAPI.getPosition(qId, ph);
      setQueueStatus(data);
      checkAndNotify(data);
      setError('');
    } catch (err) {
      setError('Could not find your position in queue.');
      localStorage.removeItem('currentQueueEntry');
    } finally {
      setLoading(false);
    }
  }, [checkAndNotify]);

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

  // Auto-refresh every 10 seconds when in queue
  useEffect(() => {
    if (queueStatus && queueStatus.entry.status === 'waiting') {
      const interval = setInterval(() => {
        const savedEntry = localStorage.getItem('currentQueueEntry');
        if (savedEntry) {
          const entry = JSON.parse(savedEntry);
          fetchQueueStatus(entry.queueId, entry.phone);
        }
      }, 10000); // Refresh every 10 seconds
      
      return () => clearInterval(interval);
    }
  }, [queueStatus, fetchQueueStatus]);

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
      showSuccess('Queue entry cancelled successfully');
    } catch (err) {
      showError('Failed to cancel entry. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your queue status...</p>
      </div>
    );
  }

  if (!queueStatus && !localStorage.getItem('currentQueueEntry')) {
    return (
      <div className="my-queue-page">
        <div className="my-queue-container">
          <div className="search-card">
            <div className="card-header">
              <h1>Track Your Queue</h1>
              <p>Enter your details to check your position</p>
            </div>
            
            <form onSubmit={handleSearch} className="search-form">
              <div className="form-group">
                <label htmlFor="queueId">Queue ID</label>
                <input
                  type="text"
                  id="queueId"
                  value={queueId}
                  onChange={(e) => setQueueId(e.target.value)}
                  placeholder="Enter queue ID"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-primary btn-full">
                Check Status
              </button>
            </form>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-queue-page">
        <div className="my-queue-container">
          <div className="alert alert-error">
            {error}
          </div>
        </div>
      </div>
    );
  }

  const { entry, peopleAhead, queue } = queueStatus;

  return (
    <div className="my-queue-page">
      {/* Hidden audio for notification sound */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdnmFl5ycl4+GdWBRTl5tjJOVlpWSlY2FbFhLSldocIKRmZWQioV+b11TS0xUY3KDlJuXk42HfXBgUklKVWZ2h5aZlpKMhn1xX09HSlVld4iYnJiTjoeDdWNUSkVQYXKFl5yXko2Jf3FfUkhHU2V2iJedmJKNiIF1Y1NJRlFjdIiYnZeTjoqBcmBQR0dTZneJmZ2Xk42JgXJgT0dIVGd4iZqdl5ONiIF0YU9HR1RneImbnpeTjIl/cV9PR0hVaHmKnJ6XkoyJfnBeT0dIVWl6i5ydlpKMiH5wXk9ISFUAAIA/AABAQAAAQEAAAEBAAABAQAAAQD8AAEA/AABAPwAAQD8AAAA/AAAAPwAAAD8AAAA/" type="audio/wav"/>
      </audio>
      
      <div className="my-queue-container">
        <div className="status-main-card">
          {/* Notification permission banner */}
          {!notificationsEnabled && (
            <div className="notification-banner">
              <span>🔔</span>
              <p>Enable notifications to get alerted when it's your turn!</p>
              <button 
                onClick={async () => {
                  const granted = await requestNotificationPermission();
                  setNotificationsEnabled(granted);
                  if (granted) showSuccess('Notifications enabled!');
                }}
                className="btn btn-small"
              >
                Enable
              </button>
            </div>
          )}

          <div className="status-header">
            <h1>{queue.name}</h1>
            <span className={`status-badge-large ${entry.status}`}>
              {entry.status}
            </span>
          </div>

          <div className="queue-id-display">
            <span className="queue-id-label">Queue ID:</span>
            <span className="queue-id-value">{queueId}</span>
          </div>

          {entry.status === 'called' && (
            <div className="alert alert-success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <div>
                <strong>It's your turn!</strong>
                <p>Please proceed to the service point now.</p>
              </div>
            </div>
          )}

          {entry.status === 'missed' && (
            <div className="alert alert-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <div>
                <strong>You missed your turn</strong>
                <p>Please contact the organizer to rejoin the queue.</p>
              </div>
            </div>
          )}

          <div className="position-grid">
            <div className="position-card your-position">
              <div className="position-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="position-content">
                <span className="position-label">Your Position</span>
                <span className="position-number">#{entry.position}</span>
              </div>
            </div>
            
            <div className="position-card serving-position">
              <div className="position-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <div className="position-content">
                <span className="position-label">Now Serving</span>
                <span className="position-number">#{queue.currentServingPosition}</span>
              </div>
            </div>
          </div>

          <div className="wait-stats">
            <div className="stat-item">
              <span className="stat-icon">👥</span>
              <div className="stat-content">
                <span className="stat-label">People Ahead</span>
                <span className="stat-value">{peopleAhead}</span>
              </div>
            </div>
            
            <div className="stat-item">
              <span className="stat-icon">⏱️</span>
              <div className="stat-content">
                <span className="stat-label">Estimated Wait</span>
                <span className="stat-value">~{entry.estimatedWaitTime} min</span>
              </div>
            </div>
          </div>

          <div className="user-details-card">
            <h3>Your Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Name</span>
                <span className="detail-value">{entry.userName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone</span>
                <span className="detail-value">{entry.userPhone}</span>
              </div>
              {entry.userEmail && (
                <div className="detail-item">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{entry.userEmail}</span>
                </div>
              )}
              {entry.notes && (
                <div className="detail-item full-width">
                  <span className="detail-label">Notes</span>
                  <span className="detail-value">{entry.notes}</span>
                </div>
              )}
            </div>
          </div>

          {entry.status === 'waiting' && (
            <div className="action-buttons">
              <button 
                onClick={() => fetchQueueStatus(queueId, phone)} 
                className="btn btn-secondary"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                Refresh Status
              </button>
              <button 
                onClick={handleCancel} 
                className="btn btn-secondary btn-danger"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                Cancel Entry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyQueue;

