import React, { useState, useEffect } from 'react';
import { queueAPI } from '../services/api';
import QueueCard from '../components/QueueCard';
import '../styles/QueueList.css';

function QueueList() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchQueues();
  }, []);

  const fetchQueues = async () => {
    try {
      setLoading(true);
      const data = await queueAPI.getAllQueues();
      setQueues(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch queues. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredQueues = filter === 'all' 
    ? queues 
    : queues.filter(q => q.organizationType === filter);

  if (loading) {
    return (
      <div className="queue-list-container">
        <div className="loading">Loading queues...</div>
      </div>
    );
  }

  return (
    <div className="queue-list-container">
      <div className="queue-list-header">
        <h1>Available Queues</h1>
        <p>Find and join queues near you</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filter-section">
        <label>Filter by type:</label>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Types</option>
          <option value="clinic">Clinic</option>
          <option value="shop">Shop</option>
          <option value="college">College</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="queues-grid">
        {filteredQueues.length === 0 ? (
          <div className="no-queues">
            <p>No queues available at the moment.</p>
          </div>
        ) : (
          filteredQueues.map(queue => (
            <QueueCard key={queue._id} queue={queue} />
          ))
        )}
      </div>
    </div>
  );
}

export default QueueList;
