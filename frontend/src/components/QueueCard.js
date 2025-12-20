import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/QueueCard.css';

function QueueCard({ queue }) {
  return (
    <div className="queue-card">
      <div className="queue-card-header">
        <h3>{queue.name}</h3>
        <span className={`queue-badge ${queue.isActive ? 'active' : 'inactive'}`}>
          {queue.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      
      <p className="queue-description">{queue.description}</p>
      
      <div className="queue-info">
        <div className="info-item">
          <span className="info-label">Type:</span>
          <span className="info-value">{queue.organizationType}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Current Position:</span>
          <span className="info-value">{queue.currentServingPosition}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Avg Wait Time:</span>
          <span className="info-value">{queue.estimatedTimePerPerson} min</span>
        </div>
        <div className="info-item">
          <span className="info-label">Total Served:</span>
          <span className="info-value">{queue.totalServed}</span>
        </div>
      </div>
      
      <div className="queue-card-footer">
        <Link to={`/queue/${queue._id}`} className="btn btn-secondary">
          View Details
        </Link>
        {queue.isActive && (
          <Link to={`/queue/${queue._id}/join`} className="btn btn-primary">
            Join Queue
          </Link>
        )}
      </div>
    </div>
  );
}

export default QueueCard;
