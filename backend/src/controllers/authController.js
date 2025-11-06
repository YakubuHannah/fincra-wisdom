const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

// Google OAuth Callback
exports.googleCallback = async (req, res) => {
  try {
    const { email, name, picture, googleId } = req.body;

    // Validate email domain
    const emailDomain = email.split('@')[1];
    const allowedDomains = ['fincra.com', 'boldbank.ng'];
    
    if (!allowedDomains.includes(emailDomain)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only @fincra.com and @boldbank.ng emails are allowed.'
      });
    }

    // Check if user is blocked
    let user = await User.findOne({ email });
    if (user && user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your access has been blocked. Please contact an administrator.'
      });
    }

    // Create or update user
    if (!user) {
      user = await User.create({
        email,
        name,
        profilePicture: picture,
        googleId,
        lastLogin: new Date()
      });
    } else {
      user.name = name;
      user.profilePicture = picture;
      user.googleId = googleId;
      user.lastLogin = new Date();
      await user.save();
    }

    // Populate department and circle
    await user.populate('department circle');

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        department: user.department,
        circle: user.circle,
        role: user.role,
        isFirstLogin: !user.department // First login if no department set
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('department')
      .populate('circle');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        department: user.department,
        circle: user.circle,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user'
    });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { department, circle } = req.body;
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (department) user.department = department;
    if (circle) user.circle = circle;
    
    await user.save();
    await user.populate('department circle');

    res.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        department: user.department,
        circle: user.circle,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

// Logout
exports.logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};
// Simple Email Login with Circle and Department
exports.emailLogin = async (req, res) => {
  try {
    const { email, circle, department } = req.body;

    // Validate email domain
    const emailDomain = email.split('@')[1];
    const allowedDomains = ['fincra.com', 'boldbank.ng'];
    
    if (!allowedDomains.includes(emailDomain)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only @fincra.com and @boldbank.ng emails are allowed.'
      });
    }

    // Check if user is blocked
    let user = await User.findOne({ email });
    if (user && user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your access has been blocked. Please contact an administrator.'
      });
    }

    // Create or update user
    if (!user) {
      user = await User.create({
        email,
        name: email.split('@')[0],
        circle,
        department,
        lastLogin: new Date()
      });
    } else {
      user.circle = circle;
      user.department = department;
      user.lastLogin = new Date();
      await user.save();
    }

    // Populate department and circle
    await user.populate('department circle');

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        department: user.department,
        circle: user.circle,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Email login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};