// Push Notification Helper
// VAPID keys - generate these using: npx web-push generate-vapid-keys
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

export async function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.warn('Service Worker không được hỗ trợ');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    console.log('Service Worker đã đăng ký:', registration);
    return registration;
  } catch (error) {
    console.error('Lỗi đăng ký Service Worker:', error);
    return null;
  }
}

export async function requestNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('Notification API không được hỗ trợ');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  return permission;
}

export async function subscribeToPushNotifications(userId: string) {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      // Subscribe to push
      const vapidPublicKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey as unknown as BufferSource,
      });
    }

    // Send subscription to server
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        subscription,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save subscription');
    }

    console.log('Push subscription saved:', subscription);
    return subscription;
  } catch (error) {
    console.error('Lỗi subscribe push notification:', error);
    return null;
  }
}

export async function unsubscribeFromPushNotifications(userId: string) {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      
      // Remove from server
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      console.log('Unsubscribed from push notifications');
    }
  } catch (error) {
    console.error('Lỗi unsubscribe:', error);
  }
}

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  if (typeof window === 'undefined') {
    return new Uint8Array();
  }
  
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray as Uint8Array;
}

// Test notification
export async function testPushNotification() {
  if (typeof window === 'undefined') {
    return;
  }
  
  const permission = await requestNotificationPermission();
  
  if (permission === 'granted') {
    const registration = await navigator.serviceWorker.ready;
    registration.showNotification('ChatApp Test', {
      body: 'Push notification đang hoạt động! 🎉',
      icon: '/icon.svg',
      badge: '/icon.svg',
      tag: 'test-notification',
    });
  }
}
