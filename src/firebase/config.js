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

// Retrieve config from localStorage (custom entered) or environment variables
export const getActiveFirebaseConfig = () => {
  const saved = localStorage.getItem('kapil_firebase_config');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.apiKey) return parsed;
    } catch (e) { }
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "fullstack-universe-kapil.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "fullstack-universe-kapil",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "fullstack-universe-kapil.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "981245781200",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:981245781200:web:89a1b2c3d4e5f678"
  };
};

export const hasValidCustomApiKey = () => {
  const cfg = getActiveFirebaseConfig();
  return Boolean(cfg.apiKey && cfg.apiKey.length > 20 && !cfg.apiKey.includes('kapilUniverseProductionApiKey'));
};

const config = getActiveFirebaseConfig();
// Only initialize if API key exists, otherwise initialize gracefully
let app;
let auth;
let db;

try {
  app = getApps().length === 0 ? initializeApp(config.apiKey ? config : {
    apiKey: "AIzaSyD_DummyValidFormatKeyForInitOnly001",
    projectId: "fullstack-universe-kapil",
    authDomain: "fullstack-universe-kapil.firebaseapp.com",
    appId: "1:981245781200:web:89a1b2c3d4e5f678"
  }) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.warn('[Firebase] Initialization notice:', e);
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

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
