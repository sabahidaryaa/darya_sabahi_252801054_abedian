
/**
 * HomeScreen.tsx
 * The user's personalized "Daily Mission Control" dashboard.
 * 
 * Major Components:
 * 1. Dynamic Clock & Greeting: Updates every second.
 * 2. Next Medication Focus: Highlights the most immediate untaken dose.
 * 3. Stats & Streak: Gamified tracking of health compliance.
 * 4. Lockscreen Simulation: Previews how Guardian looks as a device notification.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Settings, Clock, Pill, CheckCircle2, Zap, 
  Flame, Star, Trophy, ChevronRight, Smartphone, 
  Bell
} from 'lucide-react';
import { Medication, ThemeColor } from '../types';
import { timeToMinutes } from './Dashboard';

interface HomeScreenProps {
  onOpenSettings: () => void;
  meds: Medication[];
  onToggleMed: (id: string) => void;
  themeColor: ThemeColor;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenSettings, meds, onToggleMed, themeColor }) => {
  const [currentTimeDate, setCurrentTimeDate] = useState(new Date());
  const [timeStr, setTimeStr] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('Hello');
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastTakenName, setLastTakenName] = useState('');
  const [showLockSimulation, setShowLockSimulation] = useState(false);

  // LOGIC: Maintain a live clock and generate contextual greetings (Morning/Afternoon/Evening)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeDate(now);
      setTimeStr(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
      const hour = now.getHours();
      if (hour < 12) setGreeting('Good Morning');
      else if (hour < 18) setGreeting('Good Afternoon');
      else setGreeting('Good Evening');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const takenCount = useMemo(() => meds.filter(m => m.taken).length, [meds]);
  
  // LOGIC: Filter untaken meds and find the one closest to current time (or past due)
  const currentMed = useMemo(() => {
    const untaken = meds.filter(m => !m.taken);
    return untaken.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))[0];
  }, [meds]);

  // Derived theme configurations for consistent branding
  const themeConfig = {
    indigo: { gradient: 'from-indigo-600 via-indigo-700 to-indigo-900', accent: 'bg-indigo-600', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-100 dark:border-indigo-900/30' },
    emerald: { gradient: 'from-emerald-600 via-emerald-700 to-emerald-900', accent: 'bg-emerald-600', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-900/30' },
    rose: { gradient: 'from-rose-600 via-rose-700 to-rose-900', accent: 'bg-rose-600', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-100 dark:border-rose-900/30' },
    amber: { gradient: 'from-amber-600 via-amber-700 to-amber-900', accent: 'bg-amber-600', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-900/30' },
  }[themeColor];

  // LOGIC: Determine if the medication is "DUE NOW" or scheduled for later
  const medStatusData = useMemo(() => {
    if (!currentMed) return null;
    const nowMinutes = currentTimeDate.getHours() * 60 + currentTimeDate.getMinutes();
    const medMinutes = timeToMinutes(currentMed.time);
    const isDue = nowMinutes >= medMinutes;
    
    let countdown = '';
    if (!isDue) {
      const diff = medMinutes - nowMinutes;
      if (diff < 60) countdown = `${diff}m`;
      else countdown = `${Math.floor(diff / 60)}h ${diff % 60}m`;
    }

    return {
      label: isDue ? 'DUE NOW' : 'NEXT UP',
      statusColor: isDue ? 'bg-rose-500 text-white animate-pulse' : `${themeConfig.accent} text-white`,
      countdown,
      isDue
    };
  }, [currentMed, currentTimeDate, themeConfig]);

  const handleTakeMed = (id: string, name: string) => {
    setLastTakenName(name);
    onToggleMed(id);
    setShowFeedback(true);
    // Automatic timeout to clear the success toast
    setTimeout(() => setShowFeedback(false), 3500);
  };

  return (
    <div className="bg-white dark:bg-black transition-colors duration-500 min-h-screen pb-48">
      
      {/* FEATURE: Lockscreen Simulation Overlay */}
      {showLockSimulation && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-3xl animate-in fade-in duration-500 flex flex-col items-center pt-24 px-8">
          <button onClick={() => setShowLockSimulation(false)} className="absolute top-12 right-8 text-white/40 hover:text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
            Exit Preview <ChevronRight className="w-4 h-4" />
          </button>
          
          <div className="text-center mb-16 animate-in slide-in-from-top-12 duration-700">
            <p className="text-white text-7xl font-light tracking-tight tabular-nums mb-2">
              {currentTimeDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })}
            </p>
            <p className="text-white/60 text-lg font-medium">
              {currentTimeDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="w-full max-w-sm space-y-4 animate-in slide-in-from-bottom-12 duration-700 delay-300">
            <div className="bg-white/10 backdrop-blur-2xl rounded-[2.5rem] p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${themeConfig.accent}`}>
                    <Bell className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-black uppercase tracking-[0.2em] text-[9px]">Guardian Protocol</span>
                </div>
                <span className="text-white/40 text-[9px] font-bold">Now</span>
              </div>
              <h3 className="text-white text-lg font-black tracking-tight mb-1">{currentMed?.name || 'All Caught Up'}</h3>
              <p className="text-white/60 text-xs font-bold mb-6">{currentMed ? `Scheduled for ${currentMed.time} • ${currentMed.dosage}` : 'Your medication schedule is clear for now.'}</p>
              
              {currentMed && (
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { handleTakeMed(currentMed.id, currentMed.name); setShowLockSimulation(false); }} className="bg-white text-black py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform">Log Dose</button>
                  <button className="bg-white/10 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform">Snooze</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS TOAST */}
      {showFeedback && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-sm pointer-events-none">
          <div className="bg-white dark:bg-slate-900 backdrop-blur-xl p-4 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800/50 flex items-center animate-in slide-in-from-top-8 duration-300">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 leading-none mb-0.5">Success</p>
              <p className="text-slate-900 dark:text-white font-medium text-sm truncate">{lastTakenName} logged</p>
            </div>
          </div>
        </div>
      )}

      {/* HEADER: Personal Greeting & System Clock */}
      <div className="relative bg-white dark:bg-black pt-16 pb-8 px-6 z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{greeting}</p>
            <h1 className="text-slate-900 dark:text-white text-3xl font-semibold tracking-tight">Darya</h1>
          </div>
          <div className="flex gap-2">
             <button onClick={() => setShowLockSimulation(true)} className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center transition-all active:scale-95 hover:bg-slate-200 dark:hover:bg-slate-800">
               <Smartphone className="w-5 h-5 text-slate-600 dark:text-slate-400" />
             </button>
             <button onClick={onOpenSettings} className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center transition-all active:scale-95 hover:bg-slate-200 dark:hover:bg-slate-800">
               <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
             </button>
          </div>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </div>
          <div>
             <p className="text-slate-900 dark:text-white text-3xl font-light tracking-tight tabular-nums leading-none">{timeStr}</p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 relative z-20 space-y-5">
        
        {/* FOCUS WIDGET: The "Next Actionable Dose" card */}
        <section>
          {currentMed ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-800/50 transition-all">
               <div className="flex items-center justify-between mb-5">
                  <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${medStatusData?.statusColor}`}>
                      {medStatusData?.label}
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-medium tabular-nums">{currentMed.time}</span>
               </div>
               
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 bg-slate-100 dark:bg-slate-800">
                     <Pill className={`w-8 h-8 ${themeConfig.text.split(' ')[0]}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <h3 className="text-xl font-semibold text-slate-900 dark:text-white truncate mb-2">{currentMed.name}</h3>
                     <div className="flex flex-wrap gap-2">
                        <span className="text-slate-600 dark:text-slate-400 text-xs font-medium bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">{currentMed.dosage}</span>
                        <span className="text-slate-600 dark:text-slate-400 text-xs font-medium bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">{currentMed.instruction}</span>
                     </div>
                  </div>
               </div>

               <button 
                  onClick={() => handleTakeMed(currentMed.id, currentMed.name)}
                  className="w-full py-4 rounded-xl text-white text-base font-semibold active:scale-[0.98] transition-all flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700"
               >
                  <CheckCircle2 className="w-5 h-5" />
                  Mark as Taken
               </button>
            </div>
          ) : (
            <div className="bg-emerald-500 rounded-2xl p-10 text-white text-center shadow-sm">
               <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8" />
               </div>
               <h2 className="text-2xl font-semibold mb-2">Day Complete!</h2>
               <p className="text-emerald-50 text-sm font-medium opacity-90">Perfect Score Achieved</p>
            </div>
          )}
        </section>

        {/* STATS HUB: Logging summary and streak tracker */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/50 shadow-sm active:scale-[0.98] transition-all">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-slate-100 dark:bg-slate-800`}>
              <Zap className={`w-5 h-5 ${themeConfig.text.split(' ')[0]}`} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-semibold text-slate-900 dark:text-white tabular-nums">{takenCount}</span>
              <span className="text-slate-400 dark:text-slate-600 text-base font-medium">/{meds.length}</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1">Doses Logged</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/50 shadow-sm active:scale-[0.98] transition-all">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-amber-100 dark:bg-amber-900/20">
              <Flame className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-3xl font-semibold text-slate-900 dark:text-white tabular-nums">07</span>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1 flex items-center gap-1">
              Day Streak <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
