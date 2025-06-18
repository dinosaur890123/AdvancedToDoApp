'use client';

import { useState } from 'react';
import { Task, Category } from '@/types';
import { X, Calendar, Tag, AlertCircle } from 'lucide-react';

interface TaskFormProps {
  task?: Task | null;
  categories: Category[];
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

interface SubtaskFormData {
  title: string;
}

export function TaskForm({ task, categories, onSubmit, onClose }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium' as const,
    category: task?.category || categories[0]?.id || '',
    dueDate: task?.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
    tags: task?.tags ? task.tags.join(', ') : '',
    completed: task?.completed || false,
    estimate: task?.estimate?.toString() || '',
    notes: task?.notes || '',
    isRecurring: task?.isRecurring || false,
    recurrenceType: task?.recurrence?.type || 'daily' as const,
    recurrenceInterval: task?.recurrence?.interval?.toString() || '1',
  });

  const [subtasks, setSubtasks] = useState(task?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      priority: formData.priority,
      category: formData.category,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      completed: formData.completed,
      estimate: formData.estimate ? parseInt(formData.estimate) : undefined,
      notes: formData.notes.trim() || undefined,
      isRecurring: formData.isRecurring,
      recurrence: formData.isRecurring ? {
        type: formData.recurrenceType,
        interval: parseInt(formData.recurrenceInterval),
      } : undefined,
      subtasks: subtasks,
    };

    onSubmit(taskData);
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      const subtask = {
        id: Date.now().toString(),
        title: newSubtask.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setSubtasks(prev => [...prev, subtask]);
      setNewSubtask('');
    }
  };

  const removeSubtask = (id: string) => {
    setSubtasks(prev => prev.filter(s => s.id !== id));
  };

  const toggleSubtask = (id: string) => {
    setSubtasks(prev => prev.map(s => 
      s.id === id ? { ...s, completed: !s.completed } : s
    ));
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto slide-in shadow-2xl scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 fade-in-down">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {task ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover-scale rotate-on-hover"
            title="Close (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div className="fade-in-up" style={{ animationDelay: '100ms' }}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus-ring hover-lift"
              placeholder="Enter task title..."
              required
            />
          </div>

          {/* Description */}
          <div className="fade-in-up" style={{ animationDelay: '200ms' }}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus-ring hover-lift"
              placeholder="Enter task description..."
              rows={3}
            />
          </div>

          {/* Priority and Category */}
          <div className="grid grid-cols-2 gap-4 fade-in-up" style={{ animationDelay: '300ms' }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover-lift"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover-lift"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="fade-in-up" style={{ animationDelay: '400ms' }}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter tags separated by commas..."
            />
          </div>

          {/* Estimate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time Estimate (minutes)
            </label>
            <input
              type="number"
              value={formData.estimate}
              onChange={(e) => setFormData(prev => ({ ...prev, estimate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter time estimate..."
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter additional notes..."
              rows={2}
            />
          </div>

          {/* Recurrence */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isRecurring"
              checked={formData.isRecurring}
              onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label htmlFor="isRecurring" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Repeat this task
            </label>
          </div>

          {formData.isRecurring && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Recurrence Type
                </label>
                <select
                  value={formData.recurrenceType}
                  onChange={(e) => setFormData(prev => ({ ...prev, recurrenceType: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Interval
                </label>
                <input
                  type="number"
                  value={formData.recurrenceInterval}
                  onChange={(e) => setFormData(prev => ({ ...prev, recurrenceInterval: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter interval (e.g., 1)"
                />
              </div>
            </div>
          )}

          {/* Subtasks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subtasks
            </label>
            <div className="space-y-2">
              {subtasks.map((subtask, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={subtask.title}
                    onChange={(e) => {
                      const updatedSubtasks = [...subtasks];
                      updatedSubtasks[index].title = e.target.value;
                      setSubtasks(updatedSubtasks);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter subtask title..."
                  />
                  <button
                    onClick={() => {
                      const updatedSubtasks = subtasks.filter((_, i) => i !== index);
                      setSubtasks(updatedSubtasks);
                    }}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                    title="Remove subtask"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new subtask title..."
                />                <button
                  onClick={addSubtask}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                >
                  Add Subtask
                </button>
              </div>
            </div>
          </div>

          {/* Completed checkbox for editing */}
          {task && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="completed"
                checked={formData.completed}
                onChange={(e) => setFormData(prev => ({ ...prev, completed: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="completed" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Mark as completed
              </label>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
