'use client';

import { Task, Category } from '@/types';
import { TaskItem } from './task-item';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  categories: Category[];
  selectedTasks: string[];
  onToggleSelection: (taskId: string) => void;
  onStartPomodoro?: (task: Task) => void;
}

export function TaskList({ tasks, onToggle, onEdit, onDelete, categories, selectedTasks, onToggleSelection, onStartPomodoro }: TaskListProps) {  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 fade-in">
        <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 bounce-in">
          <span className="text-4xl">📝</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 fade-in-up stagger-1">
          No tasks found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 fade-in-up stagger-2">
          Get started by creating your first task!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 custom-scrollbar">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className={`fade-in-up stagger-${Math.min(index + 1, 8)}`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <TaskItem
            task={task}
            category={categories.find(c => c.id === task.category)}
            onToggle={() => onToggle(task.id)}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task.id)}
            isSelected={selectedTasks.includes(task.id)}
            onToggleSelection={() => onToggleSelection(task.id)}
            onStartPomodoro={onStartPomodoro}
          />
        </div>
      ))}
    </div>
  );
}
