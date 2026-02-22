// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'Crypto Risk Alert';
  const notificationOptions = {
    body: payload.notification?.body || 'Check your favorite coins',
    icon: '/icon.png',
    badge: '/badge.png',
    vibrate: [200, 100, 200],
    tag: 'crypto-risk-alert',
    requireInteraction: true,
    data: payload.data,
    actions: [
      {
        action: 'view',
        title: 'View Details'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click:', event);

  event.notification.close();

  if (event.action === 'view') {
    const coinId = event.notification.data?.coinId;
    const url = coinId ? `/coin/${coinId}` : '/';

    event.waitUntil(
      clients.openWindow(url)
    );
  }
});
