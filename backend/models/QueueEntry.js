const mongoose = require('mongoose');

const queueEntrySchema = new mongoose.Schema({
  queueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Queue',
    required: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  userPhone: {
    type: String,
    required: true,
    trim: true
  },
  userEmail: {
    type: String,
    trim: true
  },
  position: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'called', 'served', 'missed', 'cancelled'],
    default: 'waiting'
  },
  estimatedWaitTime: {
    type: Number, // in minutes
    default: 0
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  calledAt: {
    type: Date
  },
  servedAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
});

// Index for faster queries
queueEntrySchema.index({ queueId: 1, position: 1 });
queueEntrySchema.index({ queueId: 1, status: 1 });

module.exports = mongoose.model('QueueEntry', queueEntrySchema);
