import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, 
  Lightbulb, 
  Building2, 
  Code, 
  CheckCircle2, 
  HelpCircle, 
  Terminal, 
  Copy, 
  Check, 
  ArrowRight,
  Flame,
  Zap,
  Sparkles
} from 'lucide-react';

export const LearningStudio = () => {
  const { currentTrackData, activeTrack, setActiveTab } = useApp();
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const activeModule = currentTrackData.modules[selectedModuleIndex] || currentTrackData.modules[0];

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>KAPIL LEARNING STUDIO · 10% THEORY / 90% HANDS-ON</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {currentTrackData.title} Syllabus
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Concepts deconstructed using relatable student-life analogies, followed by production-grade code, real industry use cases, and technical interview questions.
          </p>
        </div>

        {/* Philosophy Badge */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center gap-4 shrink-0">
          <div className="text-center border-r border-slate-800 pr-4">
            <div className="text-lg font-black text-sky-400">10%</div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Intuition & Theory</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-black text-emerald-400">90%</div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Hands-on & Code</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Module Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
            <span>Core Curriculum Modules</span>
            <span className="text-sky-400">{currentTrackData.modules.length} Lessons</span>
          </div>

          <div className="space-y-2">
            {currentTrackData.modules.map((mod, idx) => {
              const isSelected = selectedModuleIndex === idx;
              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    setSelectedModuleIndex(idx);
                    setExpandedFaq(null);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-sky-500 shadow-lg shadow-sky-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className={isSelected ? 'text-sky-400 font-bold' : 'text-slate-500'}>
                      Module 0{idx + 1}
                    </span>
                    <span className="text-slate-500">{mod.duration}</span>
                  </div>
                  
                  <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {mod.title}
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {mod.level}
                    </span>
                    <span>•</span>
                    <span className="text-amber-400 font-semibold">{mod.studentAnalogy.concept}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Module Content Deep Dive */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Module Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-sky-400">
                Module 0{selectedModuleIndex + 1} · {activeModule.level}
              </span>
              <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
                {activeModule.duration}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {activeModule.title}
            </h2>

            {/* 1. Student-Life Analogy Card (User requirement) */}
            <div className="mt-6 bg-gradient-to-br from-amber-950/30 via-slate-900 to-amber-950/20 border border-amber-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-xs uppercase tracking-wide mb-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Student-Life Analogy: {activeModule.studentAnalogy.title}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                "{activeModule.studentAnalogy.story}"
              </p>
              <div className="mt-3 text-[11px] font-mono text-amber-300/90 font-medium">
                Core Takeaway: {activeModule.studentAnalogy.concept}
              </div>
            </div>

            {/* 2. Industry Use Case */}
            <div className="mt-5 bg-gradient-to-br from-sky-950/40 via-slate-900 to-indigo-950/30 border border-sky-500/30 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-2.5 text-sky-400 font-bold text-xs uppercase tracking-wide mb-2">
                <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Industry Application: {activeModule.industryUseCase.company}</span>
              </div>
              <div className="text-xs font-semibold text-white mb-1">
                {activeModule.industryUseCase.scenario}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeModule.industryUseCase.explanation}
              </p>
            </div>

            {/* 3. Working Production Code Snippet */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2 font-mono">
                  <Code className="w-4 h-4 text-sky-400" />
                  <span className="text-white font-semibold">{activeModule.codeSnippet.filename}</span>
                </div>
                <button
                  onClick={() => handleCopy(activeModule.codeSnippet.code)}
                  className="flex items-center gap-1.5 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md transition"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto text-xs font-mono text-slate-200">
                <pre className="leading-relaxed">
                  <code>{activeModule.codeSnippet.code}</code>
                </pre>
              </div>
            </div>

            {/* 4. Solved Example */}
            <div className="mt-6 bg-slate-950 border border-slate-800/90 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wide mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Solved Example & Implementation Pattern</span>
              </div>
              <div className="text-xs font-semibold text-white mb-2">
                Q: {activeModule.solvedExample.question}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900 p-3.5 rounded-xl border border-slate-800/80">
                {activeModule.solvedExample.solution}
              </p>
            </div>

            {/* 5. Common Interview Questions & Placement Traps */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wide">
                <HelpCircle className="w-4 h-4" />
                <span>Technical Interview & Placement FAQs</span>
              </div>

              <div className="space-y-2">
                {activeModule.interviewQuestions.map((qa, qidx) => {
                  const isOpen = expandedFaq === qidx;
                  return (
                    <div
                      key={qidx}
                      className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFaq(isOpen ? null : qidx)}
                        className="w-full text-left p-3.5 text-xs font-semibold text-white flex items-center justify-between hover:bg-slate-900 transition"
                      >
                        <span>{qa.q}</span>
                        <span className="text-slate-400 ml-2">{isOpen ? '−' : '+'}</span>
                      </button>
                      {isOpen && (
                        <div className="p-3.5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 bg-slate-900/40">
                          {qa.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 6. Hands-On Practice Challenge & Code Studio Launcher */}
            <div className="mt-6 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-sky-950/30 border border-emerald-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>Hands-on Challenge: {activeModule.practiceChallenge.title}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {activeModule.practiceChallenge.objective}
                </p>
              </div>

              <button
                onClick={() => setActiveTab('ide')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-600/20 shrink-0 cursor-pointer"
              >
                <Terminal className="w-4 h-4" />
                <span>Code in Studio</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
