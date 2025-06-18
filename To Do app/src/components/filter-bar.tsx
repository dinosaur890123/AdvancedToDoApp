'use client';

import { TaskFilters, Category } from '@/types';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';

interface FilterBarProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  categories: Category[];
  showCompleted: boolean;
  onShowCompletedChange: (show: boolean) => void;
  selectedTasks: string[];
  onBulkComplete: () => void;
  onBulkDelete: () => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  totalFilteredTasks: number;
}

export function FilterBar({ 
  filters, 
  onFiltersChange, 
  categories,
  showCompleted,
  onShowCompletedChange,
  selectedTasks,
  onBulkComplete,
  onBulkDelete,
  onSelectAll,
  onClearSelection,
  totalFilteredTasks
}: FilterBarProps) {
  const handleFilterChange = (updates: Partial<TaskFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fade-in-down">
      {/* Bulk Operations Bar */}
      {selectedTasks.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 px-4 py-3 slide-in-down">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300 fade-in-left">
              {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
            </span>            <div className="flex items-center space-x-2 fade-in-right">
              <button
                onClick={onBulkComplete}
                className="inline-flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-all duration-200 hover-scale bounce-in"
              >
                Complete
              </button>
              <button
                onClick={onBulkDelete}
                className="inline-flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-all duration-200 hover-scale bounce-in"
              >
                Delete
              </button>
              <button
                onClick={onClearSelection}
                className="inline-flex items-center px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-md transition-all duration-200 hover-scale bounce-in"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Filter Bar */}
      <div className="p-4 fade-in-up">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md fade-in-right">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus-ring"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 fade-in-left">
            {/* Show Completed Toggle */}
            <label className="inline-flex items-center hover-scale transition-all duration-200">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => onShowCompletedChange(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500 transition-all duration-200"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Show completed</span>
            </label>

            {/* Select All Button */}
            {totalFilteredTasks > 0 && (
              <button
                onClick={onSelectAll}                className="px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 border border-blue-300 dark:border-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 hover-scale"
              >
                Select All ({totalFilteredTasks})
              </button>
            )}

            {/* Filter Type */}
            <select
              value={filters.filterType}
              onChange={(e) => handleFilterChange({ filterType: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover-lift"
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>

            {/* Category Filter */}
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange({ category: e.target.value || undefined })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover-lift"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={filters.priority || ''}
              onChange={(e) => handleFilterChange({ priority: e.target.value as any || undefined })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover-lift"
            >
              <option value="">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <select
                value={filters.sortType}
                onChange={(e) => handleFilterChange({ sortType: e.target.value as any })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover-lift"
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="created">Created</option>
                <option value="title">Title</option>
              </select>              <button
                onClick={() => handleFilterChange({ 
                  sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
                })}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover-scale rotate-on-click"
                title={`Sort ${filters.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
              >
                {filters.sortOrder === 'asc' ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
