const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    lowercase: true
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  departmentName: {
    type: String,
    required: true
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
  
  // File information
  fileUrl: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true,
    enum: ['pdf', 'docx', 'doc', 'pptx', 'ppt', 'xlsx', 'xls', 'txt', 'md']
  },
  fileSize: {
    type: Number,
    default: 0
  },
  
  // Content
  content: {
    type: String,
    default: ''
  },
  summary: {
    type: String,
    default: ''
  },
  
  // Metadata
  author: {
    type: String,
    default: ''
  },
  version: {
    type: String,
    default: '1.0'
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['SOP', 'Report', 'Template', 'Guide', 'Policy', 'Manual', 'Other'],
    default: 'Other'
  },
  
  // Search optimization
  searchableText: {
    type: String,
    default: ''
  },
  vectorEmbedding: [Number],
  
  // Engagement metrics
  viewCount: {
    type: Number,
    default: 0
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  lastViewedAt: {
    type: Date
  },
  
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient searching
documentSchema.index({ title: 'text', content: 'text', searchableText: 'text' });
documentSchema.index({ departmentId: 1, createdAt: -1 });
documentSchema.index({ circleId: 1, createdAt: -1 });
documentSchema.index({ tags: 1 });

// Method to increment view count
documentSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  this.lastViewedAt = new Date();
  return this.save();
};

// Method to increment download count
documentSchema.methods.incrementDownloadCount = function() {
  this.downloadCount += 1;
  return this.save();
};

module.exports = mongoose.model('Document', documentSchema);
