'use client';

import { useState, useEffect } from 'react';
import { Task, TaskFilters, Category, TaskTemplate } from '@/types';
import { storage } from '@/lib/storage';
import { TaskList } from '@/components/task-list';
import { TaskForm } from '@/components/task-form';
import { FilterBar } from '@/components/filter-bar';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { TaskStats } from '@/components/task-stats';
import { TaskTemplates } from '@/components/task-templates';
import { Settings } from '@/components/settings';
import { PomodoroTimer } from '@/components/pomodoro-timer';
import { DataManagement } from '@/components/data-management';
import { SmartSuggestions } from '@/components/smart-suggestions';
import { Celebration } from '@/components/celebration';
import { useSettings, useAudioFeedback, useHapticFeedback, useAnimations, useCelebrations, useSmartSuggestions } from '@/components/settings-provider';
import { AudioFeedback, HapticFeedback } from '@/lib/audio';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  // Get settings from context
  const { preferences } = useSettings();
  const audioEnabled = useAudioFeedback();
  const hapticEnabled = useHapticFeedback();
  const animationsEnabled = useAnimations();
  const celebrationsEnabled = useCelebrations();
  const smartSuggestionsEnabled = useSmartSuggestions();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({
    filterType: 'all',
    sortType: 'dueDate',
    sortOrder: 'asc',
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showCompleted, setShowCompleted] = useState(true);
  
  // New modals/features
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [showDataManagement, setShowDataManagement] = useState(false);
  const [currentPomodoroTask, setCurrentPomodoroTask] = useState<Task | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'task' | 'milestone' | 'streak'>('task');

  // Load data on mount
  useEffect(() => {
    setTasks(storage.getTasks());
    setCategories(storage.getCategories());
    setTemplates(storage.getTemplates());
  }, []);

  // Sync audio and haptic feedback settings
  useEffect(() => {
    AudioFeedback.setAudioFeedbackEnabled(audioEnabled);
    HapticFeedback.setEnabled(hapticEnabled);
  }, [audioEnabled, hapticEnabled]);

  // Save tasks when they change
  useEffect(() => {
    storage.saveTasks(tasks);
  }, [tasks]);

  // Auto-create recurring tasks
  useEffect(() => {
    const checkRecurringTasks = () => {
      const now = new Date();
      const newTasks: Task[] = [];
      
      tasks.forEach(task => {
        if (task.isRecurring && task.recurrence && task.completed) {
          const lastUpdate = new Date(task.updatedAt);
          const daysSinceUpdate = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysSinceUpdate >= task.recurrence.interval) {
            const newTask: Task = {
              ...task,
              id: uuidv4(),
              completed: false,
              createdAt: now,
              updatedAt: now,
              dueDate: task.dueDate ? new Date(task.dueDate.getTime() + (task.recurrence.interval * 24 * 60 * 60 * 1000)) : undefined,
            };
            newTasks.push(newTask);
          }
        }
      });
      
      if (newTasks.length > 0) {
        setTasks(prev => [...prev, ...newTasks]);
      }
    };

    const interval = setInterval(checkRecurringTasks, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [tasks]);

  const createFromTemplate = (template: TaskTemplate) => {
    const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: template.title,
      description: template.description,
      priority: template.priority,
      category: template.category,
      tags: template.tags,
      completed: false,
      estimate: template.estimate,
    };
    addTask(taskData);
    setShowTemplates(false);
  };

  const handleDataRefresh = () => {
    setTasks(storage.getTasks());
    setCategories(storage.getCategories());
    setTemplates(storage.getTemplates());
  };

  const bulkCompleteSelected = () => {
    selectedTasks.forEach(taskId => {
      const task = tasks.find(t => t.id === taskId);
      if (task && !task.completed) {
        updateTask(taskId, { completed: true });
      }
    });
    setSelectedTasks([]);
  };

  const bulkDeleteSelected = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedTasks.length} selected tasks?`)) {
      selectedTasks.forEach(taskId => deleteTask(taskId));
      setSelectedTasks([]);
    }
  };

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );  };

  const clearSelection = () => {
    setSelectedTasks([]);
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
    setIsFormOpen(false);
  };

  const addTaskFromSuggestion = (title: string) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      description: '',
      priority: 'medium',
      category: categories[0]?.id || 'Personal',
      tags: [],
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);    if (task && !task.completed) {
      // Show celebration when completing a task (only if enabled)
      if (celebrationsEnabled) {
        setShowCelebration(true);
        
        // Check for milestones
        const completedCount = tasks.filter(t => t.completed).length + 1;
        if (completedCount % 10 === 0) {
          setCelebrationType('milestone');
        } else if (completedCount % 5 === 0) {
          setCelebrationType('streak');
        } else {
          setCelebrationType('task');
        }
      }
    }
    updateTask(id, { completed: !task?.completed });
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleEditSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
      setIsFormOpen(false);
    }
  };
  const filteredTasks = tasks.filter(task => {
    // Show/hide completed tasks toggle
    if (!showCompleted && task.completed) {
      return false;
    }

    // Category filter
    if (filters.category && task.category !== filters.category) {
      return false;
    }

    // Priority filter
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filter type
    switch (filters.filterType) {
      case 'active':
        return !task.completed;
      case 'completed':
        return task.completed;
      case 'overdue':
        return task.dueDate && task.dueDate < new Date() && !task.completed;
      default:
        return true;
    }
  }).sort((a, b) => {
    const { sortType, sortOrder } = filters;
    let comparison = 0;

    switch (sortType) {
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = a.dueDate.getTime() - b.dueDate.getTime();
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
        break;
      case 'created':
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });

  // Helper function for selecting all filtered tasks
  const selectAllFiltered = () => {
    const filteredTaskIds = filteredTasks.map((task: Task) => task.id);
    setSelectedTasks(filteredTaskIds);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N: New task
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setEditingTask(null);
        setIsFormOpen(true);
      }
      
      // Ctrl/Cmd + A: Select all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a' && !isFormOpen) {
        e.preventDefault();
        selectAllFiltered();
      }
      
      // Escape: Close modal or clear selection
      if (e.key === 'Escape') {
        if (isFormOpen) {
          setIsFormOpen(false);
          setEditingTask(null);
        } else if (selectedTasks.length > 0) {
          clearSelection();
        }
      }
      
      // Delete: Delete selected tasks
      if (e.key === 'Delete' && selectedTasks.length > 0 && !isFormOpen) {
        e.preventDefault();
        bulkDeleteSelected();
      }
      
      // Ctrl/Cmd + Enter: Complete selected tasks
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && selectedTasks.length > 0 && !isFormOpen) {
        e.preventDefault();
        bulkCompleteSelected();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFormOpen, selectedTasks, bulkCompleteSelected, bulkDeleteSelected, selectAllFiltered, clearSelection]);  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 fade-in ${
      !animationsEnabled ? 'settings-no-animation' : 
      preferences.reducedMotion ? 'settings-reduced-motion' : ''
    }`}>
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        categories={categories}
        selectedCategory={filters.category}
        onCategorySelect={(category) =>
          setFilters(prev => ({ ...prev, category }))
        }
        onAddCategory={(category) => {
          const newCategories = [...categories, category];
          setCategories(newCategories);
          storage.saveCategories(newCategories);
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden slide-in-right">        {/* Header */}
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onAddTask={() => {
            setEditingTask(null);
            setIsFormOpen(true);
          }}
          onOpenTemplates={() => setShowTemplates(true)}
          onOpenSettings={() => setShowSettings(true)}
          onOpenPomodoro={() => setShowPomodoro(true)}
          onOpenDataManagement={() => setShowDataManagement(true)}
        />

        {/* Stats */}
        <TaskStats tasks={tasks} />        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
          showCompleted={showCompleted}
          onShowCompletedChange={setShowCompleted}
          selectedTasks={selectedTasks}
          onBulkComplete={bulkCompleteSelected}
          onBulkDelete={bulkDeleteSelected}
          onSelectAll={selectAllFiltered}
          onClearSelection={clearSelection}
          totalFilteredTasks={filteredTasks.length}
        />        {/* Task List */}
        <div className="flex-1 overflow-auto p-4">
          <TaskList
            tasks={filteredTasks}
            onToggle={toggleTask}
            onEdit={openEditForm}
            onDelete={deleteTask}
            categories={categories}
            selectedTasks={selectedTasks}
            onToggleSelection={toggleTaskSelection}
            onStartPomodoro={(task) => {
              setCurrentPomodoroTask(task);
              setShowPomodoro(true);
            }}
          />
        </div>
      </div>      {/* Task Form Modal */}
      {isFormOpen && (
        <TaskForm
          task={editingTask}
          categories={categories}
          onSubmit={editingTask ? handleEditSubmit : addTask}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTask(null);
          }}
        />
      )}

      {/* Task Templates Modal */}
      {showTemplates && (
        <TaskTemplates
          templates={templates}
          categories={categories}
          onTemplatesChange={setTemplates}
          onCreateFromTemplate={createFromTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
          onSettingsChanged={handleDataRefresh}
        />
      )}

      {/* Pomodoro Timer Modal */}
      {showPomodoro && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setShowPomodoro(false)}
              className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg z-10"
            >
              ✕
            </button>
            <PomodoroTimer
              task={currentPomodoroTask || undefined}
              onSessionComplete={(session) => {
                // Update task with actual time spent
                if (session.taskId && session.type === 'work') {
                  updateTask(session.taskId, {
                    actualTime: (tasks.find(t => t.id === session.taskId)?.actualTime || 0) + session.duration
                  });
                }
              }}
            />
          </div>
        </div>
      )}      {/* Data Management Modal */}
      {showDataManagement && (
        <DataManagement
          onClose={() => setShowDataManagement(false)}
          onDataImported={handleDataRefresh}
        />
      )}      {/* Smart Suggestions - conditionally rendered */}
      {smartSuggestionsEnabled && (
        <SmartSuggestions 
          tasks={tasks}
          onCreateTask={addTaskFromSuggestion}
        />
      )}      {/* Celebration - conditionally rendered */}
      {celebrationsEnabled && (
        <Celebration
          isVisible={showCelebration}
          type={celebrationType}
          onComplete={() => setShowCelebration(false)}
        />
      )}
    </div>
  );
}
