const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: false // Optional since Google OAuth users won't have password
  },
  name: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  circle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Circle'
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

// Check if user email is from allowed domains
userSchema.methods.isAllowedDomain = function() {
  const allowedDomains = ['fincra.com', 'boldbank.ng'];
  const emailDomain = this.email.split('@')[1];
  return allowedDomains.includes(emailDomain);
};

// Get user's email domain
userSchema.methods.getEmailDomain = function() {
  return this.email.split('@')[1];
};

module.exports = mongoose.model('User', userSchema);