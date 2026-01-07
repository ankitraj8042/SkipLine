import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError, showInfo } from '../utils/toast';
import '../styles/QRScanner.css';

function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [manualQueueId, setManualQueueId] = useState('');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Extract queue ID from the scanned text
  const extractQueueId = (decodedText) => {
    try {
      // Method 1: Parse as URL
      try {
        const url = new URL(decodedText);
        const pathParts = url.pathname.split('/').filter(part => part !== '');
        const queueIndex = pathParts.indexOf('queue');
        
        if (queueIndex !== -1 && pathParts[queueIndex + 1]) {
          const queueId = pathParts[queueIndex + 1];
          return queueId;
        }
      } catch (e) {
        // Not a URL, try other methods
      }
      
      // Method 2: Direct MongoDB ID (24 hex characters)
      if (/^[a-f0-9]{24}$/i.test(decodedText.trim())) {
        return decodedText.trim();
      }
      
      // Method 3: Find MongoDB ID pattern anywhere in text
      const idMatch = decodedText.match(/[a-f0-9]{24}/i);
      if (idMatch) {
        return idMatch[0];
      }
      
      return null;
    } catch (err) {
      return null;
    }
  };

  const handleQRSuccess = (queueId) => {
    setSuccess('✅ Success! Redirecting...');
    showSuccess('QR code scanned successfully!');
    
    // Stop camera if running
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    
    setTimeout(() => {
      navigate(`/queue/${queueId}/join`);
    }, 800);
  };

  // CAMERA SCANNER using native browser APIs
  const startCameraScanner = async () => {
    try {
      setError('');
      setSuccess('');
      setScanning(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        // Start scanning every 500ms
        const scanInterval = setInterval(async () => {
          if (canvasRef.current && videoRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            try {
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const { default: jsQR } = await import('jsqr');
              const code = jsQR(imageData.data, imageData.width, imageData.height);
              
              if (code) {
                clearInterval(scanInterval);
                stream.getTracks().forEach(track => track.stop());
                
                const queueId = extractQueueId(code.data);
                if (queueId) {
                  handleQRSuccess(queueId);
                } else {
                  setError('Invalid QR code');
                  setScanning(false);
                }
              }
            } catch (e) {
              // Continue scanning
            }
          }
        }, 500);
        
        // Store interval for cleanup
        videoRef.current.scanInterval = scanInterval;
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Could not access camera. Please check permissions.');
      setScanning(false);
    }
  };

  const stopCameraScanner = () => {
    if (videoRef.current) {
      if (videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current.scanInterval) {
        clearInterval(videoRef.current.scanInterval);
      }
    }
    setScanning(false);
  };

  // FILE UPLOAD with jsQR library
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess('');
    setUploading(true);

    try {
      // Load image
      const img = new Image();
      const imageUrl = URL.createObjectURL(file);
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });
      
      // Draw to canvas
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Scan with jsQR
      const { default: jsQR } = await import('jsqr');
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });
      
      URL.revokeObjectURL(imageUrl);
      
      if (code) {
        const queueId = extractQueueId(code.data);
        
        if (queueId) {
          handleQRSuccess(queueId);
        } else {
          setError('❌ Could not extract Queue ID from QR code');
          showError('Invalid QR code format');
          setUploading(false);
        }
      } else {
        setError('❌ No QR code detected. Please try a clearer image.');
        showError('No QR code found in image');
        setUploading(false);
      }
    } catch (err) {
      setError('Failed to process image. Please try again.');
      showError('Failed to process image');
      setUploading(false);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleManualEntry = (e) => {
    e.preventDefault();
    const id = manualQueueId.trim();
    
    if (id) {
      showInfo('Redirecting to queue...');
      navigate(`/queue/${id}/join`);
    } else {
      setError('Please enter a valid Queue ID');
      showError('Please enter a valid Queue ID');
    }
  };

  return (
    <div className="qr-scanner-container">
      <div className="qr-scanner-card">
        <h1>Scan Queue QR Code</h1>
        <p className="scanner-subtitle">
          Scan or upload a QR code to quickly join the queue
        </p>

        {error && <div className="error-message" style={{whiteSpace: 'pre-line'}}>{error}</div>}
        {success && <div className="success-message">{success}</div>}
        {uploading && <div className="info-message">📤 Processing image...</div>}

        {!scanning ? (
          <div className="scanner-actions">
            <button onClick={startCameraScanner} className="btn btn-primary btn-large">
              📷 Start Camera Scanner
            </button>
            
            <div className="divider">
              <span>OR</span>
            </div>

            <div className="upload-section">
              <label 
                htmlFor="qr-upload" 
                className="btn btn-secondary btn-large" 
                style={{ 
                  opacity: uploading ? 0.6 : 1, 
                  pointerEvents: uploading ? 'none' : 'auto' 
                }}
              >
                {uploading ? '⏳ Processing...' : '📁 Upload QR Image'}
              </label>
              <input
                id="qr-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </div>

            <div className="divider">
              <span>OR</span>
            </div>

            <form onSubmit={handleManualEntry} className="manual-entry-form">
              <div className="form-group">
                <label htmlFor="queueId">Enter Queue ID Manually</label>
                <input
                  type="text"
                  id="queueId"
                  value={manualQueueId}
                  onChange={(e) => setManualQueueId(e.target.value)}
                  placeholder="69477b1824d1c46858519f32"
                  className="form-input"
                />
                <small style={{color: '#666', fontSize: '0.85em', marginTop: '5px', display: 'block'}}>
                  Get the 24-character Queue ID from the organizer
                </small>
              </div>
              <button type="submit" className="btn btn-secondary btn-large">
                🔗 Join with Queue ID
              </button>
            </form>

            <div className="info-box">
              <h3>📖 How to use:</h3>
              <ul>
                <li><strong>Camera:</strong> Point your camera at the QR code</li>
                <li><strong>Upload:</strong> Select a photo of the QR code</li>
                <li><strong>Manual:</strong> Type/paste the Queue ID (24 characters)</li>
              </ul>
              <p style={{marginTop: '12px', fontSize: '0.9em', color: '#666'}}>
                💡 <strong>Tip:</strong> For best results, ensure good lighting and hold steady
              </p>
            </div>
          </div>
        ) : (
          <div className="scanner-wrapper">
            <video 
              ref={videoRef} 
              style={{
                width: '100%', 
                maxWidth: '500px', 
                border: '2px solid #667eea',
                borderRadius: '8px'
              }}
            />
            <canvas ref={canvasRef} style={{display: 'none'}} />
            <button 
              onClick={stopCameraScanner} 
              className="btn btn-danger"
              style={{ marginTop: '20px' }}
            >
              Cancel Scanning
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QRScanner;