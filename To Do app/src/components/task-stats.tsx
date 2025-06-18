'use client';

import { Task } from '@/types';
import { CheckCircle, Clock, AlertTriangle, Calendar } from 'lucide-react';

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const overdueTasks = tasks.filter(
    task => task.dueDate && task.dueDate < new Date() && !task.completed
  ).length;
  const dueTodayTasks = tasks.filter(
    task =>
      task.dueDate &&
      task.dueDate.toDateString() === new Date().toDateString() &&
      !task.completed
  ).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: Calendar,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    },
    {
      label: 'Due Today',
      value: dueTodayTasks,
      icon: Clock,
      color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
    },
    {
      label: 'Overdue',
      value: overdueTasks,
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-50 dark:bg-red-900/20',
    },
  ];  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 fade-in-down glass-effect floating">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover-lift transition-all duration-200 fade-in-up floating magnetic gradient-border"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`p-2 rounded-md ${stat.color} pulse-subtle breathing`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white counter-animate">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {totalTasks > 0 && (
        <div className="mt-4 fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400 counter-animate">
              {completionRate}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-700 ease-out shimmer"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
