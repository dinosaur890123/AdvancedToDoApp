'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { storage, UserPreferences } from '@/lib/storage';
import { useTheme } from '@/components/theme-provider';

interface SettingsProps {
  onClose: () => void;
  onSettingsChanged: () => void;
}

export function Settings({ onClose, onSettingsChanged }: SettingsProps) {
  const { setTheme } = useTheme();
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      return storage.getUserPreferences();
    } catch (error) {
      console.error('Error loading preferences:', error);
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
      };
    }
  });

  const handleSave = () => {
    try {
      storage.saveUserPreferences(preferences);
      setTheme(preferences.theme);
      onSettingsChanged();
      onClose();
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Error saving settings. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Theme Setting */}
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <select
              value={preferences.theme}
              onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          {/* Default Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Default Category</label>
            <input
              type="text"
              value={preferences.defaultCategory}
              onChange={(e) => setPreferences(prev => ({ ...prev, defaultCategory: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            />
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Notifications</label>
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={(e) => setPreferences(prev => ({ ...prev, notifications: e.target.checked }))}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </div>

          {/* Sound */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Sound Effects</label>
            <input
              type="checkbox"
              checked={preferences.soundEnabled}
              onChange={(e) => setPreferences(prev => ({ ...prev, soundEnabled: e.target.checked }))}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </div>

          {/* Pomodoro Length */}
          <div>
            <label className="block text-sm font-medium mb-2">Pomodoro Length (minutes)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={preferences.pomodoroLength}
              onChange={(e) => setPreferences(prev => ({ ...prev, pomodoroLength: parseInt(e.target.value) || 25 }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
