// ============================================
// FILE: backend/routes/adminRoutes.js
// COMPLETE VERSION WITH DEBUG ENDPOINT
// ============================================

const express = require('express');
const router = express.Router();
const Queue = require('../models/Queue');
const QueueEntry = require('../models/QueueEntry');
const { generateQRCode, generateQueueJoinURL } = require('../utils/qrCodeGenerator');
const { protect, admin } = require('../middleware/authMiddleware');

// Apply authentication and admin middleware to all routes
router.use(protect);
router.use(admin);

// Create a new queue
router.post('/queues', async (req, res) => {
  try {
    const {
      name,
      description,
      organizationType,
      maxCapacity,
      estimatedTimePerPerson,
      organizerName,
      organizerEmail
    } = req.body;

    const queue = new Queue({
      name,
      description,
      organizationType,
      maxCapacity,
      estimatedTimePerPerson,
      organizerName,
      organizerEmail
    });

    await queue.save();
    console.log('✅ Queue created with ID:', queue._id);

    const joinURL = generateQueueJoinURL(queue._id);
    console.log('✅ Generated join URL:', joinURL);
    
    const qrCodeDataURL = await generateQRCode(joinURL);
    console.log('✅ QR code generated, length:', qrCodeDataURL.length);
    console.log('✅ QR code preview:', qrCodeDataURL.substring(0, 100));
    
    queue.qrCode = qrCodeDataURL;
    await queue.save();
    console.log('✅ QR code saved to database');

    res.status(201).json({ 
      message: 'Queue created successfully', 
      queue,
      joinURL,
      debug: {
        qrCodeLength: qrCodeDataURL.length,
        qrCodePreview: qrCodeDataURL.substring(0, 100)
      }
    });
  } catch (error) {
    console.error('❌ Error creating queue:', error);
    res.status(500).json({ 
      message: 'Failed to create queue',
      error: error.message 
    });
  }
});

// Update queue
router.put('/queues/:id', async (req, res) => {
  try {
    const queue = await Queue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    res.json({ message: 'Queue updated successfully', queue });
  } catch (error) {
    console.error('Error updating queue:', error);
    res.status(500).json({ 
      message: 'Failed to update queue',
      error: error.message 
    });
  }
});

// Delete/Deactivate queue
router.delete('/queues/:id', async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    queue.isActive = false;
    await queue.save();

    res.json({ message: 'Queue deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating queue:', error);
    res.status(500).json({ 
      message: 'Failed to deactivate queue',
      error: error.message 
    });
  }
});

// Get all entries for a queue
router.get('/queues/:id/entries', async (req, res) => {
  try {
    const entries = await QueueEntry.find({ queueId: req.params.id })
      .sort({ position: 1 });

    res.json(entries);
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ 
      message: 'Failed to fetch entries',
      error: error.message 
    });
  }
});

// Call next person in queue
router.post('/queues/:id/call-next', async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    const nextEntry = await QueueEntry.findOne({
      queueId: req.params.id,
      status: 'waiting',
      position: { $gt: queue.currentServingPosition }
    }).sort({ position: 1 });

    if (!nextEntry) {
      return res.status(404).json({ message: 'No one waiting in queue' });
    }

    nextEntry.status = 'called';
    nextEntry.calledAt = new Date();
    await nextEntry.save();

    queue.currentServingPosition = nextEntry.position;
    await queue.save();

    res.json({
      message: 'Next person called',
      entry: nextEntry
    });
  } catch (error) {
    console.error('Error calling next person:', error);
    res.status(500).json({ 
      message: 'Failed to call next person',
      error: error.message 
    });
  }
});

// Mark entry as served
router.post('/entries/:id/served', async (req, res) => {
  try {
    const entry = await QueueEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    entry.status = 'served';
    entry.servedAt = new Date();
    await entry.save();

    const queue = await Queue.findById(entry.queueId);
    queue.totalServed += 1;
    await queue.save();

    res.json({ message: 'Entry marked as served', entry });
  } catch (error) {
    console.error('Error marking entry as served:', error);
    res.status(500).json({ 
      message: 'Failed to mark entry as served',
      error: error.message 
    });
  }
});

// Mark entry as missed
router.post('/entries/:id/missed', async (req, res) => {
  try {
    const entry = await QueueEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    entry.status = 'missed';
    await entry.save();

    res.json({ message: 'Entry marked as missed', entry });
  } catch (error) {
    console.error('Error marking entry as missed:', error);
    res.status(500).json({ 
      message: 'Failed to mark entry as missed',
      error: error.message 
    });
  }
});

// Skip to specific entry
router.post('/entries/:id/skip-to', async (req, res) => {
  try {
    const entry = await QueueEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    const queue = await Queue.findById(entry.queueId);
    queue.currentServingPosition = entry.position - 1;
    await queue.save();

    res.json({ message: 'Skipped to entry', entry });
  } catch (error) {
    console.error('Error skipping to entry:', error);
    res.status(500).json({ 
      message: 'Failed to skip to entry',
      error: error.message 
    });
  }
});

// Regenerate QR code for a queue
router.get('/queues/:id/qrcode', async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    const joinURL = generateQueueJoinURL(queue._id);
    console.log('Regenerating QR for URL:', joinURL);

    // Always regenerate with new black/white settings
    const qrCodeDataURL = await generateQRCode(joinURL);
    console.log('New QR generated, length:', qrCodeDataURL.length);
    
    // Update in database
    queue.qrCode = qrCodeDataURL;
    await queue.save();
    console.log('✅ QR code updated for queue:', queue._id);

    res.json({ 
      qrCode: queue.qrCode, 
      joinURL: joinURL,
      queueId: queue._id.toString()
    });
  } catch (error) {
    console.error('Error regenerating QR code:', error);
    res.status(500).json({ 
      message: 'Failed to regenerate QR code',
      error: error.message 
    });
  }
});

// 🔍 DEBUG ENDPOINT - Test QR code data
router.get('/test-qr/:id', async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    console.log('=== QR CODE DEBUG ===');
    console.log('Queue ID:', queue._id);
    console.log('Queue Name:', queue.name);
    console.log('QR Code exists:', !!queue.qrCode);
    console.log('QR Code length:', queue.qrCode ? queue.qrCode.length : 0);
    console.log('QR Code starts with:', queue.qrCode ? queue.qrCode.substring(0, 50) : 'N/A');
    console.log('Expected URL:', generateQueueJoinURL(queue._id));
    
    res.json({
      queueId: queue._id,
      queueName: queue.name,
      hasQRCode: !!queue.qrCode,
      qrCodeLength: queue.qrCode ? queue.qrCode.length : 0,
      qrCodePreview: queue.qrCode ? queue.qrCode.substring(0, 100) : null,
      expectedJoinURL: generateQueueJoinURL(queue._id),
      isColorCorrect: queue.qrCode ? queue.qrCode.includes('data:image/png') : false
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get queue statistics
router.get('/queues/:id/stats', async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    const totalWaiting = await QueueEntry.countDocuments({
      queueId: req.params.id,
      status: 'waiting'
    });

    const totalServed = await QueueEntry.countDocuments({
      queueId: req.params.id,
      status: 'served'
    });

    const totalMissed = await QueueEntry.countDocuments({
      queueId: req.params.id,
      status: 'missed'
    });

    const totalCancelled = await QueueEntry.countDocuments({
      queueId: req.params.id,
      status: 'cancelled'
    });

    res.json({
      queue,
      stats: {
        totalWaiting,
        totalServed,
        totalMissed,
        totalCancelled,
        currentServingPosition: queue.currentServingPosition
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      message: 'Failed to fetch statistics',
      error: error.message 
    });
  }
});

// Download QR code as PNG file
router.get('/queues/:id/qrcode/download', async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    if (queue.qrCode) {
      const base64Data = queue.qrCode.replace(/^data:image\/png;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      res.set({
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="queue-${queue._id}-qrcode.png"`
      });
      
      res.send(buffer);
    } else {
      res.status(404).json({ message: 'QR code not found for this queue' });
    }
  } catch (error) {
    console.error('Error downloading QR code:', error);
    res.status(500).json({ 
      message: 'Failed to download QR code',
      error: error.message 
    });
  }
});

module.exports = router;