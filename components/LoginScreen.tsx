
/**
 * LoginScreen.tsx
 * A two-stage secure gateway: ID Identification -> Pin Authorization.
 * 
 * Features:
 * - High-fidelity animations using Tailwind and Lucide icons.
 * - Demo mode to allow instant access during testing.
 * - Theme-aware styling that adapts to the user's chosen accent color.
 */
import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Heart, ChevronLeft, Lock, Sparkles } from 'lucide-react';
import { LoginStep, ThemeColor } from '../types';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  isDarkMode: boolean;
  themeColor: ThemeColor;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, isDarkMode, themeColor }) => {
  const [step, setStep] = useState<LoginStep>('social');
  const [socialInput, setSocialInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Mock Credentials for the "Guardian Protocol"
  const CORRECT_SOCIAL = '0927146355';
  const CORRECT_CODE = '8585';

  // Dynamic Class Mapping based on Global Theme
  const accentTextClass = {
    indigo: 'text-indigo-600 dark:text-indigo-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    rose: 'text-rose-600 dark:text-rose-400',
    amber: 'text-amber-600 dark:text-amber-400',
  }[themeColor];

  const accentButtonClass = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-600',
    rose: 'bg-rose-600',
    amber: 'bg-amber-600',
  }[themeColor];

  // Logic: Stage 1 - ID Validation
  const handleSocialSubmit = () => {
    if (socialInput === CORRECT_SOCIAL) {
      setIsLoading(true);
      setError(null);
      setTimeout(() => {
        setIsLoading(false);
        setStep('code');
      }, 800);
    } else {
      setError(`ID: ${CORRECT_SOCIAL}`);
    }
  };

  // Logic: Stage 2 - Pin Verification
  const handleCodeSubmit = () => {
    if (codeInput === CORRECT_CODE) {
      setIsLoading(true);
      setError(null);
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess();
      }, 600);
    } else {
      setError(`Pin: ${CORRECT_CODE}`);
    }
  };

  // Utility: Bypass login for demo purposes
  const fillDemo = () => {
    setIsLoading(true);
    setSocialInput(CORRECT_SOCIAL);
    setTimeout(() => {
      setStep('code');
      setCodeInput(CORRECT_CODE);
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess();
      }, 500);
    }, 500);
  };

  // Auto-focus the pin input when moving to the second step
  useEffect(() => {
    if (step === 'code' && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden transition-all duration-700">
      
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-white to-pink-50/20 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900" />
      
      <div className="relative z-10 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        {/* Apple Health-inspired Icon */}
        <div className="w-28 h-28 mx-auto mb-8 relative">
          <div className="relative w-full h-full rounded-[2.5rem] bg-white dark:bg-slate-900 flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800">
            {/* Heart Icon - Apple Health Style */}
            <div className="relative">
              <Heart 
                className="w-16 h-16 text-red-500 dark:text-red-500 fill-red-500 dark:fill-red-500" 
                strokeWidth={2.5}
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(239, 68, 68, 0.2))'
                }}
              />
              {/* White outline effect */}
              <Heart 
                className="absolute inset-0 w-16 h-16 text-white dark:text-slate-900 fill-none" 
                strokeWidth={4}
                style={{ 
                  stroke: 'white',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                }}
              />
            </div>
          </div>
        </div>
        <h1 className="text-slate-900 dark:text-white text-5xl font-black tracking-tight mb-2">MediCare</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold tracking-wide">Your Health Companion</p>
      </div>

      <div className="relative z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[3rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] w-full max-w-md border border-slate-100/50 dark:border-slate-800/50 transition-all">
        {step === 'social' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-slate-900 dark:text-white text-3xl font-semibold mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8">Enter your Health ID to continue</p>
            
            <div className="relative mb-6">
              <input
                type="tel"
                maxLength={10}
                value={socialInput}
                onChange={(e) => { setError(null); setSocialInput(e.target.value.replace(/\D/g, '')); }}
                placeholder="Health ID"
                className="w-full px-5 py-4 text-xl font-semibold rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-red-500 dark:focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none text-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>

            <button
              disabled={isLoading || socialInput.length < 10}
              onClick={handleSocialSubmit}
              className={`w-full py-4 rounded-2xl text-white font-semibold text-base transition-all flex items-center justify-center gap-3 shadow-lg
                ${socialInput.length === 10 
                  ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 shadow-red-500/30 active:scale-[0.98]' 
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                }
              `}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Continue'
              )}
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <button 
              onClick={() => setStep('social')} 
              className="mb-6 flex items-center text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-red-500 dark:hover:text-red-400 transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back
            </button>
            <h2 className="text-slate-900 dark:text-white text-3xl font-semibold mb-2 tracking-tight">Enter PIN</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-10">Enter your 4-digit security code</p>
            
            {/* PIN Input Grid with hidden native input for better UX */}
            <div className="flex justify-between gap-3 mb-8 relative">
              {[0, 1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={`flex-1 h-16 border-2 rounded-2xl flex items-center justify-center text-2xl font-semibold transition-all ${
                    codeInput[i] 
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-slate-900 dark:text-white shadow-inner shadow-red-500/10' 
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950'
                  }`}
                >
                  {codeInput[i] ? '•' : ''}
                </div>
              ))}
              <input 
                ref={otpInputRef} 
                type="tel" 
                maxLength={4} 
                value={codeInput} 
                onChange={(e) => { 
                  const v = e.target.value.replace(/\D/g, ''); 
                  setCodeInput(v); 
                  if (v.length === 4) handleCodeSubmit(); 
                }} 
                className="absolute inset-0 opacity-0 cursor-default" 
              />
            </div>

            <button 
              disabled={isLoading || codeInput.length < 4} 
              onClick={handleCodeSubmit} 
              className={`w-full py-4 rounded-2xl text-white font-semibold text-base transition-all shadow-lg ${
                codeInput.length === 4 
                  ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 shadow-red-500/30 active:scale-[0.98]' 
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        )}

        {/* Dynamic Error State */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center justify-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <Lock className="w-4 h-4 text-red-500" />
            <span className="text-red-600 dark:text-red-400 font-medium text-sm">Required: {error}</span>
          </div>
        )}
      </div>

      <button 
        onClick={fillDemo}
        className="mt-8 relative z-10 flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-200/50 dark:border-slate-800/50 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
      >
        <Sparkles className="w-4 h-4 text-red-500" />
        Quick Access
      </button>

      <div className="mt-auto pt-8 relative z-10 flex items-center justify-center gap-2 text-slate-400 dark:text-slate-600 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span className="text-[10px] font-medium tracking-wide">Secure & Encrypted</span>
      </div>
    </div>
  );
};
