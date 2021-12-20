const { initializeApp, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');

const serviceAccount = require('./serviceAccountKey.json');

const firebaseApp = initializeApp({
  credential: cert(serviceAccount),
  // apiKey: "AIzaSyB51FdqiarLOMHsK8XBfyGdho8Zxx0gkxQ",
  // authDomain: "cs-554-27e17.firebaseapp.com",
  // projectId: "cs-554-27e17",
  // storageBucket: "cs-554-27e17.appspot.com",
  // messagingSenderId: "944775931807",
  // appId: "1:944775931807:web:b1d6605ce210da9309bfaa",
});

module.exports = {
  firebaseApp,
  messaging: getMessaging(firebaseApp),
};
