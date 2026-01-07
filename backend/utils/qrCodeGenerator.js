const QRCode = require('qrcode');

/**
 * Generate QR code as data URL with optimized settings for scanning
 * Pure black and white colors for maximum scanability
 */
const generateQRCode = async (data) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 500,
      margin: 6,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      type: 'image/png',
      quality: 1.0
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error(`QR code generation failed: ${error.message}`);
  }
};

/**
 * Generate the complete URL for joining a queue
 */
const generateQueueJoinURL = (queueId, baseURL) => {
  const frontendURL = baseURL || 
                      process.env.FRONTEND_URL || 
                      'http://localhost:3000';
  
  const cleanURL = frontendURL.replace(/\/$/, '');
  const joinURL = `${cleanURL}/queue/${queueId}/join`;
  
  return joinURL;
};

/**
 * Generate QR code with just the queue ID (simpler alternative)
 */
const generateSimpleQRCode = async (queueId) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(queueId.toString(), {
      width: 500,
      margin: 6,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      type: 'image/png',
      quality: 1.0
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating simple QR code:', error);
    throw new Error(`Simple QR code generation failed: ${error.message}`);
  }
};

/**
 * Generate QR code as a buffer (for file downloads)
 */
const generateQRCodeBuffer = async (data) => {
  try {
    const buffer = await QRCode.toBuffer(data, {
      width: 800,
      margin: 6,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return buffer;
  } catch (error) {
    console.error('Error generating QR code buffer:', error);
    throw new Error(`QR code buffer generation failed: ${error.message}`);
  }
};

/**
 * Validate if a string is a valid MongoDB ObjectId
 */
const isValidQueueId = (id) => {
  return /^[a-f0-9]{24}$/i.test(id);
};

module.exports = {
  generateQRCode,
  generateQueueJoinURL,
  generateSimpleQRCode,
  generateQRCodeBuffer,
  isValidQueueId
};