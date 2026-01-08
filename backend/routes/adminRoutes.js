// ============================================
// FILE: backend/routes/adminRoutes.js
// WITH NOTIFICATIONS AND VALIDATION
// ============================================

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
        ).catch(err => console.error('Notification failed:', err));
      }
    }
  } catch (error) {
    console.error('Error notifying people ahead:', error);
  }
};

// Get all queues (including inactive) for admin dashboard
router.get('/queues', async (req, res) => {
  try {
    const queues = await Queue.find().sort({ createdAt: -1 });
    res.json(queues);
  } catch (error) {
    console.error('Error fetching queues:', error);
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
      organizerEmail
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

// Call next person in queue (with email notifications)
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

    // Send "It's your turn" email to the called person
    if (nextEntry.userEmail) {
      sendYourTurnEmail(nextEntry.userEmail, nextEntry.userName, queue.name)
        .catch(err => console.error('Your turn email failed:', err));
    }

    // Notify the next 3 people in queue that their turn is approaching
    notifyPeopleAhead(req.params.id, queue.name, nextEntry.position, 3);

    res.json({
      message: 'Next person called',
      entry: nextEntry,
      notificationSent: !!nextEntry.userEmail
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