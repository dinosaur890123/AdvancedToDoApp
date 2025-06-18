import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function isOverdue(date: Date): boolean {
  return date < new Date() && date.toDateString() !== new Date().toDateString();
}

export function isDueToday(date: Date): boolean {
  return date.toDateString() === new Date().toDateString();
}

export function getDaysUntilDue(date: Date): number {
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getPriorityColor(priority: 'low' | 'medium' | 'high'): string {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20';
    case 'low':
      return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
    default:
      return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20';
  }
}
