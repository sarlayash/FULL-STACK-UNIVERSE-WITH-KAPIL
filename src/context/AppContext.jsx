import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRACKS_DATA } from '../data/curriculumData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Track selection: 'java' or 'python'
  const [activeTrack, setActiveTrack] = useState(() => {
    return localStorage.getItem('kapil_universe_track') || 'java';
  });

  // Current logged in user (Default to the authentic learner from PDF page 1 for immediate tour/experience)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('kapil_universe_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    // Realistic default demo learner matching PDF Page 1
    return {
      id: 'demo-learner-101',
      name: 'Alex Sharma',
      email: 'alex.sharma.engineer@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      track: 'java',
      level: 'Level 04',
      progressPercent: 42,
      streakDays: 12,
      projectsRemaining: 8,
      xp: 2840,
      enrolledDate: 'Sept 2026',
      githubUsername: 'alexsharma-dev',
      isGoogleAuth: true
    };
  });

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('kapil_universe_admin') === 'true';
  });

  // Interactive Tour State
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Google Login Modal visibility
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Code editor state
  const [savedSnippets, setSavedSnippets] = useState(() => {
    const saved = localStorage.getItem('kapil_universe_snippets');
    return saved ? JSON.parse(saved) : {};
  });

  // Completed assessments & quiz scores
  const [completedQuizzes, setCompletedQuizzes] = useState(() => {
    const saved = localStorage.getItem('kapil_universe_quizzes');
    return saved ? JSON.parse(saved) : { 'mcq-1': 1, 'mcq-2': 1 };
  });

  // Issued certificates
  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem('kapil_universe_certs');
    return saved ? JSON.parse(saved) : [
      {
        id: 'CERT-KAPIL-2026-8891',
        studentName: 'Alex Sharma',
        track: 'Java Full Stack Universe',
        issueDate: '24 September 2026',
        instructor: 'Kapil Sir',
        score: '96%',
        verificationUrl: 'https://fullstack-universe.kapil.edu/verify/CERT-KAPIL-2026-8891'
      }
    ];
  });

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

  // Auth actions
  const loginWithGoogle = (profile) => {
    const user = {
      id: profile.id || 'g-' + Date.now(),
      name: profile.name || 'Google Learner',
      email: profile.email || 'learner@gmail.com',
      avatar: profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      track: activeTrack,
      level: 'Level 01',
      progressPercent: 12,
      streakDays: 1,
      projectsRemaining: 8,
      xp: 450,
      enrolledDate: 'Sept 2026',
      githubUsername: profile.githubUsername || 'learner-dev',
      isGoogleAuth: true
    };
    setCurrentUser(user);
    setIsGoogleModalOpen(false);
  };

  const loginAsDemoUser = (trackPreference = 'java') => {
    const demo = {
      id: 'demo-learner-101',
      name: trackPreference === 'java' ? 'Alex Sharma' : 'Priya Patel',
      email: trackPreference === 'java' ? 'alex.sharma.engineer@gmail.com' : 'priya.patel.ai@gmail.com',
      avatar: trackPreference === 'java' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      track: trackPreference,
      level: 'Level 04',
      progressPercent: 42,
      streakDays: 12,
      projectsRemaining: 8,
      xp: 2840,
      enrolledDate: 'Sept 2026',
      githubUsername: trackPreference === 'java' ? 'alexsharma-dev' : 'priyapatel-tech',
      isGoogleAuth: true
    };
    setActiveTrack(trackPreference);
    setCurrentUser(demo);
    setIsGoogleModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const authenticateAdmin = (adminId, password) => {
    if (adminId.trim().toUpperCase() === 'KAPILADMIN' && password.trim() === 'ADMIN123') {
      setIsAdminLoggedIn(true);
      setIsAdminModalOpen(false);
      return { success: true };
    }
    return { success: false, message: 'Invalid Admin Credentials! Required ID: KAPILADMIN / Password: ADMIN123' };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
  };

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

  const recordQuizAnswer = (quizId, optionIndex, isCorrect) => {
    if (isCorrect) {
      setCompletedQuizzes(prev => ({ ...prev, [quizId]: optionIndex }));
      if (currentUser) {
        setCurrentUser(prev => ({
          ...prev,
          xp: (prev.xp || 0) + 50,
          progressPercent: Math.min(100, (prev.progressPercent || 0) + 2)
        }));
      }
    }
  };

  const generateCertificate = (studentName, trackTitle) => {
    const newCert = {
      id: `CERT-KAPIL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: studentName || (currentUser ? currentUser.name : 'Certified Full Stack Engineer'),
      track: trackTitle || (activeTrack === 'java' ? 'Java Full Stack Universe' : 'Python Full Stack Universe'),
      issueDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      instructor: 'Kapil Sir',
      score: '94%',
      verificationUrl: `https://fullstack-universe.kapil.edu/verify/CERT-KAPIL-${Date.now().toString().slice(-4)}`
    };
    setCertificates(prev => [newCert, ...prev]);
    return newCert;
  };

  return (
    <AppContext.Provider
      value={{
        activeTrack,
        setActiveTrack,
        currentUser,
        setCurrentUser,
        isAdminLoggedIn,
        authenticateAdmin,
        logoutAdmin,
        loginWithGoogle,
        loginAsDemoUser,
        logout,
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
