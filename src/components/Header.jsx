import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Terminal, 
  BookOpen, 
  Layers, 
  Award, 
  GitPullRequest, 
  Briefcase, 
  ShieldCheck, 
  User, 
  Flame, 
  Compass, 
  CheckCircle2, 
  LogOut, 
  ExternalLink 
} from 'lucide-react';

export const Header = () => {
  const { 
    activeTrack, 
    setActiveTrack, 
    currentUser, 
    logoutUser, 
    startDemoTour, 
    setIsGoogleModalOpen, 
    setIsAdminModalOpen, 
    isAdminLoggedIn, 
    logoutAdmin,
    activeTab, 
    setActiveTab 
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'learning', label: 'Learning Studio', icon: BookOpen },
    { id: 'ide', label: 'Code Studio (IDE)', icon: Terminal },
    { id: 'mvps', label: 'Industry Lab (4 MVPs)', icon: Layers },
    { id: 'assessments', label: 'Assessment Arena', icon: Award },
    { id: 'deployment', label: 'Deployment Hub', icon: GitPullRequest },
    { id: 'career', label: 'Career & Placement', icon: Briefcase },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Brand Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 px-4 py-1.5 text-xs border-b border-slate-800 flex flex-wrap items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-sky-500/20 text-sky-400 font-semibold px-2 py-0.5 rounded border border-sky-500/30">
            POWERED BY KAPIL
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Legacy of Values. Future of Learning. 10% Theory, 90% Hands-On.
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <button 
            onClick={startDemoTour}
            className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-medium transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
            <span>Take Demo Tour</span>
          </button>
          <span className="text-slate-700">|</span>
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Administrator Active
              </span>
              <button 
                onClick={logoutAdmin} 
                className="text-xs text-rose-400 hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAdminModalOpen(true)}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" /> Admin Console
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/20 font-black text-xl text-white">
              FS
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                FULL STACK UNIVERSE
                <span className="text-xs font-normal text-sky-400 bg-sky-950 px-1.5 py-0.5 rounded border border-sky-800">
                  with Kapil
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5 font-mono">
                Learn → Code → Practice → Build → Deploy → Interview-Ready
              </p>
            </div>
          </div>

          {/* Track Switcher (Java Full Stack vs Python Full Stack) */}
          <div className="hidden md:flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTrack('java')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                activeTrack === 'java'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-orange-400 inline-block"></span>
              Java Full Stack
            </button>
            <button
              onClick={() => setActiveTrack('python')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                activeTrack === 'python'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              Python Full Stack
            </button>
          </div>

          {/* User Profile / Google Sign-In & Tour */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {/* Streak Badge */}
                <div className="hidden lg:flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-full text-xs font-medium">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{currentUser.streakDays}-Day Streak</span>
                </div>

                {/* Learner Card */}
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 pr-3 rounded-full">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full border border-sky-400 object-cover"
                  />
                  <div className="text-left text-xs leading-tight">
                    <div className="font-semibold text-white flex items-center gap-1">
                      {currentUser.name}
                      <CheckCircle2 className="w-3 h-3 text-sky-400" />
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {currentUser.level} · {currentUser.progressPercent}%
                    </div>
                  </div>
                  <button 
                    onClick={logoutUser}
                    title="Sign Out"
                    className="ml-1 text-slate-400 hover:text-rose-400 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsGoogleModalOpen(true)}
                className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-semibold px-4 py-2 rounded-lg text-xs shadow-md transition cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Sign In with Google
              </button>
            )}

            {/* Admin Quick Switch (if logged in as admin) */}
            {isAdminLoggedIn && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`p-2 rounded-lg border text-xs font-medium transition ${
                  activeTab === 'admin'
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-emerald-400 hover:bg-slate-800'
                }`}
                title="Admin Command Center"
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation row */}
        <div className="flex overflow-x-auto no-scrollbar border-t border-slate-800/80 -mb-px">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition ${
                  isActive
                    ? 'border-sky-500 text-sky-400 bg-sky-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
