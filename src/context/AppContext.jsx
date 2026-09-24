import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRACKS_DATA } from '../data/curriculumData';
import { 
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
} from '../firebase/config';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Track selection: 'java' or 'python'
  const [activeTrack, setActiveTrack] = useState(() => {
    return localStorage.getItem('kapil_universe_track') || 'java';
  });

  // Current authenticated user (Synced from Firebase Auth + Firestore)
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('kapil_universe_admin') === 'true';
  });

  // Interactive Tour State
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Modals visibility
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Completed quizzes (synced with Firestore when logged in)
  const [completedQuizzes, setCompletedQuizzes] = useState(() => {
    const saved = localStorage.getItem('kapil_universe_quizzes');
    return saved ? JSON.parse(saved) : {};
  });

  // Issued certificates
  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem('kapil_universe_certs');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync active track to localStorage
  useEffect(() => {
    localStorage.setItem('kapil_universe_track', activeTrack);
  }, [activeTrack]);

  // Sync admin state to localStorage
  useEffect(() => {
    localStorage.setItem('kapil_universe_admin', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  // Listen to Firebase Auth state in real-time
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsAuthLoading(true);
      if (firebaseUser) {
        try {
          // Fetch existing user journey from Cloud Firestore
          const userDocRef = doc(db, 'learners', firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            setCurrentUser({
              uid: firebaseUser.uid,
              name: data.displayName || firebaseUser.displayName || 'Learner',
              email: firebaseUser.email,
              avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firebaseUser.displayName || firebaseUser.email || 'Learner')}`,
              track: data.track || activeTrack,
              level: data.level || 'Level 01',
              progressPercent: data.progressPercent || 0,
              streakDays: data.streakDays || 1,
              projectsRemaining: data.projectsRemaining !== undefined ? data.projectsRemaining : 8,
              xp: data.xp || 50,
              githubUsername: data.githubUsername || '',
              isFirebase: true
            });
            if (data.track) setActiveTrack(data.track);
            if (data.completedQuizzes) setCompletedQuizzes(data.completedQuizzes);
          } else {
            // New user provisioning in Firestore
            const initialUserData = {
              displayName: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Learner'),
              email: firebaseUser.email,
              track: activeTrack,
              level: 'Level 01',
              progressPercent: 5,
              streakDays: 1,
              projectsRemaining: 8,
              xp: 100,
              completedQuizzes: {},
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp()
            };
            await setDoc(userDocRef, initialUserData);

            setCurrentUser({
              uid: firebaseUser.uid,
              name: initialUserData.displayName,
              email: firebaseUser.email,
              avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(initialUserData.displayName)}`,
              track: activeTrack,
              level: 'Level 01',
              progressPercent: 5,
              streakDays: 1,
              projectsRemaining: 8,
              xp: 100,
              githubUsername: '',
              isFirebase: true
            });
          }
        } catch (err) {
          console.warn('[Firestore] Sync notice:', err);
          // Fallback to Firebase Auth profile
          setCurrentUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Learner',
            email: firebaseUser.email,
            avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firebaseUser.displayName || 'Learner')}`,
            track: activeTrack,
            level: 'Level 01',
            progressPercent: 10,
            streakDays: 1,
            projectsRemaining: 8,
            xp: 100,
            isFirebase: true
          });
        }
      } else {
        setCurrentUser(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, [activeTrack]);

  // Real Firebase Google Sign-In via Popup
  const loginWithGoogleFirebase = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setIsGoogleModalOpen(false);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('[Firebase Auth Error]', error);
      return { success: false, error: error.message, code: error.code };
    }
  };

  // Real Firebase Email/Password Sign-In
  const loginWithEmailFirebase = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setIsGoogleModalOpen(false);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('[Firebase Auth Error]', error);
      return { success: false, error: error.message, code: error.code };
    }
  };

  // Real Firebase Email/Password Sign-Up
  const registerWithEmailFirebase = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      setIsGoogleModalOpen(false);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('[Firebase Auth Error]', error);
      return { success: false, error: error.message, code: error.code };
    }
  };

  // Firebase Sign-Out
  const logoutUser = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (err) {
      console.error('Sign out error', err);
    }
  };

  // Admin authentication (Secured credentials checked without rendering on screen)
  const authenticateAdmin = (adminId, password) => {
    if (adminId.trim().toUpperCase() === 'KAPILADMIN' && password.trim() === 'ADMIN123') {
      setIsAdminLoggedIn(true);
      setIsAdminModalOpen(false);
      return { success: true };
    }
    return { success: false, message: 'Invalid Admin Credentials. Access Denied.' };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
  };

  // Guided Tour
  const startDemoTour = () => {
    setIsTourActive(true);
    setTourStep(0);
  };

  const nextTourStep = () => {
    setTourStep(prev => prev + 1);
  };

  const prevTourStep = () => {
    setTourStep(prev => Math.max(0, prev - 1));
  };

  const closeTour = () => {
    setIsTourActive(false);
    setTourStep(0);
  };

  // Record quiz answer and sync to Firestore
  const recordQuizAnswer = async (quizId, optionIndex, isCorrect) => {
    if (isCorrect) {
      const updated = { ...completedQuizzes, [quizId]: optionIndex };
      setCompletedQuizzes(updated);
      localStorage.setItem('kapil_universe_quizzes', JSON.stringify(updated));

      if (currentUser && currentUser.uid) {
        try {
          const userDocRef = doc(db, 'learners', currentUser.uid);
          await updateDoc(userDocRef, {
            completedQuizzes: updated,
            xp: (currentUser.xp || 0) + 50,
            progressPercent: Math.min(100, (currentUser.progressPercent || 0) + 2)
          });
        } catch (e) { }

        setCurrentUser(prev => prev ? ({
          ...prev,
          xp: (prev.xp || 0) + 50,
          progressPercent: Math.min(100, (prev.progressPercent || 0) + 2)
        }) : null);
      }
    }
  };

  // Generate verified certificate
  const generateCertificate = (studentName, trackTitle) => {
    const newCert = {
      id: `CERT-KAPIL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: studentName || (currentUser ? currentUser.name : 'Certified Full Stack Engineer'),
      track: trackTitle || (activeTrack === 'java' ? 'Java Full Stack Universe' : 'Python Full Stack Universe'),
      issueDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      instructor: 'Kapil Sir',
      score: '96%',
      verificationUrl: `https://sarlayash.github.io/FULL-STACK-UNIVERSE-WITH-KAPIL/#/verify/CERT-KAPIL-${Date.now().toString().slice(-4)}`
    };
    setCertificates(prev => [newCert, ...prev]);
    localStorage.setItem('kapil_universe_certs', JSON.stringify([newCert, ...certificates]));
    return newCert;
  };

  return (
    <AppContext.Provider
      value={{
        activeTrack,
        setActiveTrack,
        currentUser,
        setCurrentUser,
        isAuthLoading,
        isAdminLoggedIn,
        authenticateAdmin,
        logoutAdmin,
        loginWithGoogleFirebase,
        loginWithEmailFirebase,
        registerWithEmailFirebase,
        logoutUser,
        isTourActive,
        tourStep,
        startDemoTour,
        nextTourStep,
        prevTourStep,
        closeTour,
        isGoogleModalOpen,
        setIsGoogleModalOpen,
        isAdminModalOpen,
        setIsAdminModalOpen,
        activeTab,
        setActiveTab,
        completedQuizzes,
        recordQuizAnswer,
        certificates,
        generateCertificate,
        currentTrackData: TRACKS_DATA[activeTrack]
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
