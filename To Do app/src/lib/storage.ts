import { Task, Category, TaskTemplate } from '@/types';

const STORAGE_KEYS = {
  TASKS: 'todo-app-tasks',
  CATEGORIES: 'todo-app-categories',
  USER_PREFERENCES: 'todo-app-preferences',
  TEMPLATES: 'todo-app-templates',
  POMODORO_SESSIONS: 'todo-app-pomodoro',
} as const;

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultCategory: string;
  sortBy: 'dueDate' | 'priority' | 'created' | 'title';
  sortOrder: 'asc' | 'desc';
  notifications: boolean;
  soundEnabled: boolean;
  pomodoroLength: number; // in minutes
  shortBreakLength: number;
  longBreakLength: number;
  // Immersive features
  audioFeedback: boolean;
  hapticFeedback: boolean;
  animations: boolean;
  tooltips: boolean;
  celebrations: boolean;
  smartSuggestions: boolean;
  reducedMotion: boolean;
}

export interface PomodoroSession {
  id: string;
  taskId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  type: 'work' | 'short-break' | 'long-break';
  completed: boolean;
}

class LocalStorage {
  private isClient = typeof window !== 'undefined';

  getTasks(): Task[] {
    if (!this.isClient) return [];
    
    try {
      const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (!tasks) return [];
      
      return JSON.parse(tasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }));
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }

  saveTasks(tasks: Task[]): void {
    if (!this.isClient) return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }

  getCategories(): Category[] {
    if (!this.isClient) return this.getDefaultCategories();
    
    try {
      const categories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (!categories) return this.getDefaultCategories();
      
      return JSON.parse(categories);
    } catch (error) {
      console.error('Error loading categories:', error);
      return this.getDefaultCategories();
    }
  }

  saveCategories(categories: Category[]): void {
    if (!this.isClient) return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  }

  getUserPreferences(): UserPreferences {
    if (!this.isClient) return this.getDefaultPreferences();
    
    try {
      const preferences = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (!preferences) return this.getDefaultPreferences();
      
      return JSON.parse(preferences);
    } catch (error) {
      console.error('Error loading user preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  saveUserPreferences(preferences: UserPreferences): void {
    if (!this.isClient) return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }

  getTemplates(): TaskTemplate[] {
    if (!this.isClient) return [];
    
    try {
      const templates = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      if (!templates) return [];
      
      return JSON.parse(templates).map((template: any) => ({
        ...template,
        createdAt: new Date(template.createdAt),
      }));
    } catch (error) {
      console.error('Error loading templates:', error);
      return [];
    }
  }

  saveTemplates(templates: TaskTemplate[]): void {
    if (!this.isClient) return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
    } catch (error) {
      console.error('Error saving templates:', error);
    }
  }

  getPomodoroSessions(): PomodoroSession[] {
    if (!this.isClient) return [];
    
    try {
      const sessions = localStorage.getItem(STORAGE_KEYS.POMODORO_SESSIONS);
      if (!sessions) return [];
      
      return JSON.parse(sessions).map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: session.endTime ? new Date(session.endTime) : undefined,
      }));
    } catch (error) {
      console.error('Error loading pomodoro sessions:', error);
      return [];
    }
  }

  savePomodoroSessions(sessions: PomodoroSession[]): void {
    if (!this.isClient) return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.POMODORO_SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving pomodoro sessions:', error);
    }
  }
  // Enhanced preferences with new features
  private getDefaultPreferences(): UserPreferences {
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

  // Export/Import functionality
  exportData(): string {
    const data = {
      tasks: this.getTasks(),
      categories: this.getCategories(),
      templates: this.getTemplates(),
      preferences: this.getUserPreferences(),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.tasks) this.saveTasks(data.tasks);
      if (data.categories) this.saveCategories(data.categories);
      if (data.templates) this.saveTemplates(data.templates);
      if (data.preferences) this.saveUserPreferences(data.preferences);
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  clearAllData(): void {
    if (!this.isClient) return;
    
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  private getDefaultCategories(): Category[] {
    return [
      { id: 'work', name: 'Work', color: '#3b82f6', icon: '💼' },
      { id: 'personal', name: 'Personal', color: '#10b981', icon: '🏠' },
      { id: 'shopping', name: 'Shopping', color: '#f59e0b', icon: '🛒' },
      { id: 'health', name: 'Health', color: '#ef4444', icon: '🏥' },
      { id: 'learning', name: 'Learning', color: '#8b5cf6', icon: '📚' },
    ];
  }
}

export const storage = new LocalStorage();
