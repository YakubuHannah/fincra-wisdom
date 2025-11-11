const mongoose = require('mongoose');

const suggestedDocumentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, lowercase: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  departmentName: { type: String, required: true },
  circleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Circle', required: true },
  circleName: { type: String, required: true },
  // File information stored (uploaded but not published)
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, default: 0 },
  cloudinaryPublicId: { type: String },
  // submitter and status
  submitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submitterEmail: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminNotes: { type: String },
  summary: { type: String, default: '' },
  category: { type: String, default: 'Other' },
}, { timestamps: true });

module.exports = mongoose.model('SuggestedDocument', suggestedDocumentSchema);
