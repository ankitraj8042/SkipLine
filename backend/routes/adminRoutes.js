const express = require('express');
const router = express.Router();
const Queue = require('../models/Queue');
const QueueEntry = require('../models/QueueEntry');
const { generateQRCode, generateQueueJoinURL } = require('../utils/qrCodeGenerator');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateQueueCreation } = require('../middleware/validation');
const { sendYourTurnEmail, sendTurnApproachingEmail } = require('../services/emailService');

// Apply authentication and admin middleware to all routes
router.use(protect);
router.use(admin);

// Helper middleware to verify queue ownership
const verifyQueueOwnership = async (req, res, next) => {
  try {
    const queueId = req.params.id || req.params.queueId;
    const queue = await Queue.findById(queueId);
    
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }
    
    if (queue.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this queue' });
    }
    
    req.queue = queue;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error verifying queue ownership' });
  }
};

// Helper function to notify people ahead
const notifyPeopleAhead = async (queueId, queueName, currentPosition, notifyCount = 3) => {
  try {
    // Find next few people in queue who should be notified
    const upcomingEntries = await QueueEntry.find({
      queueId,
      status: 'waiting',
      position: { $gt: currentPosition, $lte: currentPosition + notifyCount }
    }).sort({ position: 1 });

    for (const entry of upcomingEntries) {
      const peopleAhead = entry.position - currentPosition - 1;
      if (entry.userEmail && peopleAhead <= 2) {
        sendTurnApproachingEmail(
          entry.userEmail, 
          entry.userName, 
          queueName, 
          entry.position, 
          peopleAhead
        ).catch(() => {});
      }
    }
  } catch (error) {
    // Error handled silently
  }
};

// Get all queues (including inactive) for admin dashboard
router.get('/queues', async (req, res) => {
  try {
    // Show only queues created by this admin
    const queues = await Queue.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(queues);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch queues',
      error: error.message 
    });
  }
});

// Create a new queue (with validation)
router.post('/queues', validateQueueCreation, async (req, res) => {
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
      organizerEmail,
      createdBy: req.user._id
    });

    await queue.save();

    const joinURL = generateQueueJoinURL(queue._id);
    
    const qrCodeDataURL = await generateQRCode(joinURL);
    
    queue.qrCode = qrCodeDataURL;
    await queue.save();

    res.status(201).json({ 
      message: 'Queue created successfully', 
      queue,
      joinURL
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to create queue',
      error: error.message 
    });
  }
});

// Update queue
router.put('/queues/:id', async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    // Verify ownership
    if (queue.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this queue' });
    }

    Object.assign(queue, req.body);
    await queue.save();

    res.json({ message: 'Queue updated successfully', queue });
  } catch (error) {
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

    // Verify ownership
    if (queue.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this queue' });
    }

    queue.isActive = false;
    await queue.save();

    res.json({ message: 'Queue deactivated successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to deactivate queue',
      error: error.message 
    });
  }
});

// Get all entries for a queue
router.get('/queues/:id/entries', verifyQueueOwnership, async (req, res) => {
  try {
    const entries = await QueueEntry.find({ queueId: req.params.id })
      .sort({ position: 1 });

    res.json(entries);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch entries',
      error: error.message 
    });
  }
});

// Call next person in queue (with email notifications)
router.post('/queues/:id/call-next', verifyQueueOwnership, async (req, res) => {
  try {
    const queue = req.queue;

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

    // Send "It's your turn" email to the called person
    if (nextEntry.userEmail) {
      sendYourTurnEmail(nextEntry.userEmail, nextEntry.userName, queue.name)
        .catch(() => {});
    }

    // Notify the next 3 people in queue that their turn is approaching
    notifyPeopleAhead(req.params.id, queue.name, nextEntry.position, 3);

    res.json({
      message: 'Next person called',
      entry: nextEntry,
      notificationSent: !!nextEntry.userEmail
    });
  } catch (error) {
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
    res.status(500).json({ 
      message: 'Failed to skip to entry',
      error: error.message 
    });
  }
});

// Regenerate QR code for a queue
router.get('/queues/:id/qrcode', verifyQueueOwnership, async (req, res) => {
  try {
    const queue = req.queue;

    const joinURL = generateQueueJoinURL(queue._id);

    // Always regenerate with new black/white settings
    const qrCodeDataURL = await generateQRCode(joinURL);
    
    // Update in database
    queue.qrCode = qrCodeDataURL;
    await queue.save();

    res.json({ 
      qrCode: queue.qrCode, 
      joinURL: joinURL,
      queueId: queue._id.toString()
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to regenerate QR code',
      error: error.message 
    });
  }
});

// Get queue statistics
router.get('/queues/:id/stats', verifyQueueOwnership, async (req, res) => {
  try {
    const queue = req.queue;

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
    res.status(500).json({ 
      message: 'Failed to fetch statistics',
      error: error.message 
    });
  }
});

// Download QR code as PNG file
router.get('/queues/:id/qrcode/download', verifyQueueOwnership, async (req, res) => {
  try {
    const queue = req.queue;

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
    res.status(500).json({ 
      message: 'Failed to download QR code',
      error: error.message 
    });
  }
});

module.exports = router;