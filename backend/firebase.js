// backend/firebase.js
const admin = require('firebase-admin');

// Initialize Firebase Admin with your credentials
const serviceAccount = require('./serviceaccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wherenow-832e7.firebaseio.com",
});

const auth = admin.auth();
const db = admin.firestore();

module.exports = { auth, db };
