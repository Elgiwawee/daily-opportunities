
// Service Worker for Push Notifications
self.addEventListener('push', function(event) {
  try {
    const data = event.data.json();
    
    // Default options
    const options = {
      body: data.body || 'New notification',
      icon: data.icon || '/og-image.png',
      badge: '/favicon.ico',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/',
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      // For videos/images, we can add an image to the notification
      image: data.image || null,
      actions: data.actions || [
        {
          action: 'explore',
          title: 'View Details',
          icon: '/favicon.ico'
        }
      ],
      // Make notifications more prominent
      requireInteraction: true
    };

    // Show the notification
    event.waitUntil(
      self.registration.showNotification(data.title || 'New Update', options)
    );
  } catch (error) {
    console.error('Error showing notification:', error);
    
    // Show a generic notification if parsing fails
    const options = {
      body: 'You have a new notification',
      icon: '/og-image.png',
      badge: '/favicon.ico'
    };
    
    event.waitUntil(
      self.registration.showNotification('New Notification', options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // Determine the URL to open
  let url = '/';
  if (event.notification.data && event.notification.data.url) {
    url = event.notification.data.url;
  } else if (event.action === 'explore' && event.notification.data) {
    url = event.notification.data.url || '/';
  }
  
  // Open the URL in a browser tab
  event.waitUntil(
    clients.matchAll({type: 'window'}).then(function(clientList) {
      // If a tab is already open, focus it
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new tab
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Handle the notification closing event
self.addEventListener('notificationclose', function(event) {
  console.log('Notification was closed', event);
});

// Activate event - claim clients so the service worker is used right away
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});
