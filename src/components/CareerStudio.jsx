import React, { useState } from 'react';
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
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CareerStudio = () => {
  const { currentUser, activeTrack, currentTrackData, certificates, generateCertificate } = useApp();
  const [activeTab, setActiveTab] = useState('readiness'); // 'readiness' | 'star' | 'companies' | 'certificate'
  const [expandedStarIndex, setExpandedStarIndex] = useState(0);
  const [issuedCert, setIssuedCert] = useState(certificates[0] || null);

  const handleGenerateCertificate = () => {
    const cert = generateCertificate(currentUser ? currentUser.name : 'Alex Sharma', currentTrackData.title);
    setIssuedCert(cert);
    try {
      confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
    } catch (e) { }
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
          <div className="flex justify-end gap-3">
            <button
              onClick={handleGenerateCertificate}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Issue New Accredited Certificate</span>
            </button>
            <button
              onClick={() => window.print()}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>

          {/* Certificate Canvas */}
          {issuedCert && (
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-8 border-double border-amber-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6 max-w-4xl mx-auto">
              
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
