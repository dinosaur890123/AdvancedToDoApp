'use client';

import { Menu, Plus, Sun, Moon, Monitor, FileText, Settings as SettingsIcon, Timer, Database } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { KeyboardShortcuts } from '@/components/keyboard-shortcuts';
import { AudioFeedback, HapticFeedback } from '@/lib/audio';

interface HeaderProps {
  onToggleSidebar: () => void;
  onAddTask: () => void;
  onOpenTemplates?: () => void;
  onOpenSettings?: () => void;
  onOpenPomodoro?: () => void;
  onOpenDataManagement?: () => void;
}

export function Header({ 
  onToggleSidebar, 
  onAddTask, 
  onOpenTemplates,
  onOpenSettings,
  onOpenPomodoro,
  onOpenDataManagement
}: HeaderProps) {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5" />;
      case 'dark':
        return <Moon className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };
  return (    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 fade-in-down glass-effect floating">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 fade-in-left">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden hover-scale transition-all duration-200 ripple magnetic"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white breathing">
            🚀 Advanced Todo
          </h1>
        </div><div className="flex items-center space-x-2">
          <KeyboardShortcuts />
            {onOpenPomodoro && (
            <button
              onClick={onOpenPomodoro}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-200 hover-scale magnetic ripple soft-glow"
              title="Pomodoro Timer (⌘P)"
            >
              <Timer className="h-5 w-5" />
            </button>
          )}
          
          {onOpenTemplates && (
            <button
              onClick={onOpenTemplates}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-200 hover-scale magnetic ripple"
              title="Task Templates (⌘T)"
            >
              <FileText className="h-5 w-5" />
            </button>
          )}
          
          {onOpenDataManagement && (
            <button
              onClick={onOpenDataManagement}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              title="Data Management"
            >
              <Database className="h-5 w-5" />
            </button>
          )}
            {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              title="Settings"
            >
              <SettingsIcon className="h-5 w-5" />
            </button>
          )}
          
          <button
            onClick={cycleTheme}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
            title={`Current theme: ${theme}. Click to cycle themes.`}
          >
            {getThemeIcon()}
          </button>          <button
            onClick={() => {
              AudioFeedback.playSuccess();
              HapticFeedback.medium();
              onAddTask();
            }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-md font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105 ripple magnetic soft-glow gradient-border"
            title="Add new task (Ctrl+N)"
            onMouseEnter={() => AudioFeedback.playHover()}
          >
            <Plus className="h-4 w-4 mr-2" />
            ✨ Add Task
          </button>
        </div>
      </div>
    </header>
  );
}
