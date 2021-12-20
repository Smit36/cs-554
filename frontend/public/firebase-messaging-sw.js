// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyB51FdqiarLOMHsK8XBfyGdho8Zxx0gkxQ",
  authDomain: "cs-554-27e17.firebaseapp.com",
  projectId: "cs-554-27e17",
  storageBucket: "cs-554-27e17.appspot.com",
  messagingSenderId: "944775931807",
  appId: "1:944775931807:web:b1d6605ce210da9309bfaa"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.title || 'WashTastic Update';
  const notificationOptions = {
    body: payload.message || 'New updates available.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});