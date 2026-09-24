import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CAREER_DATA } from '../data/careerData';
import { 
  Briefcase, 
  CheckCircle2, 
  Award, 
  Building, 
  HelpCircle, 
  Printer, 
  Sparkles, 
  QrCode, 
  ExternalLink,
  Download,
  Image as ImageIcon,
  Check,
  Lock,
  Unlock,
  ShieldAlert,
  ArrowRight,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';

export const CareerStudio = () => {
  const { 
    currentUser, 
    activeTrack, 
    currentTrackData, 
    certificates, 
    generateCertificate,
    enrollmentStatus,
    finalAssessmentStatus,
    moduleProgress,
    canAccessCertificate,
    setIsEnrollmentModalOpen,
    setIsFinalAssessmentModalOpen,
    isAdminLoggedIn,
    setActiveTab: setGlobalActiveTab
  } = useApp();
  const [activeTab, setActiveTab] = useState('readiness'); // 'readiness' | 'star' | 'companies' | 'certificate'

  const [issuedCert, setIssuedCert] = useState(certificates[0] || null);
  const [isDownloadingPng, setIsDownloadingPng] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const certificateRef = useRef(null);

  const handleGenerateCertificate = () => {
    const cert = generateCertificate(currentUser ? currentUser.name : 'Alex Sharma', currentTrackData.title);
    setIssuedCert(cert);
    try {
      confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
    } catch (e) { }
  };

  // High-Resolution PNG Certificate Exporter
  const handleDownloadPng = async () => {
    if (!issuedCert) return;
    setIsDownloadingPng(true);
    setDownloadSuccess(false);

    try {
      if (certificateRef.current) {
        const canvas = await html2canvas(certificateRef.current, {
          scale: 2.5, // Ultra sharp high-DPI retina PNG
          useCORS: true,
          backgroundColor: '#090d16',
          logging: false
        });

        const safeName = (issuedCert.studentName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `Kapil_FullStack_Certificate_${safeName}_${issuedCert.id}.png`;
        link.href = imgData;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setDownloadSuccess(true);
        try {
          confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        } catch (e) { }
        setTimeout(() => setDownloadSuccess(false), 3000);
      } else {
        downloadCanvasFallback();
      }
    } catch (error) {
      console.warn('html2canvas capture notice, falling back to native high-res canvas renderer:', error);
      downloadCanvasFallback();
    } finally {
      setIsDownloadingPng(false);
    }
  };

  // Native HTML5 Canvas Fallback for 100% reliable offline PNG generation
  const downloadCanvasFallback = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1100;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1600, 1100);
    gradient.addColorStop(0, '#090d16');
    gradient.addColorStop(0.5, '#020617');
    gradient.addColorStop(1, '#090d16');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1600, 1100);

    // Double Gold/Amber Border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 12;
    ctx.strokeRect(36, 36, 1528, 1028);
    ctx.lineWidth = 3;
    ctx.strokeRect(52, 52, 1496, 996);

    // Header branding
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('FULL STACK UNIVERSE · POWERED BY KAPIL', 80, 100);
    
    ctx.textAlign = 'right';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`VERIFICATION ID: ${issuedCert.id}`, 1520, 100);

    // Center Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('OFFICIAL CERTIFICATE OF COMPLETION & INDUSTRY MASTERY', 800, 240);

    // Student Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px serif';
    ctx.fillText(issuedCert.studentName, 800, 350);

    // Decorative line
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(560, 390);
    ctx.lineTo(1040, 390);
    ctx.stroke();

    // Body text
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '24px sans-serif';
    ctx.fillText('has successfully mastered the rigorous curriculum, built 4 production domain MVPs,', 800, 460);
    ctx.fillText('and demonstrated placement readiness in:', 800, 500);

    // Track Title
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText(issuedCert.track, 800, 580);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px sans-serif';
    ctx.fillText('Demonstrated proficiency in Architecture Design, Database Optimization, Asynchronous APIs,', 800, 650);
    ctx.fillText('Dockerization, and Automated CI/CD Pipelines.', 800, 685);

    // Footer items
    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px monospace';
    ctx.fillText(`Date of Award: ${issuedCert.issueDate}`, 90, 940);
    ctx.fillStyle = '#10b981';
    ctx.fillText(`Evaluation Score: ${issuedCert.score}`, 90, 980);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'italic bold 38px serif';
    ctx.fillText('Kapil', 1510, 930);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px monospace';
    ctx.fillText('Kapil Sir · Lead Architect', 1510, 970);
    ctx.fillStyle = '#64748b';
    ctx.font = '16px monospace';
    ctx.fillText('Full Stack Universe', 1510, 1000);

    const safeName = (issuedCert.studentName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
    const link = document.createElement('a');
    link.download = `Kapil_FullStack_Certificate_${safeName}_${issuedCert.id}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>CAREER STUDIO · PLACEMENT READINESS & CERTIFICATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Interview Preparation & Verifiable Certificate
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Behavioral STAR method templates, company hiring patterns, placement readiness benchmarks, and accredited certification.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'readiness', label: 'Readiness Checklist' },
            { id: 'star', label: 'STAR Interview Method' },
            { id: 'companies', label: 'Company Blueprints' },
            { id: 'certificate', label: 'Verifiable Certificate' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* View 1: Placement Readiness Checklist */}
      {activeTab === 'readiness' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Placement Readiness Competency Matrix</h3>
                <p className="text-xs text-slate-400">Target metrics expected by tier-1 product and fintech companies</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-emerald-400 font-mono">Level 04</div>
                <div className="text-[10px] text-slate-500 uppercase font-mono">Job Ready Status</div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {CAREER_DATA.placementChecklist.map(item => (
                <div key={item.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className={`w-4 h-4 ${item.progress === 100 ? 'text-emerald-400' : 'text-sky-400'}`} />
                      <span className="text-xs font-bold text-white">{item.title}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
                      {item.progress}% Completed
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">{item.target}</p>

                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.progress === 100 ? 'bg-emerald-400' : 'bg-sky-500'}`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View 2: STAR Method Templates */}
      {activeTab === 'star' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">STAR Method Interview Answer Blueprints</h3>
              <p className="text-xs text-slate-400">
                Structure: <strong>S</strong>ituation (10%), <strong>T</strong>ask (10%), <strong>A</strong>ction (70%), <strong>R</strong>esult (10%)
              </p>
            </div>

            <div className="space-y-4">
              {CAREER_DATA.starMethodTemplates.map((template, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-sm font-bold text-white leading-snug">
                      "{template.question}"
                    </h4>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                      Model Answer
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      <span className="font-bold text-sky-400 block mb-1">Situation (Context):</span>
                      <p className="text-slate-300 leading-relaxed">{template.situation}</p>
                    </div>
                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      <span className="font-bold text-amber-400 block mb-1">Task (Objective):</span>
                      <p className="text-slate-300 leading-relaxed">{template.task}</p>
                    </div>
                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 sm:col-span-2">
                      <span className="font-bold text-emerald-400 block mb-1">Action (Deep Technical Steps):</span>
                      <p className="text-slate-300 leading-relaxed">{template.action}</p>
                    </div>
                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 sm:col-span-2">
                      <span className="font-bold text-purple-400 block mb-1">Result (Quantifiable Business Impact):</span>
                      <p className="text-slate-300 leading-relaxed font-semibold">{template.result}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View 3: Company Blueprints */}
      {activeTab === 'companies' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CAREER_DATA.companyBlueprints.map((comp, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <Building className="w-6 h-6 text-sky-400" />
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      {comp.package}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">{comp.company}</h4>
                  
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="text-slate-400 font-mono text-[11px] uppercase">Interview Pattern:</div>
                    <p className="text-slate-300 leading-relaxed">{comp.pattern}</p>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs text-amber-300 leading-relaxed">
                  <strong className="block text-amber-400 font-mono text-[10px] uppercase mb-0.5">Kapil Placement Tip:</strong>
                  {comp.tip}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-sky-400" />
              <span>General Placement Strategy FAQs</span>
            </h4>
            <div className="space-y-3">
              {CAREER_DATA.faqs.map((faq, i) => (
                <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="font-bold text-white">{faq.q}</div>
                  <p className="text-slate-400 leading-relaxed pt-1">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View 4: Verifiable Certificate */}
      {activeTab === 'certificate' && (
        <div className="space-y-6">
          {!canAccessCertificate ? (
            /* LOCKED STATE: Comprehensive Gating Checklist */
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="max-w-2xl mx-auto text-center space-y-4">
                <div className="inline-flex p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Lock className="w-10 h-10 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-wide">
                    Industry Master Certificate Locked
                  </h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    Full Stack Universe certificates carry genuine industry credibility. To maintain the highest hiring standards, certificate generation remains strictly gated until all curriculum milestones and the <strong className="text-amber-300">80% Final Assessment</strong> are completed.
                  </p>
                </div>

                {/* Requirements Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-4">
                  {/* Requirement 1: FAANG Enrollment Test */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    enrollmentStatus?.isUnlocked
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Gate 1: Enrollment
                      </span>
                      {enrollmentStatus?.isUnlocked ? (
                        <span className="flex items-center space-x-1 text-xs text-emerald-400 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Passed ({enrollmentStatus.score}%)</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-xs text-amber-400 font-bold">
                          <Lock className="w-3.5 h-3.5" />
                          <span>80% Required</span>
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">
                      FAANG Enrollment Assessment
                    </h4>
                    <p className="text-xs text-slate-400 mb-3">
                      Score at least 80% on the 50 hard FAANG MCQs and 10 coding challenges.
                    </p>
                    {!enrollmentStatus?.isUnlocked && (
                      <button
                        onClick={() => setIsEnrollmentModalOpen(true)}
                        className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1 shadow-md transition"
                      >
                        <span>Take Enrollment Exam</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Requirement 2: 8 Modules Completed */}
                  {(() => {
                    const completedCount = Object.values(moduleProgress || {}).filter(Boolean).length;
                    const isAllDone = completedCount >= 8;
                    return (
                      <div className={`p-4 rounded-2xl border transition-all ${
                        isAllDone
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Gate 2: Curriculum
                          </span>
                          {isAllDone ? (
                            <span className="flex items-center space-x-1 text-xs text-emerald-400 font-bold">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>8/8 Done</span>
                            </span>
                          ) : (
                            <span className="flex items-center space-x-1 text-xs text-amber-400 font-bold">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{completedCount}/8 Modules</span>
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">
                          Core Modules & Student Analogies
                        </h4>
                        <p className="text-xs text-slate-400 mb-3">
                          Review all 8 curriculum modules, real-world mental models, and deep-dive notes.
                        </p>
                        <button
                          onClick={() => setGlobalActiveTab('learning')}
                          className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center space-x-1 border border-slate-700 transition"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                          <span>Open Learning Modules</span>
                        </button>
                      </div>
                    );
                  })()}

                  {/* Requirement 3: 4 Domain MVPs */}
                  <div className="p-4 rounded-2xl border bg-slate-950/60 border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Gate 3: Architecture
                      </span>
                      <span className="flex items-center space-x-1 text-xs text-sky-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>4 MVPs Available</span>
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">
                      Domain MVPs & Design Patterns
                    </h4>
                    <p className="text-xs text-slate-400 mb-3">
                      Review production codebases for FinTech, E-Commerce, OTT, and HealthTech.
                    </p>
                    <button
                      onClick={() => setGlobalActiveTab('mvps')}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center space-x-1 border border-slate-700 transition"
                    >
                      <span>Explore 4 Production MVPs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Requirement 4: Final Capstone Assessment (80% cut-off) */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    finalAssessmentStatus?.passed
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-amber-950/20 border-amber-500/30'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Gate 4: Final Exam
                      </span>
                      {finalAssessmentStatus?.passed ? (
                        <span className="flex items-center space-x-1 text-xs text-emerald-400 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Passed ({finalAssessmentStatus.score}%)</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-xs text-amber-400 font-bold">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>80% Cut-Off</span>
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">
                      Comprehensive Final Assessment
                    </h4>
                    <p className="text-xs text-slate-400 mb-3">
                      25 advanced questions covering system design, microservices, and distributed architecture.
                    </p>
                    <button
                      onClick={() => setIsFinalAssessmentModalOpen(true)}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-black text-xs flex items-center justify-center space-x-1 shadow-lg shadow-amber-500/20 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{finalAssessmentStatus?.score ? 'Retake Final Exam' : 'Launch Final Capstone Exam'}</span>
                    </button>
                  </div>
                </div>

                {/* Admin Master Unlock if logged in */}
                {isAdminLoggedIn && (
                  <div className="pt-4 border-t border-slate-800 flex justify-center">
                    <button
                      onClick={() => {
                        setIsFinalAssessmentModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-bold text-xs hover:bg-indigo-900 transition flex items-center space-x-2"
                    >
                      <span>⚡ Kapil Admin: Preview / Bypass Assessment</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* UNLOCKED STATE: Full Certificate Generator & Downloader */
            <>
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      🎉 Gold Accreditation Unlocked!
                    </h4>
                    <p className="text-xs text-slate-300">
                      You passed all curriculum requirements and achieved 80%+ in the Final Assessment.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsFinalAssessmentModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700"
                >
                  Review Final Exam ({finalAssessmentStatus?.score || 100}%)
                </button>
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                <button
                  onClick={handleGenerateCertificate}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Issue New Certificate</span>
                </button>

                {/* PNG Download Button */}
                <button
                  onClick={handleDownloadPng}
                  disabled={isDownloadingPng}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-amber-600/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {downloadSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>PNG Downloaded!</span>
                    </>
                  ) : isDownloadingPng ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Rendering PNG...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Certificate (PNG)</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => window.print()}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / PDF</span>
                </button>
              </div>
            </>
          )}


          {/* Certificate Canvas / Render Frame */}
          {issuedCert && (
            <div 
              ref={certificateRef}
              className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-8 border-double border-amber-500/50 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6 max-w-4xl mx-auto"
            >
              
              <div className="flex justify-between items-start text-left text-xs font-mono text-slate-500">
                <div>
                  <div>FULL STACK UNIVERSE</div>
                  <div className="text-sky-400 font-bold">POWERED BY KAPIL</div>
                </div>
                <div className="text-right">
                  <div>VERIFICATION ID:</div>
                  <div className="text-amber-400 font-bold">{issuedCert.id}</div>
                </div>
              </div>

              <div className="py-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-sky-500 flex items-center justify-center text-white mx-auto shadow-xl">
                  <Award className="w-8 h-8" />
                </div>
                <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold mt-4">
                  Official Certificate of Completion & Industry Mastery
                </div>
                <h2 className="text-2xl sm:text-4xl font-serif font-black text-white mt-2">
                  {issuedCert.studentName}
                </h2>
                <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-2" />
              </div>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                has successfully mastered the rigorous curriculum, built 4 production domain MVPs, 
                and demonstrated placement readiness in:
              </p>

              <div className="text-xl sm:text-2xl font-bold text-sky-400 tracking-wide font-sans">
                {issuedCert.track}
              </div>

              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Demonstrated proficiency in Architecture Design, Database Optimization, Asynchronous APIs, Dockerization, and Automated CI/CD Pipelines.
              </p>

              {/* Signatures & QR Section */}
              <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
                <div className="text-left font-mono">
                  <div className="text-slate-500">Date of Award</div>
                  <div className="text-white font-bold">{issuedCert.issueDate}</div>
                  <div className="text-emerald-400 font-bold mt-0.5">Evaluation Score: {issuedCert.score}</div>
                </div>

                <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl">
                  <QrCode className="w-8 h-8 text-amber-400" />
                  <div className="text-left text-[10px] font-mono text-slate-400">
                    <div>SCAN TO VERIFY</div>
                    <div className="text-sky-400 underline">{issuedCert.id}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-amber-400 font-serif italic text-lg font-bold">Kapil</div>
                  <div className="text-slate-400 text-[11px] font-mono -mt-1">Kapil Sir · Lead Architect</div>
                  <div className="text-[10px] text-slate-600">Full Stack Universe</div>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
};
