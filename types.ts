
/**
 * types.ts
 * Shared TypeScript definitions used across the application.
 */

// Navigation screen options
export type ScreenType = 'home' | 'list' | 'contacts';

// Authentication steps for the login flow
export type LoginStep = 'social' | 'code';

// Personalization themes
export type ThemeColor = 'indigo' | 'emerald' | 'rose' | 'amber';

// Time-of-day periods for medication scheduling
export type MedPeriod = 'morning' | 'evening' | 'night';

export interface User {
  name: string;
  age: number;
  medicalCase: string;
  lastCheckup: string;
  upcomingCheckup: string;
}

// Primary data structure for medication items
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  description: string;
  instruction: string;
  time: string;
  period: MedPeriod;
  taken: boolean; // Tracking status for the current day
}
