export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  tags: string[];
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  estimate?: number; // estimated time in minutes
  actualTime?: number; // actual time spent in minutes
  subtasks?: Subtask[];
  isRecurring?: boolean;
  recurrence?: RecurrencePattern;
  parentId?: string; // for subtasks
  notes?: string;
  attachments?: string[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // every X days/weeks/months/years
  endDate?: Date;
  daysOfWeek?: number[]; // for weekly recurrence (0-6, Sunday-Saturday)
}

export interface TaskTemplate {
  id: string;
  name: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  tags: string[];
  estimate?: number;
  subtasks?: Omit<Subtask, 'id' | 'createdAt' | 'completed'>[];
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export type FilterType = 'all' | 'active' | 'completed' | 'overdue';
export type SortType = 'dueDate' | 'priority' | 'created' | 'title';

export interface TaskFilters {
  category?: string;
  priority?: Task['priority'];
  search?: string;
  filterType: FilterType;
  sortType: SortType;
  sortOrder: 'asc' | 'desc';
}
