import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Check if push notifications are supported
export const isPushSupported = () => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!isPushSupported()) {
    console.log('Push notifications not supported');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Get VAPID public key from server
export const getVapidPublicKey = async () => {
  try {
    const response = await axios.get(`${API_URL}/notifications/vapid-public-key`);
    return response.data;
  } catch (error) {
    console.error('Failed to get VAPID key:', error);
    return { available: false };
  }
};

// Subscribe to push notifications
export const subscribeToPush = async () => {
  if (!isPushSupported()) {
    return { success: false, reason: 'Not supported' };
  }

  try {
    // Get permission
    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      return { success: false, reason: 'Permission denied' };
    }

    // Get VAPID key
    const vapidData = await getVapidPublicKey();
    if (!vapidData.available) {
      return { success: false, reason: 'Server not configured' };
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;

    // Subscribe to push
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidData.publicKey)
    });

    // Send subscription to server
    const token = localStorage.getItem('token');
    await axios.post(
      `${API_URL}/notifications/subscribe`,
      { subscription },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('Push notification subscription successful');
    return { success: true };
  } catch (error) {
    console.error('Push subscription error:', error);
    return { success: false, reason: error.message };
  }
};

// Unsubscribe from push notifications
export const unsubscribeFromPush = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/notifications/unsubscribe`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
    
    return { success: true };
  } catch (error) {
    console.error('Push unsubscribe error:', error);
    return { success: false, reason: error.message };
  }
};

// Show browser notification (for when app is in foreground)
export const showBrowserNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/logo192.png',
      badge: '/logo192.png',
      ...options
    });
  }
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const pushNotificationUtils = {
  isPushSupported,
  requestNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
  showBrowserNotification
};

export default pushNotificationUtils;
