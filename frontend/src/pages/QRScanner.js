import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/QRScanner.css';

function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);

  const extractQueueId = (decodedText) => {
    try {
      const url = new URL(decodedText);
      const pathParts = url.pathname.split('/');
      const queueIndex = pathParts.indexOf('queue');

      if (queueIndex !== -1 && pathParts[queueIndex + 1]) {
        return pathParts[queueIndex + 1];
      }
      return null;
    } catch (err) {
      return null;
    }
  };

  const handleQRSuccess = (queueId) => {
    setSuccess('QR Code detected! Redirecting...');
    setTimeout(() => {
      navigate(`/queue/${queueId}/join`);
    }, 500);
  };

  const onScanSuccess = (decodedText) => {
    const queueId = extractQueueId(decodedText);
    
    if (queueId) {
      if (scannerRef.current && scannerRef.current.clear) {
        scannerRef.current.clear().catch(() => {});
      }
      handleQRSuccess(queueId);
    } else {
      setError('Invalid QR code. Please scan a valid queue QR code.');
    }
  };

  const onScanFailure = () => {
    // Ignore scan failures
  };

  useEffect(() => {
    let cancelled = false;

    if (scanning) {
      const setupScanner = async () => {
        try {
          const { Html5QrcodeScanner } = await import('html5-qrcode');
          
          if (cancelled) return;

          // Wait for DOM element
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const container = document.getElementById('qr-reader');
          if (!container) {
            setError('Scanner container not found. Please try again.');
            setScanning(false);
            return;
          }

          const scanner = new Html5QrcodeScanner(
            'qr-reader',
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.0,
            },
            false
          );

          scannerRef.current = scanner;
          scanner.render(onScanSuccess, onScanFailure);
        } catch (err) {
          console.error('Scanner initialization failed:', err);
          setError('Failed to initialize camera scanner. Please try again.');
          setScanning(false);
        }
      };

      setupScanner();

      return () => {
        cancelled = true;
        if (scannerRef.current && scannerRef.current.clear) {
          scannerRef.current.clear().catch(() => {});
          scannerRef.current = null;
        }
      };
    }
  }, [scanning]);

  const startScanner = () => {
    setScanning(true);
    setError('');
    setSuccess('');
  };

  const stopScanner = () => {
    if (scannerRef.current && scannerRef.current.clear) {
      scannerRef.current.clear().catch(() => {});
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess('');
    setUploading(true);

    try {
      // Create a temporary element for scanning
      const tempDiv = document.createElement('div');
      tempDiv.id = 'qr-file-reader-temp';
      tempDiv.style.display = 'none';
      document.body.appendChild(tempDiv);

      const { Html5Qrcode } = await import('html5-qrcode');
      const html5QrCode = new Html5Qrcode(tempDiv.id);
      
      // Scan the file with show image enabled
      const decodedText = await html5QrCode.scanFile(file, true);
      
      // Clean up
      html5QrCode.clear().catch(() => {});
      document.body.removeChild(tempDiv);

      const queueId = extractQueueId(decodedText);

      if (queueId) {
        handleQRSuccess(queueId);
      } else {
        setError('Invalid QR code image. Please upload a valid queue QR code.');
        setUploading(false);
      }
    } catch (err) {
      console.error('QR scan from file failed:', err);
      
      // Clean up temp element if it exists
      const tempDiv = document.getElementById('qr-file-reader-temp');
      if (tempDiv) {
        document.body.removeChild(tempDiv);
      }

      // More descriptive error message
      if (err.message && err.message.includes('QR code')) {
        setError('No QR code found in image. Please upload a clear QR code image.');
      } else {
        setError('Could not read QR code from image. Ensure the image is clear and in focus.');
      }
      setUploading(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleManualEntry = () => {
    navigate('/queues');
  };

  return (
    <div className="qr-scanner-container">
      <div className="qr-scanner-card">
        <h1>Scan Queue QR Code</h1>
        <p className="scanner-subtitle">
          Scan or upload a QR code to quickly join the queue
        </p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        {uploading && <div className="info-message">📤 Processing QR image...</div>}

        {!scanning ? (
          <div className="scanner-actions">
            <button onClick={startScanner} className="btn btn-primary btn-large">
              📷 Start Camera Scanner
            </button>
            
            <div className="divider">
              <span>OR</span>
            </div>

            <div className="upload-section">
              <label htmlFor="qr-upload" className="btn btn-secondary btn-large" style={{ opacity: uploading ? 0.6 : 1, pointerEvents: uploading ? 'none' : 'auto' }}>
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

            <button onClick={handleManualEntry} className="btn btn-secondary btn-large">
              🔍 Browse Queues Manually
            </button>

            <div className="info-box">
              <h3>How to use:</h3>
              <ul>
                <li><strong>Camera:</strong> Click "Start Camera Scanner" and point at QR code</li>
                <li><strong>Image:</strong> Click "Upload QR Image" and select a QR code image</li>
                <li><strong>Manual:</strong> Click "Browse Queues" to search manually</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="scanner-wrapper">
            <div id="qr-reader"></div>
            <button 
              onClick={stopScanner} 
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
