// src/firebase.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


// Check loaded environment variables
console.log('Firebase Config:', {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

const firebaseConfig = {
  apiKey: "AIzaSyDOiYxavXKZ_JKMCMk_IBbU588r8tLmzgw",
  authDomain: "wherenow-832e7.firebaseapp.com",
  projectId: "wherenow-832e7",
  storageBucket: "wherenow-832e7.firebasestorage.app",
  messagingSenderId: "508961153534",
  appId: "1:508961153534:web:2a9b0c11b297a19b75e0af",
  measurementId: "G-VQ5WWRQ0HG"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth();

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

export { auth, db };
export default app;
