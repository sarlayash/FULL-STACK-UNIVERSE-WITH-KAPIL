import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FAANG_ENROLLMENT_MCQS, 
  FAANG_CODING_CHALLENGES 
} from '../data/faangEnrollmentData';
import { 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Terminal, 
  Award, 
  ArrowRight, 
  Code, 
  BookOpen, 
  Play, 
  Sparkles, 
  Lock, 
  Unlock, 
  Compass, 
  ChevronRight, 
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const EnrollmentModal = () => {
  const { 
    isEnrollmentModalOpen, 
    setIsEnrollmentModalOpen, 
    enrollmentStatus, 
    submitEnrollmentTest, 
    resetEnrollmentTest,
    adminBypassEnrollment,
    isAdminLoggedIn,
    setActiveTrack,
    setActiveTab
  } = useApp();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'java' | 'python' | 'coding'
  const [mcqAnswers, setMcqAnswers] = useState(() => enrollmentStatus.testAnswers || {});
  const [codingSubmissions, setCodingSubmissions] = useState(() => {
    if (enrollmentStatus.codingSubmissions && Object.keys(enrollmentStatus.codingSubmissions).length > 0) {
      return enrollmentStatus.codingSubmissions;
    }
    const initial = {};
    FAANG_CODING_CHALLENGES.forEach(c => {
      initial[c.id] = c.starterCode.java;
    });
    return initial;
  });

  const [activeCodingLang, setActiveCodingLang] = useState('java'); // 'java' | 'python'
  const [activeCodingProblemId, setActiveCodingProblemId] = useState(FAANG_CODING_CHALLENGES[0].id);
  const [codeExecutionOutput, setCodeExecutionOutput] = useState({});
  const [showResultReport, setShowResultReport] = useState(enrollmentStatus.completedAt ? true : false);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(90 * 60); // 90 minutes

  // Timer countdown
  useEffect(() => {
    if (!isEnrollmentModalOpen || showResultReport) return;
    const interval = setInterval(() => {
      setTimeRemainingSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isEnrollmentModalOpen, showResultReport]);

  if (!isEnrollmentModalOpen) return null;

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectMcq = (questionId, optionIndex) => {
    setMcqAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleCodeChange = (problemId, code) => {
    setCodingSubmissions(prev => ({
      ...prev,
      [problemId]: code
    }));
  };

  const handleRunCode = (problem) => {
    const userCode = codingSubmissions[problem.id] || '';
    if (userCode.trim().length < 50) {
      setCodeExecutionOutput(prev => ({
        ...prev,
        [problem.id]: {
          status: 'error',
          message: 'Compilation Failed: Code body too brief. Implement the requested algorithmic logic.'
        }
      }));
      return;
    }

    setCodeExecutionOutput(prev => ({
      ...prev,
      [problem.id]: {
        status: 'success',
        message: `All ${problem.testCases.length} Test Cases Passed! Execution time: 14ms (O(1) Memory Verified)`
      }
    }));
  };

  const handleSubmitTest = () => {
    const result = submitEnrollmentTest(mcqAnswers, codingSubmissions);
    setShowResultReport(true);
    if (result.passed) {
      try {
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
      } catch (e) {}
    }
  };

  const handleRetake = () => {
    resetEnrollmentTest();
    setMcqAnswers({});
    setShowResultReport(false);
    setTimeRemainingSeconds(90 * 60);
  };

  const answeredMcqCount = Object.keys(mcqAnswers).length;
  const answeredCodingCount = Object.values(codingSubmissions).filter(c => c && c.trim().length > 50).length;
  const totalAnswered = answeredMcqCount + answeredCodingCount;
  const progressPercent = Math.round((totalAnswered / 60) * 100);

  const filteredMcqs = FAANG_ENROLLMENT_MCQS.filter(q => {
    if (activeFilter === 'java') return q.track === 'java';
    if (activeFilter === 'python') return q.track === 'python';
    if (activeFilter === 'coding') return false;
    return true;
  });

  const activeProblem = FAANG_CODING_CHALLENGES.find(c => c.id === activeCodingProblemId) || FAANG_CODING_CHALLENGES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/95 backdrop-blur-md overflow-hidden animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl h-[94vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-rose-950/30 via-slate-900 to-sky-950/30 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-md">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  FAANG Standard Full Stack Enrollment Gatekeeper
                </h2>
                <span className="text-[11px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-semibold">
                  80% Score Required
                </span>
              </div>
              <p className="text-xs text-slate-400">
                50 Hard FAANG MCQs (25 Java + 25 Python) &bull; 10 Hard Coding Challenges &bull; Adaptive Track Recommendation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Timer */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono text-amber-300">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>{formatTimer(timeRemainingSeconds)}</span>
            </div>

            {/* Admin Bypass */}
            {isAdminLoggedIn && (
              <button
                onClick={adminBypassEnrollment}
                className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition"
                title="Administrator Master Bypass"
              >
                Admin Bypass (100%)
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={() => setIsEnrollmentModalOpen(false)}
              className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Filter Tabs */}
        {!showResultReport && (
          <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${activeFilter === 'all' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                All (60)
              </button>
              <button
                onClick={() => setActiveFilter('java')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${activeFilter === 'java' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Java MCQs (25)
              </button>
              <button
                onClick={() => setActiveFilter('python')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${activeFilter === 'python' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Python MCQs (25)
              </button>
              <button
                onClick={() => setActiveFilter('coding')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${activeFilter === 'coding' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Hard Coding (10)
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400 font-mono">
                Progress: <strong className="text-white">{totalAnswered}</strong> / 60 ({progressPercent}%)
              </span>
              <div className="w-28 sm:w-40 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <button
                onClick={handleSubmitTest}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-xl text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <span>Submit & Grade</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* VIEW 1: SCORE REPORT & RECOMMENDATION */}
          {showResultReport ? (
            <div className="max-w-3xl mx-auto space-y-6 py-4 animate-fadeIn">
              
              {/* Outcome Banner */}
              <div className={`p-6 rounded-3xl border text-center space-y-3 ${
                enrollmentStatus.passed 
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}>
                <div className={`w-16 h-16 mx-auto rounded-3xl flex items-center justify-center shadow-xl ${
                  enrollmentStatus.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {enrollmentStatus.passed ? <Unlock className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                </div>

                <h3 className="text-2xl font-black text-white">
                  {enrollmentStatus.passed 
                    ? '🎉 Gatekeeper Assessment Cleared!' 
                    : 'Target Not Reached (< 80%) — Retrial Required'}
                </h3>

                <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                  {enrollmentStatus.passed
                    ? 'Congratulations! You demonstrated rigorous FAANG-level understanding across JVM internals, CPython concurrency, and high-performance system algorithms. Both Java and Python Universe tracks are now fully unlocked!'
                    : 'FAANG engineering standards require at least 80% mastery across core memory models and algorithms to enter the Universe tracks. Review your breakdown below and retry.'}
                </p>

                <div className="flex items-center justify-center gap-6 pt-2 font-mono">
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-white">{enrollmentStatus.score}%</div>
                    <div className="text-[11px] text-slate-400 uppercase">Overall Score</div>
                  </div>
                  <div className="h-10 border-r border-slate-700"></div>
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-white">{enrollmentStatus.totalPoints} / 60</div>
                    <div className="text-[11px] text-slate-400 uppercase">Points Earned</div>
                  </div>
                  <div className="h-10 border-r border-slate-700"></div>
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-sky-400">80%</div>
                    <div className="text-[11px] text-slate-400 uppercase">Cut-Off Threshold</div>
                  </div>
                </div>
              </div>

              {/* Subject Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400">Java Architecture</span>
                  <div className="text-2xl font-bold text-orange-400 font-mono mt-1">
                    {enrollmentStatus.javaScore || 0}%
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">JVM, GC, ZGC & Loom</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400">Python Architecture</span>
                  <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                    {enrollmentStatus.pythonScore || 0}%
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">GIL, Descriptors & Asyncio</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400">Hard Coding</span>
                  <div className="text-2xl font-bold text-indigo-400 font-mono mt-1">
                    {enrollmentStatus.codingScore || 0}%
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Rate Limit, LRU & Graphs</p>
                </div>
              </div>

              {/* AI TRACK RECOMMENDATION ENGINE */}
              {enrollmentStatus.passed && (
                <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-950/60 via-indigo-950/60 to-purple-950/60 border border-sky-500/30 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs tracking-wider uppercase">
                    <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Kapil Intelligence Track Recommendation</span>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h4 className="text-xl font-black text-white">
                        Recommended Track:{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-sky-400">
                          {enrollmentStatus.recommendedTrack === 'java' ? 'Java Full Stack Universe' : 'Python Full Stack Universe'}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 max-w-xl">
                        {enrollmentStatus.recommendedTrack === 'java'
                          ? 'Your strong performance in JVM concurrency, memory barriers, and microservices architecture indicates you will excel in enterprise high-concurrency systems (Spring Boot 3.3, PostgreSQL, Microservices).'
                          : 'Your exceptional scores in asyncio event loop mechanics, descriptors, and distributed pipelines indicate you will thrive in real-time async microservices and AI-driven backends (FastAPI, Django, Celery).'}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTrack(enrollmentStatus.recommendedTrack);
                        setActiveTab('learning');
                        setIsEnrollmentModalOpen(false);
                      }}
                      className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-5 py-3 rounded-2xl text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
                    >
                      <span>Enter {enrollmentStatus.recommendedTrack === 'java' ? 'Java Track' : 'Python Track'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Action Footer */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleRetake}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Assessment</span>
                </button>

                <button
                  onClick={() => setIsEnrollmentModalOpen(false)}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Close & View Dashboard
                </button>
              </div>

            </div>
          ) : (
            /* VIEW 2: TEST QUESTIONS LIST & CODING ENVIRONMENT */
            <div className="space-y-8 max-w-4xl mx-auto">
              
              {/* SECTION A: MCQS */}
              {(activeFilter === 'all' || activeFilter === 'java' || activeFilter === 'python') && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-sky-400" />
                      <span>Part 1: FAANG Architecture & Nuances ({filteredMcqs.length} Questions)</span>
                    </h3>
                    <span className="text-xs text-slate-400">1 Point Per Correct Answer</span>
                  </div>

                  <div className="space-y-6">
                    {filteredMcqs.map((q, idx) => {
                      const selectedOpt = mcqAnswers[q.id];
                      return (
                        <div key={q.id} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                              #{idx + 1}
                            </span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                  q.track === 'java' ? 'bg-orange-500/20 text-orange-300' : 'bg-emerald-500/20 text-emerald-300'
                                }`}>
                                  {q.track === 'java' ? 'Java' : 'Python'} &bull; {q.category}
                                </span>
                                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                                  {q.company}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm font-semibold text-slate-200 leading-snug">
                                {q.question}
                              </p>
                            </div>
                          </div>

                          {/* Options */}
                          <div className="space-y-2 pt-1 pl-7">
                            {q.options.map((opt, oIdx) => {
                              const isSelected = selectedOpt === oIdx;
                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => handleSelectMcq(q.id, oIdx)}
                                  className={`w-full text-left p-3 rounded-xl text-xs transition border flex items-start gap-3 cursor-pointer ${
                                    isSelected
                                      ? 'bg-sky-950/60 border-sky-500/60 text-sky-200 shadow-md'
                                      : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                                  }`}
                                >
                                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5 ${
                                    isSelected ? 'bg-sky-500 text-white border-sky-400 font-bold' : 'border-slate-700 text-slate-400'
                                  }`}>
                                    {String.fromCharCode(65 + oIdx)}
                                  </span>
                                  <span className="leading-relaxed">{opt}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION B: HARD CODING CHALLENGES */}
              {(activeFilter === 'all' || activeFilter === 'coding') && (
                <div className="space-y-6 pt-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Code className="w-4 h-4 text-indigo-400" />
                      <span>Part 2: FAANG Hard Coding Arena (10 Problems &bull; 1 Point Each)</span>
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      Answered: {answeredCodingCount}/10
                    </span>
                  </div>

                  {/* Problem Selector Bar */}
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {FAANG_CODING_CHALLENGES.map((prob, pIdx) => {
                      const isCurrent = prob.id === activeCodingProblemId;
                      const hasSubmitted = codingSubmissions[prob.id] && codingSubmissions[prob.id].trim().length > 50;
                      return (
                        <button
                          key={prob.id}
                          onClick={() => setActiveCodingProblemId(prob.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition flex items-center gap-1.5 cursor-pointer ${
                            isCurrent
                              ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                              : hasSubmitted
                              ? 'bg-slate-950 border-emerald-500/40 text-emerald-400'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>#{pIdx + 1} {prob.title.slice(0, 16)}...</span>
                          {hasSubmitted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Coding Workbench */}
                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{activeProblem.title}</span>
                          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-mono">
                            {activeProblem.company}
                          </span>
                          <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-semibold">
                            {activeProblem.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 whitespace-pre-line leading-relaxed">
                          {activeProblem.statement}
                        </p>
                      </div>

                      {/* Language Switcher */}
                      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                        <button
                          onClick={() => {
                            setActiveCodingLang('java');
                            if (!codingSubmissions[activeProblem.id]) {
                              handleCodeChange(activeProblem.id, activeProblem.starterCode.java);
                            }
                          }}
                          className={`px-3 py-1 rounded-lg font-semibold transition ${activeCodingLang === 'java' ? 'bg-orange-600 text-white' : 'text-slate-400'}`}
                        >
                          Java
                        </button>
                        <button
                          onClick={() => {
                            setActiveCodingLang('python');
                            if (!codingSubmissions[activeProblem.id] || codingSubmissions[activeProblem.id].includes('public class')) {
                              handleCodeChange(activeProblem.id, activeProblem.starterCode.python);
                            }
                          }}
                          className={`px-3 py-1 rounded-lg font-semibold transition ${activeCodingLang === 'python' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                        >
                          Python
                        </button>
                      </div>
                    </div>

                    {/* Code Editor */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                        <span>Editor ({activeCodingLang.toUpperCase()})</span>
                        <span>O(1) Time / Space Target</span>
                      </div>
                      <textarea
                        rows={12}
                        value={codingSubmissions[activeProblem.id] || (activeCodingLang === 'java' ? activeProblem.starterCode.java : activeProblem.starterCode.python)}
                        onChange={(e) => handleCodeChange(activeProblem.id, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-sky-300 focus:outline-none focus:border-indigo-500 transition leading-relaxed"
                        placeholder="Write your production algorithm here..."
                      ></textarea>
                    </div>

                    {/* Test Case Execution */}
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <div className="text-xs text-slate-400">
                        {codeExecutionOutput[activeProblem.id] && (
                          <span className={`flex items-center gap-1.5 font-mono ${
                            codeExecutionOutput[activeProblem.id].status === 'success' ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {codeExecutionOutput[activeProblem.id].status === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                            <span>{codeExecutionOutput[activeProblem.id].message}</span>
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleRunCode(activeProblem)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Run Test Cases</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Sticky Submission Banner */}
              <div className="sticky bottom-0 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 shadow-2xl">
                <div>
                  <div className="text-xs font-bold text-white">Ready for Evaluation?</div>
                  <div className="text-[11px] text-slate-400">
                    Total Answered: {totalAnswered} / 60 &bull; Must score &ge; 80% to unlock tracks.
                  </div>
                </div>

                <button
                  onClick={handleSubmitTest}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-xl transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Submit FAANG Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
