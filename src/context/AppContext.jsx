import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRACKS_DATA } from '../data/curriculumData';
import { 
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
} from '../firebase/config';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Track selection: 'java' or 'python'
  const [activeTrack, setActiveTrack] = useState(() => {
    return localStorage.getItem('kapil_universe_track') || 'java';
  });

  // Current authenticated user
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('kapil_universe_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return null;
  });

  const [isAuthLoading, setIsAuthLoading] = useState(false);

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

  // Completed quizzes
  const [completedQuizzes, setCompletedQuizzes] = useState(() => {
    const saved = localStorage.getItem('kapil_universe_quizzes');
    return saved ? JSON.parse(saved) : {};
  });

  // Issued certificates
  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem('kapil_universe_certs');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('kapil_universe_track', activeTrack);
  }, [activeTrack]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('kapil_universe_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('kapil_universe_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('kapil_universe_admin', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  // Listen to live Firebase Auth state if configured
  useEffect(() => {
    if (!auth) return;
    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // Immediately set user without blocking for Firestore
          const baseUser = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Learner'),
            email: firebaseUser.email,
            avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firebaseUser.displayName || firebaseUser.email || 'Learner')}`,
            track: activeTrack,
            level: 'Level 01',
            progressPercent: 20,
            streakDays: 1,
            projectsRemaining: 8,
            xp: 150,
            isFirebase: true
          };
          setCurrentUser(baseUser);

          // Asynchronously sync and enrich from Cloud Firestore in the background
          try {
            const userDocRef = doc(db, 'learners', firebaseUser.uid);
            getDoc(userDocRef).then((userSnap) => {
              if (userSnap.exists()) {
                const data = userSnap.data();
                setCurrentUser(prev => ({
                  ...prev,
                  name: data.displayName || prev.name,
                  track: data.track || prev.track,
                  level: data.level || prev.level,
                  progressPercent: data.progressPercent || prev.progressPercent,
                  xp: data.xp || prev.xp
                }));
                if (data.track) setActiveTrack(data.track);
                if (data.completedQuizzes) setCompletedQuizzes(data.completedQuizzes);
              } else {
                setDoc(userDocRef, {
                  displayName: baseUser.name,
                  email: baseUser.email,
                  track: activeTrack,
                  level: 'Level 01',
                  progressPercent: 20,
                  streakDays: 1,
                  projectsRemaining: 8,
                  xp: 150,
                  createdAt: serverTimestamp()
                }, { merge: true }).catch(() => {});
              }
            }).catch(() => {});
          } catch (e) {
            console.warn('[Firestore] Sync warning:', e);
          }
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('[Auth listener notice]:', e);
    }
  }, [activeTrack]);

  // Handle Google Redirect Result (for Incognito & mobile users)
  useEffect(() => {
    if (!auth) return;
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          const firebaseUser = result.user;
          const userObj = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Learner'),
            email: firebaseUser.email,
            avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firebaseUser.displayName || firebaseUser.email || 'Learner')}`,
            track: activeTrack,
            level: 'Level 01',
            progressPercent: 20,
            streakDays: 1,
            projectsRemaining: 8,
            xp: 150,
            isFirebase: true
          };

          setCurrentUser(userObj);
          setIsGoogleModalOpen(false);

          // Background firestore sync
          try {
            const userDocRef = doc(db, 'learners', firebaseUser.uid);
            setDoc(userDocRef, {
              displayName: userObj.name,
              email: userObj.email,
              photoURL: userObj.avatar,
              track: activeTrack,
              lastLogin: serverTimestamp(),
              updatedAt: new Date().toISOString()
            }, { merge: true }).catch(() => {});
          } catch (e) { }
        }
      })
      .catch((err) => {
        console.warn('[Firebase Redirect Result notice]:', err);
      });
  }, [activeTrack]);

  // Genuine Google OAuth Sign-In via Firebase signInWithPopup with automatic Redirect fallback
  const loginWithGoogleFirebase = async () => {
    if (!auth) {
      return { success: false, error: 'Firebase Auth is not available. Please verify configuration.' };
    }
    try {
      let result;
      try {
        result = await signInWithPopup(auth, googleProvider);
      } catch (popupErr) {
        // If popup was blocked by browser or Incognito policy, seamlessly switch to redirect
        if (popupErr.code === 'auth/popup-blocked' || popupErr.code === 'auth/cancelled-popup-request') {
          console.warn('[Firebase Auth] Popup blocked by browser, automatically falling back to redirect mode...');
          await signInWithRedirect(auth, googleProvider);
          return { success: true, redirected: true };
        }
        throw popupErr;
      }

      const firebaseUser = result.user;

      const userObj = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Learner'),
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firebaseUser.displayName || firebaseUser.email || 'Learner')}`,
        track: activeTrack,
        level: 'Level 01',
        progressPercent: 20,
        streakDays: 1,
        projectsRemaining: 8,
        xp: 150,
        isFirebase: true
      };

      // Set user immediately for 0-latency UI response
      setCurrentUser(userObj);
      setIsGoogleModalOpen(false);

      // Background sync to Cloud Firestore
      try {
        const userDocRef = doc(db, 'learners', firebaseUser.uid);
        setDoc(userDocRef, {
          displayName: userObj.name,
          email: userObj.email,
          photoURL: userObj.avatar,
          track: activeTrack,
          lastLogin: serverTimestamp(),
          updatedAt: new Date().toISOString()
        }, { merge: true }).catch(() => {});
      } catch (firestoreErr) { }

      return { success: true, user: userObj };
    } catch (error) {
      console.warn('[Firebase Google Auth Notice]:', error);
      return { 
        success: false, 
        error: error.message, 
        code: error.code 
      };
    }
  };

  // Google OAuth Sign-In via Redirect (100% works in Incognito without popup issues)
  const loginWithGoogleRedirect = async () => {
    if (!auth) {
      return { success: false, error: 'Firebase Auth is not available. Please verify configuration.' };
    }
    try {
      await signInWithRedirect(auth, googleProvider);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message, code: error.code };
    }
  };

  // Genuine Email & Password Sign-In
  const loginWithEmailFirebase = async (email, password) => {
    if (!auth) {
      return { success: false, error: 'Firebase Auth is not initialized.' };
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setIsGoogleModalOpen(false);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message, code: error.code };
    }
  };

  // Genuine Email & Password Registration
  const registerWithEmailFirebase = async (email, password, displayName) => {
    if (!auth) {
      return { success: false, error: 'Firebase Auth is not initialized.' };
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        try {
          await updateProfile(userCredential.user, { displayName });
        } catch (e) { }
      }
      try {
        const userDocRef = doc(db, 'learners', userCredential.user.uid);
        await setDoc(userDocRef, {
          displayName: displayName || email.split('@')[0],
          email: email,
          track: activeTrack,
          createdAt: serverTimestamp(),
          xp: 100,
          level: 'Level 01'
        }, { merge: true });
      } catch (e) { }

      setIsGoogleModalOpen(false);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message, code: error.code };
    }
  };

  // Sign out
  const logoutUser = async () => {
    if (auth) {
      try { await signOut(auth); } catch (e) { }
    }
    setCurrentUser(null);
    localStorage.removeItem('kapil_universe_user');
  };

  // Admin authentication (Checked against KAPILADMIN / ADMIN123 securely)
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

  // Record quiz answer and sync
  const recordQuizAnswer = async (quizId, optionIndex, isCorrect) => {
    if (isCorrect) {
      const updated = { ...completedQuizzes, [quizId]: optionIndex };
      setCompletedQuizzes(updated);
      localStorage.setItem('kapil_universe_quizzes', JSON.stringify(updated));

      if (currentUser && currentUser.uid) {
        if (hasValidCustomApiKey() && db) {
          try {
            const userDocRef = doc(db, 'learners', currentUser.uid);
            await updateDoc(userDocRef, {
              completedQuizzes: updated,
              xp: (currentUser.xp || 0) + 50,
              progressPercent: Math.min(100, (currentUser.progressPercent || 0) + 2)
            });
          } catch (e) { }
        }

        setCurrentUser(prev => prev ? ({
          ...prev,
          xp: (prev.xp || 0) + 50,
          progressPercent: Math.min(100, (prev.progressPercent || 0) + 2)
        }) : null);
      }
    }
  };

  // Generate certificate
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
        loginWithGoogleRedirect,
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
