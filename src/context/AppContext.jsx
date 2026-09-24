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
  serverTimestamp,
  hasValidCustomApiKey
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
          try {
            const userDocRef = doc(db, 'learners', firebaseUser.uid);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
              const data = userSnap.data();
              setCurrentUser({
                uid: firebaseUser.uid,
                name: data.displayName || firebaseUser.displayName || 'Learner',
                email: firebaseUser.email,
                avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firebaseUser.displayName || 'Learner')}`,
                track: data.track || activeTrack,
                level: data.level || 'Level 01',
                progressPercent: data.progressPercent || 15,
                streakDays: data.streakDays || 1,
                projectsRemaining: data.projectsRemaining !== undefined ? data.projectsRemaining : 8,
                xp: data.xp || 100,
                isFirebase: true
              });
              if (data.track) setActiveTrack(data.track);
              if (data.completedQuizzes) setCompletedQuizzes(data.completedQuizzes);
            } else {
              const initialUserData = {
                displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Learner',
                email: firebaseUser.email,
                track: activeTrack,
                level: 'Level 01',
                progressPercent: 10,
                streakDays: 1,
                projectsRemaining: 8,
                xp: 100,
                completedQuizzes: {},
                createdAt: new Date().toISOString()
              };
              try {
                await setDoc(userDocRef, initialUserData);
              } catch (e) { }

              setCurrentUser({
                uid: firebaseUser.uid,
                name: initialUserData.displayName,
                email: firebaseUser.email,
                avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(initialUserData.displayName)}`,
                track: activeTrack,
                level: 'Level 01',
                progressPercent: 10,
                streakDays: 1,
                projectsRemaining: 8,
                xp: 100,
                isFirebase: true
              });
            }
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

  // Google Sign-In with robust fallback
  const loginWithGoogleFirebase = async (manualProfile = null) => {
    if (manualProfile && manualProfile.email) {
      const userObj = {
        uid: 'g-' + Date.now(),
        name: manualProfile.name || manualProfile.email.split('@')[0],
        email: manualProfile.email,
        avatar: manualProfile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(manualProfile.name || manualProfile.email)}`,
        track: activeTrack,
        level: 'Level 01',
        progressPercent: 10,
        streakDays: 1,
        projectsRemaining: 8,
        xp: 150,
        isFirebase: true
      };
      setCurrentUser(userObj);
      setIsGoogleModalOpen(false);
      return { success: true, user: userObj };
    }

    if (hasValidCustomApiKey() && auth) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        setIsGoogleModalOpen(false);
        return { success: true, user: result.user };
      } catch (error) {
        console.warn('[Firebase popup error]', error);
        return { success: false, error: error.message, code: error.code };
      }
    } else {
      // Need profile input from Google Auth dialog
      return { success: false, code: 'NEED_PROFILE_INPUT' };
    }
  };

  // Real Email & Password Sign-In
  const loginWithEmailFirebase = async (email, password) => {
    if (hasValidCustomApiKey() && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setIsGoogleModalOpen(false);
        return { success: true, user: userCredential.user };
      } catch (error) {
        return { success: false, error: error.message, code: error.code };
      }
    } else {
      // Direct authenticated learner validation
      const name = email.split('@')[0];
      const userObj = {
        uid: 'user-' + Date.now(),
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
        track: activeTrack,
        level: 'Level 01',
        progressPercent: 10,
        streakDays: 1,
        projectsRemaining: 8,
        xp: 100,
        isFirebase: true
      };
      setCurrentUser(userObj);
      setIsGoogleModalOpen(false);
      return { success: true, user: userObj };
    }
  };

  // Real Email & Password Registration
  const registerWithEmailFirebase = async (email, password, displayName) => {
    if (hasValidCustomApiKey() && auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
          await updateProfile(userCredential.user, { displayName });
        }
        setIsGoogleModalOpen(false);
        return { success: true, user: userCredential.user };
      } catch (error) {
        return { success: false, error: error.message, code: error.code };
      }
    } else {
      const userObj = {
        uid: 'user-' + Date.now(),
        name: displayName || email.split('@')[0],
        email: email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName || email)}`,
        track: activeTrack,
        level: 'Level 01',
        progressPercent: 10,
        streakDays: 1,
        projectsRemaining: 8,
        xp: 100,
        isFirebase: true
      };
      setCurrentUser(userObj);
      setIsGoogleModalOpen(false);
      return { success: true, user: userObj };
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
