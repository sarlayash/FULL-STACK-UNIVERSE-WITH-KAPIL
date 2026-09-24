import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Flame, 
  Trophy, 
  Target, 
  Terminal, 
  BookOpen, 
  Layers, 
  Award, 
  GitPullRequest, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  Code2,
  Cpu,
  Database,
  Lock,
  Unlock,
  Zap,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const DashboardView = () => {
  const { 
    currentUser, 
    activeTrack, 
    currentTrackData, 
    setActiveTab, 
    startDemoTour, 
    setActiveTrack,
    canAccessTracks,
    enrollmentStatus,
    setIsEnrollmentModalOpen,
    adminBypassEnrollment,
    isAdminLoggedIn
  } = useApp();


  const learnerName = currentUser ? currentUser.name : 'Learner REAL NAME';
  const streak = currentUser ? currentUser.streakDays : 12;
  const progress = currentUser ? currentUser.progressPercent : 42;
  const level = currentUser ? currentUser.level : 'Level 04';
  const remaining = currentUser ? currentUser.projectsRemaining : 8;

  const coreModules = [
    {
      id: 'learning',
      title: 'Simple Notes & Analogies',
      desc: '10% Theory, 90% Hands-on. Real student-life analogies and industry use cases.',
      icon: BookOpen,
      color: 'from-blue-600 to-indigo-600',
      actionText: 'Study Notes & Use Cases',
      badge: '100% Authentic'
    },
    {
      id: 'ide',
      title: 'My Coding Lab (IDE)',
      desc: 'Run and debug Java and Python code with live console output and test cases.',
      icon: Terminal,
      color: 'from-emerald-600 to-teal-600',
      actionText: 'Launch Code Studio',
      badge: 'Executable Sandbox'
    },
    {
      id: 'mvps',
      title: 'Industry Projects (MVPs)',
      desc: 'Build real MVPs: ShopSphere, FinCore, MediFlow, and CampusOS with system architecture.',
      icon: Layers,
      color: 'from-purple-600 to-pink-600',
      actionText: 'Explore 4 MVPs',
      badge: 'Production Ready'
    },
    {
      id: 'assessments',
      title: 'Mock Interviews & MCQs',
      desc: 'MCQs, coding tests, and timed mock rounds with instant scorecards and analogies.',
      icon: Award,
      color: 'from-amber-600 to-orange-600',
      actionText: 'Take Practice Test',
      badge: 'Interview Benchmark'
    },
    {
      id: 'deployment',
      title: 'GitHub Portfolio & Deploy',
      desc: 'Save, containerize with Docker, and deploy live with CI/CD pipeline simulation.',
      icon: GitPullRequest,
      color: 'from-cyan-600 to-sky-600',
      actionText: 'Deployment Hub',
      badge: 'GitHub Integrated'
    },
    {
      id: 'career',
      title: 'Placement Readiness',
      desc: 'Track preparation, STAR method answers, company blueprints, and Kapil Certificate.',
      icon: Briefcase,
      color: 'from-rose-600 to-red-600',
      actionText: 'Check Readiness',
      badge: 'Top Tier Placement'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Hero Learner Dashboard Banner (Matching Concept Preview from PDF Page 1) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-sky-950/70 to-indigo-950/80 border border-sky-500/20 shadow-2xl p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>LEARNER DASHBOARD · CONCEPT PREVIEW</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">{learnerName}!</span>
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Your <strong className="text-sky-300 font-semibold">{currentTrackData.title}</strong> journey is live. 
              Remember Kapil's philosophy: <em className="text-amber-300 not-italic font-semibold">10% Theory & 90% Hands-on</em>. 
              Master the concepts through student-life analogies and deploy real industry MVPs.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-mono text-slate-200">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>{level}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-mono text-slate-200">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                <span>{streak}-day streak</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-mono text-slate-200">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>{remaining} projects remaining</span>
              </div>
            </div>
          </div>

          {/* Learning Progress Widget */}
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 sm:min-w-[280px] shadow-xl">
            <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
              <span>Your Learning Progress</span>
              <span className="text-sky-400 font-bold text-sm">{progress}%</span>
            </div>
            
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
              <div 
                className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-[11px] text-slate-400">
                Track: <strong className="text-white capitalize">{activeTrack}</strong>
              </div>
              <button
                onClick={startDemoTour}
                className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 font-semibold transition"
              >
                <span>Demo Tour</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 6-Step Journey Flow Roadmap */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <span>The Six-Phase Curriculum Journey</span>
            <span className="text-slate-600">·</span>
            <span className="text-sky-400 font-normal">Legacy of Values. Future of Learning.</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { step: '01', title: 'Learn', sub: 'Simple Notes & Analogies', active: true },
              { step: '02', title: 'Code', sub: 'Integrated IDE & Tests', active: true },
              { step: '03', title: 'Practice', sub: 'Assessments & MCQs', active: true },
              { step: '04', title: 'Build', sub: '4 Domain MVPs', active: true },
              { step: '05', title: 'Deploy', sub: 'GitHub & Cloud CI/CD', active: false },
              { step: '06', title: 'Placement', sub: 'STAR & Mock Rounds', active: false }
            ].map((phase, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-xl border text-left transition ${
                  phase.active 
                    ? 'bg-slate-900/80 border-sky-500/30' 
                    : 'bg-slate-950/50 border-slate-800/60 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className="text-sky-400 font-bold">{phase.step}</span>
                  {phase.active ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="text-slate-600">Upcoming</span>
                  )}
                </div>
                <div className="font-bold text-xs text-white">{phase.title}</div>
                <div className="text-[10px] text-slate-400 leading-snug mt-0.5">{phase.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* FAANG Enrollment Status & Track Recommendation Banner */}
      {!canAccessTracks ? (
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-orange-950/40 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                <Lock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>FAANG ADMISSION GATE · 80% SCORE REQUIRED</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Java & Python Full Stack Tracks are Currently Gated
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                To guarantee true enterprise engineering mastery, all modules, code labs, MVPs, and deployment pipelines remain locked until you pass the <strong className="text-amber-300">FAANG-Standard Enrollment Assessment</strong> at <strong className="text-amber-300">80%+</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <span className="text-amber-400 font-bold block">50 Hard FAANG MCQs</span>
                  <span className="text-slate-400">25 Java (JVM/JMM) + 25 Python (GIL/Asyncio)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <span className="text-amber-400 font-bold block">10 Hard Coding Challenges</span>
                  <span className="text-slate-400">Rate Limiter, LRU TTL, Concurrent Queue</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <span className="text-amber-400 font-bold block">Adaptive Recommendation</span>
                  <span className="text-slate-400">System recommends Java vs Python on sub-scores</span>
                </div>
              </div>

              {enrollmentStatus?.score > 0 && !enrollmentStatus?.isUnlocked && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200 flex items-center justify-between flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Previous Score: <strong>{enrollmentStatus.score}%</strong> (Needed: 80%)</span>
                  </span>
                  <span className="text-slate-400 font-mono">
                    Java: {enrollmentStatus.javaScore}% · Python: {enrollmentStatus.pythonScore}% · Coding: {enrollmentStatus.codingScore}%
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={() => setIsEnrollmentModalOpen(true)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-slate-950 font-black text-sm hover:brightness-110 shadow-xl shadow-amber-500/20 transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{enrollmentStatus?.score > 0 ? 'Retake FAANG Exam' : 'Take Enrollment Exam (80% Cut-Off)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {isAdminLoggedIn && (
                <button
                  onClick={adminBypassEnrollment}
                  className="px-4 py-2 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-bold text-xs hover:bg-indigo-900 transition flex items-center justify-center space-x-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>⚡ Kapil Admin: Master Bypass</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-950/30 via-slate-900 to-teal-950/30 border border-emerald-500/30 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  FAANG Verified Admission
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Score: {enrollmentStatus?.score}%
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Full Stack Universe Access Unlocked
              </h3>
              <p className="text-xs text-slate-300">
                Kapil Intelligence Recommendation: <strong className="text-amber-300 capitalize">{enrollmentStatus?.recommendedTrack || 'Java'} Track</strong> based on your high algorithmic aptitude.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTrack(enrollmentStatus?.recommendedTrack || 'java')}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5"
            >
              <span>Switch to Recommended ({enrollmentStatus?.recommendedTrack === 'python' ? 'Python' : 'Java'})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsEnrollmentModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition"
            >
              Review Exam Report
            </button>
          </div>
        </div>
      )}

      {/* Core Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Core Modules & Student Experience</h2>
            <p className="text-xs text-slate-400">Everything needed to transition from learner to deployed full-stack software engineer</p>
          </div>
          <div className="text-xs text-slate-400 font-mono hidden sm:block">
            Track: <span className="text-sky-400 font-semibold uppercase">{activeTrack} Full Stack</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coreModules.map((module) => {
            const Icon = module.icon;
            return (
              <div
                key={module.id}
                onClick={() => setActiveTab(module.id)}
                className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-2xl p-5 transition-all duration-300 shadow-lg hover:shadow-sky-500/10 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {module.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors">
                    {module.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {module.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-sky-400 group-hover:text-sky-300">
                  <span>{module.actionText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Track Details & Technology Arsenal */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs font-mono uppercase text-sky-400 font-semibold">Active Syllabus Deep-Dive</div>
            <h3 className="text-lg font-bold text-white mt-0.5">{currentTrackData.title}</h3>
            <p className="text-xs text-slate-400 mt-1">{currentTrackData.tagline}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTrack('java')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                activeTrack === 'java' 
                  ? 'bg-sky-600 border-sky-500 text-white' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Switch to Java
            </button>
            <button
              onClick={() => setActiveTrack('python')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                activeTrack === 'python' 
                  ? 'bg-emerald-600 border-emerald-500 text-white' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Switch to Python
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <div className="text-2xl font-black text-white">{currentTrackData.stats.modules}</div>
            <div className="text-[11px] text-slate-400 uppercase font-mono mt-1">Core Modules</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <div className="text-2xl font-black text-sky-400">{currentTrackData.stats.lessons}</div>
            <div className="text-[11px] text-slate-400 uppercase font-mono mt-1">Hands-on Lessons</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <div className="text-2xl font-black text-emerald-400">{currentTrackData.stats.projects}</div>
            <div className="text-[11px] text-slate-400 uppercase font-mono mt-1">Production MVPs</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <div className="text-2xl font-black text-amber-400">{currentTrackData.stats.placementReadinessRate}</div>
            <div className="text-[11px] text-slate-400 uppercase font-mono mt-1">Placement Rate</div>
          </div>
        </div>
      </div>

    </div>
  );
};
