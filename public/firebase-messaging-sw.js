
// This file must be in the public folder.

// Give the service worker access to Firebase Messaging.
// Note that you can only use plain `importScripts` here, not ES6 `import`.
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
// The config object should be sourced from your Firebase project settings.
const firebaseConfig = {
  apiKey: "AIzaSyA16GvnMrRQrMQDQggkPyzK6uuVgJSNPAU",
  authDomain: "bonus-tracker-ae251.firebaseapp.com",
  projectId: "bonus-tracker-ae251",
  storageBucket: "bonus-tracker-ae251.firebasestorage.app",
  messagingSenderId: "264854663999",
  appId: "1:264854663999:web:82117b88ab35ef584c998a",
  measurementId: "G-NZS6G1VWH0"
};

firebase.initializeApp(firebaseConfig);

// Immediately activate and take control so PushManager can subscribe on first load
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification?.title || 'Notification';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    data: { url: (payload?.fcmOptions?.link || '/dashboard') }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Ensure clicking the notification focuses or opens the app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const targetUrl = event.notification?.data?.url || '/';
  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({ includeUncontrolled: true, type: 'window' });
      let client = allClients.find(c => c.url.includes(self.location.origin));
      if (client) {
        client.focus();
        try { client.navigate(targetUrl); } catch {}
      } else {
        await clients.openWindow(targetUrl);
      }
    })()
  );
});
