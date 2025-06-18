'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage, UserPreferences } from '@/lib/storage';

interface SettingsContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    // Default preferences with immersive features enabled
    return {
      theme: 'system',
      defaultCategory: 'Personal',
      sortBy: 'dueDate',
      sortOrder: 'asc',
      notifications: true,
      soundEnabled: true,
      pomodoroLength: 25,
      shortBreakLength: 5,
      longBreakLength: 15,
      audioFeedback: true,
      hapticFeedback: true,
      animations: true,
      tooltips: true,
      celebrations: true,
      smartSuggestions: true,
      reducedMotion: false,
    };
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load preferences from storage on mount
    try {
      const storedPreferences = storage.getUserPreferences();
      setPreferences(storedPreferences);
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    storage.saveUserPreferences(newPreferences);
  };

  const value = {
    preferences,
    updatePreferences,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

// Convenience hooks for specific settings
export function useAudioFeedback() {
  const { preferences } = useSettings();
  return preferences.audioFeedback;
}

export function useHapticFeedback() {
  const { preferences } = useSettings();
  return preferences.hapticFeedback;
}

export function useAnimations() {
  const { preferences } = useSettings();
  return preferences.animations && !preferences.reducedMotion;
}

export function useTooltips() {
  const { preferences } = useSettings();
  return preferences.tooltips;
}

export function useCelebrations() {
  const { preferences } = useSettings();
  return preferences.celebrations;
}

export function useSmartSuggestions() {
  const { preferences } = useSettings();
  return preferences.smartSuggestions;
}

export function useReducedMotion() {
  const { preferences } = useSettings();
  return preferences.reducedMotion;
}
