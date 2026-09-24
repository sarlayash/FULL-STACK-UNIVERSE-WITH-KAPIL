import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ASSESSMENTS_DATA } from '../data/assessmentsData';
import { 
  Award, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Lightbulb, 
  ArrowRight, 
  RotateCcw, 
  Trophy, 
  Terminal, 
  Sparkles,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AssessmentArena = () => {
  const { activeTrack, recordQuizAnswer, completedQuizzes, setActiveTab } = useApp();
  const [activeTab, setActiveSubTab] = useState('mcq'); // 'mcq' | 'timedMock'
  const [selectedAnswers, setSelectedAnswers] = useState(completedQuizzes || {});
  
  // Timed Mock Test State
  const [isTestActive, setIsTestActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [mockAnswers, setMockAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(0);

  // Timer countdown
  useEffect(() => {
    let timer = null;
    if (isTestActive && timeLeft > 0 && !testSubmitted) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTestActive && !testSubmitted) {
      handleMockSubmit();
    }
    return () => clearInterval(timer);
  }, [isTestActive, timeLeft, testSubmitted]);

  const handleSelectOption = (mcqId, optionIdx, correctIdx) => {
    if (selectedAnswers[mcqId] !== undefined) return; // already answered
    const isCorrect = optionIdx === correctIdx;
    setSelectedAnswers(prev => ({ ...prev, [mcqId]: optionIdx }));
    recordQuizAnswer(mcqId, optionIdx, isCorrect);

    if (isCorrect) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) { }
    }
  };

  const startMockTest = () => {
    setIsTestActive(true);
    setTimeLeft(600);
    setMockAnswers({});
    setTestSubmitted(false);
  };

  const handleMockSubmit = () => {
    setIsTestActive(false);
    setTestSubmitted(true);
    let score = 0;
    ASSESSMENTS_DATA.mcqs.forEach(q => {
      if (mockAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    setTestScore(score);
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 }
      });
    } catch (e) { }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const filteredMcqs = ASSESSMENTS_DATA.mcqs.filter(m => 
    m.track === activeTrack || m.track === 'general'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>ASSESSMENT ARENA · PLACEMENT BENCHMARKING</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            MCQs, Coding Rounds & Mock Placement Tests
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Test your knowledge with authentic technical interview questions. Includes Kapil's student-life explanations and why common traps occur.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab('mcq')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'mcq'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Practice MCQs with Analogies
          </button>
          <button
            onClick={() => setActiveSubTab('timedMock')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'timedMock'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timed Placement Mock Test</span>
          </button>
        </div>
      </div>

      {/* View 1: Practice MCQs with Analogies */}
      {activeTab === 'mcq' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Showing authentic questions for <strong className="text-sky-400 uppercase">{activeTrack} & Full Stack</strong></span>
            <span>Answered: {Object.keys(selectedAnswers).length} / {filteredMcqs.length}</span>
          </div>

          <div className="space-y-6">
            {filteredMcqs.map((q, idx) => {
              const userAnswer = selectedAnswers[q.id];
              const isAnswered = userAnswer !== undefined;
              const isCorrect = userAnswer === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 font-mono font-bold text-xs flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-mono font-semibold text-slate-400 uppercase">
                        {q.category}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-amber-400">
                      {q.difficulty}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    {q.question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {q.options.map((opt, optIdx) => {
                      let btnStyle = 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700';
                      if (isAnswered) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-500/10 border-emerald-500/60 text-emerald-300 font-semibold';
                        } else if (optIdx === userAnswer && !isCorrect) {
                          btnStyle = 'bg-rose-500/10 border-rose-500/60 text-rose-300';
                        } else {
                          btnStyle = 'bg-slate-950/40 border-slate-800/50 text-slate-500 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isAnswered}
                          onClick={() => handleSelectOption(q.id, optIdx, q.correctIndex)}
                          className={`w-full text-left p-3.5 rounded-2xl border text-xs leading-relaxed transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                        >
                          <span className="font-mono text-slate-500 shrink-0 font-bold">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span className="flex-1">{opt}</span>
                          {isAnswered && optIdx === q.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          )}
                          {isAnswered && optIdx === userAnswer && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Kapil's Real Explanation & Analogy (Revealed after answering) */}
                  {isAnswered && (
                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 animate-fadeIn">
                      <div className="bg-sky-950/40 border border-sky-800/60 rounded-2xl p-4 text-xs">
                        <div className="text-sky-300 font-bold mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Kapil's Technical Explanation:</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                      </div>

                      <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 text-xs">
                        <div className="text-amber-400 font-bold mb-1 flex items-center gap-1.5">
                          <Lightbulb className="w-4 h-4 text-amber-400" />
                          <span>Student-Life Analogy:</span>
                        </div>
                        <p className="text-slate-200 leading-relaxed italic">"{q.analogy}"</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 2: Timed Placement Mock Test */}
      {activeTab === 'timedMock' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          
          {!isTestActive && !testSubmitted && (
            <div className="text-center py-10 space-y-4 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
                <Clock className="w-8 h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Kapil Full Stack Placement Benchmark Test
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Simulates real technical screening rounds (TCS Prime, Amazon SDE-1, and Top FinTechs). 
                You will have 10 minutes to complete 5 high-yield architecture and core concepts questions.
              </p>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-xs font-mono text-slate-400 space-y-1">
                <div>• Time Allowed: 10 Minutes</div>
                <div>• Passing Score: 80% (4/5)</div>
                <div>• Penalty: No negative marking</div>
              </div>

              <button
                onClick={startMockTest}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-8 py-3 rounded-xl text-sm shadow-xl shadow-amber-600/20 transition cursor-pointer"
              >
                Begin Timed Mock Test Now
              </button>
            </div>
          )}

          {isTestActive && (
            <div className="space-y-6">
              {/* Active Test Bar */}
              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping inline-block"></span>
                  <span className="text-xs font-bold text-white">Live Examination In Progress</span>
                </div>
                <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-sm bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/30">
                  <Clock className="w-4 h-4" />
                  <span>Time Remaining: {formatTime(timeLeft)}</span>
                </div>
              </div>

              {/* Mock Test Questions List */}
              <div className="space-y-6">
                {ASSESSMENTS_DATA.mcqs.map((q, qIndex) => (
                  <div key={q.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="text-xs font-mono text-sky-400 font-bold">
                      Question #{qIndex + 1} ({q.category})
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-white">
                      {q.question}
                    </div>

                    <div className="space-y-2 pt-2">
                      {q.options.map((opt, oIdx) => (
                        <label
                          key={oIdx}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition ${
                            mockAnswers[q.id] === oIdx
                              ? 'bg-sky-500/20 border-sky-500 text-white'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`mock-${q.id}`}
                            checked={mockAnswers[q.id] === oIdx}
                            onChange={() => setMockAnswers(prev => ({ ...prev, [q.id]: oIdx }))}
                            className="mt-0.5 text-sky-500 focus:ring-0"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleMockSubmit}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition cursor-pointer"
                >
                  Submit Final Test for Evaluation
                </button>
              </div>
            </div>
          )}

          {testSubmitted && (
            <div className="text-center py-8 space-y-4 max-w-lg mx-auto animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white">Examination Evaluated!</h3>
              
              <div className="text-4xl font-black text-emerald-400 font-mono">
                {testScore} / {ASSESSMENTS_DATA.mcqs.length} Correct
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {testScore >= 4 ? (
                  <span className="text-emerald-300 font-bold">
                    Outstanding Performance! You demonstrate tier-1 company placement readiness.
                  </span>
                ) : (
                  <span className="text-amber-300 font-medium">
                    Good effort! Review the student-life analogies and re-attempt to cross the 80% placement threshold.
                  </span>
                )}
              </p>

              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={startMockTest}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
                >
                  Re-attempt Test
                </button>
                <button
                  onClick={() => setActiveTab('career')}
                  className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-md"
                >
                  View Placement Readiness & Certificate
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
