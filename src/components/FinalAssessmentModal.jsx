import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { FINAL_CAPSTONE_ASSESSMENT_MCQS } from '../data/faangEnrollmentData';
import {
  Award,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ChevronRight,
  ChevronLeft,
  X,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Lock,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export const FinalAssessmentModal = () => {
  const {
    isFinalAssessmentModalOpen,
    setIsFinalAssessmentModalOpen,
    finalAssessmentStatus,
    submitFinalAssessment,
    isAdminLoggedIn,
    setActiveTab
  } = useApp();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [showReview, setShowReview] = useState(false);

  // Initialize or resume
  useEffect(() => {
    if (isFinalAssessmentModalOpen && finalAssessmentStatus?.answers) {
      setAnswers(finalAssessmentStatus.answers || {});
    }
  }, [isFinalAssessmentModalOpen]);

  // Timer countdown
  useEffect(() => {
    if (!isFinalAssessmentModalOpen || isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isFinalAssessmentModalOpen, isSubmitted, answers]);

  if (!isFinalAssessmentModalOpen) return null;

  const currentQ = FINAL_CAPSTONE_ASSESSMENT_MCQS[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = FINAL_CAPSTONE_ASSESSMENT_MCQS.length;

  const handleSelectOption = (qId, optionIdx) => {
    if (isSubmitted) return;
    setAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleSubmit = () => {
    const res = submitFinalAssessment(answers);
    setResult(res);
    setIsSubmitted(true);
  };

  const handleRetake = () => {
    setAnswers({});
    setTimeLeft(45 * 60);
    setIsSubmitted(false);
    setResult(null);
    setShowReview(false);
    setCurrentIdx(0);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Comprehensive Final Capstone Assessment
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  80% Cut-Off
                </span>
              </div>
              <p className="text-xs text-slate-400">
                25 Advanced Enterprise Architecture Questions • Required to unlock Industry Certificate
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {!isSubmitted && (
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border font-mono text-sm ${
                timeLeft < 300
                  ? 'bg-rose-950/50 border-rose-500/40 text-rose-400 animate-pulse'
                  : 'bg-slate-800/80 border-slate-700 text-amber-300'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={() => setIsFinalAssessmentModalOpen(false)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Post-Submission Result Screen */}
          {isSubmitted && result ? (
            <div className="space-y-6 max-w-2xl mx-auto py-4">
              <div className={`p-8 rounded-2xl border text-center relative overflow-hidden ${
                result.passed
                  ? 'bg-gradient-to-b from-emerald-950/40 to-slate-900 border-emerald-500/40 shadow-emerald-900/20'
                  : 'bg-gradient-to-b from-rose-950/40 to-slate-900 border-rose-500/40 shadow-rose-900/20'
              } shadow-2xl`}>
                <div className="inline-flex p-4 rounded-full mb-4 bg-slate-900 border border-slate-700">
                  {result.passed ? (
                    <Award className="w-12 h-12 text-emerald-400 animate-bounce" />
                  ) : (
                    <Lock className="w-12 h-12 text-rose-400" />
                  )}
                </div>

                <h3 className="text-2xl font-black text-white mb-2">
                  {result.passed
                    ? '🎉 Master Certification Unlocked!'
                    : 'Certificate Gated: 80% Threshold Required'}
                </h3>

                <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
                  {result.passed
                    ? 'Outstanding! You demonstrated mastery of enterprise architecture, microservices resilience, concurrency, and security protocols.'
                    : 'To maintain the gold standard of Full Stack Universe certifications, a minimum score of 80% is required. Review your answers and try again.'}
                </p>

                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-xs text-slate-400 uppercase tracking-wider block">Your Score</span>
                    <span className={`text-3xl font-black ${
                      result.score >= 80 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {result.score}%
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-xs text-slate-400 uppercase tracking-wider block">Requirement</span>
                    <span className="text-3xl font-black text-amber-400">80%</span>
                  </div>
                </div>

                {result.passed ? (
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => {
                        setIsFinalAssessmentModalOpen(false);
                        setActiveTab('career');
                      }}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold hover:brightness-110 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Proceed to Claim Certificate</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowReview(!showReview)}
                      className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700"
                    >
                      {showReview ? 'Hide Answer Review' : 'Review Questions & Explanations'}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={handleRetake}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold hover:brightness-110 flex items-center justify-center space-x-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Retake Final Assessment</span>
                    </button>
                    <button
                      onClick={() => setShowReview(!showReview)}
                      className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700"
                    >
                      {showReview ? 'Hide Analysis' : 'Review Incorrect Answers'}
                    </button>
                  </div>
                )}
              </div>

              {/* Explanations Review View */}
              {showReview && (
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <h4 className="text-md font-bold text-white flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    <span>Comprehensive Question Analysis</span>
                  </h4>
                  {FINAL_CAPSTONE_ASSESSMENT_MCQS.map((q, idx) => {
                    const userSelected = answers[q.id];
                    const isCorrect = userSelected === q.correctIndex;
                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-xl border ${
                          isCorrect
                            ? 'bg-emerald-950/20 border-emerald-500/30'
                            : 'bg-rose-950/20 border-rose-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            Q{idx + 1}: {q.category}
                          </span>
                          {isCorrect ? (
                            <span className="flex items-center space-x-1 text-xs text-emerald-400 font-bold">
                              <CheckCircle className="w-4 h-4" />
                              <span>Correct</span>
                            </span>
                          ) : (
                            <span className="flex items-center space-x-1 text-xs text-rose-400 font-bold">
                              <XCircle className="w-4 h-4" />
                              <span>Incorrect</span>
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-slate-200 mb-3">{q.question}</p>
                        <div className="space-y-1.5 text-xs mb-3">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`p-2 rounded-lg border ${
                                oIdx === q.correctIndex
                                  ? 'bg-emerald-900/30 border-emerald-500/40 text-emerald-200 font-medium'
                                  : userSelected === oIdx
                                  ? 'bg-rose-900/30 border-rose-500/40 text-rose-200 line-through'
                                  : 'bg-slate-900/50 border-slate-800 text-slate-400'
                              }`}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                        <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                          <strong className="text-amber-400 block mb-1">Architectural Rationale:</strong>
                          {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Live Question Taking View */
            <div className="space-y-6">
              {/* Question Navigation Bubbles */}
              <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-slate-800">
                <span className="text-xs text-slate-400 font-medium">
                  Answered: <strong className="text-white">{answeredCount}</strong> / {totalQuestions}
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
                  {FINAL_CAPSTONE_ASSESSMENT_MCQS.map((q, idx) => {
                    const isAnswered = answers[q.id] !== undefined;
                    const isCurrent = idx === currentIdx;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIdx(idx)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center shrink-0 ${
                          isCurrent
                            ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-900'
                            : isAnswered
                            ? 'bg-emerald-600/70 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current Question Card */}
              {currentQ && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {currentQ.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Question {currentIdx + 1} of {totalQuestions}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-slate-100 leading-relaxed">
                    {currentQ.question}
                  </h3>

                  <div className="space-y-2.5 pt-2">
                    {currentQ.options.map((option, optIdx) => {
                      const isSelected = answers[currentQ.id] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(currentQ.id, optIdx)}
                          className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-start space-x-3 ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-500/60 text-amber-100 shadow-md shadow-amber-500/5'
                              : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-900'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 border-amber-500'
                              : 'border-slate-700 text-slate-400 bg-slate-800'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="leading-snug">{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {!isSubmitted && (
          <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200 text-sm font-semibold flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <button
                disabled={currentIdx === totalQuestions - 1}
                onClick={() => setCurrentIdx(prev => Math.min(totalQuestions - 1, prev + 1))}
                className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200 text-sm font-semibold flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              {isAdminLoggedIn && (
                <button
                  onClick={() => {
                    const perfectAnswers = {};
                    FINAL_CAPSTONE_ASSESSMENT_MCQS.forEach(q => {
                      perfectAnswers[q.id] = q.correctIndex;
                    });
                    setAnswers(perfectAnswers);
                    const res = submitFinalAssessment(perfectAnswers);
                    setResult(res);
                    setIsSubmitted(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 text-xs font-semibold hover:bg-indigo-900/60"
                >
                  ⚡ Admin Bypass (100%)
                </button>
              )}

              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold hover:brightness-110 flex items-center space-x-2 shadow-lg shadow-amber-500/20"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Submit Final Assessment ({answeredCount}/{totalQuestions})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
