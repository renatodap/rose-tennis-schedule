/**
 * Custom Service Worker
 * Handles push notifications and notification clicks
 */

// Workbox manifest injection point
self.__WB_MANIFEST;

// Handle push notification events
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);

  if (!event.data) {
    console.log('Push event has no data');
    return;
  }

  try {
    const data = event.data.json();
    console.log('Push notification data:', data);

    const options = {
      body: data.body,
      icon: data.icon || '/icon-192x192.svg',
      badge: data.badge || '/icon-192x192.svg',
      tag: data.tag || 'tennis-notification',
      data: data.data || {},
      actions: data.actions || [],
      requireInteraction: true, // Keep notification visible until user interacts
      vibrate: [200, 100, 200], // Vibration pattern
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error('Error handling push event:', error);
  }
});

// Handle notification click events
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  // Handle action button clicks
  if (event.action) {
    console.log('Action clicked:', event.action);

    // Handle different actions
    switch (event.action) {
      case 'view':
      case 'rsvp':
        // Open the URL from notification data
        const url = event.notification.data?.url || '/';
        event.waitUntil(
          clients.openWindow(url)
        );
        break;
      default:
        console.log('Unknown action:', event.action);
    }
  } else {
    // No action - just open the app to the URL
    const url = event.notification.data?.url || '/events';

    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url.includes(url) && 'focus' in client) {
            return client.focus();
          }
        }

        // No matching window, open a new one
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
});

// Handle notification close events (optional - for analytics)
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
  // Could send analytics here if needed
});
