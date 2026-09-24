import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBDmDFZtD9wExVGsbYx6ieebZrZzyGMxMU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "full-stack-universe-with-kapil.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "full-stack-universe-with-kapil",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "full-stack-universe-with-kapil.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "174077043720",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:174077043720:web:4f2783bb7abdac67609dbd",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-6Q7SJ3EE26"
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
  signInWithRedirect,
  getRedirectResult,
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
