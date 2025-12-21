// ============================================
// FILE: backend/utils/qrCodeGenerator.js
// COMPLETE VERSION WITH BLACK/WHITE FIX
// ============================================

const QRCode = require('qrcode');

/**
 * Generate QR code as data URL with optimized settings for scanning
 * FIXED: Pure black and white colors for maximum scanability
 */
const generateQRCode = async (data) => {
  try {
    console.log('Generating QR code for:', data);
    
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 500,                    // Even larger for better scanning
      margin: 6,                     // More margin for edge detection
      errorCorrectionLevel: 'H',     // Highest error correction (30% recovery)
      color: {
        dark: '#000000',             // PURE BLACK (not blue!)
        light: '#FFFFFF'             // PURE WHITE
      },
      type: 'image/png',
      quality: 1.0                   // Maximum quality
    });
    
    console.log('QR code generated successfully');
    console.log('First 100 chars of QR data:', qrCodeDataURL.substring(0, 100));
    
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
  console.log('Generated join URL:', joinURL);
  
  return joinURL;
};

/**
 * Generate QR code with just the queue ID (simpler alternative)
 */
const generateSimpleQRCode = async (queueId) => {
  try {
    console.log('Generating simple QR code for queue ID:', queueId);
    
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
    
    console.log('Simple QR code generated successfully');
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