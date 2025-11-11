const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { isAuthenticated } = require('../middleware/auth');

// Get current user's notifications (most recent first)
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) return res.status(400).json({ error: 'User email not available' });

    const notifications = await Notification.find({ recipientEmail: email })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
  }
});

// Get unread notifications count
router.get('/unread-count', isAuthenticated, async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) return res.status(400).json({ error: 'User email not available' });

    const count = await Notification.countDocuments({ recipientEmail: email, read: false });
    res.json({ success: true, data: { count } });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch unread count' });
  }
});

// Mark a single notification as read
router.put('/:id/read', isAuthenticated, async (req, res) => {
  try {
    const email = req.user?.email;
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipientEmail: email },
      { $set: { read: true } },
      { new: true }
    );

    if (!notification) return res.status(404).json({ success: false, error: 'Notification not found' });

    res.json({ success: true, data: notification });
  } catch (error) {
    console.error('Error marking notification read:', error);
    res.status(500).json({ success: false, error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.put('/read-all', isAuthenticated, async (req, res) => {
  try {
    const email = req.user?.email;
    await Notification.updateMany({ recipientEmail: email, read: false }, { $set: { read: true } });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications read:', error);
    res.status(500).json({ success: false, error: 'Failed to mark notifications as read' });
  }
});

module.exports = router;
