import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { showSuccess, showError } from '../utils/toast';
import '../styles/CreateQueue.css';

function CreateQueue() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    organizationType: 'shop',
    maxCapacity: 50,
    estimatedTimePerPerson: 5,
    organizerName: '',
    organizerEmail: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const result = await adminAPI.createQueue(formData);
      showSuccess('Queue created successfully!');
      navigate(`/admin/manage/${result.queue._id}`);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create queue';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-queue-container">
      <div className="create-queue-card">
        <h1>Create New Queue</h1>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="create-queue-form">
          <div className="form-group">
            <label htmlFor="name">Queue Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., General Consultation Queue"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of this queue"
              rows="3"
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="organizationType">Organization Type *</label>
              <select
                id="organizationType"
                name="organizationType"
                value={formData.organizationType}
                onChange={handleChange}
                required
              >
                <option value="shop">🛍️ Shop / Retail Store</option>
                <option value="restaurant">🍽️ Restaurant / Cafe</option>
                <option value="clinic">🏥 Clinic / Hospital</option>
                <option value="bank">🏦 Bank / Financial</option>
                <option value="salon">💇 Salon / Spa</option>
                <option value="government">🏛️ Government Office</option>
                <option value="college">🎓 College / Educational</option>
                <option value="other">📋 Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="maxCapacity">Max Capacity</label>
              <input
                type="number"
                id="maxCapacity"
                name="maxCapacity"
                value={formData.maxCapacity}
                onChange={handleChange}
                min="1"
                max="500"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="estimatedTimePerPerson">
              Estimated Time per Person (minutes)
            </label>
            <input
              type="number"
              id="estimatedTimePerPerson"
              name="estimatedTimePerPerson"
              value={formData.estimatedTimePerPerson}
              onChange={handleChange}
              min="1"
              max="120"
            />
          </div>

          <div className="form-group">
            <label htmlFor="organizerName">Organizer Name *</label>
            <input
              type="text"
              id="organizerName"
              name="organizerName"
              value={formData.organizerName}
              onChange={handleChange}
              placeholder="Your name or organization name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="organizerEmail">Organizer Email *</label>
            <input
              type="email"
              id="organizerEmail"
              name="organizerEmail"
              value={formData.organizerEmail}
              onChange={handleChange}
              placeholder="contact@example.com"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-large"
            disabled={submitting}
          >
            {submitting ? 'Creating...' : 'Create Queue'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateQueue;
