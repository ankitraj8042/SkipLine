const express = require('express');
const router = express.Router();
const Queue = require('../models/Queue');
const QueueEntry = require('../models/QueueEntry');
const { validateJoinQueue, validateObjectId } = require('../middleware/validation');
const { sendQueueJoinedEmail } = require('../services/emailService');

// Get all active queues
router.get('/', async (req, res) => {
  try {
    const queues = await Queue.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(queues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get queue by ID with all entries
router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    const entries = await QueueEntry.find({ queueId: req.params.id })
      .sort({ position: 1 });

    res.json({ queue, entries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join a queue (with validation and email notification)
router.post('/:id/join', validateJoinQueue, async (req, res) => {
  try {
    const { userName, userPhone, userEmail, notes } = req.body;

    const queue = await Queue.findById(req.params.id);
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    if (!queue.isActive) {
      return res.status(400).json({ message: 'Queue is not active' });
    }

    // Check if user is already in this queue
    const existingEntry = await QueueEntry.findOne({
      queueId: req.params.id,
      userPhone,
      status: { $in: ['waiting', 'called'] }
    });

    if (existingEntry) {
      return res.status(400).json({ 
        message: 'You are already in this queue',
        entry: existingEntry
      });
    }

    // Get the last position in queue
    const lastEntry = await QueueEntry.findOne({ queueId: req.params.id })
      .sort({ position: -1 });

    const newPosition = lastEntry ? lastEntry.position + 1 : 1;

    // Count waiting people
    const waitingCount = await QueueEntry.countDocuments({
      queueId: req.params.id,
      status: 'waiting'
    });

    if (waitingCount >= queue.maxCapacity) {
      return res.status(400).json({ message: 'Queue is full' });
    }

    // Calculate estimated wait time
    const estimatedWaitTime = (newPosition - queue.currentServingPosition) * queue.estimatedTimePerPerson;

    const newEntry = new QueueEntry({
      queueId: req.params.id,
      userName,
      userPhone,
      userEmail,
      position: newPosition,
      estimatedWaitTime,
      notes
    });

    await newEntry.save();

    // Send confirmation email (non-blocking)
    if (userEmail) {
      sendQueueJoinedEmail(userEmail, userName, queue.name, newPosition, estimatedWaitTime)
        .catch(err => console.error('Email sending failed:', err));
    }

    res.status(201).json({
      message: 'Successfully joined the queue',
      entry: newEntry,
      queueName: queue.name,
      estimatedWaitTime
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's position in queue
router.get('/:queueId/position/:phone', async (req, res) => {
  try {
    const entry = await QueueEntry.findOne({
      queueId: req.params.queueId,
      userPhone: req.params.phone,
      status: { $in: ['waiting', 'called'] }
    });

    if (!entry) {
      return res.status(404).json({ message: 'No active entry found in this queue' });
    }

    const queue = await Queue.findById(req.params.queueId);
    
    // Count people ahead
    const peopleAhead = await QueueEntry.countDocuments({
      queueId: req.params.queueId,
      position: { $lt: entry.position },
      status: 'waiting'
    });

    res.json({
      entry,
      peopleAhead,
      queue: {
        name: queue.name,
        currentServingPosition: queue.currentServingPosition
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel queue entry
router.delete('/:queueId/cancel/:entryId', async (req, res) => {
  try {
    const entry = await QueueEntry.findById(req.params.entryId);

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    if (entry.status !== 'waiting' && entry.status !== 'called') {
      return res.status(400).json({ message: 'Cannot cancel this entry' });
    }

    entry.status = 'cancelled';
    await entry.save();

    res.json({ message: 'Entry cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
