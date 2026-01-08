const webpush = require('web-push');

// Configure web-push with VAPID keys
const initializePushNotifications = () => {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  
  if (!publicKey || !privateKey) {
    return false;
  }

  webpush.setVapidDetails(
    'mailto:' + (process.env.EMAIL_USER || 'admin@skipline.com'),
    publicKey,
    privateKey
  );
  
  return true;
};

// Store for push subscriptions (in production, store in database)
const subscriptions = new Map();

/**
 * Save a push subscription for a user
 */
const saveSubscription = (userId, subscription) => {
  subscriptions.set(userId, subscription);
  return true;
};

/**
 * Remove a push subscription
 */
const removeSubscription = (userId) => {
  subscriptions.delete(userId);
};

/**
 * Send push notification to a specific user
 */
const sendPushNotification = async (userId, payload) => {
  const subscription = subscriptions.get(userId);
  
  if (!subscription) {
    return { success: false, reason: 'No subscription' };
  }

  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return { success: true };
  } catch (error) {
    // Remove invalid subscriptions
    if (error.statusCode === 410) {
      removeSubscription(userId);
    }
    
    return { success: false, error: error.message };
  }
};

/**
 * Send "Your Turn is Approaching" notification
 */
const notifyTurnApproaching = async (userId, queueName, position, peopleAhead) => {
  return sendPushNotification(userId, {
    title: '⏰ Your turn is approaching!',
    body: `${queueName}: You are #${position} with ${peopleAhead} ${peopleAhead === 1 ? 'person' : 'people'} ahead`,
    icon: '/logo192.png',
    badge: '/logo192.png',
    tag: 'turn-approaching',
    data: {
      type: 'turn-approaching',
      queueName,
      position,
      peopleAhead
    },
    actions: [
      { action: 'view', title: 'View Queue' }
    ]
  });
};

/**
 * Send "It's Your Turn" notification
 */
const notifyYourTurn = async (userId, queueName) => {
  return sendPushNotification(userId, {
    title: '🔔 IT\'S YOUR TURN!',
    body: `Please proceed to ${queueName} immediately!`,
    icon: '/logo192.png',
    badge: '/logo192.png',
    tag: 'your-turn',
    requireInteraction: true, // Keep notification visible until user interacts
    data: {
      type: 'your-turn',
      queueName
    },
    actions: [
      { action: 'acknowledge', title: 'On my way!' }
    ]
  });
};

/**
 * Send queue joined confirmation
 */
const notifyQueueJoined = async (userId, queueName, position) => {
  return sendPushNotification(userId, {
    title: '✅ Queue Joined Successfully!',
    body: `${queueName}: Your position is #${position}`,
    icon: '/logo192.png',
    badge: '/logo192.png',
    tag: 'queue-joined',
    data: {
      type: 'queue-joined',
      queueName,
      position
    }
  });
};

/**
 * Get VAPID public key for frontend
 */
const getPublicVapidKey = () => {
  return process.env.VAPID_PUBLIC_KEY || null;
};

module.exports = {
  initializePushNotifications,
  saveSubscription,
  removeSubscription,
  sendPushNotification,
  notifyTurnApproaching,
  notifyYourTurn,
  notifyQueueJoined,
  getPublicVapidKey
};
