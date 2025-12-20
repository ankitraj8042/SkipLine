const express = require('express');
const router = express.Router();
const Queue = require('../models/Queue');
const QueueEntry = require('../models/QueueEntry');
const { generateQRCode, generateQueueJoinURL } = require('../utils/qrCodeGenerator');
const { protect, admin } = require('../middleware/authMiddleware');

// Apply authentication and admin middleware to all routes
router.use(protect);
router.use(admin);

// Create a new queue (Admin/Organizer)
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

    // Save queue first to get the ID
    await queue.save();

    // Generate QR code for the queue
    const joinURL = generateQueueJoinURL(queue._id);
    const qrCodeDataURL = await generateQRCode(joinURL);
    
    // Update queue with QR code
    queue.qrCode = qrCodeDataURL;
    await queue.save();

    res.status(201).json({ message: 'Queue created successfully', queue });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
});

// Get all entries for a queue
router.get('/queues/:id/entries', async (req, res) => {
  try {
    const entries = await QueueEntry.find({ queueId: req.params.id })
      .sort({ position: 1 });

    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Call next person in queue
router.post('/queues/:id/call-next', async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    // Find the next waiting entry
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
    res.status(500).json({ message: error.message });
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

    // Update queue total served count
    const queue = await Queue.findById(entry.queueId);
    queue.totalServed += 1;
    await queue.save();

    res.json({ message: 'Entry marked as served', entry });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
});

// Regenerate QR code for a queue
router.get('/queues/:id/qrcode', async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    // If QR code doesn't exist, generate it
    if (!queue.qrCode) {
      const joinURL = generateQueueJoinURL(queue._id);
      const qrCodeDataURL = await generateQRCode(joinURL);
      queue.qrCode = qrCodeDataURL;
      await queue.save();
    }

    res.json({ qrCode: queue.qrCode, joinURL: generateQueueJoinURL(queue._id) });
  } catch (error) {
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
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
