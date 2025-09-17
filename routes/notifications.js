const express = require('express');
const router = express.Router();
const { sendNotification } = require('../controllers/notificationsController');

/**
 * POST /api/notifications
 * Send a test reminder notification (demo mode)
 * 
 * @route POST /api/notifications
 * @param {Object} req.body - Notification data
 * @param {string} req.body.type - Notification type ('whatsapp' or 'sms')
 * @param {string} req.body.message - Message content to send
 * @param {string} req.body.recipient - Recipient phone number or identifier
 * @param {string} [req.body.priority] - Priority level ('low', 'medium', 'high')
 * @returns {Object} 200 - Notification sent successfully (demo)
 * @returns {Object} 400 - Validation error
 * @returns {Object} 500 - Server error
 */
router.post('/', async (req, res) => {
  try {
    const result = await sendNotification(req.body);
    res.status(200).json({
      success: true,
      data: result,
      message: 'Notification sent successfully (demo mode)'
    });
  } catch (error) {
    if (error.validation) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    console.error('Error sending notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send notification',
      message: 'Internal server error'
    });
  }
});

module.exports = router;
