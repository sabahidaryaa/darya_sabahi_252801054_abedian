
/**
 * App.tsx
 * The Root Component of the Guardian Health Suite.
 * 
 * Responsibilities:
 * 1. Global State Management: Tracks authentication status.
 * 2. Theme Orchestration: Manages Dark Mode and Accent Color persistence via LocalStorage.
 * 3. Layout Shell: Provides the primary mobile-constrained container for the entire UI.
 */
import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { ThemeColor } from './types';

export default function App() {
  // Track if the user has cleared the Guardian Protocol login
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  // Theme Color (Indigo, Emerald, Rose, Amber) - Persisted to stay consistent across sessions
  const [themeColor, setThemeColor] = useState<ThemeColor>(() => {
    return (localStorage.getItem('themeColor') as ThemeColor) || 'indigo';
  });

  // Dark Mode State - Initialized from LocalStorage for seamless "Eye-Care" experience
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // EFFECT: Synchronize the HTML document class with the dark mode state
  // This allows Tailwind's 'dark:' variant to work globally.
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // EFFECT: Persist accent color changes whenever the user updates them in Settings
  useEffect(() => {
    localStorage.setItem('themeColor', themeColor);
  }, [themeColor]);

  const handleLoginSuccess = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    /**
     * Mobile-first responsive wrapper. 
     * Uses a centered container to simulate a handheld device experience on desktop.
     */
    <div className="min-h-screen w-full flex justify-center bg-white transition-colors duration-500 dark:bg-black">
      <div className="w-full max-w-md bg-white dark:bg-black min-h-screen relative overflow-hidden transition-colors duration-500">
        {isLoggedIn ? (
          // Main Application Hub
          <Dashboard 
            onLogout={handleLogout} 
            isDarkMode={isDarkMode} 
            toggleDarkMode={toggleDarkMode}
            themeColor={themeColor}
            setThemeColor={setThemeColor}
          />
        ) : (
          // Secure Gateway
          <LoginScreen 
            onLoginSuccess={handleLoginSuccess} 
            isDarkMode={isDarkMode}
            themeColor={themeColor}
          />
        )}
      </div>
    </div>
  );
}
