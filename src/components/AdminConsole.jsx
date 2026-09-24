import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  BookPlus, 
  FileCheck, 
  Award, 
  BarChart3, 
  CheckCircle2, 
  Search, 
  Plus, 
  Lock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminConsole = () => {
  const { isAdminLoggedIn, logoutAdmin, generateCertificate } = useApp();
  const [activeAdminTab, setActiveAdminTab] = useState('learners'); // 'learners' | 'content' | 'analytics'
  const [learnerSearch, setLearnerSearch] = useState('');
  const [learnersList, setLearnersList] = useState([
    { id: 'ST-101', name: 'Alex Sharma', email: 'alex.sharma.engineer@gmail.com', track: 'Java Full Stack', progress: 42, streak: 12, status: 'Active', submission: 'ShopSphere Cart Lock', verified: true },
    { id: 'ST-102', name: 'Priya Patel', email: 'priya.patel.ai@gmail.com', track: 'Python Full Stack', progress: 68, streak: 19, status: 'Active', submission: 'FinCore Ledger Hash', verified: true },
    { id: 'ST-103', name: 'Rahul Verma', email: 'rahul.verma@gmail.com', track: 'Java Full Stack', progress: 85, streak: 24, status: 'Ready for Placement', submission: 'MediFlow OPD Queue', verified: false },
    { id: 'ST-104', name: 'Ananya Iyer', email: 'ananya.iyer.dev@gmail.com', track: 'Python Full Stack', progress: 94, streak: 31, status: 'Placed (₹24 LPA)', submission: 'CampusOS Auto-Grader', verified: true }
  ]);
  const [feedbackNotice, setFeedbackNotice] = useState('');

  // New Note Form State
  const [newTitle, setNewTitle] = useState('');
  const [newAnalogy, setNewAnalogy] = useState('');
  const [newTrack, setNewTrack] = useState('java');

  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4">
        <Lock className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Privileged Administrator Access Required</h2>
        <p className="text-xs text-slate-400">
          Please verify your administrator credentials to access the command center.
        </p>
      </div>
    );
  }

  const handleApproveSubmission = (id, studentName, track) => {
    setLearnersList(prev => prev.map(l => l.id === id ? { ...l, verified: true, status: 'Certified & Verified' } : l));
    generateCertificate(studentName, track);
    setFeedbackNotice(`Submission approved and verifiable certificate issued to ${studentName}!`);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (e) { }
    setTimeout(() => setFeedbackNotice(''), 4000);
  };

  const handleAddContent = (e) => {
    e.preventDefault();
    if (!newTitle || !newAnalogy) return;
    setFeedbackNotice(`New topic "${newTitle}" with student-life analogy published to ${newTrack.toUpperCase()} curriculum!`);
    setNewTitle('');
    setNewAnalogy('');
    setTimeout(() => setFeedbackNotice(''), 4000);
  };

  const filteredLearners = learnersList.filter(l => 
    l.name.toLowerCase().includes(learnerSearch.toLowerCase()) || 
    l.email.toLowerCase().includes(learnerSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>KAPIL ADMIN COMMAND CENTER · ACTIVE SESSION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Ecosystem Oversight & Cohort Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Administrator session verified. Manage learners, inspect project code submissions, publish analogies, and issue verified certifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveAdminTab('learners')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeAdminTab === 'learners' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Learners & Submissions
            </button>
            <button
              onClick={() => setActiveAdminTab('content')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeAdminTab === 'content' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Publish Content
            </button>
            <button
              onClick={() => setActiveAdminTab('analytics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeAdminTab === 'analytics' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Cohort Analytics
            </button>
          </div>

          <button
            onClick={logoutAdmin}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold border border-rose-500/30 px-3 py-2 rounded-xl transition"
          >
            Logout
          </button>
        </div>
      </div>

      {feedbackNotice && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-2xl font-black text-white font-mono">1,482</div>
          <div className="text-[11px] text-slate-400 uppercase font-mono mt-1">Active Learners</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-2xl font-black text-emerald-400 font-mono">94.6%</div>
          <div className="text-[11px] text-slate-400 uppercase font-mono mt-1">Placement Success</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-2xl font-black text-sky-400 font-mono">4 MVPs</div>
          <div className="text-[11px] text-slate-400 uppercase font-mono mt-1">Production Domains</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-2xl font-black text-amber-400 font-mono">2 Cohorts</div>
          <div className="text-[11px] text-slate-400 uppercase font-mono mt-1">Alpha & Beta 2026</div>
        </div>
      </div>

      {/* Tab 1: Learners & Submissions */}
      {activeAdminTab === 'learners' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Learner Submissions & Verification</h3>
              <p className="text-xs text-slate-400">Inspect code submissions for ShopSphere, FinCore, MediFlow and CampusOS</p>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search learner name or email..."
                value={learnerSearch}
                onChange={(e) => setLearnerSearch(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-64"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-mono text-slate-400 bg-slate-950 uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Learner</th>
                  <th className="p-3">Track</th>
                  <th className="p-3">Progress</th>
                  <th className="p-3">Latest Submission</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredLearners.map(learner => (
                  <tr key={learner.id} className="hover:bg-slate-950/50 transition">
                    <td className="p-3">
                      <div className="font-bold text-white">{learner.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{learner.email}</div>
                    </td>
                    <td className="p-3 font-mono text-sky-400">{learner.track}</td>
                    <td className="p-3">
                      <span className="font-mono text-white font-bold">{learner.progress}%</span>
                      <span className="text-[11px] text-slate-500 block">({learner.streak}d streak)</span>
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded text-[11px]">
                        {learner.submission}
                      </span>
                    </td>
                    <td className="p-3">
                      {learner.verified ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApproveSubmission(learner.id, learner.name, learner.track)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
                        >
                          Approve & Certify
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Publish Content & Analogies */}
      {activeAdminTab === 'content' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white">Publish New Lesson & Student Analogy</h3>
            <p className="text-xs text-slate-400">Keep the 10% theory / 90% hands-on philosophy alive with fresh intuitive analogies</p>
          </div>

          <form onSubmit={handleAddContent} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Track</label>
              <select
                value={newTrack}
                onChange={(e) => setNewTrack(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="java">Java Full Stack Universe</option>
                <option value="python">Python Full Stack Universe</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Topic Title</label>
              <input
                type="text"
                placeholder="e.g. Distributed Caching with Redis & Cache Aside"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Student-Life Analogy Story</label>
              <textarea
                placeholder="Explain the technical concept using a memorable college/hostel/canteen scenario..."
                value={newAnalogy}
                onChange={(e) => setNewAnalogy(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Publish to Curriculum</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Cohort Analytics */}
      {activeAdminTab === 'analytics' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white">Cohort Performance Telemetry</h3>
            <p className="text-xs text-slate-400">Distribution across 6 learning phases</p>
          </div>

          <div className="space-y-4">
            {[
              { phase: 'Phase 1: Core Fundamentals & Analogies', count: 320, pct: '100%' },
              { phase: 'Phase 2: Code Studio IDE & Tests', count: 280, pct: '87.5%' },
              { phase: 'Phase 3: Assessment Arena & MCQs', count: 240, pct: '75.0%' },
              { phase: 'Phase 4: Industry 4 MVPs (ShopSphere, FinCore, etc.)', count: 195, pct: '60.9%' },
              { phase: 'Phase 5: Deployment Hub (GitHub & Docker)', count: 145, pct: '45.3%' },
              { phase: 'Phase 6: Placement Ready & Certified', count: 110, pct: '34.3%' },
            ].map((p, i) => (
              <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-white">{p.phase}</span>
                  <span className="font-mono text-emerald-400 font-bold">{p.count} Learners ({p.pct})</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full" style={{ width: p.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
