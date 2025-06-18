'use client';

import { Task, Category } from '@/types';
import { Calendar, Edit, Trash2, Clock, AlertTriangle, Tag, Timer, CheckSquare, Play } from 'lucide-react';
import { formatDate, isOverdue, isDueToday, getPriorityColor } from '@/lib/utils';
import { AudioFeedback, HapticFeedback } from '@/lib/audio';

interface TaskItemProps {
  task: Task;
  category?: Category;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isSelected: boolean;
  onToggleSelection: () => void;
  onStartPomodoro?: (task: Task) => void;
}

export function TaskItem({ task, category, onToggle, onEdit, onDelete, isSelected, onToggleSelection, onStartPomodoro }: TaskItemProps) {
  const getDueDateStatus = () => {
    if (!task.dueDate) return null;
    
    if (isOverdue(task.dueDate)) {
      return { icon: AlertTriangle, text: 'Overdue', color: 'text-red-600' };
    }
    
    if (isDueToday(task.dueDate)) {
      return { icon: Clock, text: 'Due today', color: 'text-orange-600' };
    }
    
    return { icon: Calendar, text: formatDate(task.dueDate), color: 'text-gray-600' };
  };

  const dueDateStatus = getDueDateStatus();  return (
    <div
      className={`
        task-item bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4
        hover-lift hover-glow transition-all duration-300 floating glass-effect
        ${task.completed ? 'opacity-75 breathing' : ''}
        ${isSelected ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-in soft-glow' : ''}
        ${task.priority === 'high' ? 'border-l-4 border-l-red-500 gradient-border' : ''}
        ${task.priority === 'medium' ? 'border-l-4 border-l-yellow-500' : ''}
        ${task.priority === 'low' ? 'border-l-4 border-l-green-500' : ''}
        fade-in-up magnetic
      `}
      style={{ animationDelay: `${Math.random() * 0.2}s` }}
    >
      <div className="flex items-start space-x-3 group">        {/* Selection Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelection}
          className="mt-1 h-4 w-4 text-blue-600 focus-ring border-gray-300 rounded hover-scale transition-all duration-200"
        />
          {/* Task Completion Checkbox */}
        <button
          onClick={() => {
            AudioFeedback.playTaskComplete();
            HapticFeedback.light();
            onToggle();
          }}
          className={`
            mt-1 w-5 h-5 rounded border-2 flex items-center justify-center hover-scale transition-all duration-300 ripple magnetic
            ${task.completed
              ? 'bg-blue-600 border-blue-600 text-white scale-in soft-glow breathing'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }
          `}
          onMouseEnter={() => AudioFeedback.playHover()}
        >
          {task.completed && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3
                className={`
                  text-lg font-medium text-gray-900 dark:text-white
                  ${task.completed ? 'line-through opacity-60' : ''}
                `}
              >
                {task.title}
              </h3>
              
              {task.description && (
                <p
                  className={`
                    mt-1 text-sm text-gray-600 dark:text-gray-400
                    ${task.completed ? 'line-through opacity-60' : ''}
                  `}
                >
                  {task.description}
                </p>
              )}
            </div>            {/* Actions */}
            <div className="flex items-center space-x-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {onStartPomodoro && !task.completed && (
                <button
                  onClick={() => {
                    AudioFeedback.playClick();
                    HapticFeedback.light();
                    onStartPomodoro(task);
                  }}
                  className="p-2 text-gray-400 hover:text-green-600 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 hover-scale transition-all duration-200 ripple magnetic"
                  title="Start Pomodoro timer"
                  onMouseEnter={() => AudioFeedback.playHover()}
                >
                  <Play className="h-4 w-4" />
                </button>
              )}
              
              <button
                onClick={() => {
                  AudioFeedback.playClick();
                  HapticFeedback.light();
                  onEdit();
                }}
                className="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 hover-scale transition-all duration-200 ripple magnetic"
                title="Edit task"
                onMouseEnter={() => AudioFeedback.playHover()}
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  AudioFeedback.playError();
                  HapticFeedback.medium();
                  onDelete();
                }}
                className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 hover-scale transition-all duration-200 ripple magnetic"
                title="Delete task"
                onMouseEnter={() => AudioFeedback.playHover()}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Task Metadata */}
          <div className="mt-3 flex items-center space-x-4 text-sm">
            {/* Priority */}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>

            {/* Category */}
            {category && (
              <div className="flex items-center space-x-1">
                <span>{category.icon}</span>
                <span className="text-gray-600 dark:text-gray-400">{category.name}</span>
              </div>
            )}

            {/* Due Date */}
            {dueDateStatus && (
              <div className={`flex items-center space-x-1 ${dueDateStatus.color}`}>
                <dueDateStatus.icon className="h-4 w-4" />
                <span>{dueDateStatus.text}</span>
              </div>
            )}

            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="flex items-center space-x-1">
                <Tag className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  {task.tags.slice(0, 2).join(', ')}
                  {task.tags.length > 2 && ` +${task.tags.length - 2}`}
                </span>
              </div>
            )}            {/* Time Tracking */}
            {(task.estimate || task.actualTime) && (
              <div className="flex items-center space-x-1">
                <Timer className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  {task.estimate && `${task.estimate}m est`}
                  {task.estimate && task.actualTime && ' / '}
                  {task.actualTime && `${task.actualTime}m actual`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
