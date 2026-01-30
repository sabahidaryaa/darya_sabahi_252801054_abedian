
/**
 * Navigation.tsx
 * Bottom tab bar navigation featuring an "iOS Liquid Glass" aesthetic and smooth transitions.
 * 
 * Design Details:
 * - Sliding Indicator: A dynamic background "pill" that slides behind icons using CSS transforms.
 * - Liquid Glass: Advanced backdrop-blur, saturation, and ultra-thin gloss borders.
 * - Natural Motion: Uses cubic-bezier transitions to simulate physical inertia.
 */
import React, { useMemo } from 'react';
import { Home, List, Phone } from 'lucide-react';
import { ScreenType, ThemeColor } from '../types';

interface NavigationProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  themeColor: ThemeColor;
}

export const Navigation: React.FC<NavigationProps> = ({ currentScreen, onNavigate, themeColor }) => {
  const navItems: { id: ScreenType; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'list', label: 'Protocol', icon: List },
    { id: 'contacts', label: 'Support', icon: Phone },
  ];

  const activeIndex = useMemo(() => {
    return navItems.findIndex(item => item.id === currentScreen);
  }, [currentScreen, navItems]);

  const themeGradients = {
    indigo: 'from-indigo-600 to-purple-600',
    emerald: 'from-emerald-600 to-teal-600',
    rose: 'from-rose-600 to-pink-600',
    amber: 'from-amber-600 to-orange-600',
  }[themeColor];

  const activeShadow = {
    indigo: 'shadow-indigo-500/40',
    emerald: 'shadow-emerald-500/40',
    rose: 'shadow-rose-500/40',
    amber: 'shadow-amber-500/40',
  }[themeColor];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none">
      <div className="pointer-events-auto relative max-w-md mx-auto px-4 pb-8">
        {/* Apple-style Tab Bar */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800/50 p-2 transition-all duration-300">
          <div className="relative grid grid-cols-3">
            
            {/* Active Indicator */}
            <div 
              className="absolute top-0 bottom-0 w-1/3 transition-all duration-300 ease-out"
              style={{ 
                transform: `translateX(${activeIndex * 100}%)`,
              }}
            >
              <div className="h-full bg-slate-100 dark:bg-slate-800 rounded-xl" />
            </div>

            {navItems.map((item, idx) => {
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="py-3 flex flex-col items-center gap-1 transition-all duration-300 relative z-10"
                >
                  <item.icon 
                    className={`w-5 h-5 transition-all duration-300 ${
                      isActive 
                        ? 'text-slate-900 dark:text-white' 
                        : 'text-slate-500 dark:text-slate-400'
                    }`} 
                  />
                  <span 
                    className={`text-[10px] font-medium transition-all duration-300 ${
                      isActive 
                        ? 'text-slate-900 dark:text-white' 
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
