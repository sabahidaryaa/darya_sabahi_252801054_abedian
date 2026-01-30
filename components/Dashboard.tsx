
/**
 * Dashboard.tsx
 * The authenticated workspace containing navigation, data management, and sub-views.
 */
import React, { useState, useMemo } from 'react';
import { ScreenType, Medication, User, ThemeColor } from '../types';
import { HomeScreen } from './HomeScreen';
import { Navigation } from './Navigation';
import { SettingsModal } from './SettingsModal';
import { MedicationCard } from './MedicationCard';
import { Pill, AlertCircle, ChevronRight, Phone, Sunrise, Sun, Moon, Plus, Trash2, X, Edit3, Check } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
}

export const timeToMinutes = (timeStr: string): number => {
  const parts = timeStr.split(' ');
  if (parts.length < 2) return 0;
  const [time, modifier] = parts;
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return hours * 60 + (minutes || 0);
};

interface Contact {
  id: string;
  name: string;
  role: string;
  phone?: string;
  isPermanent: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, isDarkMode, toggleDarkMode, themeColor, setThemeColor }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [showSettings, setShowSettings] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactRole, setNewContactRole] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  const [user] = useState<User>({
    name: 'Robert Jenkins',
    age: 64,
    medicalCase: 'Type 2 Diabetes & Hypertension',
    lastCheckup: 'Oct 12, 2024',
    upcomingCheckup: 'Jan 15, 2025'
  });

  const [contacts, setContacts] = useState<Contact[]>([
    { id: 'p1', name: 'Dr. Robert Smith', role: 'Primary Care (Cardio)', isPermanent: true },
    { id: '2', name: 'Dr. Emily Watson', role: 'General Practitioner', isPermanent: false },
    { id: '3', name: 'Health Pharmacy', role: 'Direct Support', isPermanent: false },
  ]);

  const [meds, setMeds] = useState<Medication[]>([
    { id: '1', name: 'Metformin', dosage: '500mg', description: 'Blood Sugar', instruction: 'After breakfast', time: '8:00 AM', period: 'morning', taken: false },
    { id: '4', name: 'Aspirin', dosage: '81mg', description: 'Heart Health', instruction: 'With water', time: '7:30 AM', period: 'morning', taken: false },
    { id: '2', name: 'Lisinopril', dosage: '10mg', description: 'Blood Pressure', instruction: 'With water', time: '6:00 PM', period: 'evening', taken: false },
    { id: '5', name: 'Vitamin D3', dosage: '2000 IU', description: 'Bone Health', instruction: 'With meal', time: '1:00 PM', period: 'evening', taken: false },
    { id: '3', name: 'Atorvastatin', dosage: '20mg', description: 'Cholesterol', instruction: 'Before bed', time: '10:00 PM', period: 'night', taken: false },
    { id: '6', name: 'Magnesium', dosage: '400mg', description: 'Muscle & Sleep', instruction: '30m before sleep', time: '9:30 PM', period: 'night', taken: false }
  ]);

  const sortedMeds = useMemo(() => {
    return [...meds].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
  }, [meds]);

  const handleToggleMed = (id: string) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const medsByPeriod = useMemo(() => {
    return {
      morning: sortedMeds.filter(m => m.period === 'morning'),
      evening: sortedMeds.filter(m => m.period === 'evening'),
      night: sortedMeds.filter(m => m.period === 'night'),
    };
  }, [sortedMeds]);

  const takenCount = useMemo(() => meds.filter(m => m.taken).length, [meds]);
  const progressPercent = useMemo(() => Math.round((takenCount / meds.length) * 100), [takenCount, meds.length]);
  const isAllTaken = progressPercent === 100;

  const accentColorClass = {
    indigo: 'text-indigo-600 dark:text-indigo-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    rose: 'text-rose-600 dark:text-rose-400',
    amber: 'text-amber-600 dark:text-amber-400',
  }[themeColor];

  const accentBgClass = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-600',
    rose: 'bg-rose-600',
    amber: 'bg-amber-600',
  }[themeColor];

  const progressGradient = {
    indigo: 'from-indigo-500 to-purple-600',
    emerald: 'from-emerald-500 to-teal-600',
    rose: 'from-rose-500 to-pink-600',
    amber: 'from-amber-500 to-orange-600',
  }[themeColor];

  const handleAddContact = () => {
    if (newContactName.trim() && newContactRole.trim()) {
      const newContact: Contact = {
        id: Math.random().toString(36).substr(2, 9),
        name: newContactName,
        role: newContactRole,
        phone: newContactPhone.trim() || undefined,
        isPermanent: false
      };
      setContacts([...contacts, newContact]);
      setNewContactName('');
      setNewContactRole('');
      setNewContactPhone('');
      setIsAddingContact(false);
    }
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id || c.isPermanent));
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (isEditMode) {
      setIsAddingContact(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-black transition-colors duration-500 relative overflow-hidden">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-40">
        
        {currentScreen === 'home' && (
          <HomeScreen 
            onOpenSettings={() => setShowSettings(true)} 
            meds={sortedMeds} 
            onToggleMed={handleToggleMed}
            themeColor={themeColor}
          />
        )}
        
        {currentScreen === 'list' && (
          <div className="pt-12 px-6 animate-in fade-in duration-500">
            <header className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">Timeline</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-0.5">Daily Protocol</p>
              </div>
              <div className={`w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center transition-transform active:scale-95`}>
                <Pill className={`w-5 h-5 ${accentColorClass}`} />
              </div>
            </header>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/50 dark:border-slate-800/50 mb-6">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h3 className="text-slate-900 dark:text-white font-semibold text-lg">Daily Goal</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-0.5">
                    {takenCount} of {meds.length} meds logged
                  </p>
                </div>
                <span className={`font-semibold text-2xl leading-none ${accentColorClass}`}>{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${isAllTaken ? 'bg-emerald-500' : accentBgClass}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="space-y-12">
              {(Object.keys(medsByPeriod) as Array<keyof typeof medsByPeriod>).map((period) => {
                const items = medsByPeriod[period];
                if (items.length === 0) return null;

                return (
                  <section key={period} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center shrink-0">
                        {period === 'morning' ? <Sunrise className="w-4 h-4 text-orange-500" /> : period === 'evening' ? <Sun className="w-4 h-4 text-indigo-500" /> : <Moon className="w-4 h-4 text-slate-500" />}
                      </div>
                      <h2 className="text-slate-900 dark:text-white font-semibold text-sm capitalize">{period}</h2>
                      <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1 ml-2" />
                    </div>
                    <div className="space-y-4">
                      {items.map(med => (
                        <MedicationCard key={med.id} medication={med} onToggle={() => handleToggleMed(med.id)} themeColor={themeColor} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        )}

        {currentScreen === 'contacts' && (
          <div className="pt-12 px-6 animate-in fade-in duration-500">
            <header className="flex items-center justify-between mb-6">
               <div>
                  <h1 className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">Care Team</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-0.5">Management Hub</p>
               </div>
               <button 
                  onClick={toggleEditMode}
                  className={`px-4 py-2 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all active:scale-95
                    ${isEditMode 
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' 
                      : `bg-slate-100 dark:bg-slate-900 ${accentColorClass}`
                    }
                  `}
               >
                  {isEditMode ? (
                    <><Check className="w-4 h-4" /> Done</>
                  ) : (
                    <><Edit3 className="w-4 h-4" /> Edit</>
                  )}
               </button>
            </header>
            
            {/* 911 Banner - Always Present */}
            <button className="w-full bg-rose-500 rounded-2xl p-5 mb-6 flex items-center justify-between shadow-sm transition-transform active:scale-[0.98] group">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left text-white">
                        <p className="text-xs font-medium opacity-90 leading-none mb-1">Emergency</p>
                        <h3 className="text-2xl font-semibold">Call 911</h3>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/60" />
            </button>

            {/* In Edit Mode, Show Add Contact Control */}
            {isEditMode && !isAddingContact && (
              <button 
                onClick={() => setIsAddingContact(true)}
                className="w-full bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-center gap-2 mb-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 group"
              >
                <Plus className={`w-5 h-5 ${accentColorClass}`} />
                <span className="text-slate-600 dark:text-slate-400 font-medium text-sm">Add New Contact</span>
              </button>
            )}

            {isEditMode && isAddingContact && (
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl mb-4 shadow-sm border border-slate-200/50 dark:border-slate-800/50 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Contact Details</h4>
                  <button onClick={() => setIsAddingContact(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Name</p>
                    <input 
                      type="text" 
                      placeholder="e.g. Pharmacy, Specialist" 
                      value={newContactName}
                      onChange={(e) => setNewContactName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-sm font-medium text-slate-900 dark:text-white focus:border-slate-300 dark:focus:border-slate-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Description / Role</p>
                    <input 
                      type="text" 
                      placeholder="e.g. Refills, Support" 
                      value={newContactRole}
                      onChange={(e) => setNewContactRole(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-sm font-medium text-slate-900 dark:text-white focus:border-slate-300 dark:focus:border-slate-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Phone Number</p>
                    <input 
                      type="tel" 
                      placeholder="e.g. 5551234567" 
                      value={newContactPhone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 10) {
                          setNewContactPhone(value);
                        }
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-sm font-medium text-slate-900 dark:text-white focus:border-slate-300 dark:focus:border-slate-600"
                    />
                    {newContactPhone.length > 0 && newContactPhone.length < 10 && (
                      <p className="text-xs text-amber-500 dark:text-amber-400">
                        Enter 10 digits
                      </p>
                    )}
                  </div>
                  <button 
                    onClick={handleAddContact}
                    className={`w-full py-3 rounded-xl text-white font-semibold text-sm ${accentBgClass} active:scale-[0.98] transition-transform`}
                  >
                    Add Contact
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
                {contacts.map((contact) => (
                    <div key={contact.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between transition-all hover:shadow-md overflow-hidden relative">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center`}>
                                <span className={`text-xl font-semibold ${accentColorClass}`}>{contact.name[0]}</span>
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">{contact.name}</h3>
                                <p className="text-emerald-600 dark:text-emerald-400 text-xs font-medium mt-0.5 truncate">{contact.role}</p>
                                {contact.phone && (
                                  <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-0.5 truncate">
                                    {contact.phone.length === 10 
                                      ? contact.phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
                                      : contact.phone
                                    }
                                  </p>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {!isEditMode ? (
                            <button 
                              onClick={() => contact.phone && (window.location.href = `tel:${contact.phone}`)}
                              className={`w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all active:scale-95 active:bg-emerald-500 active:text-white ${!contact.phone ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={!contact.phone}
                            >
                                <Phone className="w-5 h-5" />
                            </button>
                          ) : (
                            !contact.isPermanent ? (
                              <button 
                                onClick={() => handleDeleteContact(contact.id)}
                                className={`w-10 h-10 bg-rose-50 dark:bg-rose-950/30 rounded-xl flex items-center justify-center text-rose-500 transition-all active:scale-95`}
                              >
                                  <Trash2 className="w-5 h-5" />
                              </button>
                            ) : (
                              <div className="w-10 h-10 flex items-center justify-center">
                                <Check className="w-5 h-5 text-slate-300 dark:text-slate-700" />
                              </div>
                            )
                          )}
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} themeColor={themeColor} />
      
      {showSettings && (
        <SettingsModal 
          user={user}
          onClose={() => setShowSettings(false)} 
          onLogout={onLogout}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          themeColor={themeColor}
          setThemeColor={setThemeColor}
        />
      )}
    </div>
  );
};
