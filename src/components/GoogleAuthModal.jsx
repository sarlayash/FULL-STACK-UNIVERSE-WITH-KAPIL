import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  ShieldCheck, 
  Database,
  Loader2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const GoogleAuthModal = () => {
  const { 
    isGoogleModalOpen, 
    setIsGoogleModalOpen, 
    loginWithGoogleFirebase, 
    loginWithEmailFirebase, 
    registerWithEmailFirebase,
    startDemoTour 
  } = useApp();

  const [mode, setMode] = useState('google'); // 'google' | 'email_login' | 'email_signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [unauthDomain, setUnauthDomain] = useState(false);
  const [providerNotEnabled, setProviderNotEnabled] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isGoogleModalOpen) return null;

  // Genuine Google OAuth Sign-In via Firebase Popup
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    setUnauthDomain(false);
    setProviderNotEnabled(false);

    try {
      const res = await loginWithGoogleFirebase();
      setLoading(false);

      if (res.success) {
        setSuccessMsg(`Welcome, ${res.user?.name || 'Learner'}! Authenticated via Google.`);
        try {
          confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        } catch (e) { }
        setTimeout(() => {
          setIsGoogleModalOpen(false);
        }, 600);
      } else {
        if (res.code === 'auth/popup-closed-by-user') {
          setErrorMsg('Google sign-in popup was closed before completion. Please click again to sign in.');
        } else if (res.code === 'auth/unauthorized-domain') {
          setUnauthDomain(true);
          setErrorMsg(`Firebase Authorized Domain required: "${window.location.hostname}" is not yet registered in Firebase Console.`);
        } else if (res.code === 'auth/operation-not-allowed' || res.code === 'auth/configuration-not-found') {
          setProviderNotEnabled(true);
          setErrorMsg('Google Sign-In Provider is not enabled yet in your Firebase Console.');
        } else if (res.code === 'auth/popup-blocked') {
          setErrorMsg('Popup was blocked by your browser. Please allow popups for this site and try again.');
        } else if (res.code === 'auth/cancelled-popup-request') {
          // another popup was triggered, ignore or reset
          setErrorMsg('Popup request was refreshed.');
        } else {
          setErrorMsg(res.error || 'Authentication could not be completed.');
        }
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'An unexpected error occurred during Google sign-in.');
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    setUnauthDomain(false);

    if (mode === 'email_signup') {
      const res = await registerWithEmailFirebase(email, password, fullName);
      setLoading(false);
      if (res.success) {
        setSuccessMsg('Account registered with Cloud Firestore! Logging in...');
        try {
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        } catch (e) { }
        setTimeout(() => setIsGoogleModalOpen(false), 800);
      } else {
        setErrorMsg(res.error || 'Registration failed.');
      }
    } else {
      const res = await loginWithEmailFirebase(email, password);
      setLoading(false);
      if (res.success) {
        setIsGoogleModalOpen(false);
      } else {
        setErrorMsg(res.error || 'Invalid email or password.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setIsGoogleModalOpen(false);
            setErrorMsg('');
            setSuccessMsg('');
            setUnauthDomain(false);
            setMode('google');
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 text-center border-b border-slate-800 bg-gradient-to-b from-sky-950/40 to-transparent">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mx-auto shadow-xl mb-3 border border-slate-200">
            <svg className="w-7 h-7" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Full Stack Universe Learner Sign-In</h2>
          <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Official Google Identity & Cloud Firestore</span>
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5 text-xs text-rose-300 space-y-2 animate-fadeIn">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="font-medium">{errorMsg}</span>
              </div>
              {unauthDomain && (
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <p className="font-semibold text-sky-400">How to authorize this domain:</p>
                  <ol className="list-decimal pl-4 space-y-0.5 text-slate-400">
                    <li>Open <a href="https://console.firebase.google.com/project/full-stack-universe-with-kapil/authentication/settings" target="_blank" rel="noreferrer" className="text-sky-300 underline font-mono">Firebase Console</a></li>
                    <li>Go to <strong>Authentication &gt; Settings &gt; Authorized domains</strong></li>
                    <li>Click <strong>Add domain</strong> and enter: <code className="bg-slate-800 text-amber-300 px-1 py-0.5 rounded">{window.location.hostname}</code></li>
                  </ol>
                </div>
              )}
              {providerNotEnabled && (
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <p className="font-semibold text-amber-400">How to enable Google Sign-In:</p>
                  <ol className="list-decimal pl-4 space-y-0.5 text-slate-400">
                    <li>Open <a href="https://console.firebase.google.com/project/full-stack-universe-with-kapil/authentication/providers" target="_blank" rel="noreferrer" className="text-sky-300 underline font-mono">Sign-in method settings</a></li>
                    <li>Click on <strong>Google</strong></li>
                    <li>Toggle the <strong>Enable</strong> switch, set your email, and click <strong>Save</strong></li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Mode 1: Genuine Google Sign In */}
          {mode === 'google' && (
            <div className="space-y-4">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 px-4 rounded-xl text-sm shadow-xl transition flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 border border-slate-200 active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 text-slate-800 animate-spin" />
                    <span>Connecting to Google OAuth...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Sign in with Google Account</span>
                  </>
                )}
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-4 text-[10px] text-slate-500 uppercase font-mono tracking-wider">or email password</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMode('email_login')}
                  className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium py-2.5 rounded-xl text-xs transition"
                >
                  Email Sign In
                </button>
                <button
                  onClick={() => setMode('email_signup')}
                  className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium py-2.5 rounded-xl text-xs transition"
                >
                  Register New
                </button>
              </div>
            </div>
          )}

          {/* Mode 2: Email Login & Signup via Firebase */}
          {(mode === 'email_login' || mode === 'email_signup') && (
            <form onSubmit={handleEmailAuth} className="space-y-3 animate-fadeIn">
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs mb-2">
                <button
                  type="button"
                  onClick={() => setMode('email_login')}
                  className={`flex-1 py-1.5 rounded-lg font-semibold transition ${mode === 'email_login' ? 'bg-sky-600 text-white' : 'text-slate-400'}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode('email_signup')}
                  className={`flex-1 py-1.5 rounded-lg font-semibold transition ${mode === 'email_signup' ? 'bg-sky-600 text-white' : 'text-slate-400'}`}
                >
                  Register
                </button>
              </div>

              {mode === 'email_signup' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yash Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setMode('google')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-2 rounded-xl transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{loading ? 'Authenticating...' : mode === 'email_signup' ? 'Create Learner Profile' : 'Sign In'}</span>
                  {!loading && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer info */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>Synced to Cloud Firestore</span>
          </span>
          <button
            onClick={() => {
              setIsGoogleModalOpen(false);
              startDemoTour();
            }}
            className="text-sky-400 hover:underline cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>Demo Tour as Guest</span>
          </button>
        </div>

      </div>
    </div>
  );
};
