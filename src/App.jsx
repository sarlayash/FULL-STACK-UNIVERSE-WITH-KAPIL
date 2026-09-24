import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { AdminModal } from './components/AdminModal';
import { DemoTourModal } from './components/DemoTourModal';
import { DashboardView } from './components/DashboardView';
import { LearningStudio } from './components/LearningStudio';
import { CodeStudio } from './components/CodeStudio';
import { IndustryLab } from './components/IndustryLab';
import { AssessmentArena } from './components/AssessmentArena';
import { DeploymentHub } from './components/DeploymentHub';
import { CareerStudio } from './components/CareerStudio';
import { AdminConsole } from './components/AdminConsole';
import { Sparkles, Heart, ShieldCheck, ArrowUpRight } from 'lucide-react';

const MainLayout = () => {
  const { activeTab, setActiveTab, activeTrack, setActiveTrack, startDemoTour, setIsAdminModalOpen } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />
      
      <main className="flex-1">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'learning' && <LearningStudio />}
        {activeTab === 'ide' && <CodeStudio />}
        {activeTab === 'mvps' && <IndustryLab />}
        {activeTab === 'assessments' && <AssessmentArena />}
        {activeTab === 'deployment' && <DeploymentHub />}
        {activeTab === 'career' && <CareerStudio />}
        {activeTab === 'admin' && <AdminConsole />}
      </main>

      {/* Global Modals */}
      <GoogleAuthModal />
      <AdminModal />
      <DemoTourModal />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 mt-20 py-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center font-bold text-white text-sm">
                  FS
                </div>
                <span className="font-bold text-white text-sm">FULL STACK UNIVERSE</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Powered by Kapil · Legacy of Values. Future of Learning. 
                10% Theory & 90% Hands-on software engineering pedagogy.
              </p>
              <div className="pt-1">
                <button
                  onClick={startDemoTour}
                  className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Launch Guided Demo Tour</span>
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase font-mono text-[11px] mb-3">Curriculum Tracks</h4>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <button 
                    onClick={() => { setActiveTrack('java'); setActiveTab('learning'); }} 
                    className="hover:text-sky-400 transition"
                  >
                    Java Full Stack (Spring Boot 3, Microservices)
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTrack('python'); setActiveTab('learning'); }} 
                    className="hover:text-emerald-400 transition"
                  >
                    Python Full Stack (FastAPI, Django, Celery)
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('ide')} 
                    className="hover:text-white transition"
                  >
                    Integrated Code Studio (IDE & Runner)
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase font-mono text-[11px] mb-3">Industry Capstone MVPs</h4>
              <ul className="space-y-2 text-[11px]">
                <li><button onClick={() => { setActiveTab('mvps'); }} className="hover:text-white">ShopSphere — E-commerce & Payment Sandbox</button></li>
                <li><button onClick={() => { setActiveTab('mvps'); }} className="hover:text-white">FinCore — Banking & Double-Entry Ledger</button></li>
                <li><button onClick={() => { setActiveTab('mvps'); }} className="hover:text-white">MediFlow — Healthcare Telehealth & OPD Queue</button></li>
                <li><button onClick={() => { setActiveTab('mvps'); }} className="hover:text-white">CampusOS — University LMS & Auto-Grader</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase font-mono text-[11px] mb-3">Admin Provisioning</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                Restricted to authorized course administrators.
              </p>
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-[11px] flex items-center gap-1.5 transition cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Console Login</span>
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
            <div>
              © 2026 Full Stack Universe with Kapil. All educational rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>No Fake Data · No Fake Numbers</span>
              <span>•</span>
              <span>100% Authentic Learning</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
