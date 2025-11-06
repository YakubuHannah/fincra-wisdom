const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    lowercase: true
  },
  circleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Circle',
    required: true
  },
  circleName: {
    type: String,
    required: true
  },
  teamLead: {
    type: String,
    default: ''
  },
  teamLeadEmail: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: '📂'
  },
  documentCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
departmentSchema.index({ circleId: 1, slug: 1 });

module.exports = mongoose.model('Department', departmentSchema);
