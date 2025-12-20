import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { queueAPI } from '../services/api';
import '../styles/JoinQueue.css';

function JoinQueue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [queue, setQueue] = useState(null);
  const [formData, setFormData] = useState({
    userName: '',
    userPhone: '',
    userEmail: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQueue();
  }, [id]);

  const fetchQueue = async () => {
    try {
      const data = await queueAPI.getQueueById(id);
      setQueue(data.queue);
      setError('');
    } catch (err) {
      setError('Failed to load queue details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.userName || !formData.userPhone) {
      setError('Name and phone number are required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const result = await queueAPI.joinQueue(id, formData);
      // Save entry details to localStorage for tracking
      localStorage.setItem('currentQueueEntry', JSON.stringify({
        queueId: id,
        entryId: result.entry._id,
        phone: formData.userPhone,
        queueName: result.queueName
      }));
      
      navigate('/my-queue');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join queue. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!queue) {
    return <div className="error-message">Queue not found</div>;
  }

  return (
    <div className="join-queue-container">
      <div className="join-queue-card">
        <h1>Join Queue</h1>
        <div className="queue-name-display">
          <h2>{queue.name}</h2>
          <p>{queue.description}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="join-form">
          <div className="form-group">
            <label htmlFor="userName">Full Name *</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="userPhone">Phone Number *</label>
            <input
              type="tel"
              id="userPhone"
              name="userPhone"
              value={formData.userPhone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="userEmail">Email (Optional)</label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Additional Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any special requirements or notes"
              rows="3"
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-large"
            disabled={submitting}
          >
            {submitting ? 'Joining...' : 'Join Queue'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default JoinQueue;
