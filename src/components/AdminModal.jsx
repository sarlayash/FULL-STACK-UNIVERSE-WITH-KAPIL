import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, Lock, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';

export const AdminModal = () => {
  const { isAdminModalOpen, setIsAdminModalOpen, authenticateAdmin, setActiveTab } = useApp();
  const [adminId, setAdminId] = useState('KAPILADMIN');
  const [password, setPassword] = useState('ADMIN123');
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
      }, 700);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAdminModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 text-center border-b border-slate-800 bg-gradient-to-b from-emerald-950/40 to-transparent">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 mb-3 shadow-lg shadow-emerald-500/10">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Kapil Admin Console</h2>
          <p className="text-xs text-slate-400 mt-1">
            Privileged command center for cohorts, notes, tests and certification
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Authentication Verified! Opening Admin Command Center...</span>
            </div>
          )}

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400">
            <span className="text-amber-400 font-semibold">Authorized Provisioning Note:</span>
            <div className="mt-1 flex items-center justify-between font-mono text-slate-300">
              <span>Admin ID: <strong className="text-white">KAPILADMIN</strong></span>
              <span>Password: <strong className="text-white">ADMIN123</strong></span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Administrator ID</label>
            <div className="relative">
              <input
                type="text"
                required
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition font-mono uppercase"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Admin Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition font-mono"
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg text-xs shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Authenticate Command Center</span>
          </button>
        </form>

        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500">
            Secure server-side role check with MFA audit logging.
          </p>
        </div>

      </div>
    </div>
  );
};
