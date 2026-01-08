import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { queueAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showSuccess, showError, showInfo } from '../utils/toast';
import { requestNotificationPermission } from '../utils/pushNotifications';
import '../styles/JoinQueue.css';

function JoinQueue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [queue, setQueue] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        const data = await queueAPI.getQueueById(id);
        setQueue(data.queue);
        setError('');
      } catch (err) {
        setError('Failed to load queue details.');
        showError('Failed to load queue details');
      } finally {
        setLoading(false);
      }
    };

    fetchQueueData();
    // Request notification permission early
    requestNotificationPermission();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Use logged-in user's details automatically
    const formData = {
      userName: user.name,
      userPhone: user.phone,
      userEmail: user.email,
      notes: notes
    };

    setSubmitting(true);
    setError('');

    try {
      const result = await queueAPI.joinQueue(id, formData);
      // Save entry details to localStorage for tracking
      localStorage.setItem('currentQueueEntry', JSON.stringify({
        queueId: id,
        entryId: result.entry._id,
        phone: user.phone,
        queueName: result.queueName
      }));
      
      showSuccess(`Successfully joined ${result.queueName}! Position #${result.entry.position}`);
      showInfo(`Estimated wait: ~${result.estimatedWaitTime || result.entry.estimatedWaitTime} minutes`);
      
      navigate('/user/my-queue');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to join queue. Please try again.';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading queue details...</p>
      </div>
    );
  }

  if (!queue) {
    return (
      <div className="join-queue-page">
        <div className="join-queue-container">
          <div className="alert alert-error">Queue not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="join-queue-page">
      <div className="join-queue-container">
        <div className="join-queue-card">
          <div className="card-header">
            <h1>Join Queue</h1>
            <div className="queue-info-banner">
              <h2>{queue.name}</h2>
              <p>{queue.description}</p>
              <div className="queue-meta">
                <span className="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  Max Capacity: {queue.maxCapacity}
                </span>
                <span className="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  ~{queue.estimatedTimePerPerson} min per person
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="user-details-preview">
            <h3>Your Information</h3>
            <p className="info-subtitle">This information will be used for your queue entry</p>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Name</span>
                <span className="detail-value">{user.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone</span>
                <span className="detail-value">{user.phone}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{user.email}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="join-form">
            <div className="form-group">
              <label htmlFor="notes">Additional Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requirements or notes..."
                rows="3"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="spinner-small"></div>
                  Joining Queue...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  Join Queue
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default JoinQueue;
