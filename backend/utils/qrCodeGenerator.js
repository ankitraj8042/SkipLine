const QRCode = require('qrcode');

// Generate QR code as data URL
const generateQRCode = async (data) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#667eea',
        light: '#ffffff'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

// Generate QR code URL for joining queue
const generateQueueJoinURL = (queueId, baseURL = 'http://localhost:3000') => {
  return `${baseURL}/queue/${queueId}/join`;
};

module.exports = {
  generateQRCode,
  generateQueueJoinURL
};
