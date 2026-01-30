
/**
 * MedicationCard.tsx
 * Interactive card representing a medication item with high-contrast accessibility and theme support.
 */
import React from 'react';
import { CheckCircle2, Circle, Sun, Moon, Sunrise } from 'lucide-react';
import { Medication, ThemeColor } from '../types';

interface MedicationCardProps {
  medication: Medication;
  onToggle: () => void;
  themeColor: ThemeColor;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({ medication, onToggle, themeColor }) => {
  const { name, dosage, time, taken, period, instruction } = medication;

  const getPeriodIcon = () => {
    switch (period) {
      case 'morning': return <Sunrise className="w-4 h-4" />;
      case 'evening': return <Sun className="w-4 h-4" />;
      case 'night': return <Moon className="w-4 h-4" />;
    }
  };

  const themeColors = {
    indigo: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-900/40',
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-900/40',
    rose: 'text-rose-600 bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-900/40',
    amber: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-900/40',
  }[themeColor];

  const accentColor = themeColors.split(' ')[0];

  return (
    <div 
      onClick={onToggle}
      className={`relative cursor-pointer rounded-2xl border p-4 transition-all active:scale-[0.98] flex items-center gap-4
        ${taken 
          ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200/50 dark:border-slate-800/50 opacity-75' 
          : 'bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md'
        }`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${taken ? 'bg-slate-200 dark:bg-slate-800 text-slate-400' : themeColors}`}>
        {getPeriodIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className={`font-semibold text-base truncate transition-all ${taken ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>
            {name}
          </h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ml-2 shrink-0 ${taken ? 'text-slate-400 bg-slate-200 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'}`}>
            {time}
          </span>
        </div>
        <div className="flex items-center gap-2">
           <p className={`text-xs font-medium ${taken ? 'text-slate-400' : accentColor}`}>{dosage}</p>
           <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
           <p className={`text-xs font-medium truncate ${taken ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
             {instruction}
           </p>
        </div>
      </div>

      <div className="shrink-0 ml-2">
        {taken ? (
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center transition-colors">
            <Circle className="w-4 h-4 text-transparent" />
          </div>
        )}
      </div>
    </div>
  );
};
