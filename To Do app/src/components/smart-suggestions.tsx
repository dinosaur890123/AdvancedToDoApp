'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, X, Sparkles } from 'lucide-react';
import { Task } from '@/types';

interface SmartSuggestionsProps {
  tasks: Task[];
  onCreateTask?: (suggestion: string) => void;
}

interface Suggestion {
  id: string;
  type: 'productivity' | 'organization' | 'time-management' | 'wellness';
  title: string;
  description: string;
  action?: string;
  icon: React.ReactNode;
}

export function SmartSuggestions({ tasks, onCreateTask }: SmartSuggestionsProps) {
  const [currentSuggestion, setCurrentSuggestion] = useState<Suggestion | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const generateSuggestions = (): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    const activeTasks = tasks.filter(t => !t.completed);
    const overdueTasks = tasks.filter(t => t.dueDate && t.dueDate < new Date() && !t.completed);
    const highPriorityTasks = tasks.filter(t => t.priority === 'high' && !t.completed);

    // No tasks yet
    if (tasks.length === 0) {
      suggestions.push({
        id: 'first-task',
        type: 'productivity',
        title: 'Welcome to Advanced Todo! 🎉',
        description: 'Start by creating your first task. Try adding something simple like "Buy groceries" or "Call mom".',
        action: 'Create my first task',
        icon: <Sparkles className="w-4 h-4" />
      });
    }

    // Many overdue tasks
    if (overdueTasks.length >= 3) {
      suggestions.push({
        id: 'overdue-cleanup',
        type: 'time-management',
        title: 'Time to catch up! ⏰',
        description: `You have ${overdueTasks.length} overdue tasks. Consider breaking them down into smaller, manageable pieces.`,
        icon: <Lightbulb className="w-4 h-4" />
      });
    }

    // Too many high priority tasks
    if (highPriorityTasks.length >= 5) {
      suggestions.push({
        id: 'priority-balance',
        type: 'organization',
        title: 'Priority Balance 🎯',
        description: 'You have many high-priority tasks. Consider if some can be medium priority to maintain focus.',
        icon: <Lightbulb className="w-4 h-4" />
      });
    }

    // No tasks for today
    if (activeTasks.length > 0 && !activeTasks.some(t => t.dueDate && t.dueDate.toDateString() === new Date().toDateString())) {
      suggestions.push({
        id: 'daily-planning',
        type: 'productivity',
        title: 'Plan your day 📅',
        description: 'Set due dates for your tasks to stay organized and motivated.',
        icon: <Lightbulb className="w-4 h-4" />
      });
    }

    // Wellness suggestion
    if (tasks.length >= 10 && !tasks.some(t => t.title.toLowerCase().includes('break') || t.title.toLowerCase().includes('rest'))) {
      suggestions.push({
        id: 'wellness-break',
        type: 'wellness',
        title: 'Remember to rest 🌱',
        description: 'You\'re being very productive! Don\'t forget to schedule breaks and self-care.',
        action: 'Schedule a break',
        icon: <Lightbulb className="w-4 h-4" />
      });
    }

    // Pomodoro suggestion
    if (activeTasks.length >= 3 && !dismissed.has('pomodoro-technique')) {
      suggestions.push({
        id: 'pomodoro-technique',
        type: 'productivity',
        title: 'Try the Pomodoro Technique 🍅',
        description: 'Break your work into focused 25-minute sessions with short breaks. Perfect for staying focused!',
        icon: <Sparkles className="w-4 h-4" />
      });
    }

    return suggestions.filter(s => !dismissed.has(s.id));
  };

  useEffect(() => {
    const suggestions = generateSuggestions();
    if (suggestions.length > 0) {
      // Rotate through suggestions every 30 seconds
      const interval = setInterval(() => {
        const availableSuggestions = suggestions.filter(s => !dismissed.has(s.id));
        if (availableSuggestions.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableSuggestions.length);
          setCurrentSuggestion(availableSuggestions[randomIndex]);
        }
      }, 30000);

      // Show first suggestion immediately
      setCurrentSuggestion(suggestions[0]);

      return () => clearInterval(interval);
    }
  }, [tasks, dismissed]);
  const handleDismiss = (suggestionId: string) => {
    setDismissed(prev => new Set(Array.from(prev).concat(suggestionId)));
    setCurrentSuggestion(null);
  };

  const handleAction = (suggestion: Suggestion) => {
    if (suggestion.action && onCreateTask) {
      let taskTitle = '';
      switch (suggestion.id) {
        case 'first-task':
          taskTitle = 'My first task';
          break;
        case 'wellness-break':
          taskTitle = 'Take a 15-minute break';
          break;
        default:
          taskTitle = suggestion.action;
      }
      onCreateTask(taskTitle);
    }
    handleDismiss(suggestion.id);
  };

  if (!currentSuggestion) return null;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'productivity':
        return 'from-blue-500 to-indigo-600';
      case 'organization':
        return 'from-purple-500 to-pink-600';
      case 'time-management':
        return 'from-orange-500 to-red-600';
      case 'wellness':
        return 'from-green-500 to-teal-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm">
      <div className={`bg-gradient-to-br ${getTypeColor(currentSuggestion.type)} p-1 rounded-lg shadow-lg glass-effect floating fade-in scale-in`}>
        <div className="bg-white dark:bg-gray-800 rounded-md p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              {currentSuggestion.icon}
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Smart Tip
              </span>
            </div>
            <button
              onClick={() => handleDismiss(currentSuggestion.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover-scale transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
            {currentSuggestion.title}
          </h4>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {currentSuggestion.description}
          </p>
          
          {currentSuggestion.action && (
            <button
              onClick={() => handleAction(currentSuggestion)}
              className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-all duration-200 hover-scale ripple"
            >
              {currentSuggestion.action}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
