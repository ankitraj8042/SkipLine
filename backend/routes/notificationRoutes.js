const express = require('express');
const router = express.Router();
const { saveSubscription, removeSubscription, getPublicVapidKey } = require('../services/pushService');
const { protect } = require('../middleware/authMiddleware');

// Get VAPID public key for client subscription
router.get('/vapid-public-key', (req, res) => {
  const publicKey = getPublicVapidKey();
  
  if (!publicKey) {
    return res.status(503).json({ 
      message: 'Push notifications not configured',
      available: false 
    });
  }
  
  res.json({ 
    publicKey,
    available: true 
  });
});

// Subscribe to push notifications
router.post('/subscribe', protect, async (req, res) => {
  try {
    const { subscription } = req.body;
    
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ message: 'Invalid subscription object' });
    }
    
    saveSubscription(req.user._id.toString(), subscription);
    
    res.json({ 
      success: true, 
      message: 'Successfully subscribed to push notifications' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save subscription' });
  }
});

// Unsubscribe from push notifications
router.post('/unsubscribe', protect, async (req, res) => {
  try {
    removeSubscription(req.user._id.toString());
    res.json({ 
      success: true, 
      message: 'Successfully unsubscribed from push notifications' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to unsubscribe' });
  }
});

module.exports = router;
