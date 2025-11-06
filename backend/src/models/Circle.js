const mongoose = require('mongoose');

const circleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  icon: {
    type: String,
    default: '📁'
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  description: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    required: true
  },
  departments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  }]
}, {
  timestamps: true
});

// Virtual for department count
circleSchema.virtual('departmentCount').get(function() {
  return this.departments ? this.departments.length : 0;
});

// Ensure virtuals are included in JSON
circleSchema.set('toJSON', { virtuals: true });
circleSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Circle', circleSchema);
