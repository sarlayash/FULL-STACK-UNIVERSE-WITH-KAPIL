import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, Lock, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';

export const AdminModal = () => {
  const { isAdminModalOpen, setIsAdminModalOpen, authenticateAdmin, setActiveTab } = useApp();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isAdminModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = authenticateAdmin(adminId, password);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setIsAdminModalOpen(false);
        setActiveTab('admin');
        setSuccess(false);
        setAdminId('');
        setPassword('');
      }, 600);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setIsAdminModalOpen(false);
            setError('');
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 text-center border-b border-slate-800 bg-gradient-to-b from-emerald-950/40 to-transparent">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 mb-3 shadow-lg shadow-emerald-500/10">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Kapil Admin Console</h2>
          <p className="text-xs text-slate-400 mt-1">
            Restricted instructor access. Verify administrator identity to continue.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-300 flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Identity Verified. Opening Command Center...</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Administrator ID</label>
            <div className="relative">
              <input
                type="text"
                required
                autoComplete="off"
                placeholder="Enter Administrator ID"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition font-mono uppercase"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Admin Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition font-mono"
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify & Authenticate</span>
          </button>
        </form>

        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500 font-mono">
            Encrypted session. Access logs audited by Kapil Security.
          </p>
        </div>

      </div>
    </div>
  );
};
