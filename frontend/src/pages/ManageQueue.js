import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { adminAPI, queueAPI } from '../services/api';
import '../styles/ManageQueue.css';

function ManageQueue() {
  const { id } = useParams();
  const [queue, setQueue] = useState(null);
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState(null);

  useEffect(() => {
    fetchQueueData();
    const interval = setInterval(fetchQueueData, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchQueueData = async () => {
    try {
      const [queueData, entriesData, statsData] = await Promise.all([
        queueAPI.getQueueById(id),
        adminAPI.getQueueEntries(id),
        adminAPI.getQueueStats(id)
      ]);
      
      setQueue(queueData.queue);
      setEntries(entriesData);
      setStats(statsData.stats);
    } catch (err) {
      console.error('Failed to fetch queue data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCallNext = async () => {
    try {
      await adminAPI.callNext(id);
      fetchQueueData();
      alert('Next person called successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to call next person');
    }
  };

  const handleMarkServed = async (entryId) => {
    try {
      await adminAPI.markServed(entryId);
      fetchQueueData();
    } catch (err) {
      alert('Failed to mark as served');
    }
  };

  const handleMarkMissed = async (entryId) => {
    try {
      await adminAPI.markMissed(entryId);
      fetchQueueData();
    } catch (err) {
      alert('Failed to mark as missed');
    }
  };

  const handleToggleActive = async () => {
    try {
      await adminAPI.updateQueue(id, { isActive: !queue.isActive });
      fetchQueueData();
    } catch (err) {
      alert('Failed to update queue status');
    }
  };

  const handleDownloadQR = () => {
    if (queue && queue.qrCode) {
      const link = document.createElement('a');
      link.download = `${queue.name}-QR-Code.png`;
      link.href = queue.qrCode;
      link.click();
    }
  };

  const handlePrintQR = () => {
    if (queue && queue.qrCode) {
      const printWindow = window.open('', '', 'width=600,height=600');
      printWindow.document.write(`
        <html>
          <head>
            <title>Queue QR Code - ${queue.name}</title>
            <style>
              body { 
                display: flex; 
                flex-direction: column;
                align-items: center; 
                justify-content: center; 
                font-family: Arial, sans-serif;
                padding: 20px;
              }
              h1 { color: #333; margin-bottom: 10px; }
              p { color: #666; margin: 5px 0; }
              img { margin: 20px 0; border: 2px solid #667eea; padding: 10px; }
              .footer { margin-top: 20px; font-size: 14px; color: #999; }
            </style>
          </head>
          <body>
            <h1>${queue.name}</h1>
            <p>${queue.description}</p>
            <p><strong>Scan to Join Queue</strong></p>
            <img src="${queue.qrCode}" alt="QR Code" />
            <div class="footer">
              <p>Organizer: ${queue.organizerName}</p>
              <p>Contact: ${queue.organizerEmail}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!queue) {
    return <div className="error-message">Queue not found</div>;
  }

  const waitingEntries = entries.filter(e => e.status === 'waiting');
  const calledEntries = entries.filter(e => e.status === 'called');

  return (
    <div className="manage-queue-container">
      <div className="manage-header">
        <div>
          <h1>{queue.name}</h1>
          <p>{queue.description}</p>
        </div>
        <div className="header-actions">
          <button 
            onClick={() => setShowQR(!showQR)}
            className="btn btn-primary"
          >
            {showQR ? '📊 Hide QR Code' : '📱 Show QR Code'}
          </button>
          <button 
            onClick={handleToggleActive}
            className={`btn ${queue.isActive ? 'btn-danger' : 'btn-success'}`}
          >
            {queue.isActive ? 'Deactivate Queue' : 'Activate Queue'}
          </button>
        </div>
      </div>

      {showQR && queue.qrCode && (
        <div className="qr-code-section">
          <h2>Queue QR Code</h2>
          <p className="qr-instructions">
            Share this QR code with customers. They can scan it to quickly join the queue!
          </p>
          <div className="qr-code-display">
            <img src={queue.qrCode} alt="Queue QR Code" className="qr-code-image" />
          </div>
          <div className="qr-upload">
            <h4>Upload QR Image (optional)</h4>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                // Preview
                const reader = new FileReader();
                reader.onload = async (ev) => {
                  const dataUrl = ev.target.result;
                  setUploadPreview(dataUrl);
                  setUploading(true);
                  try {
                    const res = await adminAPI.updateQueue(id, { qrCode: dataUrl });
                    // update local queue
                    setQueue(res.queue || { ...queue, qrCode: dataUrl });
                    alert('QR image uploaded and saved successfully');
                  } catch (err) {
                    console.error('Upload failed', err);
                    alert('Failed to upload QR image');
                  } finally {
                    setUploading(false);
                  }
                };
                reader.readAsDataURL(file);
              }}
            />

            {uploadPreview && (
              <div className="upload-preview">
                <p>Preview:</p>
                <img src={uploadPreview} alt="Upload Preview" style={{ maxWidth: 200, border: '1px solid #ccc', padding: 6 }} />
              </div>
            )}

            {uploading && <p>Uploading...</p>}
          </div>
          <div className="qr-actions">
            <button onClick={handleDownloadQR} className="btn btn-primary">
              💾 Download QR Code
            </button>
            <button onClick={handlePrintQR} className="btn btn-secondary">
              🖨️ Print QR Code
            </button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/queue/${id}/join`);
                alert('Queue link copied to clipboard!');
              }}
              className="btn btn-secondary"
            >
              🔗 Copy Link
            </button>
          </div>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-box">
          <h3>Now Serving</h3>
          <p className="stat-large">#{queue.currentServingPosition}</p>
        </div>
        <div className="stat-box">
          <h3>Waiting</h3>
          <p className="stat-large">{stats?.totalWaiting || 0}</p>
        </div>
        <div className="stat-box">
          <h3>Served Today</h3>
          <p className="stat-large">{stats?.totalServed || 0}</p>
        </div>
        <div className="stat-box">
          <h3>Missed</h3>
          <p className="stat-large">{stats?.totalMissed || 0}</p>
        </div>
      </div>

      <div className="action-section">
        <button 
          onClick={handleCallNext}
          className="btn btn-primary btn-large"
          disabled={waitingEntries.length === 0}
        >
          📢 Call Next Person
        </button>
      </div>

      {calledEntries.length > 0 && (
        <div className="called-section">
          <h2>Currently Called</h2>
          {calledEntries.map(entry => (
            <div key={entry._id} className="entry-card called">
              <div className="entry-info">
                <h3>#{entry.position} - {entry.userName}</h3>
                <p>Phone: {entry.userPhone}</p>
                {entry.notes && <p>Notes: {entry.notes}</p>}
              </div>
              <div className="entry-actions">
                <button 
                  onClick={() => handleMarkServed(entry._id)}
                  className="btn btn-success"
                >
                  ✓ Mark Served
                </button>
                <button 
                  onClick={() => handleMarkMissed(entry._id)}
                  className="btn btn-danger"
                >
                  ✗ Mark Missed
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="waiting-section">
        <h2>Waiting Queue ({waitingEntries.length})</h2>
        <div className="entries-container">
          {waitingEntries.length === 0 ? (
            <p className="no-entries">No one waiting</p>
          ) : (
            waitingEntries.map(entry => (
              <div key={entry._id} className="entry-card">
                <div className="entry-header">
                  <span className="position-badge">#{entry.position}</span>
                  <h4>{entry.userName}</h4>
                </div>
                <div className="entry-details">
                  <p><strong>Phone:</strong> {entry.userPhone}</p>
                  {entry.userEmail && <p><strong>Email:</strong> {entry.userEmail}</p>}
                  {entry.notes && <p><strong>Notes:</strong> {entry.notes}</p>}
                  <p><strong>Joined:</strong> {new Date(entry.joinedAt).toLocaleTimeString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageQueue;
