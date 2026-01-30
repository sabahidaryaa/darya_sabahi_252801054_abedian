
/**
 * SettingsModal.tsx
 * Comprehensive settings with User Profile, Color Theme Personalization, and 
 * high-fidelity previews of Home Screen & Lockscreen widgets.
 */
import React from 'react';
import { 
  X, LogOut, Moon, Sun, Flame, User, Activity, Shield, 
  Palette, Smartphone, Bell, Star, Heart, Zap, Pill, 
  Phone, AlertCircle 
} from 'lucide-react';
import { User as UserType, ThemeColor } from '../types';

interface SettingsModalProps {
  user: UserType;
  onClose: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ user, onClose, onLogout, isDarkMode, toggleDarkMode, themeColor, setThemeColor }) => {
  const themes: { id: ThemeColor; label: string; bg: string }[] = [
    { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-600' },
    { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-600' },
    { id: 'rose', label: 'Rose', bg: 'bg-rose-600' },
    { id: 'amber', label: 'Amber', bg: 'bg-amber-600' },
  ];

  const currentThemeClasses = {
    indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-600',
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-600',
    rose: 'text-rose-600 dark:text-rose-400 bg-rose-600',
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-600',
  }[themeColor];

  const accentColor = currentThemeClasses.split(' ')[0];
  const accentBg = currentThemeClasses.split(' ').pop();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm shadow-xl relative overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] transition-all border border-slate-200/50 dark:border-slate-800/50">
        
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between shrink-0 border-b border-slate-200/50 dark:border-slate-800/50">
          <h2 className="text-slate-900 dark:text-white text-xl font-semibold">Settings</h2>
          <button onClick={onClose} className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <X className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto no-scrollbar">
          
          {/* Health Passport Section */}
          <section className="space-y-3">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Health Passport</h3>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/50">
              <div className="flex justify-between items-center mb-5">
                <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center">
                  <User className={`w-6 h-6 ${accentColor}`} />
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-none">Age</p>
                  <p className="text-slate-900 dark:text-white font-semibold text-lg leading-none mt-1">{user.age}</p>
                </div>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Primary Holder</p>
              <p className="text-slate-900 dark:text-white font-semibold text-xl mb-5">{user.name}</p>
              
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                 <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Clinical Case</p>
                    <p className={`font-medium text-sm ${accentColor}`}>{user.medicalCase}</p>
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                        <p className={`text-xs font-medium mb-1 ${accentColor}`}>Last Visit</p>
                        <p className="text-slate-900 dark:text-white font-medium text-sm leading-tight">{user.lastCheckup}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                        <p className={`text-xs font-medium mb-1 ${accentColor}`}>Upcoming</p>
                        <p className="text-slate-900 dark:text-white font-medium text-sm leading-tight">{user.upcomingCheckup}</p>
                    </div>
                 </div>
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section className="space-y-3">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Appearance</h3>
            
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 space-y-5 border border-slate-200/50 dark:border-slate-800/50">
               <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-3">Color Theme</p>
                  <div className="flex justify-between items-center gap-2">
                     {themes.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setThemeColor(t.id)}
                          className={`w-12 h-12 rounded-xl transition-all relative ${t.bg} ${themeColor === t.id ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-500 scale-105' : 'opacity-60 hover:opacity-100'}`}
                        >
                          {themeColor === t.id && <div className="absolute inset-0 flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full" /></div>}
                        </button>
                     ))}
                  </div>
               </div>

               <button 
                onClick={toggleDarkMode}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-900 transition-all border border-slate-200/50 dark:border-slate-800/50 active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-amber-100 text-amber-600'}`}>
                    {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </div>
                  <p className="text-slate-900 dark:text-white font-medium text-sm">{isDarkMode ? 'Dark' : 'Light'} Mode</p>
                </div>
                <div className={`w-11 h-6 rounded-full relative transition-colors ${isDarkMode ? accentBg : 'bg-slate-300'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${isDarkMode ? 'left-[22px]' : 'left-0.5'}`} />
                </div>
              </button>
            </div>
          </section>

          {/* Home Screen Widgets Preview */}
          <section className="space-y-3">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Widgets</h3>
            
            <div className="space-y-4">
              {/* Home Widget Previews Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Next Med Widget */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between aspect-square">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accentBg}`}>
                    <Pill className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white font-semibold text-sm leading-none">Metformin</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1">Next: 8:00 AM</p>
                  </div>
                </div>

                {/* Streak Widget */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between aspect-square">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-xl flex items-center justify-center">
                    <Flame className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white font-semibold text-2xl leading-none">07</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1">Day Streak</p>
                  </div>
                </div>

                {/* Doctor Quick Call Widget */}
                <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-900/40 shadow-sm flex flex-col justify-between aspect-square">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-emerald-900 dark:text-emerald-400 font-semibold text-sm leading-none">Dr. Smith</p>
                    <p className="text-emerald-600 dark:text-emerald-500 text-xs font-medium mt-1">Care Team</p>
                  </div>
                </div>

                {/* 911 Emergency Widget */}
                <div className="bg-rose-500 rounded-2xl p-4 shadow-sm flex flex-col justify-between aspect-square relative overflow-hidden active:scale-95 transition-all">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-xl leading-none">911</p>
                    <p className="text-white/80 text-xs font-medium mt-1">Emergency</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
            <button 
              onClick={onLogout}
              className="w-full py-4 text-rose-600 dark:text-rose-400 font-semibold text-sm rounded-xl border border-rose-200 dark:border-rose-900/20 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
