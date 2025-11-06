const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

// Google OAuth callback
router.post('/google', authController.googleCallback);

// Get current user (protected)
router.get('/me', authenticate, authController.getCurrentUser);

// Update user profile (protected)
router.put('/profile', authenticate, authController.updateProfile);

// Logout
router.post('/logout', authenticate, authController.logout);

// Email login
router.post('/email-login', authController.emailLogin);

module.exports = router;