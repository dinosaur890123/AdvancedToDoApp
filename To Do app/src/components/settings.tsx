'use client';

import { useState, useEffect } from 'react';
import { Save, Bell, Volume2, VolumeX, Clock, Palette } from 'lucide-react';
import { storage, UserPreferences } from '@/lib/storage';
import { useTheme } from '@/components/theme-provider';

interface SettingsProps {
  onClose: () => void;
  onSettingsChanged: () => void;
}

export function Settings({ onClose, onSettingsChanged }: SettingsProps) {
  const { theme, setTheme } = useTheme();  const [preferences, setPreferences] = useState<UserPreferences>(() => {
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
        // Immersive features - enabled by default for best experience
        audioFeedback: true,
        hapticFeedback: true,
        animations: true,
        tooltips: true,
        celebrations: true,
        smartSuggestions: true,
        reducedMotion: false,
      };
    }
  });
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleSave = () => {
    storage.saveUserPreferences(preferences);
    setTheme(preferences.theme);
    onSettingsChanged();
    onClose();
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      setPreferences(prev => ({ ...prev, notifications: permission === 'granted' }));
    }
  };

  const testNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Test Notification', {
        body: 'This is how notifications will appear!',
        icon: '/favicon.ico',
      });
    }
  };

  const testSound = () => {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.frequency.value = 800;
    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.5);
  };
  const resetToDefaults = () => {
    if (window.confirm('Reset all settings to default values?')) {
      const defaultPrefs: UserPreferences = {
        theme: 'system',
        defaultCategory: 'Personal',
        sortBy: 'dueDate',
        sortOrder: 'asc',
        notifications: true,
        soundEnabled: true,
        pomodoroLength: 25,
        shortBreakLength: 5,
        longBreakLength: 15,
        // Immersive features - enabled by default for best experience
        audioFeedback: true,
        hapticFeedback: true,
        animations: true,
        tooltips: true,
        celebrations: true,
        smartSuggestions: true,
        reducedMotion: false,
      };
      setPreferences(defaultPrefs);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden scale-in slide-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 fade-in-down">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover-scale transition-all duration-200 rotate-on-hover"
          >
            ✕
          </button>
        </div>        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
          {/* Appearance Settings */}
          <section className="fade-in-up" style={{ animationDelay: '100ms' }}>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Appearance
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Theme</label>                <select
                  value={preferences.theme}
                  onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 transition-all duration-200 hover-lift focus-ring"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Default Category</label>                <input
                  type="text"
                  value={preferences.defaultCategory}
                  onChange={(e) => setPreferences(prev => ({ ...prev, defaultCategory: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 transition-all duration-200 hover-lift focus-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Default Sort</label>
                  <select
                    value={preferences.sortBy}
                    onChange={(e) => setPreferences(prev => ({ ...prev, sortBy: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  >
                    <option value="dueDate">Due Date</option>
                    <option value="priority">Priority</option>
                    <option value="created">Created Date</option>
                    <option value="title">Title</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sort Order</label>
                  <select
                    value={preferences.sortOrder}
                    onChange={(e) => setPreferences(prev => ({ ...prev, sortOrder: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>
            </div>
          </section>          {/* Notification Settings */}
          <section className="fade-in-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Browser Notifications</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Get notified when Pomodoro sessions complete
                  </p>
                </div>
                <div className="flex items-center space-x-2">                  {notificationPermission !== 'granted' && (
                    <button
                      onClick={requestNotificationPermission}
                      className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-200 hover-scale"
                    >
                      Enable
                    </button>
                  )}
                  <input
                    type="checkbox"
                    checked={preferences.notifications && notificationPermission === 'granted'}
                    onChange={(e) => setPreferences(prev => ({ ...prev, notifications: e.target.checked }))}
                    disabled={notificationPermission !== 'granted'}
                    className="w-4 h-4 text-blue-600 rounded transition-all duration-200 hover-scale"
                  />
                </div>
              </div>

              {preferences.notifications && notificationPermission === 'granted' && (
                <button
                  onClick={testNotification}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover-scale bounce-in"
                >
                  Test Notification
                </button>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Sound Effects</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Play sounds for notifications and timer alerts
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={testSound}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    title="Test sound"
                  >
                    {preferences.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  <input
                    type="checkbox"
                    checked={preferences.soundEnabled}
                    onChange={(e) => setPreferences(prev => ({ ...prev, soundEnabled: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>
              </div>
            </div>
          </section>          {/* Pomodoro Settings */}
          <section className="fade-in-up" style={{ animationDelay: '300ms' }}>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Pomodoro Timer
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Work Session (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={preferences.pomodoroLength}
                  onChange={(e) => setPreferences(prev => ({ ...prev, pomodoroLength: parseInt(e.target.value) || 25 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Short Break (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={preferences.shortBreakLength}
                  onChange={(e) => setPreferences(prev => ({ ...prev, shortBreakLength: parseInt(e.target.value) || 5 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Long Break (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={preferences.longBreakLength}
                  onChange={(e) => setPreferences(prev => ({ ...prev, longBreakLength: parseInt(e.target.value) || 15 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Long breaks occur after every 4 work sessions
            </p>
          </section>          {/* Experience Settings */}
          <section className="fade-in-up" style={{ animationDelay: '350ms' }}>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <span className="w-5 h-5 mr-2 text-lg">✨</span>
              Experience & Accessibility
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Audio Feedback</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Play sounds for interactions and task completion
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.audioFeedback}
                  onChange={(e) => setPreferences(prev => ({ ...prev, audioFeedback: e.target.checked }))
                  }
                  className="w-4 h-4 text-blue-600 rounded transition-all duration-200"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Haptic Feedback</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Vibrate on supported devices for tactile feedback
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.hapticFeedback}
                  onChange={(e) => setPreferences(prev => ({ ...prev, hapticFeedback: e.target.checked }))
                  }
                  className="w-4 h-4 text-blue-600 rounded transition-all duration-200"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Animations & Transitions</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Enable smooth animations and visual effects
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.animations}
                  onChange={(e) => setPreferences(prev => ({ ...prev, animations: e.target.checked }))
                  }
                  className="w-4 h-4 text-blue-600 rounded transition-all duration-200"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Helpful Tooltips</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Show contextual help and guidance tips
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.tooltips}
                  onChange={(e) => setPreferences(prev => ({ ...prev, tooltips: e.target.checked }))
                  }
                  className="w-4 h-4 text-blue-600 rounded transition-all duration-200"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Celebration Effects</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Show confetti and celebration animations for achievements
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.celebrations}
                  onChange={(e) => setPreferences(prev => ({ ...prev, celebrations: e.target.checked }))
                  }
                  className="w-4 h-4 text-blue-600 rounded transition-all duration-200"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Smart Suggestions</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Get contextual productivity tips and quick actions
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.smartSuggestions}
                  onChange={(e) => setPreferences(prev => ({ ...prev, smartSuggestions: e.target.checked }))
                  }
                  className="w-4 h-4 text-blue-600 rounded transition-all duration-200"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Reduced Motion</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Minimize animations for accessibility (overrides animation setting)
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.reducedMotion}
                  onChange={(e) => setPreferences(prev => ({ ...prev, reducedMotion: e.target.checked }))
                  }
                  className="w-4 h-4 text-blue-600 rounded transition-all duration-200"
                />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700 fade-in-up" style={{ animationDelay: '400ms' }}>
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-all duration-200 hover-scale"
            >
              Reset to Defaults
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover-scale"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 hover-scale bounce-in"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
