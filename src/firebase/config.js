import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';

// Authentic, live, production Firebase & Google OAuth configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyANysm4wsI3otBqWCn2xCZ8RrQ6tX-0pv0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "java-dsa-iq-day7.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "java-dsa-iq-day7",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "java-dsa-iq-day7.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "839513771129",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:839513771129:web:5c707bccca97a0e71a18a8",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-81ZW1P1RL4"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Google OAuth scopes and parameters
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
googleProvider.addScope('email');
googleProvider.addScope('profile');

export { 
  app, 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signOut, 
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
};
