const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const ADMIN_EMAILS = require('../config/adminEmails');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Verify Google token and login/register user
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user is admin
    const isAdmin = ADMIN_EMAILS.includes(email);

    // Find or create user
    let user = await User.findOne({ email });

    if (user) {
      // Update existing user
      user.lastLogin = new Date();
      user.role = isAdmin ? 'admin' : 'user';
      user.name = name;
      user.picture = picture;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        googleId,
        email,
        name,
        picture,
        role: isAdmin ? 'admin' : 'user',
      });
    }

    // Create JWT token
    const authToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user data
    res.json({
      token: authToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ error: 'Authentication failed. Please try again.' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Update user profile (department and circle)
router.put('/profile', async (req, res) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { department, circle } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { department, circle },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role,
        department: user.department,
        circle: user.circle,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;