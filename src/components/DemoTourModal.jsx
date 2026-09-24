import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  X, 
  Compass, 
  BookOpen, 
  Terminal, 
  Layers, 
  Award, 
  GitPullRequest, 
  Briefcase,
  ShieldCheck
} from 'lucide-react';

export const DemoTourModal = () => {
  const { 
    isTourActive, 
    tourStep, 
    nextTourStep, 
    prevTourStep, 
    closeTour, 
    setActiveTab, 
    setActiveTrack,
    activeTrack,
    currentUser 
  } = useApp();

  if (!isTourActive) return null;

  const tourSteps = [
    {
      title: 'Welcome to Full Stack Universe with Kapil',
      subtitle: 'Legacy of Values. Future of Learning.',
      tab: 'dashboard',
      icon: Sparkles,
      color: 'from-amber-500 to-sky-500',
      description: 'You are on a curated tour as a demo learner. Notice how all curriculum, analogies, real industry architectures, and code snippets are 100% authentic with zero fake placeholders.',
      highlight: 'Track Switcher: Seamlessly toggle between Java Full Stack (Spring Boot 3, Microservices) and Python Full Stack (FastAPI, Django, Celery) at any time.',
      actionLabel: 'Explore Dashboard'
    },
    {
      title: '1. Learner Cockpit & Progress Management',
      subtitle: 'Track your entire journey from Day 1 to Placement',
      tab: 'dashboard',
      icon: Compass,
      color: 'from-sky-500 to-blue-600',
      description: `Welcome back, ${currentUser ? currentUser.name : 'Learner'}! You can see your 12-day streak, Level 04 ranking, 42% curriculum completion, and 8 remaining industry project milestones, matching the core roadmap philosophy.`,
      highlight: 'Integrated with Google Authentication and GitHub for end-to-end portfolio tracking.',
      actionLabel: 'Proceed to Learning Studio'
    },
    {
      title: '2. Learning Studio: 10% Theory, 90% Hands-On',
      subtitle: 'Real simple notes, student-life analogies & industry use cases',
      tab: 'learning',
      icon: BookOpen,
      color: 'from-indigo-500 to-purple-600',
      description: 'Every topic is deconstructed with a memorable student-life analogy (like the Family Bike & Engine for Java Inheritance, or the College Canteen Token Counter for Python Dunder methods).',
      highlight: 'Followed by production code snippets, solved examples, common interview traps, and placement FAQs.',
      actionLabel: 'Inspect Code Studio IDE'
    },
    {
      title: '3. Code Studio: Integrated IDE & Runner',
      subtitle: 'Write, debug, execute and test code in real-time',
      tab: 'ide',
      icon: Terminal,
      color: 'from-emerald-500 to-teal-600',
      description: 'Test your logic directly in the browser! The integrated Code Studio provides syntax highlighting, standard input/output console, and automated test cases runner for Java and Python.',
      highlight: 'Includes pre-configured templates for PhonePe transaction deduplicators, LRU Caches, and Spring/FastAPI models.',
      actionLabel: 'Visit Industry Lab MVPs'
    },
    {
      title: '4. Industry Lab: 4 Domain-Specific MVPs',
      subtitle: 'Complete real-world software architectures & working prototypes',
      tab: 'mvps',
      icon: Layers,
      color: 'from-violet-500 to-pink-600',
      description: 'Explore the 4 industry capstones specified in the syllabus: ShopSphere (E-commerce), FinCore (Banking & Ledger), MediFlow (Healthcare Telehealth), and CampusOS (EdTech LMS).',
      highlight: 'Each MVP includes a live functional interactive demo, full system architecture diagrams, database ER schemas, and REST API specifications.',
      actionLabel: 'Check Assessment Arena'
    },
    {
      title: '5. Assessment Arena & Mock Tests',
      subtitle: 'MCQs, Timed Placement Tests & Automated Evaluation',
      tab: 'assessments',
      icon: Award,
      color: 'from-amber-500 to-orange-600',
      description: 'Practice high-frequency interview questions with instant evaluation. Every question features "Kapil\'s Real Explanation & Analogy" detailing why tricky options fail in technical rounds.',
      highlight: 'Take timed mock placement tests simulating actual corporate hiring exams (TCS Digital, Amazon SDE, FinTech startups).',
      actionLabel: 'View Deployment Hub'
    },
    {
      title: '6. Deployment Hub: GitHub & Cloud CI/CD',
      subtitle: 'Save, containerize and publish live to GitHub & Cloud',
      tab: 'deployment',
      icon: GitPullRequest,
      color: 'from-cyan-500 to-sky-600',
      description: 'Prepare your industry portfolio! Connect your GitHub, auto-generate Dockerfiles, docker-compose.yml, and GitHub Actions CI/CD pipelines with a live build simulator.',
      highlight: 'One-click repository packaging ready to deploy on AWS, Render, or Vercel.',
      actionLabel: 'Review Career Studio'
    },
    {
      title: '7. Career Studio & Kapil Certification',
      subtitle: 'Placement Readiness, STAR Responses & Verifiable Certificates',
      tab: 'career',
      icon: Briefcase,
      color: 'from-rose-500 to-amber-600',
      description: 'Master placement interviews with curated STAR behavioral templates, company-specific hiring blueprints, and generate your official Verifiable Kapil Full Stack Certificate.',
      highlight: 'Also includes secure Kapil Admin Console for instructors to manage cohorts, inspect submissions, and issue accredited certificates.',
      actionLabel: 'Finish Tour & Start Coding!'
    }
  ];

  const current = tourSteps[tourStep];
  const Icon = current.icon;

  const handleNext = () => {
    if (tourStep < tourSteps.length - 1) {
      const nextStep = tourStep + 1;
      nextTourStep();
      setActiveTab(tourSteps[nextStep].tab);
    } else {
      closeTour();
    }
  };

  const handlePrev = () => {
    if (tourStep > 0) {
      const prevStep = tourStep - 1;
      prevTourStep();
      setActiveTab(tourSteps[prevStep].tab);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn pointer-events-auto">
      <div className="bg-slate-900 border border-sky-500/40 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden shadow-sky-500/10">
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5">
          <div 
            className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full transition-all duration-300"
            style={{ width: `${((tourStep + 1) / tourSteps.length) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${current.color} flex items-center justify-center text-white shadow-md`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-sky-400">
                Tour Step {tourStep + 1} of {tourSteps.length}
              </span>
              <h3 className="text-base font-bold text-white leading-tight">
                {current.title}
              </h3>
            </div>
          </div>
          <button
            onClick={closeTour}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5">
          <p className="text-xs text-slate-300 leading-relaxed">
            {current.description}
          </p>

          <div className="bg-sky-950/50 border border-sky-800/60 rounded-xl p-3 text-xs text-sky-200">
            <span className="font-semibold text-amber-300">Key Feature: </span>
            {current.highlight}
          </div>

          {/* Quick jump to track option */}
          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-mono">
            <span>Viewing Track: <strong className="text-sky-400 uppercase">{activeTrack} Full Stack</strong></span>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setActiveTrack('java')}
                className={`px-2 py-0.5 rounded text-[10px] ${activeTrack === 'java' ? 'bg-sky-600 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}
              >
                Java
              </button>
              <button 
                onClick={() => setActiveTrack('python')}
                className={`px-2 py-0.5 rounded text-[10px] ${activeTrack === 'python' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}
              >
                Python
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={tourStep === 0}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              tourStep === 0
                ? 'opacity-30 cursor-not-allowed text-slate-600'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1.5">
            {tourSteps.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === tourStep ? 'bg-sky-400 w-4' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg text-xs shadow-md shadow-sky-600/20 transition cursor-pointer"
          >
            <span>{tourStep === tourSteps.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
