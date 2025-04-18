import React, { createContext, useContext, useState, useEffect } from 'react';

interface A11yContextType {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleReducedMotion: () => void;
}

const A11yContext = createContext<A11yContextType | undefined>(undefined);

export const useA11y = () => {
  const context = useContext(A11yContext);
  if (context === undefined) {
    throw new Error('useA11y must be used within an A11yProvider');
  }
  return context;
};

export const A11yProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const storedHighContrast = localStorage.getItem('highContrast') === 'true';
    const storedLargeText = localStorage.getItem('largeText') === 'true';
    const storedReducedMotion = localStorage.getItem('reducedMotion') === 'true';
    
    setHighContrast(storedHighContrast);
    setLargeText(storedLargeText);
    setReducedMotion(storedReducedMotion);
    
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && localStorage.getItem('reducedMotion') === null) {
      setReducedMotion(true);
    }
  }, []);

  // Apply classes to document when preferences change
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    localStorage.setItem('highContrast', String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    if (largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
    localStorage.setItem('largeText', String(largeText));
  }, [largeText]);

  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
    localStorage.setItem('reducedMotion', String(reducedMotion));
  }, [reducedMotion]);

  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const toggleLargeText = () => setLargeText(prev => !prev);
  const toggleReducedMotion = () => setReducedMotion(prev => !prev);

  return (
    <A11yContext.Provider
      value={{
        highContrast,
        largeText,
        reducedMotion,
        toggleHighContrast,
        toggleLargeText,
        toggleReducedMotion
      }}
    >
      {children}
    </A11yContext.Provider>
  );
};
