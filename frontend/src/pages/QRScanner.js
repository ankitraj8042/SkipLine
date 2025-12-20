import React, { useState, useEffect, useRef } from 'react';
// Dynamically import Html5QrcodeScanner inside useEffect to avoid import-time DOM/window issues
import { useNavigate } from 'react-router-dom';
import '../styles/QRScanner.css';

function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const startScanner = () => {
    setScanning(true);
    setError('');
  };

  const scannerRef = useRef(null);

  const onScanSuccess = (decodedText, decodedResult) => {
    try {
      const url = new URL(decodedText);
      const pathParts = url.pathname.split('/');
      const queueIndex = pathParts.indexOf('queue');

      if (queueIndex !== -1 && pathParts[queueIndex + 1]) {
        const queueId = pathParts[queueIndex + 1];

        if (scannerRef.current && scannerRef.current.clear) {
          scannerRef.current.clear().catch(() => {});
        }

        navigate(`/queue/${queueId}/join`);
      } else {
        setError('Invalid QR code. Please scan a valid queue QR code.');
      }
    } catch (err) {
      setError('Invalid QR code format.');
    }
  };

  const onScanFailure = (errorMsg) => {
    // no-op or could show a subtle notification
  };

  useEffect(() => {
    let mounted = true;
    if (scanning) {
      // Dynamically import the library and create the scanner after the DOM element is present
      let cancelled = false;
      const setupScanner = async () => {
        try {
          const module = await import('html5-qrcode');
          if (cancelled) return;
          const Html5QrcodeScanner = module.Html5QrcodeScanner;

          // Ensure the DOM element exists (react should have rendered it)
          const container = document.getElementById('qr-reader');
          if (!container) {
            // If element is not present yet, wait a short moment and retry once
            await new Promise(r => setTimeout(r, 100));
          }

          const html5QrcodeScanner = new Html5QrcodeScanner(
            'qr-reader',
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.0,
            },
            false
          );

          scannerRef.current = html5QrcodeScanner;
          html5QrcodeScanner.render(onScanSuccess, onScanFailure);
        } catch (err) {
          console.error('Failed to initialize QR scanner', err);
          setError('Failed to initialize camera scanner. Please try again.');
        }
      };

      setupScanner();
    }

    return () => {
      mounted = false;
      if (scannerRef.current && scannerRef.current.clear) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [scanning]);

  const stopScanner = () => {
    if (scannerRef.current && scannerRef.current.clear) {
      scannerRef.current.clear().catch(() => {});
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const handleManualEntry = () => {
    navigate('/queues');
  };

  return (
    <div className="qr-scanner-container">
      <div className="qr-scanner-card">
        <h1>Scan Queue QR Code</h1>
        <p className="scanner-subtitle">
          Scan the QR code provided by the organizer to quickly join the queue
        </p>

        {error && <div className="error-message">{error}</div>}

        {!scanning ? (
          <div className="scanner-actions">
            <button onClick={startScanner} className="btn btn-primary btn-large">
              📷 Start Camera Scanner
            </button>
            
            <div className="divider">
              <span>OR</span>
            </div>

            <button onClick={handleManualEntry} className="btn btn-secondary btn-large">
              🔍 Browse Queues Manually
            </button>

            <div className="info-box">
              <h3>How to use:</h3>
              <ol>
                <li>Click "Start Camera Scanner"</li>
                <li>Allow camera permissions</li>
                <li>Point your camera at the QR code</li>
                <li>Wait for automatic detection</li>
                <li>You'll be redirected to join the queue</li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="scanner-wrapper">
            <div id="qr-reader"></div>
            <button 
              onClick={() => {
                stopScanner();
              }} 
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
