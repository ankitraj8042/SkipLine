import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { queueAPI } from '../services/api';
import '../styles/QueueDetails.css';

function QueueDetails() {
  const { id } = useParams();
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQueueDetails();
    const interval = setInterval(fetchQueueDetails, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [id]);

  const fetchQueueDetails = async () => {
    try {
      const data = await queueAPI.getQueueById(id);
      setQueueData(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch queue details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error || !queueData) {
    return <div className="error-message">{error || 'Queue not found'}</div>;
  }

  const { queue, entries } = queueData;
  const waitingEntries = entries.filter(e => e.status === 'waiting');

  return (
    <div className="queue-details-container">
      <div className="queue-details-header">
        <h1>{queue.name}</h1>
        <span className={`status-badge ${queue.isActive ? 'active' : 'inactive'}`}>
          {queue.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="queue-info-section">
        <div className="info-card">
          <h3>Queue Information</h3>
          <p><strong>Type:</strong> {queue.organizationType}</p>
          <p><strong>Description:</strong> {queue.description}</p>
          <p><strong>Organizer:</strong> {queue.organizerName}</p>
          <p><strong>Email:</strong> {queue.organizerEmail}</p>
        </div>

        <div className="info-card">
          <h3>Current Status</h3>
          <div className="stat-item">
            <span className="stat-label">Now Serving:</span>
            <span className="stat-value large">#{queue.currentServingPosition}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">People Waiting:</span>
            <span className="stat-value">{waitingEntries.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Served Today:</span>
            <span className="stat-value">{queue.totalServed}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Avg. Time per Person:</span>
            <span className="stat-value">{queue.estimatedTimePerPerson} min</span>
          </div>
        </div>
      </div>

      {queue.isActive && (
        <div className="action-section">
          <Link to={`/queue/${id}/join`} className="btn btn-primary btn-large">
            Join This Queue
          </Link>
        </div>
      )}

      <div className="waiting-list-section">
        <h2>Current Waiting List</h2>
        {waitingEntries.length === 0 ? (
          <p className="no-entries">No one in queue currently</p>
        ) : (
          <div className="entries-list">
            {waitingEntries.map((entry, index) => (
              <div key={entry._id} className="entry-item">
                <span className="entry-position">#{entry.position}</span>
                <span className="entry-name">{entry.userName}</span>
                <span className="entry-wait">~{entry.estimatedWaitTime} min wait</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default QueueDetails;
