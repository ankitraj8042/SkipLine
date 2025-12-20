const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  organizationType: {
    type: String,
    enum: ['clinic', 'shop', 'college', 'other'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  maxCapacity: {
    type: Number,
    default: 100
  },
  estimatedTimePerPerson: {
    type: Number,
    default: 5, // in minutes
  },
  organizerName: {
    type: String,
    required: true
  },
  organizerEmail: {
    type: String,
    required: true
  },
  currentServingPosition: {
    type: Number,
    default: 0
  },
  totalServed: {
    type: Number,
    default: 0
  },
  qrCode: {
    type: String, // Stores QR code as base64 data URL
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
queueSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Queue', queueSchema);
