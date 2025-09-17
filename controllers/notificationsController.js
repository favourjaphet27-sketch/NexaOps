/**
 * Send a notification (demo mode - simulates WhatsApp/SMS)
 * 
 * @param {Object} notificationData - Notification information
 * @param {string} notificationData.type - Notification type ('whatsapp' or 'sms')
 * @param {string} notificationData.message - Message content to send
 * @param {string} notificationData.recipient - Recipient phone number or identifier
 * @param {string} [notificationData.priority] - Priority level ('low', 'medium', 'high')
 * @returns {Promise<Object>} Notification result with demo details
 * @throws {Error} Validation error
 */
async function sendNotification(notificationData) {
  // Validate input data
  const validation = validateNotification(notificationData);
  if (!validation.valid) {
    const error = new Error('Validation failed');
    error.validation = true;
    error.errors = validation.errors;
    throw error;
  }

  // Simulate notification sending with console.log
  const timestamp = new Date().toISOString();
  const notificationId = generateNotificationId();
  
  // Log the notification attempt (demo mode)
  console.log('='.repeat(60));
  console.log(`📱 NOTIFICATION SENT (DEMO MODE) - ID: ${notificationId}`);
  console.log(`⏰ Timestamp: ${timestamp}`);
  console.log(`📞 Type: ${notificationData.type.toUpperCase()}`);
  console.log(`👤 Recipient: ${notificationData.recipient}`);
  console.log(`📝 Message: ${notificationData.message}`);
  console.log(`⚡ Priority: ${notificationData.priority || 'medium'}`);
  console.log('='.repeat(60));

  // Simulate different response times based on type
  const delay = notificationData.type === 'whatsapp' ? 1500 : 800;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Return demo result
  return {
    id: notificationId,
    type: notificationData.type,
    recipient: notificationData.recipient,
    message: notificationData.message,
    priority: notificationData.priority || 'medium',
    status: 'sent',
    timestamp: timestamp,
    demo_mode: true,
    note: 'This is a demo notification. No actual message was sent.'
  };
}

/**
 * Validate notification data
 * 
 * @param {Object} data - Notification data to validate
 * @returns {Object} Validation result with valid flag and errors array
 */
function validateNotification(data) {
  const errors = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Notification payload must be an object.');
    return { valid: false, errors };
  }

  // Validate type
  if (!data.type || typeof data.type !== 'string') {
    errors.push('type is required and must be a string.');
  } else if (!['whatsapp', 'sms'].includes(data.type.toLowerCase())) {
    errors.push('type must be either "whatsapp" or "sms".');
  }

  // Validate message
  if (!data.message || typeof data.message !== 'string' || data.message.trim().length === 0) {
    errors.push('message is required and must be a non-empty string.');
  }

  // Validate recipient
  if (!data.recipient || typeof data.recipient !== 'string' || data.recipient.trim().length === 0) {
    errors.push('recipient is required and must be a non-empty string.');
  }

  // Validate priority (optional)
  if (data.priority && !['low', 'medium', 'high'].includes(data.priority.toLowerCase())) {
    errors.push('priority must be "low", "medium", or "high" if provided.');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Generate a unique notification ID for demo purposes
 * 
 * @returns {string} Unique notification identifier
 */
function generateNotificationId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `notif_${timestamp}_${random}`;
}

module.exports = {
  sendNotification
};
